import { DAY, HOUR, MINUTE, SECOND } from "@std/datetime";

export function getUptime(startTime: number) {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;

  const days = Math.floor(elapsedTime / DAY);
  const hours = Math.floor((elapsedTime % DAY) / HOUR);
  const minutes = Math.floor((elapsedTime % HOUR) / MINUTE);
  const seconds = Math.floor((elapsedTime % MINUTE) / SECOND);

  return { days, hours, minutes, seconds };
}
