import {
  config as defaultConfig,
  getNumberEnv,
  getStringEnv,
} from "@bridge/common";

export const config = {
  ...defaultConfig,
  chatId: getNumberEnv("TELEGRAM_CHAT_ID"),
  token: getStringEnv("TELEGRAM_TOKEN"),
};
