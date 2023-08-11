module.exports = {
  images: {
    domains: [],
  },
  experimental: { appDir: true, serverActions: true },
  transpilePackages: ["crawlee"],
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     fs: false,
  //     net: false,
  //     tls: false,
  //     module: false,
  //   };
  //   config.module.rules.push({
  //     test: /\.node/,
  //     use: "raw-loader",
  //   });
  //   return config;
  // },
};
