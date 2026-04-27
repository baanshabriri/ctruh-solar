import pino from "pino";
import config from "../config/config.js";

const pinoLogger = pino({
    level: config.LOG_LEVEL || "info",
});
export const systemLogger = pinoLogger.child({ context: "system" });
export const consumerLogger = pinoLogger.child({ context: "consumer" });
export const requestLogger = pinoLogger.child({ context: "request" });
export default pinoLogger;