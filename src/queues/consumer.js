import { queueRedisClient } from "../databases/redis.js";
import { processNotification } from "../services/event.service.js";
import { getBackoffDelay } from "../utils/backoff.js";

async function retryWithBackoff(event, systemLogger, queueRedisClient) {
    const retries = event.retries || 0;
    if (retries < 3) {
        event.retries = retries + 1;
        const delay = getBackoffDelay(retries);

        systemLogger.warn({
            message: "Retrying event with backoff",
            eventId: event.id,
            retries: event.retries,
            delay,
        });

        setTimeout(async () => {
            try {
                await queueRedisClient.lpush(
                    "meeting_queue",
                    JSON.stringify(event)
                );
            } catch (err) {
                systemLogger.error({
                    message: "Failed to requeue event",
                    error: err.message,
                });
            }
        }, delay);

    } else {
        systemLogger.warn({
            message: "Pushing event to DLQ after max retries",
            eventId: event.id,
            retries: event.retries,
            delay,
        });
        await queueRedisClient.lpush(
            "meeting_dlq",
            JSON.stringify(event)
        );
    }
}

export async function startConsumer({ logger }) {
    logger.info("Queue consumer started");

    while (true) {
        try {
            // Blocking pop (waits for messages)
            const [, data] = await queueRedisClient.brpop(
                "meeting_queue",
                0
            );
            const event = JSON.parse(data);
            logger.info({
                message: "Processing event",
                eventId: event.id,
            });
            const idempotencyKey = `event:${event.id}`;
            const exists = await queueRedisClient.get(idempotencyKey);
            if (exists) {
                logger.info({
                    message: "Event already processed, skipping",
                    eventId: event.id,
                });
                continue;
            }

            try {
                await processNotification(event);
                await queueRedisClient.set(idempotencyKey, "processed", "EX", 60 * 60);
                logger.info({
                    message: "Event processed successfully",
                    eventId: event.id,
                });
            } catch (err) {
                await retryWithBackoff(event, logger, queueRedisClient);
            }

        } catch (err) {
            logger.error({
                message: "Consumer loop error",
                error: err.message,
            });
            await new Promise((res) => setTimeout(res, 1000));
        }
    }
}