import { BusService } from "@bridge/bus";
import { BUS_OPTIONS, CONSUMERS } from "@bridge/contract";

import type { BusData } from "@bridge/contract";

const bus = new BusService<BusData>(BUS_OPTIONS);

await bus.launch();

bus.consume("messages", CONSUMERS.TELEGRAM, (message, data) => {
  console.log(data);
});

bus.publish("messages.telegram", { isChat: true });
bus.publish("messages.telegram", { isChat: false });

export * from "./service/telegram.type.ts";
