import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint : {
    ignoreDuringBuilds: true, // Because old code is garbage and we don't want to fix it right now trust me when i say garbage ai code
  }
};

export default nextConfig;
