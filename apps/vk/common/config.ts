import { config as defaultConfig, getStringEnv } from "@bridge/common";

export const config = {
  ...defaultConfig,
  token: getStringEnv("VK_TOKEN"),
};
