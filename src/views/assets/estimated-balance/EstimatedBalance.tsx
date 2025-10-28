'use client';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from 'shadcn/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from 'shadcn/select';
import IconAndName from 'src/components/icon-and-name/IconAndName';
import { ChevronDown } from 'lucide-react';
import { formatNumber } from 'src/utils/format';

export default function EstimatedBalance() {
    const [isHidden, setIsHidden] = useState<boolean>(true);

    return (
        <div>
            <div className="flex place-items-center gap-2">
                <h4 className="font-bold">Estimated Balance</h4>
                <div className="cursor-pointer">
                    {isHidden ? (
                        <Eye onClick={() => setIsHidden(!isHidden)} size={19} className="text-muted-foreground" />
                    ) : (
                        <EyeOff onClick={() => setIsHidden(!isHidden)} size={19} className="text-muted-foreground" />
                    )}
                </div>
            </div>
            <div>
                <div className="mt-2.5 flex place-items-center gap-3">
                    <p className="font-bold text-[28px] text-primary">{isHidden ? '***' : formatNumber('100')}</p>
                    <Select value="USDT">
                        <SelectTrigger className="w-[100px] [&_svg]:!text-primary" style={{ height: '23px' }}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="w-[100px] min-w-[100px]">
                            <SelectGroup>
                                <SelectItem value="USDT">
                                    <IconAndName tokenName="USDT" sizeIcon={14} classNameText="text-xs leading-4" />
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-sm">~ ${formatNumber(100)}</p>
            </div>
            <div className="flex gap-2 mt-3 max-w-md">
                <Button variant={'outline'} className="flex-1">
                    Withdraw
                </Button>
                <Button className="flex-1">Deposit</Button>
            </div>
        </div>
    );
}
