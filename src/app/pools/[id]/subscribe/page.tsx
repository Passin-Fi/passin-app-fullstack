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
import { usePasskeyConnected } from 'src/jotai/connect-wallet/hooks';
import { PasskeyData, useWallet } from '@lazorkit/wallet';
import { iconMap } from 'crypto-icons/index';
import { lazorkitProgram } from 'backend/_helper/const';
import { convertArrayNumberToBase64, convertBase64ToArrayNumber } from 'src/utils';
import { toast } from 'react-toastify';
import LoadingAnimation1 from 'src/components/icons/LoadingAnimation1';
import useFetchOrders from 'src/views/orders/useFetchOrders';
import { getPaymentStatus } from 'src/services/payment/get-payment-status';
import { CreateOrderPaymentInput, postCreateOrderPayment } from 'src/services/payment/create-payment-order';
import { AnchorProvider, Program, Wallet, Idl, BN } from '@coral-xyz/anchor';
import { publicClientSol } from 'src/constant';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import useSmartWalletActive from 'src/hooks/useSmartWalletActive';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { PasskeyDataReadable } from 'src/types';
import useWalletDataReadable from 'src/hooks/useWalletDataReadable';

export default function Subscribe() {
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
    const [selectedFiat, setSelectedFiat] = React.useState<'USD' | 'VND'>('USD');
    const [inputValue, setInputValue] = React.useState<{ amountToken: string; amountVND: string; amountUSD: string }>({ amountToken: '0', amountVND: '0', amountUSD: '0' });
    const { passkeyConnected } = usePasskeyConnected();
    const { smartWalletPubkey, wallet } = useWallet();
    const { refetch } = useFetchOrders(passkeyConnected?.passkeyAddress || (wallet ? convertArrayNumberToBase64(wallet.passkeyPubkey) : ''));
    const { getSmartWallet } = useSmartWalletActive();

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

    async function subscribe() {
        try {
            if (!smartWalletPubkey && !passkeyConnected) {
                toast.error('Please login first!');
                return;
            }

            let passkey: PasskeyDataReadable | null = null;
            const getSmartWalletInfo = await getSmartWallet();
            const smartWallet = getSmartWalletInfo?.smartWallet?.toString() || '';

            if (smartWallet) {
                passkey = {
                    passkeyAddress: wallet ? convertArrayNumberToBase64(wallet.passkeyPubkey) : '',
                    credentialId: wallet ? wallet.credentialId : '',
                    smartWalletAddress: smartWallet,
                    walletId: new BN(0),
                };
            } else {
                passkey = passkeyConnected;
            }

            const slippage = 0.05; // 5%

            const bodyData = {
                id_pool: idPool,
                reference_id: Date.now() + '-' + idPool,
                order_lines: [
                    {
                        key: dataPools[idPool].tokenDeposit.address,
                        title: `Subscribe in Pool ${dataPools[idPool].name}`,
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
                    account_id: passkey!.passkeyAddress,
                    zip: passkey!.credentialId,
                    phone: passkey!.walletId.toString(),
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
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response data:', errorData);
                throw new Error(errorData.error || 'Failed to create order');
            }
            const data = await response.json();
            toast.success('Order created! Redirecting to payment...');
            console.log('Response data:', data);
            refetch();
            window.location.href = data.pay_now_url;
        } catch (error) {
            console.error('Error subscribe:', error);
            toast.error('Error subscribe!' + (error instanceof Error ? ` ${error.message}` : ''));
        }
    }
    return (
        <div className="max-w-md mx-auto mt-4">
            <CardCustom>
                <h4 className="text-center font-bold">Deposit in Pool {dataPools[idPool].name}</h4>
                <div className="mt-4">
                    <p className="muted">Buy amount</p>
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
                    <p className="muted">Spend amount</p>
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
                    {/* <Button className="flex-1" onClick={subscribe}>
                        Subscribe
                    </Button> */}
                    <ButtonSubscribe onClick={subscribe} />
                </div>
            </CardCustom>
            {process.env.NODE_ENV === 'development' && <TestGetPaymentStatus />}
        </div>
    );
}

function ButtonSubscribe({ onClick }: { onClick: () => Promise<void> }) {
    const [loading, setLoading] = React.useState(false);

    async function handleClick() {
        setLoading(true);
        try {
            await onClick();
        } catch (error) {
            console.error('Error in ButtonSubscribe:', error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Button className="flex-1" onClick={handleClick} disabled={loading}>
            {loading ? (
                <>
                    <LoadingAnimation1 className="text-foreground" size={22} /> Processing...
                </>
            ) : (
                'Subscribe'
            )}
        </Button>
    );
}

const safeStorage = {
    getItem: (key: string) => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') localStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
        if (typeof window !== 'undefined') localStorage.removeItem(key);
    },
};

const atomlocalPasskey = atomWithStorage(
    'themealo',
    'light',
    createJSONStorage(() => safeStorage)
);

function TestGetPaymentStatus() {
    const { smartWalletPubkey, connect, connectPasskey, isConnected, isConnecting, disconnect, isLoading, error, signAndSendTransaction, isSigning, wallet } = useWallet();
    const [paymentId, setPaymentId] = React.useState<string>('');
    const { passkeyConnected } = usePasskeyConnected();
    const dataWalletReadable = useWalletDataReadable();

    function logs() {
        console.log(dataWalletReadable);
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

    async function testConnect() {
        try {
            const res = await connect();
            const passkey = convertArrayNumberToBase64(res.passkeyPubkey);
            console.log('Connect wallet success:', { res, passkey });
        } catch (error) {
            console.error('Error connect wallet:', error);
        }
    }

    async function getSmartWalletByPasskey() {
        try {
            if (!wallet) {
                console.error('Please connect passkey wallet first!');
                return;
            }
            const response = await lazorkitProgram.getSmartWalletByPasskey(wallet!.passkeyPubkey);
            console.log('getSmartWalletByPasskey response:', {
                smartwallet: response.smartWallet?.toString(),
                walletDevice: response.walletDevice?.toString(),
            });
        } catch (error) {
            console.error('Error getSmartWalletByPasskey:', error);
        }
    }

    async function getSmartWalletByWalletId() {
        try {
            if (!passkeyConnected) {
                console.error('Please connect passkey wallet first!');
                return;
            }
            const response = await lazorkitProgram.getSmartWalletPubkey(new BN(passkeyConnected?.walletId));
            console.log('smart wallet PDA from wallet ID response:', {
                smartwallet: response?.toString(),
                walletId: passkeyConnected?.walletId,
            });
        } catch (error) {
            console.error('Error getSmartWalletByPasskey:', error);
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

    async function testSignAndSend() {
        // const provider = new AnchorProvider(publicClientSol, new Wallet(new Keypair()), { preflightCommitment: 'finalized' });

        try {
            if (!smartWalletPubkey) {
                console.error('Please connect smart wallet first!');
                return;
            }
            const ixs: TransactionInstruction[] = [];

            const transferIx = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: new PublicKey('H5s5m3LDeBawe1NTNcNPjrhKKgnpSDmDRZsiL6pXk3wQ'),
                lamports: 10_000_000,
            });
            ixs.push(transferIx);
            const tx = await signAndSendTransaction(ixs);
            console.log('signAndSendTransaction:', tx);
        } catch (error) {
            console.error('Error create payment test:', error);
        }
    }

    return (
        <div className="mt-6 border border-red-700">
            <Input placeholder="Payment ID" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
            <Button onClick={getStatus}>Test get</Button>
            <Button variant={'destructive'} onClick={createPaymentTest}>
                Test create payment
            </Button>

            <p>Check isLoading {isLoading ? 'true' : 'false'}</p>
            <p>Check isConnecting {isConnecting ? 'true' : 'false'}</p>
            <p>Check isConnected {isConnected ? 'true' : 'false'}</p>

            <div className="mt-2">
                <Button variant={'secondary'} onClick={logs}>
                    Logs wallet variable
                </Button>
            </div>

            <div className="mt-2">
                <Button variant={'default'} onClick={connectPassk}>
                    connectPasskey()
                </Button>
            </div>

            <div className="mt-2">
                <Button variant={'outline'} onClick={getSmartWalletByPasskey}>
                    getSmartWalletBy - Passkey()
                </Button>
            </div>

            <div className="mt-2">
                <Button variant={'outline'} onClick={getSmartWalletByWalletId}>
                    getSmartWalletBy - WalletId()
                </Button>
            </div>

            <div className="mt-2">
                <p>Smart wallet: {smartWalletPubkey?.toString() || 'null'}</p>
                <p>Passkey connected: {passkeyConnected?.passkeyAddress || 'null'}</p>
                <Button onClick={testConnect}>connect() - full flow smartwallet</Button>
            </div>

            <div className="mt-2">
                <Button onClick={testSignAndSend}>{isSigning ? 'Signing.....' : 'Test sign and send ix'}</Button>
            </div>

            <div className="mt-2">
                <Button variant={'destructive'} onClick={disconnect}>
                    Disconnect()
                </Button>
            </div>
        </div>
    );
}
