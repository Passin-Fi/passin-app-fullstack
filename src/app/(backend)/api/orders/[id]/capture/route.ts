import { createSmartWalletAndSendToken } from 'backend/_helper/create_smart_wallet_and_send_token';
import { NextResponse } from 'next/server';
import { getPaymentStatus } from 'src/services/payment/get-payment-status';
import { getOrdersCollection } from 'backend/_lib/collections';
import { OrderStatus } from 'backend/_types/order';
import { CreateOrderPaymentResponse } from 'src/services/payment/create-payment-order';
import { PublicKey } from '@solana/web3.js';
import { checkSmartWallet } from 'backend/_helper/check_smartwallet_by_passkey';
import { BN } from 'bn.js';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }
    const payment_id = id;
    console.log('################Fetching order with payment ID:', payment_id);

    try {
        const orderCollection = await getOrdersCollection();
        const existingOrder = await orderCollection.findOne({ 'payment.id': payment_id });

        if (!existingOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        let currentStatus = existingOrder.status;
        if (
            currentStatus === OrderStatus.PaymentCancel ||
            currentStatus === OrderStatus.CreateAndSendTokenSuccess ||
            currentStatus === OrderStatus.CreateAndSendTokenFail ||
            currentStatus === OrderStatus.TokenSendSuccess ||
            currentStatus === OrderStatus.TokenSendFail ||
            currentStatus === OrderStatus.SubscribeToPoolSuccess
        ) {
            return NextResponse.json(existingOrder);
        }

        let paymenData: CreateOrderPaymentResponse;
        try {
            // Todo: check payment status from external API
            paymenData = await getPaymentStatus(payment_id);
            console.log('Payment status paymenData: fetch ok #######################################', paymenData.status);
        } catch (apiErr) {
            console.error('Error fetching payment status:', apiErr);
            return NextResponse.json({ error: 'Failed to fetch payment status' }, { status: 502 });
        }

        while (true) {
            switch (currentStatus) {
                case OrderStatus.PaymentPending: {
                    if (paymenData.status !== 'PAID') {
                        // If payment not successful, check if timeout (15 min) to update status to cancel
                        const timenow = Date.now();
                        const createdTime = new Date(paymenData.created_at).getTime();
                        if (timenow - createdTime > 15 * 60 * 1000) {
                            // Update order status order to cancel
                            try {
                                await orderCollection.updateOne(
                                    { 'payment.id': payment_id },
                                    {
                                        $set: {
                                            status: OrderStatus.PaymentCancel,
                                            updated_at: new Date(),
                                        },
                                    }
                                );
                                currentStatus = OrderStatus.PaymentCancel;
                            } catch (dbErr) {
                                console.error('Failed to update order to cancel after timeout:', dbErr);
                                return NextResponse.json({ error: 'Failed to update order to cancel' }, { status: 500 });
                            }
                        } else {
                            // Just return the order at that time
                            try {
                                const orderGetAgain = await orderCollection.findOne({ 'payment.id': payment_id });
                                return NextResponse.json(orderGetAgain);
                            } catch (dbErr) {
                                console.error('Failed to fetch existing order:', dbErr);
                                return NextResponse.json({ error: 'Failed to fetch existing order' }, { status: 500 });
                            }
                        }
                        break; // Exit the switch to re-evaluate the while condition
                    } else {
                        // Update order status to payment success
                        try {
                            await orderCollection.updateOne(
                                { 'payment.id': payment_id },
                                {
                                    $set: {
                                        status: OrderStatus.PaymentSuccess,
                                        updated_at: new Date(),
                                    },
                                }
                            );
                            currentStatus = OrderStatus.PaymentSuccess;
                            break; // Exit the switch to proceed with wallet creation
                        } catch (dbErr) {
                            console.error('Failed to update order to payment success:', dbErr);
                            return NextResponse.json({ error: 'Failed to update order to payment success' }, { status: 500 });
                        }
                    }
                }
                case OrderStatus.PaymentSuccess: {
                    // Todo: Check smart-wallet exist or not from payment  passkey_publickey
                    if (paymenData.shipping.smart_wallet_address) {
                        currentStatus = OrderStatus.SWalletExists; // For now, assume wallet does not exist and proceed to creation
                        await orderCollection.updateOne(
                            { 'payment.id': payment_id },
                            {
                                $set: {
                                    status: OrderStatus.SWalletExists,
                                    updated_at: new Date(),
                                },
                            }
                        );
                        break; // Exit the switch to proceed with wallet creation
                    } else {
                        currentStatus = OrderStatus.CreateAndSendTokenToSWallet;
                        await orderCollection.updateOne(
                            { 'payment.id': payment_id },
                            {
                                $set: {
                                    status: OrderStatus.CreateAndSendTokenToSWallet,
                                    updated_at: new Date(),
                                },
                            }
                        );
                        break; // Exit the switch to proceed with wallet creation
                    }
                }
                case OrderStatus.CreateAndSendTokenToSWallet:
                case OrderStatus.SWalletExists: {
                    try {
                        const dataSmartWallet = await checkSmartWallet(paymenData.shipping.passkey.public_key);
                        try {
                            await orderCollection.updateOne(
                                { 'payment.id': payment_id },
                                {
                                    $set: {
                                        status: OrderStatus.TokenSending,
                                        updated_at: new Date(),
                                    },
                                }
                            );
                        } catch (checkErr) {
                            console.error('Failed to update order to token sending:', checkErr);
                            return NextResponse.json({ error: 'Failed to update order to token sending' }, { status: 500 });
                        }
                        let createWallet = await createSmartWalletAndSendToken(
                            {
                                credentialId: paymenData.shipping.passkey!.credential_id,
                                publicKey: paymenData.shipping.passkey!.public_key,
                                isCreated: true,
                                smartWalletAddress: paymenData.shipping.smart_wallet_address || '',
                                smartWalletId: new BN(paymenData.shipping.smart_wallet_id),
                            },
                            new PublicKey(paymenData.order_lines.key),
                            // paymenData.order_lines.quantity
                            2000000, // For testing, transfer 2 tokens to new smart wallet
                            dataSmartWallet.smartWallet ? dataSmartWallet.smartWallet.toBase58() : undefined
                        );

                        if (currentStatus == OrderStatus.CreateAndSendTokenToSWallet) {
                            currentStatus = OrderStatus.CreateAndSendTokenSuccess;
                        } else {
                            currentStatus = OrderStatus.TokenSendSuccess;
                        }

                        await orderCollection.updateOne(
                            { 'payment.id': payment_id },
                            {
                                $set: {
                                    'payment.shipping.smart_wallet_address': createWallet.walletAddress,
                                    send_token_tx_hash: createWallet.signature,
                                    status: currentStatus,
                                    updated_at: new Date(),
                                },
                            }
                        );
                    } catch (walletErr) {
                        console.error('Smart wallet creation failed:', walletErr);
                        // Update order status to create smartwallet fail and return the order at that time
                        try {
                            if (currentStatus == OrderStatus.CreateAndSendTokenToSWallet) {
                                currentStatus = OrderStatus.CreateAndSendTokenFail;
                            } else {
                                currentStatus = OrderStatus.TokenSendFail;
                            }
                            await orderCollection.updateOne(
                                { 'payment.id': payment_id },
                                {
                                    $set: {
                                        status: currentStatus,
                                        updated_at: new Date(),
                                    },
                                }
                            );
                        } catch (dbErr) {
                            console.error('Failed to update order after wallet creation failure:', dbErr);
                            return NextResponse.json({ error: 'Smart wallet creation failed' }, { status: 500 });
                        }
                    }

                    break; // Proceed to wallet creation logic below
                }
                case OrderStatus.TokenSending: {
                    await orderCollection.updateOne(
                        { 'payment.id': payment_id },
                        {
                            $set: {
                                status: OrderStatus.TokenSendSuccess,
                                updated_at: new Date(),
                            },
                        }
                    );
                    currentStatus = OrderStatus.TokenSendSuccess;
                    break;
                }
                default:
                    // If order already completed wallet creation step, just return it
                    const updatedOrder = await orderCollection.findOne({ 'payment.id': payment_id });
                    return NextResponse.json(updatedOrder);
            }
        }
    } catch (error) {
        console.error('Error fetching order status:', error);
        return NextResponse.json({ error: 'Failed to fetch order status' }, { status: 500 });
    }
}
