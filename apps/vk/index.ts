import { BotService } from "#src/bot/bot.service.ts";
import { BotStore } from "#src/bot/bot.store.ts";
import { BusService } from "@bridge/bus";
import { bulkLaunch } from "@bridge/common";

const store = new BotStore();
const bot = new BotService(store);
const bus = new BusService();

bulkLaunch(bot);

await bus.launch({ purge: true });
