'use client';

import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import { TokenSymbol } from 'crypto-icons/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { Button } from 'shadcn/button';
import { Input } from 'shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'shadcn/select';
import { OrderPaymentInput } from 'backend/api/orders/route';
import CardCustom from 'src/components/card-custom/CardCustom';
import IconUSD from 'src/components/icons/IconUSD';
import IconVND from 'src/components/icons/IconVND';
import useTokenPrice from 'src/hooks/useTokenPrice';
import { dataPools } from '../../data';
import { usePasskeyConnected, usePasskeyConnectedValue } from 'src/jotai/connect-wallet/hooks';
import { PasskeyData, useWallet } from '@lazorkit/wallet';
import { iconMap } from 'crypto-icons/index';
import { lazorkitProgram } from 'backend/_helper/const';
import { convertArrayNumberToBase64, convertBase64ToArrayNumber } from 'src/utils';
import { toast } from 'react-toastify';
import LoadingAnimation1 from 'src/components/icons/LoadingAnimation1';
import useFetchOrders from 'src/views/orders/useFetchOrders';
import { getPaymentStatus } from 'src/services/payment/get-payment-status';
import { CreateOrderPaymentInput, postCreateOrderPayment } from 'src/services/payment/create-payment-order';

export default function Subcribe() {
    const { id: idPool } = useParams<{ id: string }>();

    if (!dataPools[idPool]) {
        return (
            <div className="flex justify-center items-center h-60">
                <h1>Pool not found</h1>
            </div>
        );
    }

    return <UIPoolIdValid idPool={idPool} />;
}

function UIPoolIdValid({ idPool }: { idPool: string }) {
    const priceTokenInVND = useTokenPrice(dataPools[idPool].tokenDeposit.symbol, 'VND');
    const priceTokenInUSD = useTokenPrice(dataPools[idPool].tokenDeposit.symbol, 'USD');
    const [selectedFiat, setSelectedFiat] = React.useState<'USD' | 'VND'>('VND');
    const [inputValue, setInputValue] = React.useState<{ amountToken: string; amountVND: string; amountUSD: string }>({ amountToken: '0', amountVND: '0', amountUSD: '0' });
    const [passkeyConnected, setPasskeyConnected] = usePasskeyConnected();
    const { smartWalletPubkey, wallet } = useWallet();
    const { refetch } = useFetchOrders(passkeyConnected?.publicKey || (wallet ? convertArrayNumberToBase64(wallet.passkeyPubkey) : ''));

    function handleChangeAmountToken(value: string) {
        const amountToken = value;
        const amountVND = priceTokenInVND.data ? (parseFloat(amountToken) * priceTokenInVND.data.rate).toFixed(2) : '0';
        const amountUSD = priceTokenInUSD.data ? (parseFloat(amountToken) * priceTokenInUSD.data.rate).toFixed(4) : '0';
        setInputValue({ amountToken, amountVND, amountUSD });
    }

    function handleChangeAmountQuote(value: string, fiat: 'USD' | 'VND') {
        if (fiat === 'VND') {
            const amountVND = value;
            const amountToken = priceTokenInVND.data ? (parseFloat(amountVND) / priceTokenInVND.data.rate).toFixed(2) : '0';
            const amountUSD = priceTokenInUSD.data ? (parseFloat(amountToken) * priceTokenInUSD.data.rate).toFixed(4) : '0';
            setInputValue({ amountToken, amountVND, amountUSD });
        } else {
            const amountUSD = value;
            const amountToken = priceTokenInUSD.data ? (parseFloat(amountUSD) / priceTokenInUSD.data.rate).toFixed(4) : '0';
            const amountVND = priceTokenInVND.data ? (parseFloat(amountToken) * priceTokenInVND.data.rate).toFixed(2) : '0';
            setInputValue({ amountToken, amountVND, amountUSD });
        }
    }

    async function subcribe() {
        try {
            if (!smartWalletPubkey && !passkeyConnected) {
                toast.error('Please login first!');
                return;
            }

            let passkey: PasskeyData | null = null;
            let smartWallet = '';

            if (smartWalletPubkey) {
                smartWallet = smartWalletPubkey.toString();
                passkey = {
                    publicKey: wallet ? convertArrayNumberToBase64(wallet.passkeyPubkey) : '',
                    credentialId: wallet ? wallet.credentialId : '',
                    isCreated: true,
                    smartWallet: wallet ? wallet.smartWallet : '',
                    smartWalletId: '',
                };
            } else {
                passkey = passkeyConnected;
                const getSmartWallet = await lazorkitProgram.getSmartWalletByPasskey(convertBase64ToArrayNumber(passkey?.publicKey || ''));
                if (getSmartWallet.smartWallet) {
                    toast.info('Found existing smart wallet for this passkey! Please connect smart wallet to continue.');
                    return;
                }
            }

            const slippage = 0.05; // 5%
            // passkey = {
            //     publicKey: 'A+eWPD8zgy9caOL5NC8+1wItIJ2LRhcxThmfI2oG4Ass',
            //     credentialId: 'Uuy8LYTPorWb9Wj+y8APFg==',
            //     isCreated: true,
            // };

            const bodyData = {
                id_pool: idPool,
                reference_id: Date.now() + '-' + idPool,
                order_lines: [
                    {
                        key: dataPools[idPool].tokenDeposit.address,
                        title: `Subcribe in Pool ${dataPools[idPool].name}`,
                        quantity: parseFloat(inputValue.amountToken),
                        unit_price: parseFloat(priceTokenInUSD.data ? priceTokenInUSD.data.rate.toFixed(4) : '0'),
                        min_receive_quantity: parseFloat((parseFloat(inputValue.amountToken) * (1 - slippage)).toFixed(0)),
                        price_tolerance_percent: slippage * 100,
                        supplier: dataPools[idPool].name,
                        supplier_id: dataPools[idPool].id,
                        image_url: iconMap[dataPools[idPool].tokenDeposit.symbol as TokenSymbol].lightMode,
                        note: dataPools[idPool].tokenDeposit.prettyName,
                    },
                ],
                shipping: {
                    id: smartWallet,
                    account_id: passkey!.publicKey,
                    zip: passkey!.credentialId,
                    phone: passkey!.smartWalletId,
                },
            } as OrderPaymentInput;

            console.log('Request body data:', bodyData);
            // create order
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });
            const data = await response.json();
            toast.success('Order created! Redirecting to payment...');
            console.log('Response data:', data);
            refetch();
            window.location.href = data.pay_now_url;
        } catch (error) {
            console.error('Error subcribe:', error);
            toast.error('Error subcribe!' + (error instanceof Error ? ` ${error.message}` : ''));
        }
    }
    return (
        <div className="max-w-md mx-auto mt-4">
            <CardCustom>
                <h4 className="text-center font-bold">Deposit in Pool {dataPools[idPool].name}</h4>
                <div className="mt-4">
                    <p className="muted">Enter amount</p>
                    <Input
                        placeholder="0"
                        type="number"
                        endAdornment={
                            <>
                                <span className="font-bold">{dataPools[idPool].tokenDeposit.symbol}</span>
                                <CryptoIcon name={dataPools[idPool].tokenDeposit.symbol} size={30} className="mobile:size-4 not-mobile:size-5" />
                            </>
                        }
                        endAdornmentClassName="flex items-center gap-1"
                        value={inputValue.amountToken}
                        onChange={(e) => handleChangeAmountToken(e.target.value)}
                    />
                </div>
                <div className="mt-4">
                    <p className="muted">Spend</p>
                    <Input
                        warpperClassName="!pr-0"
                        placeholder="0"
                        type="number"
                        endAdornment={
                            <Select value={selectedFiat} onValueChange={(value) => setSelectedFiat(value as 'USD' | 'VND')}>
                                <SelectTrigger className="!bg-transparent [&_svg]:!text-primary border-none" style={{ height: '30px' }}>
                                    <SelectValue className="font-bold" />
                                </SelectTrigger>
                                <SelectContent className="border-secondary shadow-md" align="end" sideOffset={4}>
                                    <SelectItem value="USD">
                                        USD <IconUSD size={30} className="mobile:size-4 not-mobile:size-5" />
                                    </SelectItem>
                                    <SelectItem value="VND">
                                        VND <IconVND size={30} className="mobile:size-4 not-mobile:size-5" />
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        }
                        endAdornmentClassName=""
                        value={selectedFiat === 'VND' ? inputValue.amountVND : inputValue.amountUSD}
                        onChange={(e) => handleChangeAmountQuote(e.target.value, selectedFiat)}
                    />
                </div>

                <div className="flex gap-2 mt-4">
                    <Button variant={'outline'} className="flex-1">
                        <Link className="w-full" href={`/pools/${idPool}`}>
                            Cancel
                        </Link>
                    </Button>
                    {/* <Button className="flex-1" onClick={subcribe}>
                        Subcribe
                    </Button> */}
                    <ButtonSubcribe onClick={subcribe} />
                </div>
            </CardCustom>
            <TestGetPaymentStatus />
        </div>
    );
}

function ButtonSubcribe({ onClick }: { onClick: () => Promise<void> }) {
    const [loading, setLoading] = React.useState(false);

    async function handleClick() {
        setLoading(true);
        try {
            await onClick();
        } catch (error) {
            console.error('Error in ButtonSubcribe:', error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Button className="flex-1" onClick={handleClick} disabled={loading}>
            {loading ? (
                <>
                    <LoadingAnimation1 size={22} /> Processing...
                </>
            ) : (
                'Subcribe'
            )}
        </Button>
    );
}

function TestGetPaymentStatus() {
    const {
        smartWalletPubkey,
        connect,
        connectPasskey,
        isConnected,
        isSmartWalletReady,
        createSmartWallet,
        checkSmartWalletByCredentialId,
        getSmartWalletByPasskey,
        getCurrentSmartWallet,
        getSmartWalletStatus,
        wallet,
    } = useWallet();
    const [paymentId, setPaymentId] = React.useState<string>('');
    const passkeyConnectedValue = usePasskeyConnectedValue();

    function logs() {
        console.log({ smartWalletPubkey, isConnected, wallet });
    }
    async function getStatus() {
        try {
            // const res = await fetch(`/api/orders/${paymentId}/capture`, { method: 'GET' });
            // const data = await res.json();
            const data = await getPaymentStatus(paymentId);
            console.log('Raw response data:', data);
        } catch (error) {
            console.error('Error get payment status:', error);
        }
    }

    async function connectPassk() {
        try {
            const data = await connectPasskey();
            console.log('data', data);
        } catch (error) {
            console.error('Error connect passkey:', error);
        }
    }

    async function testSmartWalletStatus() {
        try {
            const status = await getSmartWalletStatus();
            console.log('Smart wallet status:', status);
        } catch (error) {
            console.error('Error get smart wallet status:', error);
        }
    }

    async function checkIsSmartWalletReady() {
        try {
            const isReady = await isSmartWalletReady();
            console.log('Is smart wallet ready:', isReady);
        } catch (error) {
            console.error('Error check is smart wallet ready:', error);
        }
    }

    async function checkSmartWallet() {
        try {
            const response = await lazorkitProgram.getSmartWalletByPasskey(convertBase64ToArrayNumber('A+eWPD8zgy9caOL5NC8+1wItIJ2LRhcxThmfI2oG4Ass'));
            console.log('Smart wallet status:', {
                smartWallet: response.smartWallet?.toString(),
                walletDevice: response.walletDevice?.toString(),
            });
        } catch (error) {
            console.error('Error get smart wallet status:', error);
        }
    }

    async function testGetCurrentSmartWallet() {
        try {
            const response = await getCurrentSmartWallet();
            console.log('Current smart wallet:', {
                smartWallet: response.smartWallet?.toString(),
                walletDevice: response.walletDevice?.toString(),
            });
        } catch (error) {
            console.error('Error get current smart wallet:', error);
        }
    }

    async function testConnect() {
        try {
            const res = await connect();
            const passkey = convertArrayNumberToBase64(res.passkeyPubkey);
            console.log('Connect wallet success:', { res, passkey });
        } catch (error) {
            console.error('Error connect wallet:', error);
        }
    }

    async function createPaymentTest() {
        try {
            const bodyData = {
                id_pool: 'testpool0001',
                reference_id: Date.now() + '-testpool0001',
                order_lines: [
                    {
                        key: 'So11111111111111111111111111111111111111112',
                        title: 'Test payment',
                        quantity: 100,
                        unit_price: 1,
                        min_receive_quantity: 95,
                        price_tolerance_percent: 5,
                        supplier: 'Test supplier',
                        supplier_id: 'testsupplier0001',
                        image_url: 'https://cryptologos.cc/logos/solana-sol-logo.png',
                        note: 'Test note',
                    },
                ],
                shipping: {
                    id: 'YourSmartWalletAddress',
                    account_id: 'YourPasskeyPublicKey',
                    zip: 'YourPasskeyCredentialId',
                    phone: 'YourSmartWalletId',
                },
                cancel_url: 'https://yourdomain.com/cancel',
                success_url: 'https://yourdomain.com/success',
                metadata: [{ key: 'test_key', value: 'test_value' }],
                currency: 'USD',
            } as CreateOrderPaymentInput;
            const response = await postCreateOrderPayment(bodyData);
            console.log('Create payment response data:', response);
        } catch (error) {
            console.error('Error create payment test:', error);
        }
    }

    return (
        <div className="mt-6 border border-red-700">
            <Input placeholder="Payment ID" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
            <Button onClick={getStatus}>Test get</Button>
            <Button onClick={createPaymentTest}>Test create payment</Button>

            <div>
                <Button variant={'secondary'} onClick={logs}>
                    Logs wallet
                </Button>
            </div>

            <div className="mt-2">
                <Button variant={'default'} onClick={connectPassk}>
                    Connect passkey
                </Button>
            </div>

            <div className="mt-2">
                <Button variant={'default'} onClick={testSmartWalletStatus}>
                    Test smart wallet status
                </Button>
            </div>
            <div className="mt-2">
                <Button variant={'default'} onClick={checkIsSmartWalletReady}>
                    Check isSmartWalletReady
                </Button>
            </div>
            <div className="mt-2">
                <Button variant={'default'} onClick={testGetCurrentSmartWallet}>
                    Get current smart wallet
                </Button>
            </div>
            <div>
                <p>Smart wallet: {smartWalletPubkey?.toString() || 'null'}</p>
                <p>Passkey connected: {passkeyConnectedValue?.publicKey || 'null'}</p>
                <Button onClick={testConnect}>Test connect wallet (have create smartwallet)</Button>
            </div>

            <div>
                <Button variant={'destructive'} onClick={checkSmartWallet}>
                    Check smart wallet
                </Button>
            </div>
        </div>
    );
}
