module.exports = {
  images: {
    domains: ["wellfound.com", "i.imgur.com"],
  },
  experimental: { appDir: true },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      module: false,
    };
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });
    return config;
  },
};
