import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pontocarro.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001'
      },
    ],
  },
};

export default nextConfig;
