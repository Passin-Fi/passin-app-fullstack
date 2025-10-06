import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    eslint: { ignoreDuringBuilds: true },
    images: {
        remotePatterns: [{ hostname: 'crypto-images-4545f.web.app', protocol: 'https' }],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/pools',
                permanent: false, // save cached redirect
            },
        ];
    },
};

export default nextConfig;
