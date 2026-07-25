import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/learning", destination: "/app/learning", permanent: true },
      { source: "/learning/:slug", destination: "/app/learning/:slug", permanent: true },
      { source: "/schedule", destination: "/app/schedule", permanent: true },
      { source: "/library", destination: "/app/library", permanent: true },
      { source: "/documents", destination: "/app/documents", permanent: true },
      { source: "/profile", destination: "/app/profile", permanent: true },
    ];
  },
};

export default nextConfig;
