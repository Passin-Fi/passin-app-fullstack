import React from 'react';
import CardCustom from 'src/components/card-custom/CardCustom';
import LineData from 'src/components/line-data/LineData';
import { formatNumber } from 'src/utils/format';

export default function CardInfomation() {
    return (
        <div className="mt-2">
            <CardCustom>
                <h6 className="font-bold">Infomation</h6>
                <div>
                    <LineData title="Market Capitalization" value={formatNumber(2.43) + ' %'} mt={4} />
                    <LineData title="Circulating Supply" value={formatNumber(5.502) + ' KMNO'} mt={4} />
                    <LineData title="Maximum Supply" value={formatNumber(10000000) + ' KMNO'} mt={4} />
                    <LineData title="Total Supply" value={formatNumber(9347527832) + ' KMNO'} mt={4} />
                    <LineData title="Platform Density" value={formatNumber(2.65)} mt={4} />
                    <LineData
                        title="Highest in history"
                        value={
                            <div>
                                <p className="lead font-bold">${formatNumber(0.2477869929861312)}</p>
                                <p className="text-muted-foreground leading-3 text-[10px]">2025-12-15</p>
                            </div>
                        }
                        mt={4}
                    />
                    <LineData
                        title="Lowest in history"
                        value={
                            <div>
                                <p className="lead font-bold">${formatNumber(0.3457826)}</p>
                                <p className="text-muted-foreground leading-3 text-[10px]">2025-12-15</p>
                            </div>
                        }
                        mt={4}
                    />
                </div>
                <p className="text-muted-foreground mobile:leading-3 mobile:text-[10px] mt-4 note">
                    *The underlying data source is taken from ... and provided by ... for reference only. This information is presented on an “as is” basis and is not a representation or warranty of
                    any kind by Ezsol.
                </p>
            </CardCustom>
        </div>
    );
}
