import million from "million/compiler";
import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
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
