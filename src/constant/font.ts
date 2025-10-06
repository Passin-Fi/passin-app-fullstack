import { Geist_Mono, Mulish } from 'next/font/google';

export const mulish = Mulish({
    subsets: ['latin'],
    display: 'swap',
});

export const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});
