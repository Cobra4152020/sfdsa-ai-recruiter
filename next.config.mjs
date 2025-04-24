let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

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
    // Disable problematic experimental features but enable server actions
    webpackBuildWorker: false,
    serverActions: true,
  },
  excludeDefaultMomentLocales: true,
  
  // Simplified webpack configuration for compatibility with Next.js 13.4.19
  webpack: (config, { isServer }) => {
    // Completely disable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false,
      syncWebAssembly: false,
    };
    
    // Use md4 hash function which is known to work well with Next.js 13.4.19
    config.output = {
      ...config.output,
      hashFunction: 'md4',
    };
    
    // Add node config to avoid symlinks if on server
    if (isServer) {
      config.node = {
        ...config.node,
        __filename: true,
        __dirname: true,
      };
    }
    
    return config;
  },
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig