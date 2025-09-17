import { TokenSymbol } from 'crypto-icons/types';

export class BaseTokenInfo {
    constructor(
        public prettyName: string,
        public symbol: TokenSymbol,
        public decimals: number,
        public address: string,
        public network: { id: string | number; name: string },
        public isNative: boolean,
        public coingeckoId?: string
    ) {}
}

export enum WalletAdapterNetwork {
    Mainnet = 'mainnet-beta',
    Testnet = 'testnet',
    Devnet = 'devnet',
}
