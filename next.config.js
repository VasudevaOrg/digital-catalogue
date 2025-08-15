/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "your-domain.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY,
    SMS_API_KEY: process.env.SMS_API_KEY,
  },
};

module.exports = nextConfig;
