/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["crew3-production.s3.eu-west-3.amazonaws.com", "img.freepik.com"],
  },
  
};

module.exports = nextConfig;
