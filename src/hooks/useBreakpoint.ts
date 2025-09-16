import { useEffect, useMemo, useState } from 'react';

// Tailwind CSS v4 default breakpoints
// Reference: https://tailwindcss.com/docs/responsive-design
export const DEFAULT_BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

export type TailwindBreakpoint = keyof typeof DEFAULT_BREAKPOINTS | 'base';

function widthToBreakpoint(width: number): TailwindBreakpoint {
    if (width >= DEFAULT_BREAKPOINTS['2xl']) return '2xl';
    if (width >= DEFAULT_BREAKPOINTS.xl) return 'xl';
    if (width >= DEFAULT_BREAKPOINTS.lg) return 'lg';
    if (width >= DEFAULT_BREAKPOINTS.md) return 'md';
    if (width >= DEFAULT_BREAKPOINTS.sm) return 'sm';
    return 'base';
}

/**
 * React hook to subscribe to a CSS media query.
 * SSR-safe: returns false on the server and updates after mount.
 */
export function useMediaQuery(query: string): boolean {
    const getMatch = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
    const [matches, setMatches] = useState<boolean>(getMatch);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia(query);
        const handler = () => setMatches(mql.matches);
        handler();
        mql.addEventListener?.('change', handler);
        return () => mql.removeEventListener?.('change', handler);
    }, [query]);

    return matches;
}

export type UseBreakpointResult = {
    width: number;
    height: number;
    breakpoint: TailwindBreakpoint;
    isMobile: boolean; // < md
    isTablet: boolean; // md..lg-1
    isDesktop: boolean; // >= lg
    up: (bp: Exclude<TailwindBreakpoint, 'base'>) => boolean; // >= bp
    down: (bp: Exclude<TailwindBreakpoint, 'base'>) => boolean; // < bp
    between: (min: Exclude<TailwindBreakpoint, 'base'>, max: Exclude<TailwindBreakpoint, 'base'>) => boolean; // [min, max)
};

/**
 * Runtime breakpoint detector aligned with Tailwind defaults.
 * Useful when you need JavaScript-controlled behavior by screen size.
 */
export function useBreakpoint(): UseBreakpointResult {
    const getSize = () => ({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    const [size, setSize] = useState(getSize);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        let raf = 0;
        const onResize = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => setSize(getSize()));
        };
        window.addEventListener('resize', onResize);
        onResize();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const breakpoint = useMemo(() => widthToBreakpoint(size.width), [size.width]);

    const helpers = useMemo(() => {
        const map = DEFAULT_BREAKPOINTS;
        return {
            up: (bp: Exclude<TailwindBreakpoint, 'base'>) => size.width >= map[bp],
            down: (bp: Exclude<TailwindBreakpoint, 'base'>) => size.width < map[bp],
            between: (min: Exclude<TailwindBreakpoint, 'base'>, max: Exclude<TailwindBreakpoint, 'base'>) => size.width >= map[min] && size.width < map[max],
        };
    }, [size.width]);

    const isMobile = helpers.down('md');
    const isTablet = helpers.between('md', 'lg');
    const isDesktop = helpers.up('lg');

    return { width: size.width, height: size.height, breakpoint, isMobile, isTablet, isDesktop, ...helpers };
}

export default useBreakpoint;
