import path from "node:path";
import { cwd } from "node:process";

import { enableTailwind } from "@remotion/tailwind-v4";

/**
 * @param {import('webpack').Configuration} currentConfig Current Webpack config.
 */
export const webpackOverride = (currentConfig) => {
  const config = enableTailwind(currentConfig);

  config.resolve ??= {};
  config.resolve.alias = {
    ...config.resolve.alias,
    "@": path.resolve(cwd(), "src"),
  };

  return config;
};
