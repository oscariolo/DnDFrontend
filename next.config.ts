import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev',process.env.NEXT_PUBLIC_BACKEND_URL|| 'http://localhost'],
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

export default nextConfig;
