export function isNumeric(num: any) {
    return !isNaN(num) && !isNaN(parseFloat(num));
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
