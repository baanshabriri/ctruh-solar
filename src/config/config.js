import dotenv from "dotenv";
import path from "path";

dotenv.config();

const config = {
    STAGE: process.env.STAGE || "local",
    IS_LOCAL: (process.env.STAGE || "local") === "local",

    DEFAULT_APP_ID: process.env.DEFAULT_APP_ID || "SHOP",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",

    REST_SERVER_PORT: process.env.REST_SERVER_PORT
        ? Number(process.env.REST_SERVER_PORT)
        : 81,

    CACHE_REDIS_HOST: process.env.CACHE_REDIS_HOST,
    CACHE_REDIS_PORT: process.env.CACHE_REDIS_PORT
        ? Number(process.env.CACHE_REDIS_PORT)
        : undefined,

    QUEUE_REDIS_HOST: process.env.QUEUE_REDIS_HOST,
    QUEUE_REDIS_PORT: process.env.QUEUE_REDIS_PORT
        ? Number(process.env.QUEUE_REDIS_PORT)
        : undefined,
    MONGO_URI: process.env.MONGO_URI,
    GEO_HOSTS_CACHE_KEY_PREFIX: process.env.GEO_HOSTS_CACHE_KEY_PREFIX || "geo:hosts",
    GEO_CONSULTANTS_CACHE_KEY_PREFIX: process.env.GEO_CONSULTANTS_CACHE_KEY_PREFIX || "geo:consultants",
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret'
};

export default config;