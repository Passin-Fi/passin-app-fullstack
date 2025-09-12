import { FormatNumberOptions } from 'src/global.config';
import { isNumeric } from './index';

export function numberWithCommas(x: number | string, delimiter = ','): string {
    if (!isNumeric(x)) {
        throw new Error('Must provide a correct number');
    }
    const [naturalPart, decimalPart] = x.toString().split('.');
    let out = naturalPart.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
    if (decimalPart) {
        out += '.' + decimalPart;
    }
    return out;
}

/**
 * Format a number
 * @param {*} number - The number needs to format
 * @param {FormatNumberOptions} options - Includes options to customize the results returned
 * @returns A string representing a number in formatted, `option.fallback` will be returned if `number` is invalid
 */
export function formatNumber(number: any, options?: FormatNumberOptions): string | FormatNumberOptions['fallback'] {
    const { fallback = '0.00', fractionDigits, delimiter, padZero, prefix, suffix, onlyPositive } = options ?? {};

    if (!isNumeric(number)) {
        return fallback;
    }

    let num: number | string = parseFloat(number);
    if (onlyPositive && num < 0) {
        num = 0;
    }
    if (isNumeric(fractionDigits)) {
        num = num.toFixed(fractionDigits);
    }
    if (!padZero) {
        num = Number(num); // remove last zeros
    }
    return (prefix ?? '') + numberWithCommas(num, delimiter) + (suffix ?? '');
}
