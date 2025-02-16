import { BotService } from "#src/bot/bot.service.ts";
import { BotStore } from "#src/bot/bot.store.ts";
import { BusService } from "@bridge/bus";

const store = new BotStore();
const bus = new BusService();
const bot = new BotService(store, bus);

await bus.launch();
await bot.launch();
