import { TokenSymbol } from 'crypto-icons/types';
import useAllTokenBalanceInfos from './useAllTokenBalanceInfos';
import { BN } from 'src/utils';

export default function useTokensBalanceSolana(userAddress: string, tokens: TokenSymbol[]) {
    const { allSlpTokenBalances, native } = useAllTokenBalanceInfos(userAddress);
    return tokens.map((token) => {
        if (token === TokenSymbol.SOL) {
            return native.SOL;
        } else {
            return {
                balance: allSlpTokenBalances.data?.[token] || BN(0),
                isLoading: allSlpTokenBalances.isLoading,
                isFetching: allSlpTokenBalances.isFetching,
                refetch: allSlpTokenBalances.refetch,
            };
        }
    });
}
