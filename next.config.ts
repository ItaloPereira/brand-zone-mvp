import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
    serverComponentsExternalPackages: ['@prisma/client', 'openai'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  functions: {
    maxDuration: 90
  }
};

export default nextConfig;
