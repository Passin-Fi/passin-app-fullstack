import { TokenSymbol } from 'crypto-icons/types';
import { BaseTokenInfo } from '../BaseTokenInfo';

export class SolanaEcosystemTokenInfo extends BaseTokenInfo {
    isToken2022: boolean;
    constructor(input: {
        prettyName: string;
        symbol: TokenSymbol;
        decimals: number;
        address: string;
        network: { id: string | number; name: string };
        isNative: boolean;
        coingeckoId?: string;
        isToken2022: boolean;
    }) {
        super(input.prettyName, input.symbol, input.decimals, input.address, input.network, input.isNative, input.coingeckoId);
        this.isToken2022 = input.isToken2022;
    }
}
