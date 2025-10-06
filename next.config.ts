import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    eslint: { ignoreDuringBuilds: true },
    images: {
        remotePatterns: [{ hostname: 'firebasestorage.googleapis.com', protocol: 'https' }],
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
