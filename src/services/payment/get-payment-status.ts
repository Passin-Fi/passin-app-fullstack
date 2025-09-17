import { PAYMENT_API_BASE_URL, PAYMENT_APY_KEY } from '../constant';
import { CreateOrderPaymentResponse } from './create-payment-order';

export async function getPaymentStatus(paymentId: string): Promise<CreateOrderPaymentResponse> {
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
        console.error('Get payment status error details:', { status: error.status, url: error.url });
        throw error;
    }
    const data = await res.json();
    return {
        id: data.id,
        payment_token: data.payment_token,
        status: data.status,
        order_lines: data.order_lines?.[0] || {},
        shipping: {
            smart_wallet_address: data.shipping.id,
            passkey: {
                public_key: data.shipping.account_id,
                credential_id: data.shipping.zip,
            },
        },
        view_order_url: data.links?.[0]?.href,
        pay_now_url: data.links?.[1]?.href,
        success_url: data.links?.[2]?.href,
        cancel_url: data.links?.[3]?.href,
        created_at: data.created,
    } as CreateOrderPaymentResponse;
}
