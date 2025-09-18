import { usdc01DevSolanaDevnet } from 'src/token-info/solana-ecosystem/solana-devnet';
import { SolanaEcosystemTokenInfo } from 'src/token-info/solana-ecosystem/SolanaEcosystemTokenInfo';

export type TypePool = {
    id: string;
    name: string;
    description: string;
    tokenDeposit: SolanaEcosystemTokenInfo;
    category: string[];
};
export const dataPools: Record<string, TypePool> = {
    jupiter: {
        id: 'jupiter',
        name: 'Jupiter',
        description: 'Jupiter is the largest planet in our solar system, known for its massive size and iconic Great Red Spot.',
        tokenDeposit: usdc01DevSolanaDevnet,
        category: ['Lending', 'Liquidity Provider', 'Yield Aggregator'],
    },
};
