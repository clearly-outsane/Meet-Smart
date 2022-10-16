/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'maps.googleapis.com'],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
