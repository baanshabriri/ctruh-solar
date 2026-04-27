import { Server as SocketIOServer } from "socket.io";
import getHttpServer from "./app.js";
import { connectDB, disconnectDB } from "./databases/mongo.js";
import { redisClient, queueRedisClient, checkRedisConnection } from "./databases/redis.js";
import { initSocket } from "./sockets/consultant.socket.js";
import { startConsumer } from "./queues/consumer.js";
import { systemLogger, consumerLogger } from "./logger/index.js";

const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        const { app, httpServer } = getHttpServer();
        await connectDB();
        await checkRedisConnection(redisClient, "Cache Redis");
        await checkRedisConnection(queueRedisClient, "Queue Redis");
        const io = new SocketIOServer(httpServer, {
            cors: {
                origin: "*",
            },
        });
        initSocket(io, redisClient, { systemLogger });
        startConsumer({ logger: consumerLogger }).catch((err) => {
            systemLogger.error({
                message: "Queue consumer crashed",
                error: err.message,
            });
            process.exit(1);
        });

        systemLogger.info("Queue consumer started");
        httpServer.listen(PORT, () => {
            systemLogger.info(`Server running on port ${PORT}`);
        });

        // Graceful shutdown
        const shutdown = async (signal) => {
            systemLogger.info(`Received ${signal}. Shutting down...`);
            try {
                await disconnectDB();
                await redisClient.quit();
                systemLogger.info("Cache Redis disconnected");

                await queueRedisClient.quit();
                systemLogger.info("Queue Redis disconnected");

                httpServer.close(() => {
                    systemLogger.info("HTTP server closed");
                    process.exit(0);
                });
                io.close(() => {
                    systemLogger.info("Socket.io server closed");
                });
            } catch (err) {
                systemLogger.error({
                    message: "Error during shutdown",
                    error: err.message,
                });
                process.exit(1);
            }
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

    } catch (err) {
        systemLogger.error({
            message: "Failed to start server",
            error: err.message,
        });
        process.exit(1);
    }
}

startServer();