import { PAYMENT_API_BASE_URL, PAYMENT_APY_KEY } from '../constant';

export async function getPaymentStatus(paymentId: string) {
    const res = await fetch(`${PAYMENT_API_BASE_URL}/${paymentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-key': PAYMENT_APY_KEY,
        },
    });
    if (!res.ok) {
        const error: Error & { status?: number; data?: any; url?: string } = new Error(`Get payment status failed (${res.status} ${res.statusText})`);
        error.status = res.status;
        error.url = `${PAYMENT_API_BASE_URL}/${paymentId}`;
        throw error;
    }
    const data = await res.json();
    return data;
}
