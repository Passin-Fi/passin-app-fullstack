'use client';

import { useRouter } from '@bprogress/next/app';
import { TransactionInstruction, useWallet, useWalletStore, WalletInfo } from '@lazorkit/wallet';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { OrderDoc, OrderStatus } from 'backend/_types/order';
import { ExternalLink, SquareArrowOutUpRight, TriangleAlert } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'shadcn/button';
import { dataPools } from 'src/app/pools/data';
import ErrorAnimationIcon from 'src/components/icons/ErrorAnimationIcon';
import LoadingAnimation1 from 'src/components/icons/LoadingAnimation1';
import SuccessAnimationIcon from 'src/components/icons/SuccessAnimationIcon';
import Stepper, { StepperProps } from 'src/components/stepper/Stepper';
import { cn } from 'src/lib/utils';
import { BN, sleep } from 'src/utils';
import { formatAddress, formatNumber } from 'src/utils/format';

const stepPayment = () => ({ title: 'Payment', description: 'Check fiat money deposited into the system.' });
const stepCreateAndSendToken = (smartWallet?: string) => ({
    title: 'Create Smart Wallet & Send Token',
    description: (
        <p className="text-inherit text-sm">
            Creating smart wallet corresponding for your passkeys and send tokens to smart wallet. <br />
            {smartWallet && <span className="text-foreground">Created and Send to your wallet: {formatAddress(smartWallet, 7, 5)}</span>}
        </p>
    ),
});
const stepSendTokenToSmartWallet = (smartWallet: string) => ({
    title: 'Send Token to Smart Wallet',
    description: (
        <p className="text-inherit text-sm">
            Send tokens to the smart wallet. <br />
            <span className="text-foreground">Send to your wallet: {formatAddress(smartWallet, 7, 5)}</span>
        </p>
    ),
});
const stepSubToPool = (poolName: string, txHash?: string) => ({
    title: 'Subcrib to Pools',
    description: (
        <p className="text-inherit text-sm">
            Deposit tokens to the pool. Pool: {poolName}
            <br />
            {txHash && (
                <a className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap" target="_blank" href={`https://solscan.io/tx/${txHash}?cluster=devnet`}>
                    Tx: {formatAddress(txHash, 15, 6)} <SquareArrowOutUpRight className="inline" size={14} />
                </a>
            )}
        </p>
    ),
});

export default function OrderInformation({ dataOrder, isSuccessPayment }: { dataOrder: OrderDoc; isSuccessPayment: boolean }) {
    const { wallet, isConnecting, isConnected, isLoading } = useWallet();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1100);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center pt-7">
                <LoadingAnimation1 className="mx-auto" />
                <h5 className="pt-3.5 text-center">Connecting to wallet...</h5>
            </div>
        );
    }
    if (!isConnected || !wallet) {
        return (
            <div className="flex flex-col justify-center pt-7">
                <TriangleAlert size={80} className="text-red-500 mx-auto" />
                <h5 className="pt-3.5 text-center">Please connect your wallet to view order!</h5>
            </div>
        );
    }
    return <OrderView dataOrder={dataOrder} isSuccessPayment={isSuccessPayment} wallet={wallet} />;
}

function OrderView({ dataOrder, isSuccessPayment, wallet }: { dataOrder: OrderDoc; isSuccessPayment: boolean; wallet: WalletInfo }) {
    const poolInfo = dataPools[dataOrder.id_pool];
    const router = useRouter();
    const [stepData, setStepData] = React.useState<StepperProps>({
        steps: [{ title: 'Payment', description: 'Check fiat money deposited into the system.' }],
        currentStep: 0,
        isProcessDone: false,
    });
    const [isFetching, setIsFetching] = React.useState(false);
    const { syncWalletStatus, signAndSendTransaction, smartWalletPubkey } = useWallet();

    // Local order state driven by polling
    const [orderState, setOrderState] = useState<{ status: OrderStatus; order: OrderDoc }>(() => ({ status: dataOrder.status, order: dataOrder }));

    // Idempotent step updater
    const updateStep = useCallback((nextStep: number, nextDone: boolean) => {
        setStepData((prev) => {
            if (prev.currentStep === nextStep && prev.isProcessDone === nextDone) return prev;
            return { ...prev, currentStep: nextStep, isProcessDone: nextDone };
        });
    }, []);

    // Compute steps when order changes
    useEffect(() => {
        const o = orderState.order;
        const steps: StepperProps['steps'] = [];
        if (o.request.shipping.id) {
            if (orderState.status === OrderStatus.CreateAndSendTokenSuccess) {
                steps.push(stepPayment(), stepCreateAndSendToken(o.payment.shipping.smart_wallet_address), stepSubToPool(poolInfo?.name || 'Unknown Pool', o.subcribe_to_pool_tx_hash));
            } else {
                steps.push(stepPayment(), stepSendTokenToSmartWallet(o.request.shipping.id), stepSubToPool(poolInfo?.name || 'Unknown Pool', o.subcribe_to_pool_tx_hash));
            }
        } else {
            steps.push(stepPayment(), stepCreateAndSendToken(o.payment.shipping.smart_wallet_address), stepSubToPool(poolInfo?.name || 'Unknown Pool', o.subcribe_to_pool_tx_hash));
        }
        setStepData((prev) => ({ ...prev, steps }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderState.order.request.shipping.id, orderState.status, poolInfo?.name]);

    // Map status -> step
    useEffect(() => {
        switch (orderState.status) {
            case OrderStatus.PaymentPending:
                if (!isSuccessPayment) {
                    updateStep(0, true);
                    return;
                }
                updateStep(0, false);
                break;
            case OrderStatus.PaymentCancel:
                updateStep(0, true);
                break;
            case OrderStatus.PaymentSuccess:
            case OrderStatus.CreateAndSendTokenToSWallet:
                updateStep(1, false);
                break;
            case OrderStatus.CreateAndSendTokenSuccess:
            case OrderStatus.TokenSendSuccess:
                updateStep(2, false);
                break;
            case OrderStatus.CreateAndSendTokenFail:
            case OrderStatus.TokenSendFail:
                updateStep(1, true);
                break;
            case OrderStatus.SWalletExists:
            case OrderStatus.TokenSending:
                updateStep(1, false);
                break;
            case OrderStatus.SubcribeToPoolSuccess:
                updateStep(3, true);
                break;
        }
    }, [orderState.status, updateStep]);

    // Polling: capture once, then poll for status using interval and store into orderState
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;
        let stop = false;
        async function captureOrder() {
            setIsFetching(true);
            try {
                const res = await fetch(`/api/orders/${dataOrder.payment.id}/capture`, { method: 'POST' });
                const order = (await res.json()) as OrderDoc;
                setOrderState({ status: order.status, order });
            } catch (error) {
                console.error('Error capturing order:', error);
            } finally {
                setIsFetching(false);
            }
        }
        async function pollStatus() {
            try {
                const res = await fetch(`/api/orders/${dataOrder.payment.id}`);
                const s = (await res.json()) as { status: OrderStatus; order: OrderDoc };
                setOrderState((prev) => {
                    if (!prev || prev.status !== s.status || prev.order.updated_at !== s.order.updated_at) {
                        return s;
                    }
                    return prev;
                });
                // Stop conditions
                if (
                    s.status === OrderStatus.PaymentCancel ||
                    s.status === OrderStatus.CreateAndSendTokenFail ||
                    s.status === OrderStatus.TokenSendFail ||
                    s.status === OrderStatus.SubcribeToPoolSuccess
                ) {
                    stop = true;
                    if (intervalId) clearInterval(intervalId);
                }
            } catch (error) {
                console.error('Error fetching order status:', error);
            }
        }

        captureOrder();
        intervalId = setInterval(() => {
            if (!stop) pollStatus();
        }, 1200);
        return () => {
            if (intervalId) clearInterval(intervalId);
            stop = true;
        };
    }, [dataOrder.payment.id]);

    // Step 2: sync wallet then subscribe once
    const [shouldSubscribe, setShouldSubscribe] = useState(false);
    const isSubscribingRef = useRef(false);
    const hasSubscribedRef = useRef(false);
    const walletReadyRef = useRef(false);

    const subcribeToPool = async () => {
        if (!smartWalletPubkey) return;
        console.log('Start subcribe to pool ........');
        console.log({ smartWalletPubkey, wallet });
        try {
            isSubscribingRef.current = true;
            const ixs: TransactionInstruction[] = [];
            const transferIx = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: new PublicKey('H5s5m3LDeBawe1NTNcNPjrhKKgnpSDmDRZsiL6pXk3wQ'),
                lamports: 10_000_000,
            });
            ixs.push(transferIx);
            const tx = await signAndSendTransaction(ixs);
            const updatedb = await fetch(`/api/orders`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference_id: orderState.order.reference_id, subcribe_to_pool_tx_hash: tx }),
            });
            console.log('Updated order after subcribe to pool:', await updatedb.json());
            toast.success('Subcribed to pool successfully');
            hasSubscribedRef.current = true;
        } catch (error) {
            console.error('Error subcribe to pool:', error);
            toast.error('Error subcribe to pool: ' + (error as Error).message);
        } finally {
            isSubscribingRef.current = false;
        }
    };

    // Effect 1: when reach step 2 and not done -> sync and arm subscription
    useEffect(() => {
        if (stepData.currentStep !== 2 || stepData.isProcessDone) return;
        if (walletReadyRef.current || hasSubscribedRef.current || isSubscribingRef.current) return;
        (async () => {
            console.log(JSON.stringify({ currentStep: stepData.currentStep, isProcessDone: stepData.isProcessDone }));
            try {
                const dataSync = await syncWalletStatus();
                console.log('syncWalletStatus done:', dataSync);
                await sleep(150);
                walletReadyRef.current = true;
                setShouldSubscribe(true);
            } catch (e) {
                console.error('syncWalletStatus error:', e);
            }
        })();
    }, [stepData.currentStep, stepData.isProcessDone, syncWalletStatus]);

    // Effect 2: actually subscribe when wallet refreshed
    useEffect(() => {
        if (!shouldSubscribe) return;
        if (typeof signAndSendTransaction !== 'function') return;
        if (hasSubscribedRef.current || isSubscribingRef.current) return;
        subcribeToPool();
        setShouldSubscribe(false);
    }, [shouldSubscribe, signAndSendTransaction]);

    const o = orderState.order;
    return (
        <div className="py-6">
            {isFetching ? <LoadingAnimation1 className="mx-auto" /> : <>{isSuccessPayment ? <SuccessAnimationIcon /> : <ErrorAnimationIcon />}</>}
            <h1 className={cn('text-center text-2xl font-bold mb-2', isSuccessPayment ? 'text-emerald-600' : 'text-red-600')}>{isSuccessPayment ? 'Payment successful' : 'Payment failed'}</h1>
            <p className="text-center text-sm text-muted-foreground mb-6">
                {isSuccessPayment ? 'Thank you, your order has been received.' : 'Sorry, the transaction was unsuccessful. Please try again.'}
            </p>

            <Stepper {...stepData} />

            <div className="space-y-3 text-sm">
                <InfoRow label="Payment ID" value={o.payment.id} />
                <InfoRow label="Pool" value={o.payment.order_lines.supplier} />
                <InfoRow label="Status" value={orderState.status} />
                <InfoRow label="Created at" value={new Date(o.created_at).toLocaleString()} />
                <InfoRow label="Amount" value={o.payment.order_lines.quantity + ' ' + o.payment.order_lines.note} />
                <InfoRow label="Unit price" value={'$' + o.payment.order_lines.unit_price} />
                <InfoRow label="Total price" value={'$' + formatNumber(BN(o.payment.order_lines.unit_price).times(o.payment.order_lines.quantity), { fractionDigits: 4 })} />
            </div>

            <div className="mt-8 flex gap-3">
                <Button className="flex-1" variant="default" onClick={() => router.push('/pools')}>
                    Back to Pools
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => router.refresh()}>
                    Reload
                </Button>
            </div>
        </div>
    );
}

export function OrderInformationOld({ dataOrder, isSuccess }: { dataOrder: OrderDoc; isSuccess: boolean }) {
    const poolInfo = dataPools[dataOrder.id_pool];
    const router = useRouter();
    const [stepData, setStepData] = React.useState<StepperProps>({
        steps: [{ title: 'Payment', description: 'Check fiat money deposited into the system.' }],
        currentStep: 0,
        isProcessDone: false,
    });
    const [checkOrderAgain, setCheckOrderAgain] = React.useState<OrderDoc | null>(null);
    const [isFetching, setIsFetching] = React.useState(false);
    const { syncWalletStatus, wallet, signAndSendTransaction, connectPasskey, smartWalletPubkey, isConnecting, isLoading } = useWallet();

    // State + refs to coordinate the two-step flow (check wallet readiness -> then subscribe)
    const [shouldSubscribe, setShouldSubscribe] = useState(false);
    const [hasSubscribed, setHasSubscribed] = useState(false);
    const isSubscribingRef = useRef(false);
    const walletReadyRef = useRef(false);

    // Reset guards when order changes
    useEffect(() => {
        setHasSubscribed(false);
        setShouldSubscribe(false);
        isSubscribingRef.current = false;
        walletReadyRef.current = false;
    }, [dataOrder.reference_id]);

    // 1) Check wallet readiness when we reach step 2 and process not done yet
    const checkConditionSmartWallet = useCallback(async () => {
        try {
            if (!wallet) {
                // If wallet is null initially, try to connect passkey. If user already connected, hook will hydrate.
                await connectPasskey();
            }
            // Sync hook state to ensure smartWalletPubkey and signAndSendTransaction are refreshed
            await syncWalletStatus();
            await sleep(150); // small delay to allow hook state to propagate
            console.log('syncWalletStatus done', { smartWalletPubkey });
            return true;
        } catch (e) {
            console.error('checkConditionSmartWallet error:', e);
            toast.error('Unable to prepare wallet. Please try again.');
            return false;
        }
    }, [wallet, connectPasskey, syncWalletStatus]);

    useEffect(() => {
        let cancelled = false;
        if (stepData.currentStep === 2 && stepData.isProcessDone === false && !hasSubscribed && !isSubscribingRef.current && !shouldSubscribe && !walletReadyRef.current) {
            (async () => {
                const ready = await checkConditionSmartWallet();
                if (!cancelled && ready) {
                    // Mark that we can attempt subscribing. This will be picked up by the next effect
                    walletReadyRef.current = true;
                    setShouldSubscribe(true);
                }
            })();
        }
        return () => {
            cancelled = true;
        };
    }, [stepData.currentStep, stepData.isProcessDone, hasSubscribed, shouldSubscribe, checkConditionSmartWallet]);

    // 2) Subscribe when signAndSendTransaction is ready (it may change identity after sync)
    const subcribeToPool = useCallback(async () => {
        if (!smartWalletPubkey) return;
        try {
            isSubscribingRef.current = true;
            const ixs: TransactionInstruction[] = [];
            const transferIx = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: new PublicKey('H5s5m3LDeBawe1NTNcNPjrhKKgnpSDmDRZsiL6pXk3wQ'),
                lamports: 10_000_000,
            });
            ixs.push(transferIx);
            const tx = await signAndSendTransaction(ixs);
            console.log('signAndSendTransaction:', tx);
            const updatedb = await fetch(`/api/orders`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference_id: dataOrder.reference_id, subcribe_to_pool_tx_hash: tx }),
            });
            console.log('Updated order after subcribe to pool:', await updatedb.json());
            toast.success('Subcribed to pool successfully');
            setHasSubscribed(true);
        } catch (error) {
            console.error('Error subcribe to pool:', error);
            toast.error('Error subcribe to pool: ' + (error as Error).message);
        } finally {
            isSubscribingRef.current = false;
        }
    }, [smartWalletPubkey, signAndSendTransaction, dataOrder.reference_id]);

    useEffect(() => {
        if (!shouldSubscribe) return;
        if (typeof signAndSendTransaction !== 'function') return; // wait until hook refreshes
        if (hasSubscribed || isSubscribingRef.current) return;
        subcribeToPool();
        // we keep shouldSubscribe true until subcribeToPool runs once; then reset
        setShouldSubscribe(false);
    }, [shouldSubscribe, signAndSendTransaction, hasSubscribed, subcribeToPool]);

    // Idempotent step updater to avoid re-render storms when polling sets the same state
    const updateStep = useCallback((nextStep: number, nextDone: boolean) => {
        setStepData((prev) => {
            if (prev.currentStep === nextStep && prev.isProcessDone === nextDone) return prev;
            return { ...prev, currentStep: nextStep, isProcessDone: nextDone };
        });
    }, []);

    useEffect(() => {
        let currentStep = 0;
        let isProcessDone = false;
        let steps = [];
        if (dataOrder.payment.shipping.smart_wallet_address) {
            if (dataOrder.status == OrderStatus.CreateAndSendTokenSuccess) {
                steps.push(stepPayment(), stepCreateAndSendToken(), stepSubToPool(poolInfo?.name || 'Unknown Pool'));
            } else {
                steps.push(stepPayment(), stepSendTokenToSmartWallet(dataOrder.payment.shipping.smart_wallet_address), stepSubToPool(poolInfo?.name || 'Unknown Pool'));
            }
        } else {
            steps.push(stepPayment(), stepCreateAndSendToken(), stepSubToPool(poolInfo?.name || 'Unknown Pool'));
        }
        setStepData({ steps, currentStep: currentStep, isProcessDone });
    }, [dataOrder]);

    useEffect(() => {
        async function captureOrder() {
            setIsFetching(true);
            try {
                const res = await fetch(`/api/orders/${dataOrder.payment.id}/capture`, { method: 'POST' });
                const order = (await res.json()) as OrderDoc;
                console.log('Captured order:', order);
                setCheckOrderAgain(order);
            } catch (error) {
                console.error('Error capturing order:', error);
            }
            setIsFetching(false);
        }
        async function getOrderStatusAgain() {
            try {
                const res = await fetch(`/api/orders/${dataOrder.payment.id}`);
                const status = (await res.json()) as { status: OrderStatus; order: OrderDoc };
                return status;
            } catch (error) {
                console.error('Error fetching order status:', error);
                return null;
            }
        }
        async function fetchOrderStatusLoop() {
            while (true) {
                const status = await getOrderStatusAgain();
                if (status) {
                    switch (status?.status) {
                        case OrderStatus.PaymentPending:
                            updateStep(0, false);
                            break;
                        case OrderStatus.PaymentCancel:
                            updateStep(0, true);
                            return; // stop checking
                        case OrderStatus.PaymentSuccess:
                            updateStep(1, false);
                            break;
                        case OrderStatus.CreateAndSendTokenToSWallet:
                            updateStep(1, false);
                            break;
                        case OrderStatus.CreateAndSendTokenSuccess:
                            updateStep(2, false);
                            // const checkReadySubToPool = await checkConditionSmartWallet();
                            // if (checkReadySubToPool) {
                            //     await subcribeToPool();
                            //     return; // stop checking tam thoi
                            // }
                            await sleep(1500); // wait for db update
                            break;
                        case OrderStatus.CreateAndSendTokenFail:
                            updateStep(1, true);
                            return; // stop checking
                        case OrderStatus.SWalletExists:
                        case OrderStatus.TokenSending:
                            updateStep(1, false);
                            break;
                        case OrderStatus.TokenSendSuccess:
                            updateStep(2, false);
                            // const checkReadySubToPool2 = await checkConditionSmartWallet();
                            // if (checkReadySubToPool2) {
                            //     await subcribeToPool();
                            //     return; // stop checking tam thoi
                            // }
                            // return; // stop checking
                            await sleep(1500); // wait for db update
                            break;
                        case OrderStatus.TokenSendFail:
                            updateStep(1, true);
                            return; // stop checking
                        case OrderStatus.SubcribeToPoolSuccess:
                            updateStep(3, true);
                            return; // done
                    }
                }
                await sleep(600);
            }
        }
        captureOrder();
        fetchOrderStatusLoop();
    }, []);

    return (
        <div className="py-6">
            {isFetching ? <LoadingAnimation1 /> : <>{isSuccess ? <SuccessAnimationIcon /> : <ErrorAnimationIcon />}</>}
            <h1 className={cn('text-center text-2xl font-bold mb-2', isSuccess ? 'text-emerald-600' : 'text-red-600')}>{isSuccess ? 'Payment successful' : 'Payment failed'}</h1>
            <p className="text-center text-sm text-muted-foreground mb-6">{isSuccess ? 'Thank you, your order has been received.' : 'Sorry, the transaction was unsuccessful. Please try again.'}</p>

            <Stepper {...stepData} />

            <div className="space-y-3 text-sm">
                <InfoRow label="Payment ID" value={dataOrder.payment.id} />
                <InfoRow label="Pool" value={dataOrder.payment.order_lines.supplier} />
                <InfoRow label="Status" value={dataOrder.status} />
                <InfoRow label="Created at" value={new Date(dataOrder.created_at).toLocaleString()} />
                <InfoRow label="Amount" value={dataOrder.payment.order_lines.quantity + ' ' + dataOrder.payment.order_lines.note} />
                <InfoRow label="Unit price" value={'$' + dataOrder.payment.order_lines.unit_price} />
                <InfoRow label="Total price" value={'$' + formatNumber(BN(dataOrder.payment.order_lines.unit_price).times(dataOrder.payment.order_lines.quantity), { fractionDigits: 4 })} />
            </div>

            <div className="mt-8 flex gap-3">
                <Button className="flex-1" variant="default" onClick={() => router.push('/pools')}>
                    Back to Pools
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => router.refresh()}>
                    Reload
                </Button>
            </div>
        </div>
    );
}

const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between gap-4 rounded-md border px-3 py-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium truncate max-w-[65%] text-right" title={String(value ?? '')}>
            {value ?? '-'}
        </span>
    </div>
);
