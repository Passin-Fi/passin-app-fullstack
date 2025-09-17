import { TokenSymbol } from 'crypto-icons/types';
import { SolanaEcosystemTokenInfo } from '../SolanaEcosystemTokenInfo';
import { WalletAdapterNetwork } from 'src/token-info/BaseTokenInfo';

export class SolanaDevnetTokenInfo extends SolanaEcosystemTokenInfo {
    constructor(input: { prettyName: string; symbol: TokenSymbol; decimals: number; address: string; isNative: boolean; coingeckoId?: string; isToken2022: boolean }) {
        super({
            prettyName: input.prettyName,
            symbol: input.symbol,
            decimals: input.decimals,
            address: input.address,
            network: { id: WalletAdapterNetwork.Devnet, name: 'Solana Devnet' },
            isNative: input.isNative,
            coingeckoId: input.coingeckoId,
            isToken2022: input.isToken2022,
        });
    }
}
