import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/home',   // The page you want to redirect
        destination: '/',   // Redirects to the home page
        permanent: true,     // This is a permanent redirect (use false for temporary)
      },
    ];
  },
};

export default nextConfig;
