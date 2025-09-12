export function isNumeric(num: any) {
    return !isNaN(num) && !isNaN(parseFloat(num));
}
