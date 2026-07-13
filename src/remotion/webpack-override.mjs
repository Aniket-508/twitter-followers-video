import { enableTailwind } from "@remotion/tailwind-v4";
import { resolve } from "node:path";
import { cwd } from "node:process";

/**
 *  @param {import('webpack').Configuration} currentConfig
 */
export const webpackOverride = (currentConfig) => {
  const config = enableTailwind(currentConfig);

  config.resolve ??= {};
  config.resolve.alias = {
    ...(config.resolve.alias ?? {}),
    "@": resolve(cwd(), "src"),
  };

  return config;
};
