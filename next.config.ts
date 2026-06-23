import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /assessments → /admin/assessments (correct admin dashboard URL)
      {
        source: "/assessments",
        destination: "/admin/assessments",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
