import { useQuery } from '@tanstack/react-query';
import { TokenSymbol } from 'crypto-icons/types';
import { fetchTokenPrice, FiatCurrency } from 'src/services/token-prices';

export default function useTokenPrice(token: TokenSymbol, fiatCurrency: FiatCurrency = 'USD') {
    return useQuery({
        queryKey: ['tokenPrice', token, fiatCurrency],
        queryFn: async () => {
            const response = await fetchTokenPrice(token, fiatCurrency);
            return response;
        },
        enabled: !!token,
        // 1️⃣ luôn coi data là cũ → khi component mount lại sẽ fetch mới ngay
        staleTime: 0,
        // 2️⃣ giữ cache 5 phút, hết 5p không ai dùng thì xoá cache
        gcTime: 5 * 60 * 1000,
        // 3️⃣ chỉ chạy interval khi có component dùng query
        refetchInterval: 30 * 1000,
    });
}
