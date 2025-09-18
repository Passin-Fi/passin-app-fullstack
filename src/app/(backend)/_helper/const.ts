import { ComputeBudgetProgram, Connection, Keypair, Transaction, VersionedTransaction } from '@solana/web3.js';
import { convertBase64ToArrayNumber } from 'src/utils';
import { AnchorProvider } from '@coral-xyz/anchor';
import type { Wallet } from '@coral-xyz/anchor';
import { LazorkitClient } from 'backend/_lib/contract-integration';

export const connection = new Connection('https://api.devnet.solana.com');
export class BackendSolanaClient {
    signerKeypair: Keypair;
    wallet: Wallet;
    provider: AnchorProvider;
    constructor(privateKeyBase64: string) {
        const signerKeypair = Keypair.fromSecretKey(Uint8Array.from(convertBase64ToArrayNumber(privateKeyBase64)));
        const wallet = {
            publicKey: signerKeypair.publicKey,
            payer: signerKeypair,
            async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
                if (typeof (tx as any).partialSign === 'function') {
                    (tx as any).partialSign(signerKeypair);
                } else if (typeof (tx as any).sign === 'function') {
                    (tx as any).sign([signerKeypair]);
                } else {
                    throw new Error('Unsupported transaction type for signing');
                }
                return tx;
            },
            async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
                return txs.map((tx) => {
                    if (typeof (tx as any).partialSign === 'function') {
                        (tx as any).partialSign(signerKeypair);
                    } else if (typeof (tx as any).sign === 'function') {
                        (tx as any).sign([signerKeypair]);
                    } else {
                        throw new Error('Unsupported transaction type for signing');
                    }
                    return tx;
                });
            },
        };
        this.signerKeypair = signerKeypair;
        this.wallet = wallet;
        this.provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    }
}

// Implement a minimal Wallet from the signer Keypair (Anchor no longer exports a runtime Wallet class)
export const lazorkitProgram = new LazorkitClient(connection);

export const gasPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 20_000 });
