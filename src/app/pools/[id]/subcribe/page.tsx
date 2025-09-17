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
import { useWallet } from '@lazorkit/wallet';
import { iconMap } from 'crypto-icons/index';
import { lazorkitProgram } from 'backend/_helper/const';
import { convertArrayNumberToBase64, convertBase64ToArrayNumber } from 'src/utils';

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
    const { createPasskeyOnly } = useWallet();

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
            const slippage = 0.05; // 5%

            let passkey = passkeyConnected;
            if (!passkey) {
                // passkey = await createPasskeyOnly();
                passkey = {
                    publicKey: 'A+eWPD8zgy9caOL5NC8+1wItIJ2LRhcxThmfI2oG4Ass',
                    credentialId: 'Uuy8LYTPorWb9Wj+y8APFg==',
                    isCreated: true,
                };
                setPasskeyConnected(passkey);
            }

            const bodyData = {
                id_pool: idPool,
                reference_id: Date.now() + '-' + idPool,
                order_lines: [
                    {
                        key: dataPools[idPool].tokenDeposit.address,
                        title: `Subcribe in Pool ${dataPools[idPool].name}`,
                        quantity: parseFloat(inputValue.amountToken),
                        unit_price: parseFloat(priceTokenInUSD.data ? priceTokenInUSD.data.rate.toFixed(4) : '0'),
                        min_receive_quantity: parseFloat((parseFloat(inputValue.amountToken) * (1 - slippage)).toFixed(4)),
                        price_tolerance_percent: slippage * 100,
                        supplier: dataPools[idPool].name,
                        supplier_id: dataPools[idPool].id,
                        image_url: iconMap[dataPools[idPool].tokenDeposit.symbol as TokenSymbol].lightMode,
                        note: dataPools[idPool].tokenDeposit.prettyName,
                    },
                ],
                shipping: { id: '', account_id: passkey.publicKey, zip: passkey.credentialId },
            } as OrderPaymentInput;

            console.log('Request body data:', bodyData);
            // return;
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });
            const data = await response.json();
            console.log('Response data:', data);
        } catch (error) {
            console.error('Error subcribe:', error);
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
                    {' '}
                    <Button variant={'outline'} className="flex-1">
                        <Link className="w-full" href={`/pools/${idPool}`}>
                            Cancel
                        </Link>
                    </Button>
                    <Button className="flex-1" onClick={subcribe}>
                        Subcribe
                    </Button>
                </div>
            </CardCustom>
            <TestGetPaymentStatus />
        </div>
    );
}

function TestGetPaymentStatus() {
    const { smartWalletPubkey, connect } = useWallet();
    const [paymentId, setPaymentId] = React.useState<string>('');
    const passkeyConnectedValue = usePasskeyConnectedValue();

    async function getStatus() {
        try {
            const res = await fetch(`/api/orders/${paymentId}/capture`, { method: 'GET' });
            const data = await res.json();
            console.log('Raw response data:', data);
        } catch (error) {
            console.error('Error get payment status:', error);
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

    async function testConnect() {
        try {
            const res = await connect();
            const passkey = convertArrayNumberToBase64(res.passkeyPubkey);
            console.log('Connect wallet success:', { res, passkey });
        } catch (error) {
            console.error('Error connect wallet:', error);
        }
    }

    return (
        <div className="mt-4">
            <Input placeholder="Payment ID" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
            <Button onClick={getStatus}>Test get</Button>

            <div>
                <p>Smart wallet: {smartWalletPubkey?.toString()}</p>
                <Button onClick={testConnect}>Test connect wallet</Button>
            </div>

            <div>
                <Button variant={'destructive'} onClick={checkSmartWallet}>
                    Check smart wallet
                </Button>
            </div>
        </div>
    );
}
