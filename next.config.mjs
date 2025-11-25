/** @type {import('next').NextConfig} */
    const nextConfig = {
      // Disable source maps in production to prevent source code visibility
      productionBrowserSourceMaps: false,

      // Enable SWC minification (default, but explicit for clarity)
      swcMinify: true,

      // Compiler options for optimization
      compiler: {
        // Remove console logs in production
        removeConsole: process.env.NODE_ENV === 'production' ? {
          exclude: ['error', 'warn'],
        } : false,
      },

      // Webpack configuration for additional optimizations
      webpack: (config, { dev, isServer }) => {
        // Only apply these optimizations in production
        if (!dev && !isServer) {
          // Minimize and mangle code
          config.optimization = {
            ...config.optimization,
            minimize: true,
          };
        }
        return config;
      },
    };

    export default nextConfig;