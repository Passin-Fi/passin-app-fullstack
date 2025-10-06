import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

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

// Use layout effect on the client to update before paint; fall back to effect on SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
    // Do not read window during initial render to avoid SSR/client mismatch
    const [matches, setMatches] = useState<boolean>(false);

    useIsomorphicLayoutEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia(query);

        const handler = () => setMatches(mql.matches);
        // Initialize immediately (before paint on client)
        handler();

        // Support both modern and legacy APIs
        if (mql.addEventListener) mql.addEventListener('change', handler);
        else (mql as any).addListener?.(handler);

        return () => {
            if (mql.removeEventListener) mql.removeEventListener('change', handler);
            else (mql as any).removeListener?.(handler);
        };
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
    // Initialize with 0 for SSR and first client render to ensure hydration matches
    const [size, setSize] = useState({ width: 0, height: 0 });

    useIsomorphicLayoutEffect(() => {
        if (typeof window === 'undefined') return;
        let raf = 0;

        const read = () => ({ width: window.innerWidth, height: window.innerHeight });
        const onResize = () => {
            cancelAnimationFrame(raf);
            raf = window.requestAnimationFrame(() => setSize(read()));
        };

        // Set before first paint to minimize FOUC
        setSize(read());
        window.addEventListener('resize', onResize);

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

    // Keep semantics aligned with comments: mobile < md, tablet [md, lg), desktop >= lg
    const isMobile = helpers.down('md');
    const isTablet = helpers.between('md', 'lg');
    const isDesktop = helpers.up('lg');

    return { width: size.width, height: size.height, breakpoint, isMobile, isTablet, isDesktop, ...helpers };
}

export default useBreakpoint;
