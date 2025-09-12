import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { Button } from 'shadcn/button';
import { layoutConstants } from 'src/components/layout/constant';

export default function PoolButtons() {
    const params = useParams<{ id: string }>();

    return (
        <div>
            <div className={`pointer-events-none fixed bottom-0 left-0 w-full h-50 bg-[linear-gradient(180deg,rgba(5,13,24,0)_0%,#050D18_46.59%)]`}></div>
            <div style={{ bottom: layoutConstants.navigationHeight }} className={'fixed' + ` left-0 w-full py-2.5 z-200 `}>
                <div className="container !max-w-[400px]">
                    <div className="flex gap-2">
                        <Button variant={'outline'} className="flex-1">
                            Redeem
                        </Button>
                        <Button className="flex-1">
                            <Link className="w-full" href={`/pools/${params.id}/subcribe`}>
                                Subcribe
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
