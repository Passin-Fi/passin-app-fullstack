import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    eslint: { ignoreDuringBuilds: true },
    images: {
        remotePatterns: [{ hostname: 'firebasestorage.googleapis.com', protocol: 'https' }],
    },
};

export default nextConfig;
