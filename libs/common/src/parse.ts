import { Buffer } from "node:buffer";
import type { Readable } from "node:stream";

function safeParse<T>(data: Buffer | string): T | undefined;
function safeParse<T>(data: Readable): Promise<T | undefined>;
function safeParse<T>(data: Buffer | string | Readable) {
  if (Buffer.isBuffer(data)) {
    data = data.toString();
  }

  if (typeof data === "string") {
    try {
      return JSON.parse(data) as T;
    } catch {
      return undefined;
    }
  }

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];

    data.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    data.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks);
        const body = JSON.parse(buffer.toString()) as T;

        resolve(body);
      } catch {
        resolve(undefined);
      }
    });

    data.on("error", () => {
      resolve(undefined);
    });
  });
}

export { safeParse };
