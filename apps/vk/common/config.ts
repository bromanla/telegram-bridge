import { config as defaultConfig, requiredEnv } from "@bridge/common";

const token = requiredEnv("VK_TOKEN");

export const config = {
  ...defaultConfig,
  token,
};
