import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Optimize production builds
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Environment variables validation (optional but recommended)
  env: {
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE || 'false',
  },
};

export default nextConfig;
