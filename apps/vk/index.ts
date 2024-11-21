import { BotService } from "#src/bot/bot.service.ts";
import { BotStore } from "#src/bot/bot.store.ts";
import { bulkLaunch } from "@bridge/common";

const store = new BotStore();
const bot = new BotService(store);

bulkLaunch(bot);

// bus.consume("messages", CONSUMERS.TELEGRAM, (message, data) => {
//   console.log(data);
// });

// bus.publish("messages.telegram", { isChat: true });

// const bus = new BusService();
// const store = new BotStore();
// const bot = new BotService(bus, store);

// bulkLaunch(bus, bot);

// bus.consume("messages", CONSUMERS.TELEGRAM, (message, data) => {
//   console.log(data);
// });

// bus.publish("messages.telegram", { isChat: true });
