import { NextFederationPlugin } from "@module-federation/nextjs-mf";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "pedido",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./Pedidos": "./src/components/Pedidos",
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
          "react-dom": {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
        },
      })
    );

    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
