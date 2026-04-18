/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output export for static hosting (cPanel/Hostinger/etc)
  output: 'export',
  trailingSlash: true,

  // Disable React strict mode to avoid double-rendering GSAP animations
  reactStrictMode: false,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lumecontrolesolar.com.br',
      },
    ],
    unoptimized: true,
  },

  // Webpack and Turbopack customization
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
  
  // turbopack: {} // Setting empty turbopack config to silence the error if we want to force webpack
  // However, Next 16 might require setting 'experimental' or just using the CLI flag.
  // I will try to use the flag in the build command or just let it be.
};

export default nextConfig;
