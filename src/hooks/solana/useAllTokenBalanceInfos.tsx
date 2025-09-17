import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { TokenSymbol } from 'crypto-icons/types';
import { publicClientSol } from 'src/constant';
import { mapAddressToTokenInfo } from 'src/token-info/solana-ecosystem/recordData';
import { BN, DEC } from 'src/utils';

export default function useAllTokenBalanceInfos(addressUser: string) {
    const nativeSolBalance = useNativeSolBalance(addressUser);
    const allSlpTokenBalances = useAllSlpTokenBalances(addressUser);
    return {
        native: {
            [TokenSymbol.SOL]: { balance: nativeSolBalance.data || BN(0), isLoading: nativeSolBalance.isLoading, isFetching: nativeSolBalance.isFetching, refetch: nativeSolBalance.refetch },
        },
        allSlpTokenBalances,
    };
}

function useNativeSolBalance(addressUser: string) {
    return useQuery({
        queryKey: ['solana', 'native-sol-balance', addressUser],
        queryFn: async () => {
            const publicKey = new PublicKey(addressUser);
            const balance = await publicClientSol.getBalance(publicKey);
            return BN(balance).div(DEC(9));
        },
        enabled: !!addressUser,
        staleTime: 1000 * 60 * 5,
    });
}
function useAllSlpTokenBalances(addressUser: string) {
    return useQuery({
        queryKey: ['solana', 'all-slp-token-balances', addressUser],
        queryFn: async () => {
            const publicKey = new PublicKey(addressUser);
            const tokenAccounts = await publicClientSol.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID,
            });
            // console.log(tokenAccounts);
            const result: { [k in TokenSymbol]?: BigNumber } = {};
            for (const tokenAccount of tokenAccounts.value) {
                const tokenAdd = tokenAccount.account.data.parsed.info.mint;
                const tokenSymbolOrAddress = mapAddressToTokenInfo[tokenAdd]?.symbol || tokenAdd;
                const balance = BN(tokenAccount.account.data.parsed.info.tokenAmount.uiAmount);
                result[tokenSymbolOrAddress] = balance;
            }
            return result;
        },
        enabled: !!addressUser,
        staleTime: 1000 * 60 * 5,
    });
}
