import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // hostname for images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/image-raw/**",
      },
    ],
  },
};

export default nextConfig;
