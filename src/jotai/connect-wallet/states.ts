'use client';

import { atom } from 'jotai';
import { PasskeyDataReadable } from 'src/types';

export const passkeysConnected = atom<PasskeyDataReadable | null>(null);
