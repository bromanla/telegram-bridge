import { BotService } from "/bot/bot.service.ts";
import { bulkLaunch } from "@bridge/common";
import { StoreService } from "@bridge/store";
import { BotStore } from "/bot/bot.store.ts";

const store = new BotStore();
const bot = new BotService(store);

bulkLaunch(bot);
