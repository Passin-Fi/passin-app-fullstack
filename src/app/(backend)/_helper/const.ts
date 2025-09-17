import { ComputeBudgetProgram, Connection, Keypair, Transaction, VersionedTransaction } from '@solana/web3.js';
import { convertBase64ToArrayNumber } from 'src/utils';
import { AnchorProvider } from '@coral-xyz/anchor';
import type { Wallet } from '@coral-xyz/anchor';
import { LazorkitClient } from 'backend/_lib/contract-integration';

export const signerKeypair = Keypair.fromSecretKey(Uint8Array.from(convertBase64ToArrayNumber(process.env.WALLET_BE!)));

export const connection = new Connection('https://api.devnet.solana.com');
// Implement a minimal Wallet from the signer Keypair (Anchor no longer exports a runtime Wallet class)
export const wallet: Wallet = {
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
export const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
export const lazorkitProgram = new LazorkitClient(connection);

export const gasPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 20_000 });
