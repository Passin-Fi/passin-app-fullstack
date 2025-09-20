import { getOrdersCollection } from 'backend/_lib/collections';
import { NextResponse } from 'next/server';

// Todo: Get order status by payment_id
// GET /api/orders/:payment_id
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }
    const payment_id = id;
    // Fetch order status from database or external service using payment_id
    try {
        const orders = await getOrdersCollection();
        const orderExist = await orders.findOne({ 'payment.id': payment_id });
        if (!orderExist) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ status: orderExist.status, order: orderExist });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order status' }, { status: 500 });
    }
}
