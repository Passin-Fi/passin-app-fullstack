import { OrderDoc } from 'backend/_types/order';
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/accordion';
import { Badge } from 'shadcn/badge';
import { Button } from 'shadcn/button';
import LineData from 'src/components/line-data/LineData';
import { CreateOrderPaymentResponse } from 'src/services/payment/create-payment-order';
import { mapAddressToTokenInfo } from 'src/token-info/solana-ecosystem/recordData';

export default function OrderCard({ data, value }: { data: OrderDoc; value: string }) {
    const dataPayment = data.payment as CreateOrderPaymentResponse;
    return (
        <AccordionItem value={value} className="bg-card rounded-card mb-1.5">
            <AccordionTrigger className="bg-transparent items-center" style={{ textDecoration: 'none' }}>
                <div className="flex justify-between w-full">
                    <div>
                        <p className="muted"># {dataPayment.id}</p>
                        <Badge variant="secondary" className="mt-1">
                            {data.status}
                        </Badge>
                    </div>
                    <div className="text-right">
                        <p className="muted">{dataPayment.order_lines.supplier}</p>
                        <p className="lead">
                            {dataPayment.order_lines.quantity} {mapAddressToTokenInfo[dataPayment.order_lines.key]?.symbol || ''}
                        </p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-3.5 text-balance bg-secondary rounded-b-card">
                <LineData title="Create at" value={new Date(data.created_at).toLocaleString()} />

                <div className="mt-4 flex gap-2">
                    <Button size={'sm'} variant={'outline'} className="grow" asChild>
                        <a href={`${dataPayment.pay_now_url}`} target="_blank" rel="noreferrer">
                            Paynow
                        </a>
                    </Button>
                    <Button size={'sm'} variant={'secondary'} className="grow bg-accent" asChild>
                        <a href={`${dataPayment.view_order_url}`} target="_blank" rel="noreferrer">
                            View order
                        </a>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
