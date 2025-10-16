import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { ComputeBudgetProgram, Keypair, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { publicClientSol } from 'src/constant';
import { sleep } from 'src/utils';

class GeneratedWallet {
    public publicKey: PublicKey;
    private kp: Keypair;
    public payer: Keypair;

    constructor(kp: Keypair) {
        this.kp = kp;
        this.publicKey = kp.publicKey;
        this.payer = kp;
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
        if (tx instanceof Transaction) {
            tx.partialSign(this.kp);
        } else {
            // VersionedTransaction
            (tx as VersionedTransaction).sign([this.kp]);
        }
        return tx;
    }

    async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
        txs.forEach((tx) => {
            if (tx instanceof Transaction) {
                (tx as Transaction).partialSign(this.kp);
            } else {
                (tx as VersionedTransaction).sign([this.kp]);
            }
        });
        return txs;
    }
}

export abstract class SolanaContractAbstract<IDL extends Idl> {
    public provider: AnchorProvider;
    public program: Program<IDL>;
    public programId: PublicKey;
    constructor(programId: PublicKey, idl: IDL) {
        this.provider = new AnchorProvider(publicClientSol, new GeneratedWallet(Keypair.generate()) as any, { preflightCommitment: 'finalized' });
        this.program = new Program(idl, this.provider);
        this.programId = programId;
    }

    setfeeGas(gas: number) {
        return ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: gas,
        });
    }

    async awaitConfirmTransaction(signature: string) {
        const latestBlockHash = await publicClientSol.getLatestBlockhash();

        await publicClientSol.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });
        await sleep(600);
    }
}
