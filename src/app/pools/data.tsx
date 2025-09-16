import { TokenSymbol } from 'crypto-icons/types';

export type TypePool = {
    id: string;
    name: string;
    description: string;
    tokenDeposit: TokenSymbol;
    category: string[];
};
export const dataPools: Record<string, TypePool> = {
    jupiter: {
        id: 'jupiter',
        name: 'Jupiter',
        description: 'Jupiter is the largest planet in our solar system, known for its massive size and iconic Great Red Spot.',
        tokenDeposit: TokenSymbol.USDC,
        category: ['Lending', 'Liquidity Provider', 'Yield Aggregator'],
    },
};
