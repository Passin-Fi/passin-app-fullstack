'use client';
import { useQuery } from '@tanstack/react-query';
import { dataPools } from 'src/app/pools/data';
import { SolanaContractJupLend } from 'src/contracts/class/jup_lend/SolanaContractJupLend';
import useSmartWalletActive from 'src/hooks/useSmartWalletActive';
import { BN, DEC } from 'src/utils';

function usePoolExchangeRate({ poolId }: { poolId: string }) {
    return useQuery({
        queryKey: ['pool-exchange-rate', poolId],
        queryFn: async () => {
            const contractJupLend = new SolanaContractJupLend();
            const poolStaticInfo = dataPools[poolId];
            return await contractJupLend.getExchangeRate({ token: poolStaticInfo.tokenDeposit });
        },
        enabled: !!poolId,
        // Refetch every 10 seconds
        refetchInterval: 10 * 1000,
    });
}
function usePoolFTokenTotalSupply({ poolId }: { poolId: string }) {
    return useQuery({
        queryKey: ['pool-fToken-total-supply', poolId],
        queryFn: async () => {
            const contractJupLend = new SolanaContractJupLend();
            const poolStaticInfo = dataPools[poolId];
            return await contractJupLend.getFTokenTotalSupply({ token: poolStaticInfo.tokenDeposit });
        },
        enabled: !!poolId,
        // Refetch every 5 minutes
        refetchInterval: 5 * 60 * 1000,
    });
}

function useUserFTokenBalance({ poolId }: { poolId: string }) {
    const { smartWallet } = useSmartWalletActive();
    return useQuery({
        queryKey: ['user-fToken-balance', poolId, smartWallet?.toString()],
        queryFn: async () => {
            if (!smartWallet) {
                return 0;
            }
            const contractJupLend = new SolanaContractJupLend();
            const poolStaticInfo = dataPools[poolId];

            return await contractJupLend.getUserFTokenBalance({ token: poolStaticInfo.tokenDeposit, smartWallet });
        },
        enabled: !!poolId && !!smartWallet,
        refetchInterval: 30 * 60 * 1000,
        staleTime: 30 * 60 * 1000,
        gcTime: 31 * 60 * 1000,
    });
}

export default function usePoolOnChainInfo({ poolId }: { poolId: string }) {
    const exchangeRateQuery = usePoolExchangeRate({ poolId });
    const fTokenTotalSupplyQuery = usePoolFTokenTotalSupply({ poolId });
    const userFTokenBalanceQuery = useUserFTokenBalance({ poolId });
    const poolData = dataPools[poolId];
    return {
        exchangeRate: exchangeRateQuery,
        totalSupply: {
            isLoading: fTokenTotalSupplyQuery.isLoading && exchangeRateQuery.isLoading,
            data: fTokenTotalSupplyQuery.data
                ? BN(fTokenTotalSupplyQuery.data)
                      .times(exchangeRateQuery.data ? exchangeRateQuery.data.toNumber() : 0)
                      .div(BN(1_000_000_000_000))
                      .div(DEC(poolData.tokenDeposit.decimals))
                : undefined,

            refetch: async () => {
                await Promise.all([exchangeRateQuery.refetch(), fTokenTotalSupplyQuery.refetch()]);
            },
        },
        userDeposited: {
            isLoading: userFTokenBalanceQuery.isLoading && exchangeRateQuery.isLoading,
            data: userFTokenBalanceQuery.data
                ? BN(userFTokenBalanceQuery.data)
                      .times(exchangeRateQuery.data ? exchangeRateQuery.data.toNumber() : 0)
                      .div(BN(1_000_000_000_000))
                      .div(DEC(poolData.tokenDeposit.decimals))
                : undefined,
            refetch: async () => {
                await Promise.all([exchangeRateQuery.refetch(), userFTokenBalanceQuery.refetch()]);
            },
        },
    };
}
