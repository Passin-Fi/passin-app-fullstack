'use client';
import React from 'react';
import useFetchOrders from './useFetchOrders';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/accordion';
import OrderCard from './OrderCard';
import { useWallet } from '@lazorkit/wallet';
import { usePasskeyConnectedValue } from 'src/jotai/connect-wallet/hooks';
import { convertArrayNumberToBase64 } from 'src/utils';
import LoadingAnimation1 from 'src/components/icons/LoadingAnimation1';

export default function OrderList() {
    const { wallet } = useWallet();
    const passkey = usePasskeyConnectedValue();
    const { data, isLoading } = useFetchOrders(passkey?.publicKey || (wallet ? convertArrayNumberToBase64(wallet.passkeyPubkey) : ''));

    return (
        <div className="mt-6">
            {isLoading ? (
                <div className="text-center">
                    <LoadingAnimation1 size={80} className="mx-auto" />
                </div>
            ) : (
                <Accordion type="multiple" className="w-full max-w-2xl mx-auto">
                    {data?.map((order, index) => (
                        <OrderCard key={order.reference_id + index} data={order} value={`item-${index}`} />
                    ))}
                </Accordion>
            )}
        </div>
    );
}
