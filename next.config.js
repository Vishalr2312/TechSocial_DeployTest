/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "export",
  images: {
    domains: ["techsocial.s3.ap-south-1.amazonaws.com"],
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    config.resolve.alias["re2"] = false;
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["metascraper", "cheerio", "undici"],
  },
};

module.exports = nextConfig;
