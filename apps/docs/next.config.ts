import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  // Set DOCS_BASE_PATH (for example "/projects/holo-card-tilt") to serve the site from a sub-path.
  basePath: process.env.DOCS_BASE_PATH || undefined,
  reactCompiler: true,
};

export default nextConfig;
