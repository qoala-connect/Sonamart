import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // cache optimised images for 24 h
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Required for @xenova/transformers (ONNX runtime) in Next.js API routes
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
    };
    return config;
  },
  // Add Turbopack configuration to handle aliases needed by @xenova/transformers.
  // This resolves the build error on Vercel where Turbopack is the default builder.
  turbopack: {
    resolveAlias: {
      sharp: "next/dist/build/swc/empty",
      "onnxruntime-node": "next/dist/build/swc/empty",
    },
  },
  serverExternalPackages: ["@xenova/transformers", "onnxruntime-web"],
};

export default nextConfig;
