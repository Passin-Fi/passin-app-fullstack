'use client';

import { FileClock, Pickaxe, UserRound, Wallet } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { layoutConstants } from './constant';
import { cn } from 'src/lib/utils';
import { usePathname } from 'next/navigation';

const menu = [
    { name: 'Acount', href: '/account', icon: UserRound },
    { name: 'Orders', href: '/orders', icon: FileClock },
    { name: 'Pools', href: '/pools', icon: Pickaxe },
    { name: 'Assets', href: '/assets', icon: Wallet },
];

export default function Navigation() {
    const pathName = usePathname();
    return (
        <div
            className={`px-0.5 not-mobile:max-w-[400px] mobile:fixed w-[100%] mobile:bottom-0 mobile:left-0 mobile:bg-[#2A3040] flex justify-center  items-center rounded-t-[12px] overflow-hidden`}
            style={{ height: layoutConstants.navigationHeight, zIndex: layoutConstants.headerZindex }}
        >
            {menu.map((item) => (
                <div key={item.name} className="py-1 px-0.5 h-full w-full">
                    <Link
                        href={item.href}
                        className={cn(
                            'rounded-md flex flex-col items-center justify-center flex-1 desktop:px-4 h-full hover:bg-[#ffffff0a] transition-colors duration-300',
                            pathName.startsWith(item.href) ? 'text-primary bg-[#ffffff0a] shadow-[inset_0px_0px_50px_-40px] font-bold' : 'text-[#ffffff80] hover:text-white'
                        )}
                    >
                        <item.icon className="transition-colors duration-300" size={18} strokeWidth="2px"></item.icon>{' '}
                        <span className="mobile:text-[10px] text-xs mt-1 transition-colors duration-300">{item.name}</span>
                    </Link>
                </div>
            ))}
        </div>
    );
}
