'use client';
import { useQuery } from '@tanstack/react-query';
import { OrderDoc } from 'backend/_types/order';

export default function useFetchOrders(passkey: string) {
    return useQuery({
        queryKey: ['fetch-orders', passkey],
        queryFn: async () => {
            const response = await fetch(`/api/orders?passkey_public_key=${encodeURIComponent(passkey)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched orders data:', data);
            return data as OrderDoc[];
        },
        enabled: !!passkey,
        staleTime: 1000 * 60 * 10, // 1 minute
        refetchOnWindowFocus: false,
    });
}
