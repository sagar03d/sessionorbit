import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "frame-src 'self' https://player.vimeo.com;",
        },
      ],
    },
  ],
};

export default nextConfig;
