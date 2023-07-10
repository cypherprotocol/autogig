module.exports = {
  experimental: { appDir: true },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      module: false,
    };
    return config;
  },
};
