import { Pickaxe, User, UserRound, Wallet } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { layoutConstants } from './constant';

const menu = [
    { name: 'Acount', href: '#', icon: UserRound },
    { name: 'Pools', href: '#', icon: Pickaxe },
    { name: 'Assets', href: '#', icon: Wallet },
];

export default function Navigation() {
    return (
        <div
            className={`not-mobile:max-w-[400px] mobile:fixed w-[100%] mobile:bottom-0 mobile:left-0 bg-[#2A3040] flex justify-around desktop:gap-6 items-center rounded-[99px] overflow-hidden`}
            style={{ height: layoutConstants.navigationHeight, zIndex: layoutConstants.headerZindex }}
        >
            {menu.map((item) => (
                <Link href={item.href} key={item.name} className="flex flex-col items-center justify-center flex-1 desktop:px-4 h-full hover:bg-[#ffffff0a]">
                    <item.icon size={18} strokeWidth="1.5px"></item.icon> <span className="mobile:text-[10px] text-xs mt-1">{item.name}</span>
                </Link>
            ))}
        </div>
    );
}
