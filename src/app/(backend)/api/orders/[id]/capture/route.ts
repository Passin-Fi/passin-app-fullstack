import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // PRODUCTION-required: read order from database and return it
    // PRODUCTION-required: read payment_id from existing order

    // Lấy payment_id từ query string
    const { searchParams } = new URL(request.url);
    const payment_id = searchParams.get('payment_id');

    console.log('Fetching order with ID:', id, 'and payment ID:', payment_id);

    if (!payment_id) {
        return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    const patch: Record<string, string | number> = {};
}
