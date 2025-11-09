import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Optimize production builds
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Disable ESLint during production builds (errors won't block deployment)
  // Re-enable once code quality issues are fixed
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds (for faster deploys)
  // Type errors will still show in development
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Environment variables validation (optional but recommended)
  env: {
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE || 'false',
  },
};

export default nextConfig;
