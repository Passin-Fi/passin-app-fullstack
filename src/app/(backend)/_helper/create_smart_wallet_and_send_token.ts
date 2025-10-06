import { PasskeyData } from '@lazorkit/wallet';
import { convertBase64ToArrayNumber, sleep } from 'src/utils';
import { BackendSolanaClient, connection, gasPriceInstruction, lazorkitProgram } from './const';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { createAssociatedTokenAccountIdempotentInstruction, createTransferInstruction, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';

export async function createSmartWalletAndSendToken(
    passKeys: PasskeyData,
    tokenMint: PublicKey,
    amount: number,
    smartWalletOfPasskeys?: string
): Promise<{ walletAddress: string; isCreated: boolean; signature: string }> {
    try {
        if (process.env.WALLET_BE == undefined) {
            throw new Error('Backend wallet not configured');
        }
        const backendClient = new BackendSolanaClient(process.env.WALLET_BE!);
        const provider = backendClient.provider;
        const ixs = [gasPriceInstruction];
        const signerKeypairs = [provider.wallet.payer!];

        // const smartWalletIdBn = lazorkitProgram.generateWalletId();
        // const smartWallet = lazorkitProgram.getSmartWalletPubkey(smartWalletIdBn);
        const smartWalletIdBn: BN = new BN(passKeys.smartWalletId);
        const smartWallet = smartWalletOfPasskeys ? new PublicKey(smartWalletOfPasskeys) : lazorkitProgram.getSmartWalletPubkey(smartWalletIdBn);

        if (!smartWalletOfPasskeys) {
            // Todo: create smart wallet only when not exist
            const publicKeyBase64 = passKeys.publicKey;
            const passkeyPubkey = convertBase64ToArrayNumber(publicKeyBase64);
            const walletDevice = lazorkitProgram.getWalletDevicePubkey(smartWallet, passkeyPubkey);
            const credentialId = Buffer.from(passKeys.credentialId);
            const policyInstruction = await lazorkitProgram.defaultPolicyProgram.buildInitPolicyIx(smartWalletIdBn, passkeyPubkey, smartWallet, walletDevice);
            const args = {
                passkeyPublicKey: passkeyPubkey,
                credentialId,
                policyData: policyInstruction.data,
                walletId: smartWalletIdBn,
                amount: new BN(0.00342432 * LAMPORTS_PER_SOL),
                referralAddress: null,
                vaultIndex: null,
            };
            //@ts-ignore
            const createSmartWalletIx = await lazorkitProgram.buildCreateSmartWalletIns(provider.publicKey, smartWallet, walletDevice, policyInstruction, args);
            ixs.push(createSmartWalletIx);
            console.log('##################Create smart wallet instruction added###############################');
        }

        // Send token to smart wallet
        const createAccountIx = createAssociatedTokenAccountIdempotentInstruction(provider.publicKey, getAssociatedTokenAddressSync(tokenMint, smartWallet, true), smartWallet, tokenMint);
        const transferTokenIx = createTransferInstruction(
            getAssociatedTokenAddressSync(tokenMint, provider.publicKey),
            getAssociatedTokenAddressSync(tokenMint, smartWallet, true),
            provider.publicKey,
            amount
        );
        console.log('##################Transfer token instruction added###############################');

        ixs.push(createAccountIx, transferTokenIx);
        const signature = await sendVersionedTransaction(ixs, signerKeypairs);
        const check = await checkTransactionStatus(signature as string);
        if (!check) {
            throw new Error('Transaction failed on chain!');
        }
        return { walletAddress: smartWallet.toString(), isCreated: true, signature: signature as string };
    } catch (error) {
        console.error('Create smart wallet error:', error);
        throw error;
    }
}

async function sendVersionedTransaction(instructions: TransactionInstruction[], singerKeypairs: Keypair[], lookupTableAddress?: PublicKey, isSimulate?: boolean) {
    if (instructions.length <= 1) {
        throw new Error('No instructions');
    }

    let alt = [];

    if (lookupTableAddress != undefined) {
        const lookupTableAccounts = await connection.getAddressLookupTable(lookupTableAddress);
        // console.log(lookupTableAccounts.value?.state.addresses)
        if (!lookupTableAccounts || !lookupTableAccounts.value) {
            throw new Error('Failed to fetch ALT');
        }
        alt.push(lookupTableAccounts.value);
    }

    const messageV0 = new TransactionMessage({
        payerKey: singerKeypairs[0].publicKey,
        instructions,
        recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    }).compileToV0Message(alt);

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign(singerKeypairs);

    let signature;
    if (isSimulate == true) {
        signature = await connection.simulateTransaction(transaction, {
            commitment: 'confirmed',
        });
    } else {
        signature = await connection.sendTransaction(transaction, { skipPreflight: false });
    }
    console.log('Transaction sent:', signature);
    return signature;
}

export async function checkTransactionStatus(signature: string): Promise<boolean> {
    const countTimeout = 120; // 120 times check
    let count = 0;
    while (count < countTimeout) {
        const { value } = await connection.getSignatureStatuses([signature], { searchTransactionHistory: true });
        const status = value[0];
        if (status?.confirmationStatus == 'finalized') {
            return true;
        }
        await sleep(500);
        count++;
    }
    return false;
}
