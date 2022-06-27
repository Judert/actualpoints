/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
    minimumCacheTTL: 43200,
  },
};

module.exports = nextConfig;
