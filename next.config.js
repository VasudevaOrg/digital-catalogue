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
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      // Vercel Blob Storage - Your specific instance
      {
        protocol: "https",
        hostname: "o7ckvepmoupwate7.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      // Common Vercel Blob Storage patterns (add your specific ones as needed)
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Allow optimization for blob storage
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY,
    SMS_API_KEY: process.env.SMS_API_KEY,
  },
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
  },
};

module.exports = nextConfig;
