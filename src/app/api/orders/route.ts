import { NextResponse } from 'next/server';
import { CreateOrderPaymentInput, MetadataKV, OrderLine, postCreateOrderPayment } from 'src/services/payment/create-payment-order';

// CreateOrder API (POST)
export type OrderPaymentInput = {
    id_pool: string;
    reference_id: CreateOrderPaymentInput['reference_id'];
    order_lines: CreateOrderPaymentInput['order_lines'];
    shipping: CreateOrderPaymentInput['shipping'];
    currency?: string;
    success_url?: string;
    cancel_url?: string;
    metadata?: MetadataKV[];
};

export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        console.log('Request Body:', reqBody);

        // Lấy origin từ headers
        const origin = request.headers.get('origin') || `https://${request.headers.get('host')}`;

        // Gửi yêu cầu đến API bên ngoài
        const response = await postCreateOrderPayment({
            currency: 'USD',
            cancel_url: `${origin}/pools/${reqBody.id_pool}?reference_id=${reqBody.reference_id}&status=cancel`,
            success_url: `${origin}/pools/${reqBody.id_pool}?reference_id=${reqBody.reference_id}&status=success`,
            ...reqBody,
        });

        // console.log('Response from external API:', response);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in POST /api/orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
