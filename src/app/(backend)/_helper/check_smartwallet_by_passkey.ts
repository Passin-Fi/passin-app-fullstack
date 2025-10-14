import { convertBase64ToArrayNumber } from 'src/utils';
import { lazorkitProgram } from './const';

export async function checkSmartWallet(passkey_publickey: string | number[]) {
    try {
        const response = await lazorkitProgram.getSmartWalletByPasskey(typeof passkey_publickey === 'string' ? convertBase64ToArrayNumber(passkey_publickey) : passkey_publickey);
        return response;
    } catch (error) {
        return {
            smartWallet: null,
            walletDevice: null,
        };
    }
}
