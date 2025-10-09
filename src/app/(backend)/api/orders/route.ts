import { NextResponse } from 'next/server';
import { getOrdersCollection } from 'backend/_lib/collections';
import { OrderStatus, type OrderDoc } from 'backend/_types/order';
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
                cancel_url: `${origin}/pools/${reqBody.id_pool}/subscribe/${reqBody.reference_id}?status=cancel`,
                success_url: `${origin}/pools/${reqBody.id_pool}/subscribe/${reqBody.reference_id}?status=success`,
                ...reqBody,
            });
        } catch (apiErr) {
            console.error('Error creating order payment:', apiErr);
            return NextResponse.json({ error: 'Failed to create order payment. ' + (apiErr as Error).message }, { status: 502 });
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
                status: OrderStatus.PaymentPending,
                updated_at: new Date(),
            };
            await orders.updateOne({ reference_id: reqBody.reference_id }, { $set: toSet, $setOnInsert: { created_at: createdAt } }, { upsert: true });
        } catch (dbErr) {
            console.error('Err: failed to persist order to MongoDB:', dbErr);
            return NextResponse.json({ error: 'Failed to persist order' }, { status: 500 });
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

// PATCH /api/orders
// Body: { reference_id: string; subscribe_to_pool_tx_hash: string }
// Behavior: Client can only provide the tx hash of subscribing tokens to the pool.
// When provided, we mark status = SubscribeToPoolSuccess.
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const referenceId = body?.reference_id as string | undefined;
        const subscribeToPoolTxHash = body?.subscribe_to_pool_tx_hash as string | undefined;

        if (!referenceId) {
            return NextResponse.json({ error: 'reference_id is required' }, { status: 400 });
        }
        if (typeof subscribeToPoolTxHash !== 'string' || !subscribeToPoolTxHash.trim()) {
            return NextResponse.json({ error: 'subscribe_to_pool_tx_hash is required' }, { status: 400 });
        }

        const orders = await getOrdersCollection();
        const update: Partial<OrderDoc> & { updated_at: Date } = { updated_at: new Date() };
        // Only when client confirms pool subscribe tx is finalized
        update.subscribe_to_pool_tx_hash = subscribeToPoolTxHash.trim();
        update.status = OrderStatus.SubscribeToPoolSuccess;

        const upd = await orders.updateOne({ reference_id: referenceId }, { $set: update });
        if (upd.matchedCount === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        const after = await orders.findOne({ reference_id: referenceId });
        return NextResponse.json(after);
    } catch (error) {
        console.error('Error in PATCH /api/orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
