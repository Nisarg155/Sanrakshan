import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  // typescript: {
  //   // !! WARN !!
  //   // This is a temporary solution
  //   // ignoreBuildErrors: true,
  // },
};

export default nextConfig;
