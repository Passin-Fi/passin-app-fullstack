//TODO: Call price of token per fiat currency

import { TokenSymbol } from 'crypto-icons/types';

export type FiatCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'VND';

export async function fetchTokenPrice(token: TokenSymbol, fiatCurrency: FiatCurrency = 'USD'): Promise<{ rate: number }> {
    const response = await fetch(`https://api.coinbase.com/v2/prices/${token}-${fiatCurrency}/spot`);
    if (!response.ok) {
        throw new Error(`Failed to fetch price for ${token} in ${fiatCurrency}`);
    }
    const data = await response.json();
    return { rate: parseFloat(data.data.amount) };
}
