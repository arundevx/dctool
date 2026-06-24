import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
