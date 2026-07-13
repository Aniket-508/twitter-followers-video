import { BUILD_DIR } from "./build-dir.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/render": [`./${BUILD_DIR}/**/*`],
  },
  reactStrictMode: true,
  serverExternalPackages: [
    "@remotion/vercel",
    "@vercel/blob",
    "@vercel/functions",
    "@vercel/sandbox",
  ],
};

export default nextConfig;
