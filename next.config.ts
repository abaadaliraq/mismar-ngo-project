import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/dyqdfbaln/image/upload/**" }] },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
