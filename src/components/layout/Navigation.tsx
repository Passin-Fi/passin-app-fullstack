import { Pickaxe, User, UserRound, Wallet } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { layoutConstants } from './constant';

const menu = [
    { name: 'Acount', href: '/account', icon: UserRound },
    { name: 'Pools', href: '/pools', icon: Pickaxe },
    { name: 'Assets', href: '/assets', icon: Wallet },
];

export default function Navigation() {
    return (
        <div className="relative">
            <div className={`pointer-events-none fixed bottom-0 left-0 w-full h-34 bg-[linear-gradient(180deg,rgba(5,13,24,0)_0%,#050D18_46.59%)]`}></div>
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
        </div>
    );
}
