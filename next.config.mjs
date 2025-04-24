/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Only include valid experimental features for Next.js 13.4.19
    webpackBuildWorker: false,
    serverActions: true,
  },
  excludeDefaultMomentLocales: true,
  
  // Handle the font loading issue
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://fonts.googleapis.com' : '',
  
  // Simplified webpack config
  webpack: (config) => {
    // Use a reliable hash function
    config.output = {
      ...config.output,
      hashFunction: 'md4',
    };
    
    return config;
  },
}

export default nextConfig