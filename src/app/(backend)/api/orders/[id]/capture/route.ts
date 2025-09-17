import { createSmartWallet } from 'backend/_helper/create_smart_wallet';
import { NextResponse } from 'next/server';
import { getPaymentStatus } from 'src/services/payment/get-payment-status';
import { getOrdersCollection } from 'backend/_lib/collections';
import { PaymentStatus } from 'backend/_types/order';
import { CreateOrderPaymentResponse } from 'src/services/payment/create-payment-order';
import { PublicKey } from '@solana/web3.js';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    const payment_id = id;

    console.log('Fetching order with ID:', id, 'and payment ID:', payment_id);

    if (!payment_id) {
        return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    try {
        let response: CreateOrderPaymentResponse;
        try {
            response = await getPaymentStatus(payment_id);
            console.log('Payment status response: fetch ok #######################################');
        } catch (apiErr) {
            console.error('Error fetching payment status:', apiErr);
            return NextResponse.json({ error: 'Failed to fetch payment status' }, { status: 502 });
        }
        // Try to create smart wallet
        let createWallet;
        try {
            createWallet = await createSmartWallet(
                {
                    credentialId: response.shipping.passkey!.credential_id,
                    publicKey: response.shipping.passkey!.public_key,
                    isCreated: true,
                },
                new PublicKey(response.order_lines.key),
                // response.order_lines.quantity
                2000000 // For testing, transfer 2 tokens to new smart wallet
            );
            console.log('Smart Wallet created:', createWallet);
        } catch (walletErr) {
            console.error('Smart wallet creation failed:', walletErr);
            // Update order status to create smartwallet fail and return the order at that time
            try {
                const orders = await getOrdersCollection();
                await orders.updateOne(
                    { 'payment.id': payment_id },
                    {
                        $set: {
                            status: PaymentStatus.CreateWalletFail,
                            updated_at: new Date(),
                        },
                    }
                );
                const updatedOrder = await orders.findOne({ 'payment.id': payment_id });
                return NextResponse.json(updatedOrder);
            } catch (dbErr) {
                console.error('Failed to update order after wallet creation failure:', dbErr);
                return NextResponse.json({ error: 'Smart wallet creation failed' }, { status: 500 });
            }
        }

        // On success: update order with wallet address and status, then return updated order
        try {
            const orders = await getOrdersCollection();
            await orders.updateOne(
                { 'payment.id': payment_id },
                {
                    $set: {
                        'payment.shipping.smart_wallet_address': createWallet.walletAddress,
                        status: PaymentStatus.SendingTokenToSmartwallet,
                        updated_at: new Date(),
                    },
                }
            );

            const updatedOrder = await orders.findOne({ 'payment.id': payment_id });
            return NextResponse.json(updatedOrder);
        } catch (dbErr) {
            console.error('Failed to update or fetch order after wallet creation:', dbErr);
            return NextResponse.json({ error: 'Failed to update order after wallet creation' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error fetching payment status:', error);
        return NextResponse.json({ error: 'Failed to fetch payment status' }, { status: 500 });
    }
}
