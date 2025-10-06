'use client';

import { PasskeyData } from '@lazorkit/wallet';
import { atom } from 'jotai';

export const passkeysConnected = atom<PasskeyData | null>(null);
