import mongoose from "mongoose";
import config from "../config/config.js";
import { systemLogger } from "../logger/index.js";

const { MONGO_URI } = config;

export async function connectDB() {
    try {
        systemLogger.info(`Connecting to MongoDB...`);

        await mongoose.connect(MONGO_URI, {
            autoIndex: true,
            serverSelectionTimeoutMS: 10000,
        });
        systemLogger.info("MongoDB connected");
    } catch (err) {
        systemLogger.error({
            message: "MongoDB connection failed",
            error: err.message,
        });
        process.exit(1);
    }
}
export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        systemLogger.info("MongoDB disconnected");
    } catch (err) {
        systemLogger.error({
            message: "Error disconnecting MongoDB",
            error: err.message,
        });
    }
}