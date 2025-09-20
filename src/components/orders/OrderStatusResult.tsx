'use client';
import React, { useEffect, useState } from 'react';
import { cn } from 'src/lib/utils';
import LoadingAnimation1 from 'src/components/icons/LoadingAnimation1';
import { Button } from 'shadcn/button';
import SuccessAnimationIcon from '../icons/SuccessAnimationIcon';
import ErrorAnimationIcon from '../icons/ErrorAnimationIcon';

type OrderDoc = {
    reference_id: string;
    id_pool: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    payment?: any;
    request?: any;
};

interface Props {
    referenceId?: string;
}

interface State {
    loading: boolean;
    error?: string;
    order?: OrderDoc;
}

const SuccessIcon = SuccessAnimationIcon;

const ErrorIcon = ErrorAnimationIcon;

export const OrderStatusResult: React.FC<Props> = ({ referenceId }) => {
    const [state, setState] = useState<State>({ loading: true });

    useEffect(() => {
        if (!referenceId) {
            setState({ loading: false, error: 'Thiếu reference_id' });
            return;
        }

        let aborted = false;
        const controller = new AbortController();

        async function load() {
            setState({ loading: true });
            try {
                const res = await fetch(`/api/orders?reference_id=${encodeURIComponent(referenceId as string)}`, {
                    signal: controller.signal,
                    cache: 'no-store',
                });
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(`API ${res.status}: ${txt}`);
                }
                const data: OrderDoc = await res.json();

                if (!aborted) setState({ loading: false, order: data });
            } catch (e: any) {
                if (aborted) return;
                setState({ loading: false, error: e?.message || 'Lỗi tải dữ liệu' });
            }
        }
        load();
        return () => {
            aborted = true;
            controller.abort();
        };
    }, [referenceId]);

    if (state.loading) {
        return (
            <div className="flex flex-col items-center py-14">
                <LoadingAnimation1 size={72} />
                <p className="mt-4 text-sm text-muted-foreground">Đang tải đơn hàng...</p>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="py-10">
                <ErrorIcon />
                <h2 className="text-center text-xl font-semibold mb-2">Không thể tải đơn hàng</h2>
                <p className="text-center text-sm text-muted-foreground mb-4">{state.error}</p>
                <div className="flex justify-center">
                    <Button onClick={() => window.location.reload()}>Thử lại</Button>
                </div>
            </div>
        );
    }

    const { order } = state;
    const createdAt = order?.created_at ? new Date(order.created_at) : undefined;
    const locale = typeof window !== 'undefined' ? navigator.language : 'vi-VN';
    const dateStr = createdAt ? createdAt.toLocaleString(locale) : 'N/A';

    // Giả định: status Pending / Succeeded / Failed / Cancelled
    const status = order?.status || 'Unknown';
    const isSuccess = /success|succeeded|pending/i.test(status) ? true : false; // pending coi như success tạm thời

    return (
        <div className="py-6">
            {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
            <h1 className={cn('text-center text-2xl font-bold mb-2', isSuccess ? 'text-emerald-600' : 'text-red-600')}>{isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}</h1>
            <p className="text-center text-sm text-muted-foreground mb-6">{isSuccess ? 'Cảm ơn bạn, đơn hàng đã được ghi nhận.' : 'Rất tiếc giao dịch không thành công. Vui lòng thử lại.'}</p>
            <div className="space-y-3 text-sm">
                <InfoRow label="Mã tham chiếu" value={order?.reference_id} />
                <InfoRow label="Pool" value={order?.id_pool} />
                <InfoRow label="Trạng thái" value={status} />
                <InfoRow label="Thời gian tạo" value={dateStr} />
                <InfoRow label="Số dòng hàng" value={order?.request?.order_lines?.length} />
                <InfoRow label="Số lượng tổng" value={sumQty(order)} />
            </div>
            <div className="mt-8 flex gap-3">
                <Button className="flex-1" variant="default" onClick={() => (window.location.href = '/pools')}>
                    Về Pools
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => window.location.reload()}>
                    Tải lại
                </Button>
            </div>
        </div>
    );
};

function sumQty(order?: OrderDoc) {
    if (!order?.request?.order_lines) return 0;
    try {
        return order.request.order_lines.reduce((a: number, l: any) => a + (Number(l.quantity) || 0), 0);
    } catch {
        return 0;
    }
}

const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between gap-4 rounded-md border px-3 py-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium truncate max-w-[55%] text-right" title={String(value ?? '')}>
            {value ?? '-'}
        </span>
    </div>
);

export default OrderStatusResult;
