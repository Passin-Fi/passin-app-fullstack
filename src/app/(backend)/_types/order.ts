import type { ObjectId } from 'mongodb';
import type { CreateOrderPaymentResponse, MetadataKV, OrderLine } from 'src/services/payment/create-payment-order';

export enum PaymentStatus {
    Pending = 'pending',
    CompletedPay = 'completed_pay',
    FailedPay = 'failed_pay',
    CreatingWallet = 'creating_wallet',
    CreateWalletFail = 'create_wallet_fail',
    SendingTokenToSmartwallet = 'sending_token_to_smartwallet',
    SendTokenToSmartwalletFail = 'send_token_to_smartwallet_fail',
    Completed = 'completed',
}

export type OrderRequest = {
    reference_id: string;
    id_pool: string;
    order_lines: OrderLine[];
    shipping: {
        id: string;
        account_id: string;
        zip: string;
    };
    currency?: string;
    success_url?: string;
    cancel_url?: string;
    metadata?: MetadataKV[];
};

export interface OrderDoc {
    _id?: ObjectId;
    reference_id: string;
    id_pool: string;
    request: OrderRequest;
    payment: CreateOrderPaymentResponse | Record<string, unknown>;
    status: PaymentStatus;
    created_at: Date;
    updated_at: Date;
}
