/** @type {import('next').NextConfig} */
    const nextConfig = {
      // Disable source maps in production to prevent source code visibility
      productionBrowserSourceMaps: false,

      // Compiler options for optimization
      compiler: {
        // Remove console logs in production
        removeConsole: process.env.NODE_ENV === 'production' ? {
          exclude: ['error', 'warn'],
        } : false,
      },
    };

    export default nextConfig;