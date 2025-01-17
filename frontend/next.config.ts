import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_URL: "http://localhost:3000",
  },
  reactStrictMode: false
};

export default nextConfig;
