import { OrderStatus } from 'backend/_types/order';
import React from 'react';
import { Badge } from 'shadcn/badge';

export default function BadgeOrderStatus({ status, className }: { status: OrderStatus; className?: string }) {
    if (status === OrderStatus.PaymentPending) {
        return (
            <Badge className={className} variant="secondary">
                Payment Pending
            </Badge>
        );
    } else if (status === OrderStatus.PaymentCancel) {
        return (
            <Badge className={className} variant="destructive">
                Payment Cancel
            </Badge>
        );
    } else if (status === OrderStatus.PaymentSuccess) {
        return (
            <Badge className={className} variant="success">
                Payment Success
            </Badge>
        );
    } else if (status === OrderStatus.CreateAndSendTokenToSWallet) {
        return (
            <Badge className={className} variant="secondary">
                Creating Smart Wallet & Sending Token
            </Badge>
        );
    } else if (status === OrderStatus.CreateAndSendTokenSuccess) {
        return (
            <Badge className={className} variant="success">
                Create & Sent token to Smart Wallet success
            </Badge>
        );
    } else if (status === OrderStatus.CreateAndSendTokenFail) {
        return (
            <Badge className={className} variant="destructive">
                Failed to Create & Send token to Smart Wallet
            </Badge>
        );
    } else if (status === OrderStatus.SWalletExists) {
        return (
            <Badge className={className} variant="secondary">
                Smart Wallet Exists
            </Badge>
        );
    } else if (status === OrderStatus.TokenSending) {
        return (
            <Badge className={className} variant="secondary">
                Sending Token to Smart Wallet
            </Badge>
        );
    } else if (status === OrderStatus.TokenSendSuccess) {
        return (
            <Badge className={className} variant="success">
                Token Sent to Smart Wallet
            </Badge>
        );
    } else if (status === OrderStatus.TokenSendFail) {
        return (
            <Badge className={className} variant="destructive">
                Failed to Send Token to Smart Wallet
            </Badge>
        );
    } else if (status === OrderStatus.SubscribeToPoolSuccess) {
        return (
            <Badge className={className} variant="success">
                Subscribed to Pool
            </Badge>
        );
    } else {
        return (
            <Badge className={className} variant="secondary">
                Unknown Status
            </Badge>
        );
    }
}
