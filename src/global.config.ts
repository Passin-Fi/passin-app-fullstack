import { ReactNode } from 'react';

// Augment NodeJS.ProcessEnv to strongly type Next.js environment variables
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly NEXT_PUBLIC_BASE_URL: string;
            readonly NEXT_PUBLIC_CLUSTER: 'devnet' | 'mainnet-beta' | 'testnet';
        }
    }
}
export interface FormatNumberOptions {
    /**
     * Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
     */
    fractionDigits?: number;
    /**
     * A fallback react tree to show when a number is invalid.
     * @default `---`
     */
    fallback?: ReactNode;
    /**
     * The string used to separate number.
     */
    delimiter?: string;
    /**
     * Allow zero after decimal point.
     * @default false
     */
    padZero?: boolean;
    /**
     * A string that will be appended to the beginning of the returned result.
     */
    prefix?: string;
    /**
     * A string that will be appended to the ending of the returned result.
     */
    suffix?: string;
    /**
     * return 0 if number < 0
     */
    onlyPositive?: boolean;
}
