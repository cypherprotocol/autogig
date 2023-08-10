module.exports = {
  images: {
    domains: [],
  },
  experimental: { appDir: true, serverActions: true },
  transpilePackages: ["crawlee"],
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "https://discord.gg/j4BAHXm77",
        permanent: false,
      },
      {
        source: "/ingest/:path*",
        destination: "https://app.posthog.com/:path*",
        permanent: false,
      },
    ];
  },
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
