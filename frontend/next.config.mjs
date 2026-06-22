/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
reactStrictMode: false, // 開発時の2回レンダリングを無効化して負荷軽減
    experimental: {
        workerThreads: false,
    },
};

export default nextConfig;
