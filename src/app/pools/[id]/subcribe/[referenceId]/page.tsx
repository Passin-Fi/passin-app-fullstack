import React from 'react';
import NotFoundOrder from 'src/views/pools/results-orders/NotFoundOrder';
import { OrderDoc } from 'backend/_types/order';
import FailToLoadOrder from 'src/views/pools/results-orders/FailToLoadOrder';
import OrderInformation from 'src/views/pools/results-orders/OrderInformation';
import { getPaymentStatus } from 'src/services/payment/get-payment-status';

// Option: incremental revalidate per referenceId (e.g. 30s) + tag for manual invalidation.
// If you need to programmatically revalidate: fetch('/api/revalidate?tag=order-<id>') in an API route.

async function fetchOrder(referenceId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/orders?reference_id=${referenceId}`.replace(/([^:]?)\/\//g, '$1/'), {
            // Provide caching semantics; each referenceId can be cached separately.
            next: { revalidate: 30, tags: [`order:${referenceId}`] },
        });
        if (res.status === 404)
            return {
                error: 'Not Found',
                status: 404,
            };
        if (!res.ok) {
            // Decide: throw to trigger error boundary or return null. We throw so higher layer can decide.
            throw new Error(`Order fetch failed ${res.status}`);
        }
        return (await res.json()) as OrderDoc;
    } catch (err) {
        // Log server side; but return null to avoid crashing the whole page.
        console.error('[order-page] fetch error', err);
        return {
            error: err instanceof Error ? err.message : 'Unknown error',
            status: 500,
        }; // undefined signals hard failure
    }
}

export default async function ResultOrderPayment({ params, searchParams }: PageProps<'/pools/[id]/subcribe/[referenceId]'>) {
    const [{ referenceId }, search] = await Promise.all([params, searchParams]);
    if (!referenceId) return <NotFoundOrder />;

    const order = await fetchOrder(referenceId);
    // const paymentStatus = await getPaymentStatus(String(search.payment_id))

    if (order.status === 500) {
        // Hard failure (network / 5xx). You could also throw new Error to use error.js.
        return <FailToLoadOrder error={order.error} />;
    }

    if (order.status === 404) {
        // Not found
        return <NotFoundOrder />;
    }

    return (
        <div className="mx-auto max-w-[450px] py-4 px-1 space-y-2">
            <h1 className="text-lg font-semibold">Order ID: {referenceId}</h1>
            {search.status && <p className="text-sm text-muted-foreground">Status param: {String(search.status)}</p>}
            <OrderInformation dataOrder={order as OrderDoc} isSuccessPayment={search.status == 'success'} />
            <pre className="mt-4 overflow-auto rounded bg-muted p-3 text-xs leading-relaxed">{JSON.stringify(order, null, 2)}</pre>
        </div>
    );
}
