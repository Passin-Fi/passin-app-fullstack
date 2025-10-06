import BigNumber from 'bignumber.js';

export function isNumeric(num: any) {
    return !isNaN(num) && !isNaN(parseFloat(num));
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function convertArrayNumberToBase64(passkeyPubkey: number[]): string {
    return Buffer.from(passkeyPubkey).toString('base64');
}

export function convertBase64ToArrayNumber(base64String: string): number[] {
    return Array.from(Buffer.from(base64String, 'base64'));
}

/**
 * Cast a value to BigNumber instance.
 * @param value - The value
 * @returns An instance of BigNumber or NaN if value isn't a valid number.
 */
export function BN(value: any): BigNumber {
    return new BigNumber(value);
}

export function DEC(value: string | number): BigNumber {
    return BN(10).pow(value);
}
