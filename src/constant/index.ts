import { Connection } from '@solana/web3.js';

export const rpcDistilled = 'https://solana-woker.distilled.ai';
// export const rpcDevnet = 'https://api.devnet.solana.com';
export const rpcDevnet = 'https://devnet.helius-rpc.com/?api-key=47712b7a-ea63-49b8-9685-dff77d9eb55a';

export const publicClientSol = new Connection(rpcDevnet, 'confirmed');
