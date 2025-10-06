import { AnchorProvider, Program, Idl, Wallet } from '@coral-xyz/anchor';
import { ComputeBudgetProgram, Keypair, PublicKey } from '@solana/web3.js';
import { publicClientSol } from 'src/constant';
import { sleep } from 'src/utils';

export abstract class SolanaContractAbstract<IDL extends Idl> {
    public provider: AnchorProvider;
    public program: Program<IDL>;
    public programId: PublicKey;
    constructor(programId: PublicKey, idl: IDL) {
        this.provider = new AnchorProvider(publicClientSol, new Wallet(Keypair.generate()), { preflightCommitment: 'finalized' });
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
