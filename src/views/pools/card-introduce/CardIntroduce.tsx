import React from 'react';
import CardCustom from 'src/components/card-custom/CardCustom';

export default function CardIntroduce() {
    return (
        <CardCustom className="mt-2">
            <h6 className="font-bold">Introduce</h6>
            <p className="text-muted-foreground mobile:leading-3 mobile:text-[10px] note mt-3">
                Kamino offers a suite of products that combine multiple Dei platforms to create sophisticated strategies - each wrapped in an accessible, user-centric interface.
            </p>
        </CardCustom>
    );
}
