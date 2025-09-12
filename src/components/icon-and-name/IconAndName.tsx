import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import { TokenSymbol } from 'crypto-icons/types';
import React from 'react';

type Props = {
    tokenName: TokenSymbol | string;
    className?: string;
    sizeIcon?: number;
    classNameText?: string;
    reverse?: boolean;
};

export default function IconAndName({ tokenName, className, sizeIcon, classNameText, reverse = false }: Props) {
    return (
        <div className={`flex place-items-center gap-2 w-fit ${reverse ? 'row-reverse' : undefined} ${className}`}>
            <CryptoIcon size={sizeIcon} name={tokenName} />
            <p className={`font-bold ${classNameText}`}>{tokenName}</p>
        </div>
    );
}
