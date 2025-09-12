import React, { ReactNode } from 'react';
import { Skeleton } from 'shadcn/skeleton';

type Props = {
    title: string;
    value: ReactNode;
    valueStyles?: React.CSSProperties;
    placeItems?: 'center' | 'start' | 'end';
    isLoading?: boolean;
    pt?: number;
    mt?: number;
    mb?: number;
};

export default function LineData(props: Props) {
    return (
        <div className={'flex' + ` mt-${props.mt}`}>
            <p className="muted">{props.title}</p>
            {props.isLoading ? (
                <Skeleton style={{ marginLeft: 'auto', width: '100px', height: '30px' }} />
            ) : (
                <>
                    {typeof props.value === 'string' ? (
                        <p className="lead font-bold" style={{ marginLeft: 'auto', textAlign: 'right', ...props.valueStyles }}>
                            {props.value}
                        </p>
                    ) : (
                        <div style={{ marginLeft: 'auto', textAlign: 'right', ...props.valueStyles }}>{props.value}</div>
                    )}
                </>
            )}
        </div>
    );
}
