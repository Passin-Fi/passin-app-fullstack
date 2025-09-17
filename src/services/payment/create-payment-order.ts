import { PAYMENT_API_BASE_URL, PAYMENT_APY_KEY } from '../constant';

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
    image_url?: string;
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
        id: string; // smart wallet address of user
        account_id: string; // passkey public key of user
        zip: string; // passkey credential id of user
    };
    success_url: string;
    cancel_url: string;
    metadata?: MetadataKV[];
};

export type CreateOrderPaymentResponse = {
    id: string;
    payment_token: string;
    shipping: {
        smart_wallet_address?: string;
        passkey?: {
            public_key: string;
            credential_id: string;
        };
    };
    status: string;
    view_order_url?: string;
    pay_now_url?: string;
    success_url?: string;
    cancel_url?: string;
    order_lines: OrderLine;
    created_at?: string;
};

/**
 * Create an order payment against the external payment API.
 * Note: This function talks directly to the external endpoint (by default).
 * If you need to call through the internal Next.js API route (to avoid exposing secrets to the client),
 * call your own client-side helper that POSTs to "/api/orders" instead of using this function directly in the browser.
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

    // Try to parse JSON; if it fails (or body is empty), fall back to text for better error diagnostics
    let data: any = null;
    let rawBody: string | undefined;
    try {
        data = await res.json();
    } catch (_jsonErr) {
        try {
            rawBody = await res.text();
            data = rawBody ? { raw: rawBody } : null;
        } catch (_textErr) {
            // ignore
        }
    }

    if (!res.ok) {
        const error: Error & { status?: number; data?: any; url?: string } = new Error(`Create order payment failed (${res.status} ${res.statusText})`);
        error.status = res.status;
        error.data = data;
        error.url = endpoint;
        console.error('Create order payment error details:', { status: error.status, data: error.data, url: error.url });
        throw error;
    }

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

export default {
    postCreateOrderPayment,
};
