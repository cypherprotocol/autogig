import { withContentlayer } from "next-contentlayer";
import withNextIntl from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "https://discord.gg/j4BAHXm77",
        permanent: false,
      },
    ];
  },
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

export default withContentlayer(withNextIntl()(nextConfig));
