import { findTokenInfo as mapInfoDevnet } from './solana-devnet/recordData';
import { SolanaEcosystemTokenInfo } from './SolanaEcosystemTokenInfo';

export const mapAddressToTokenInfo: Record<string, SolanaEcosystemTokenInfo> = {
    ...mapInfoDevnet,
};
