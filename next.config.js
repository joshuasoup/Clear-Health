/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.clerk.com"],
  },
  serverExternalPackages: ["pdf-parse"],
};

module.exports = nextConfig;
