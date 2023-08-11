module.exports = {
  images: {
    domains: [],
  },
  experimental: { appDir: true, serverActions: true },
  transpilePackages: ["crawlee"],
  async headers() {
    return [
      {
        // matching all API routes
        source: "/ingest/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
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
        permanent: true,
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
