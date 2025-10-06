import { Connection } from '@solana/web3.js';

export const rpcDistilled = 'https://solana-woker.distilled.ai';
export const rpcDevnet = 'https://api.devnet.solana.com';

export const publicClientSol = new Connection(rpcDevnet, 'confirmed');
