/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    domains: ["techsocial.s3.ap-south-1.amazonaws.com"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
