import { PAYMENT_API_BASE_URL, PAYMENT_APY_KEY } from './constant';

// Types for order creation payload and response
export type OrderLine = {
    key: string;
    title: string;
    quantity: number;
    supplier: string;
    supplier_id: string;
    min_receive_quantity: number;
    price_tolerance_percent: number;
    unit_price: number;
};

export type MetadataKV = {
    key: string;
    value: string;
};

export type CreateOrderPaymentInput = {
    currency: string;
    reference_id: string;
    order_lines: OrderLine[];
    shipping: {
        id: string; // public key of user
        account_id: string; // user id
    };
    success_url: string;
    cancel_url: string;
    metadata?: MetadataKV[];
};

export type CreateOrderPaymentResponse = {
    id: string;
    status: string;
    redirect_url?: string;
    checkout_url?: string;
    client_secret?: string;
    // Allow unknown fields without failing typing
    [k: string]: unknown;
};

/**
 * Create an order payment via the app's API proxy (recommended to avoid exposing API keys).
 * This calls the Next.js route at /api/orders which should forward to the external payment API.
 */
export async function postCreateOrderPayment(
    input: CreateOrderPaymentInput,
    opts?: {
        /** Override the endpoint. Defaults to the internal proxy "/api/orders". */
        endpoint?: string;
        /** Optional AbortSignal for cancellation. */
        signal?: AbortSignal;
        /** Optional extra headers (will be merged). */
        headers?: Record<string, string>;
    }
): Promise<CreateOrderPaymentResponse> {
    const endpoint = opts?.endpoint ?? PAYMENT_API_BASE_URL;

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'api-key': PAYMENT_APY_KEY,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(opts?.headers ?? {}),
        },
        body: JSON.stringify(input),
        signal: opts?.signal,
    });

    const data = await res.json();
    console.log('Response Data:', data);

    if (!res.ok) {
        const error: Error & { status?: number; data?: any; url?: string } = new Error(`Create order payment failed (${res.status} ${res.statusText})`);
        error.status = res.status;
        error.data = data;
        error.url = endpoint;
        throw error;
    }

    return data as CreateOrderPaymentResponse;
}

export default {
    postCreateOrderPayment,
};
