'use client';
import React from 'react';
import { cn } from 'src/lib/utils';
import LoadingAnimation1 from 'src/components/icons/LoadingAnimation1';

export type Step = {
    iconSuccess?: React.ReactNode;
    iconCurrent?: React.ReactNode;
    iconDefault?: React.ReactNode;
    iconFail?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
};
export type StepperProps = {
    steps: Step[];
    currentStep?: number;
    isProcessDone?: boolean;
};

export default function Stepper({ currentStep = 0, steps, isProcessDone = false }: StepperProps) {
    return (
        <div className="relative">
            {steps.map((step, index) => {
                const isCompleted = index < currentStep; // đã đi qua
                const isCurrent = index === currentStep; // đang đứng
                const isAfter = index > currentStep; // bước phía sau
                const isLast = index === steps.length - 1;

                // Logic icon:
                // - Nếu process Done (kết thúc) và index >= current -> fail icon
                // - Nếu chưa Done: các bước > current là default icon (chưa chạm tới)
                // - Bước current: iconCurrent
                // - Bước < current: iconSuccess
                let icon: React.ReactNode;
                if (isCompleted) {
                    icon = step.iconSuccess || <span className="text-white font-bold">✓</span>;
                } else if (isProcessDone && (isCurrent || isAfter)) {
                    // Khi process Done: current và các bước sau -> Fail
                    icon = step.iconFail || <span className="text-white font-bold">✕</span>;
                } else if (isCurrent) {
                    icon = step.iconCurrent || (
                        <div className="flex items-center justify-center">
                            <LoadingAnimation1 size={35} />
                        </div>
                    );
                } else {
                    icon = step.iconDefault || <span className="text-gray-500 font-bold">{index + 1}</span>;
                }

                const baseColor = isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isProcessDone && (isCurrent || isAfter)
                    ? 'bg-red-500 border-red-500 text-white'
                    : isCurrent
                    ? 'border-none'
                    : 'bg-gray-200 border-gray-300 text-gray-600';

                return (
                    <div key={index} className="flex items-start mb-6">
                        <div className="flex flex-col items-center mt-1 mr-4">
                            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors', baseColor)}>{icon}</div>
                            {!isLast && <div className={cn('flex-1 w-px mt-1', isCompleted ? 'bg-emerald-500' : isProcessDone && isAfter ? 'bg-red-500' : 'bg-gray-300')} />}
                        </div>
                        <div className="flex-1 ">
                            <h4
                                className={cn(
                                    'font-semibold',
                                    isCompleted ? 'text-emerald-600' : isProcessDone && (isCurrent || isAfter) ? 'text-red-600' : isCurrent ? 'text-primary' : 'text-gray-600'
                                )}
                            >
                                {step.title}
                            </h4>
                            {step.description && <div className="text-sm text-gray-500">{step.description}</div>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
