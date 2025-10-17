// Load environment variables with custom priority (.env first, then .env.local)
require('./load-env');

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
