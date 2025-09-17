import { PasskeyData } from '@lazorkit/wallet';
import { convertBase64ToArrayNumber, sleep } from 'src/utils';
import { connection, gasPriceInstruction, lazorkitProgram, provider } from './const';
import { Keypair, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';

export async function createSmartWallet(passKeys: PasskeyData) {
    const ixs = [gasPriceInstruction];
    const signerKeypairs = [provider.wallet.payer!];

    const publicKeyBase64 = passKeys.publicKey;
    const passkeyPubkey = convertBase64ToArrayNumber(publicKeyBase64);

    const smartWalletId = lazorkitProgram.generateWalletId();
    const smartWallet = lazorkitProgram.smartWalletPda(smartWalletId);

    const walletDevice = lazorkitProgram.walletDevicePda(smartWallet, passkeyPubkey);

    const credentialId = Buffer.from('testing');

    const policyInstruction = await lazorkitProgram.defaultPolicyProgram.buildInitPolicyIx(provider.publicKey, smartWallet, walletDevice);

    const createSmartWalletIx = await lazorkitProgram.buildCreateSmartWalletInstruction(provider.publicKey, smartWallet, walletDevice, policyInstruction, {
        passkeyPubkey,
        credentialId,
        policyData: policyInstruction.data,
        walletId: smartWalletId,
        isPayForUser: true,
    });

    ixs.push(createSmartWalletIx);
    const signature = await sendVersionedTransaction(ixs, signerKeypairs);
    const check = await checkTransactionStatus(signature as string);
    if (!check) {
        throw new Error('Transaction failed');
    }
    return { walletAddress: smartWallet.toString(), isCreated: true };
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
