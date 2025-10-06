import useAllTokenBalanceInfos from './useAllTokenBalanceInfos';
import { TokenSymbol } from 'crypto-icons/types';
import { BN } from 'src/utils';

export default function useTokenBalanceSolana(address: string, tokenName: TokenSymbol) {
    const { allSlpTokenBalances, native } = useAllTokenBalanceInfos(address);
    if (tokenName === TokenSymbol.SOL) {
        return native.SOL;
    }

    return {
        balance: allSlpTokenBalances.data?.[tokenName] || BN(0),
        isLoading: allSlpTokenBalances.isLoading,
        isFetching: allSlpTokenBalances.isFetching,
        refetch: allSlpTokenBalances.refetch,
    };
}
