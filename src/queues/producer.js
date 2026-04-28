import { queueRedisClient } from "../databases/redis.js";

export async function enqueueMeetingEvent(event) {
    await queueRedisClient.lpush(
        "meeting_queue",
        JSON.stringify(event)
    );
}