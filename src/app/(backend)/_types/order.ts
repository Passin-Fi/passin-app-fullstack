import type { ObjectId } from 'mongodb';
import type { CreateOrderPaymentResponse, MetadataKV, OrderLine } from 'src/services/payment/create-payment-order';

/**
 * PaymentStatus represents the various states an order can be in during its lifecycle.
 * Start from order has been creatied
 * - PaymentPending: The order has been created and is awaiting payment.
 * - PaymentCancel: The payment process was cancelled by the user or failed or checking after 10min from created time.
 * - PaymentSuccess: The payment was successfully completed.
 *
 * Check Smart-Wallet of user exist or not from passkey_publickey
 * - CreateAndSendTokenToSWallet: if check passkey_publickey do not find any smart_wallet then run ixs create and sendtoken at same time.
 * - SWalletExists: if check passkey_publickey find a smart_wallet corresponding to.
 *
 * If from status CreateAndSendTokenToSWallet, backend process done transaction then update to:
 * - CreateAndSendTokenSuccess: The tokens were successfully sent to the user's wallet.
 * - CreateAndSendTokenFail: There was an error when ixs of create and send tokens fail.
 *
 * If from status SWalletExists, backend process action to status TokenSending:
 * - TokenSending: Backend only process 1 ix send token to the user's wallet.
 * - TokenSendFail: There was an error sending the tokens to the user's wallet.
 * - TokenSendSuccess: The tokens were successfully sent to the user's wallet.
 */
export enum OrderStatus {
    PaymentPending = 'payment_pending',
    PaymentCancel = 'payment_cancel',
    PaymentSuccess = 'payment_success',

    CreateAndSendTokenToSWallet = 'create_and_send_token_to_swallet',
    CreateAndSendTokenSuccess = 'create_and_send_token_success',
    CreateAndSendTokenFail = 'create_and_send_token_fail',

    SWalletExists = 'swallet_exists',
    TokenSending = 'token_sending',
    TokenSendSuccess = 'token_send_success',
    TokenSendFail = 'token_send_fail',
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
    payment: CreateOrderPaymentResponse;
    status: OrderStatus;
    created_at: Date;
    updated_at: Date;
}
