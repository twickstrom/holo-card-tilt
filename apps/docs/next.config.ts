import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  // Set DOCS_BASE_PATH (for example "/projects/holo-card-tilt") to serve the site from a sub-path.
  basePath: process.env.DOCS_BASE_PATH || undefined,
  // Set DOCS_EXPORT=1 to emit a static site into `out/` for hosts with no Node.js server.
  output: process.env.DOCS_EXPORT ? "export" : undefined,
  reactCompiler: true,
};

export default nextConfig;
