import million from "million/compiler";
const { withContentlayer } = require("next-contentlayer");

const nextConfig = {
  images: {
    domains: [],
  },
  experimental: { appDir: true, serverActions: true },
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

export default million.next(withContentlayer(nextConfig), {
  auto: {
    rsc: true,
  },
});
