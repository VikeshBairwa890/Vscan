import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  serverExternalPackages: [
    "@langchain/core",
    "@langchain/openai",
    "@langchain/langgraph",
  ],
};

export default nextConfig;
