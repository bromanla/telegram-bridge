import * as z from "zod";
import * as log from "@std/log";
import { isDevelopment } from "./config.ts";
import type { LevelName, LogRecord } from "@std/log";

/** Scheme for checking the logging level */
const logLevelSchema = z.enum(
  log.LogLevelNames as unknown as [LevelName, ...LevelName[]],
);

/** Get the logging level from an environment variable */
const logLevelResult = logLevelSchema.safeParse(Deno.env.get("LOGGER_LEVEL"));

/** If the result is successful, use the level from the variable, otherwise "DEBUG" */
const level = logLevelResult.success ? logLevelResult.data : "DEBUG";

/** Setting up the logger */
log.setup({
  handlers: {
    console: new log.ConsoleHandler(level, {
      formatter: isDevelopment
        ? customJsonFormatter
        : log.formatters.jsonFormatter,
      useColors: isDevelopment,
    }),
  },
  loggers: {
    default: {
      level,
      handlers: ["console"],
    },
  },
});

/** Custom JSON formatter for logs (pretty) */
function customJsonFormatter(logRecord: LogRecord): string {
  return JSON.stringify(
    {
      level: logRecord.levelName,
      datetime: logRecord.datetime.getTime(),
      message: logRecord.msg,
      args: flattenArgs(logRecord.args),
    },
    null,
    2,
  );
}

/**
 * Function for processing additional log arguments
 * copy of @std/log/formatters.ts (no export)
 */
function flattenArgs(args: unknown[]): unknown {
  if (args.length === 1) {
    return args[0];
  } else if (args.length > 1) {
    return args;
  }
}

export { log as logger };
