import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? (process.env.BASE_PATH || '/trabka-projekt') : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
