// import { BusService } from "@bridge/contract";
import { BotService } from "/bot/bot.service.ts";
import { bulkLaunch } from "@bridge/common";
import { StoreService } from "@bridge/store";
import { BotStore } from "/bot/bot.store.ts";

// const bus = new BusService();
const store = new BotStore();
const bot = new BotService(bus, store);

bulkLaunch(bus, bot);

// bus.consume("messages", CONSUMERS.TELEGRAM, (message, data) => {
//   console.log(data);
// });

// bus.publish("messages.telegram", { isChat: true });
