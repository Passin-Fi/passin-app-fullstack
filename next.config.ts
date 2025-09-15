import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    eslint: { ignoreDuringBuilds: true },
    images: {
        remotePatterns: [{ hostname: 'firebasestorage.googleapis.com', protocol: 'https' }],
    },
};

export default nextConfig;
