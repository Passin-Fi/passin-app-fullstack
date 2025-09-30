import * as anchor from '@coral-xyz/anchor';

export function instructionToAccountMetas(
  ix: anchor.web3.TransactionInstruction,
  signers?: anchor.web3.PublicKey | anchor.web3.PublicKey[]
): anchor.web3.AccountMeta[] {
  const signerArray = signers
    ? Array.isArray(signers)
      ? signers
      : [signers]
    : [];
  return ix.keys.map((k) => ({
    pubkey: k.pubkey,
    isWritable: k.isWritable,
    isSigner: signerArray.some((s) => s.toString() === k.pubkey.toString()),
  }));
}
export function getRandomBytes(len: number): Uint8Array {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const arr = new Uint8Array(len);
    globalThis.crypto.getRandomValues(arr);
    return arr;
  }
  try {
    // Node.js fallback
    const { randomBytes } = require('crypto');
    return randomBytes(len);
  } catch {
    throw new Error('No CSPRNG available');
  }
}

/**
 * Safely gets a vault index, handling the case where 0 is a valid value
 * @param vaultIndex - The vault index to check (can be 0)
 * @param generateDefault - Function to generate a default vault index
 * @returns The vault index or the generated default
 */
export function getVaultIndex(
  vaultIndex: number | undefined,
  generateDefault: () => number
): number {
  return vaultIndex !== undefined ? vaultIndex : generateDefault();
}
