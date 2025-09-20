import { convertBase64ToArrayNumber } from 'src/utils';
import { lazorkitProgram } from './const';

export async function checkSmartWallet(passkey_publickey: string) {
    try {
        const response = await lazorkitProgram.getSmartWalletByPasskey(convertBase64ToArrayNumber(passkey_publickey));
        return response;
    } catch (error) {
        return {
            smartWallet: null,
            walletDevice: null,
        };
    }
}
