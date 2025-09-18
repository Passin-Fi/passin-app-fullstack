import { NextResponse } from 'next/server';
import { getOrdersCollection } from 'backend/_lib/collections';
import { PaymentStatus, type OrderDoc } from 'backend/_types/order';
import { CreateOrderPaymentInput, CreateOrderPaymentResponse, MetadataKV, OrderLine, postCreateOrderPayment } from 'src/services/payment/create-payment-order';

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

        // Gửi yêu cầu đến API thanh toán bên ngoài
        let response: CreateOrderPaymentResponse;
        try {
            response = await postCreateOrderPayment({
                currency: 'USD',
                cancel_url: `${origin}/pools/${reqBody.id_pool}?reference_id=${reqBody.reference_id}&status=cancel`,
                success_url: `${origin}/pools/${reqBody.id_pool}?reference_id=${reqBody.reference_id}&status=success`,
                ...reqBody,
            });
        } catch (apiErr) {
            console.error('Error creating order payment:', apiErr);
            return NextResponse.json({ error: 'Failed to create order payment' }, { status: 502 });
        }

        // Lưu đơn hàng vào MongoDB (idempotent theo reference_id)
        try {
            const orders = await getOrdersCollection();
            const createdAt = (response as any)?.created_at ? new Date((response as any).created_at) : new Date();
            const toSet: Omit<OrderDoc, '_id' | 'created_at'> = {
                reference_id: reqBody.reference_id,
                id_pool: reqBody.id_pool,
                request: reqBody,
                payment: response,
                status: PaymentStatus.Pending,
                updated_at: new Date(),
            };
            await orders.updateOne({ reference_id: reqBody.reference_id }, { $set: toSet, $setOnInsert: { created_at: createdAt } }, { upsert: true });
        } catch (dbErr) {
            console.error('Warning: failed to persist order to MongoDB:', dbErr);
            // Không chặn luồng API nếu DB lỗi; vẫn trả kết quả thanh toán.
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in POST /api/orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Optional: GET /api/orders?reference_id=...
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const referenceId = searchParams.get('reference_id');
        const passkeyPublicKey = searchParams.get('passkey_public_key');

        if (referenceId && passkeyPublicKey) {
            return NextResponse.json({ error: 'Provide either reference_id or passkey_public_key, not both' }, { status: 400 });
        }

        const orders = await getOrdersCollection();

        if (referenceId) {
            const order = await orders.findOne({ reference_id: referenceId });
            if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
            return NextResponse.json(order);
        }

        if (passkeyPublicKey) {
            console.log('Searching orders with passkey public key:', passkeyPublicKey);
            const orderList = await orders.find({ 'payment.shipping.passkey.public_key': passkeyPublicKey }).toArray();
            return NextResponse.json(orderList);
        }

        return NextResponse.json({ error: 'reference_id or passkey_public_key is required' }, { status: 400 });
    } catch (error) {
        console.error('Error in GET /api/orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
