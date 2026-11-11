import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.digitrustsolutions.com",
          },
        ],
        destination: "https://digitrustsolutions.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.digitrustsolutions.in",
          },
        ],
        destination: "https://digitrustsolutions.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "digitrustsolutions.in",
          },
        ],
        destination: "https://digitrustsolutions.com/:path*",
        permanent: true,
      },
      {
        source: "/results",
        destination: "/proof",
        permanent: true,
      },
      {
        source: "/case-studies",
        destination: "/proof",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
