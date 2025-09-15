import * as React from 'react';

export interface LoadingAnimation1Props extends React.SVGProps<SVGSVGElement> {
    /** Override color (any valid CSS color). Falls back to currentColor + Tailwind text-primary if not provided. */
    color?: string;
    /** Size for width/height. Accepts number (px) or any CSS length string. Default 80. */
    size?: number | string;
}

const STOPS = 8; // number of bars
const DURATION = 1; // seconds

export const LoadingAnimation1 = React.forwardRef<SVGSVGElement, LoadingAnimation1Props>(({ color, size = 80, className = '', style, ...rest }, ref) => {
    const dimension = typeof size === 'number' ? `${size}` : size;
    // Use provided color or inherit currentColor. Tailwind text-primary sets currentColor.
    const finalStyle: React.CSSProperties = {
        color: color || undefined,
        ...style,
    };

    return (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            role="img"
            aria-label="Loading"
            width={dimension}
            height={dimension}
            className={`text-primary ${className}`.trim()}
            preserveAspectRatio="xMidYMid"
            style={finalStyle}
            {...rest}
        >
            <g>
                {Array.from({ length: STOPS }).map((_, i) => {
                    const angle = (360 / STOPS) * i;
                    const begin = -((STOPS - i) / STOPS) * DURATION; // staggered negative delays
                    return (
                        <g key={i} transform={`rotate(${angle} 50 50)`}>
                            <rect fill="currentColor" x={46} y={3} width={8} height={24} rx={4} ry={12}>
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur={`${DURATION}s`} begin={`${begin}s`} repeatCount="indefinite" />
                            </rect>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
});

LoadingAnimation1.displayName = 'LoadingAnimation1';

export default LoadingAnimation1;
