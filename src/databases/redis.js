import Redis from "ioredis";
import config from "../config/config.js";
import { systemLogger } from "../logger/index.js";

const {
    CACHE_REDIS_HOST,
    CACHE_REDIS_PORT,
    QUEUE_REDIS_HOST,
    QUEUE_REDIS_PORT,
} = config;

function attachListeners(client, name) {
    client.on("connect", () => {
        systemLogger.info(`${name} connected`);
    });

    client.on("ready", () => {
        systemLogger.info(`${name} ready`);
    });

    client.on("error", (err) => {
        systemLogger.error({
            message: `${name} error`,
            error: err.message,
        });
    });

    client.on("close", () => {
        systemLogger.warn(`${name} connection closed`);
    });
}
export async function checkRedisConnection(client, name) {
    try {
        await client.ping();
        systemLogger.info(`${name} connected`);
    } catch (err) {
        systemLogger.error({
            message: `${name} connection failed`,
            error: err.message,
        });
        process.exit(1);
    }
}
// Cache Redis
systemLogger.info(
    `Connecting to Cache Redis: ${CACHE_REDIS_HOST}:${CACHE_REDIS_PORT}`
);

export const redisClient = new Redis({
    host: CACHE_REDIS_HOST,
    port: CACHE_REDIS_PORT,
    connectTimeout: 10000,
    enableAutoPipelining: true,
});

// Queue Redis
systemLogger.info(
    `Connecting to Queue Redis: ${QUEUE_REDIS_HOST}:${QUEUE_REDIS_PORT}`
);

export const queueRedisClient = new Redis({
    host: QUEUE_REDIS_HOST,
    port: QUEUE_REDIS_PORT,
    connectTimeout: 10000,
    enableAutoPipelining: true,
});


attachListeners(redisClient, "Cache Redis");
attachListeners(queueRedisClient, "Queue Redis");