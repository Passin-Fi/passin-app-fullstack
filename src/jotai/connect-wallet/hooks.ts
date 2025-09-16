import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { passkeysConnected } from './states';

export const usePasskeyConnected = () => useAtom(passkeysConnected);
export const usePasskeyConnectedValue = () => useAtomValue(passkeysConnected);
export const useSetPasskeyConnected = () => useSetAtom(passkeysConnected);
