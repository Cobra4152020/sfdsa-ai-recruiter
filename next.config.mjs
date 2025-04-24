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
    // Disable all experimental features
    webpackBuildWorker: false,
    parallelServerBuildTraces: false,
    parallelServerCompiles: false,
  },
  excludeDefaultMomentLocales: true,
  
  // More aggressive webpack configuration to fix the WebAssembly issue
  webpack: (config, { isServer }) => {
    // Completely disable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false,
      syncWebAssembly: false,
    };
    
    // Explicitly set hash function to non-WebAssembly implementation
    config.output = {
      ...config.output,
      hashFunction: 'xxhash64'  // Try an alternative hash function
    };
    
    // Disable any potential WebAssembly modules
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.wasm$/,
          type: 'javascript/auto',
        }
      ]
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
  // Removed the 'standalone' output option to avoid symlink errors
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