'use client';
import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import { WalletName } from 'crypto-icons/types';
import React from 'react';
import { MoonStarIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'shadcn/accordion';
import { Button } from 'shadcn/button';
import { IconDiscord } from 'src/components/icons/IconDiscord';
import { IconX } from 'src/components/icons/IconX';
import { IconTelegram } from 'src/components/icons/IconTelegram';
import { useTheme } from 'next-themes';
import { Sun } from 'lucide-react';

export default function Account() {
    const { setTheme, theme } = useTheme();

    return (
        <div>
            <div className="flex place-items-center justify-between">
                <div className="flex place-items-center gap-2">
                    <CryptoIcon name={WalletName.LazorKit} className="rounded-full" size={40} />
                    <div>
                        <p className="text-sm leading-4.5">{WalletName.LazorKit}</p>
                        <p className="text-sm leading-4.5 font-bold">Qwdaf8jffoad89m8sAstar4</p>
                    </div>
                </div>
                <div className="cursor-pointer">
                    {theme == 'light' ? (
                        <MoonStarIcon size={18} fill="#C7FE62" stroke="#C7FE62" onClick={() => setTheme('dark')} />
                    ) : (
                        <Sun size={18} fill="#C7FE62" stroke="#C7FE62" onClick={() => setTheme('light')} />
                    )}
                </div>
            </div>
            <div className="mt-6">
                <h4 className="font-bold">Other</h4>
                <Accordion type="single" collapsible className="mt-2.5">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>About Us</AccordionTrigger>
                        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div className="mt-4 text-center">
                <p className="font-bold lead">Join Our Community</p>
                <div className="flex justify-center mt-2.5 gap-2">
                    <IconDiscord style={{ width: '30px', height: '30px' }} />
                    <IconX style={{ width: '30px', height: '30px' }} />
                    <IconTelegram style={{ width: '30px', height: '30px' }} />
                </div>
                <Button variant={'outline'} className="w-[130px] text-center mt-4">
                    Log out
                </Button>
            </div>
        </div>
    );
}
