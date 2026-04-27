import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        port: "",
        pathname: "/payload/api/media/file/**",
      },
    ],
  },
};

export default nextConfig;
