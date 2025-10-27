import { fUSDCDevSolanaDevnet, usdc01DevSolanaDevnet } from '.';
import { SolanaDevnetTokenInfo } from './SolanaDevnetTokenInfo';

export const findTokenInfo: Record<string, SolanaDevnetTokenInfo> = {
    [usdc01DevSolanaDevnet.address]: usdc01DevSolanaDevnet,
    [fUSDCDevSolanaDevnet.address]: fUSDCDevSolanaDevnet,
};
