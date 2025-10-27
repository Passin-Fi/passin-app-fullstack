import { TokenSymbol } from 'crypto-icons/types';
import { SolanaDevnetTokenInfo } from './SolanaDevnetTokenInfo';

export const usdc01DevSolanaDevnet = new SolanaDevnetTokenInfo({
    address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    decimals: 6,
    symbol: TokenSymbol.USDC,
    prettyName: 'USDC_01',
    isNative: false,
    isToken2022: false,
});

export const fUSDCDevSolanaDevnet = new SolanaDevnetTokenInfo({
    address: '2Wx1tTo8PkTP95NyKoFNPTtcLnYaSowDkExwbHDKAZQu',
    decimals: 6,
    symbol: TokenSymbol.USDC,
    prettyName: 'Jupiter Lend USDC',
    isNative: false,
    isToken2022: false,
});
