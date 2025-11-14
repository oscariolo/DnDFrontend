import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  turbopack: {}, 
};

export default withPWA(nextConfig);
