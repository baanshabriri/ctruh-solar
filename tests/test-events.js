import { queueRedisClient } from "../src/databases/redis.js";

const TOTAL_EVENTS = 5;

async function pushEvents() {
    for (let i = 1; i <= TOTAL_EVENTS; i++) {
        const event = {
            id: `event_${i}`,
            tenantId: "123",
            retries: 0,
            payload: {
                message: `Test event ${i}`,
            },
        };

        await queueRedisClient.lpush(
            "meeting_queue",
            JSON.stringify(event)
        );

        console.log(`📨 Enqueued event_${i}`);
    }

    process.exit(0);
}

pushEvents();