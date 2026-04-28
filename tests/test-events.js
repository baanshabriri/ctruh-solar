import { queueRedisClient } from "../src/databases/redis.js";

const TOTAL_EVENTS = 200;

function generateEvent(i) {
    // Different categories of events
    if (i % 10 === 0) {
        // Invalid event (missing fields)
        return {
            id: `invalid_${i}`,
            payload: {},
        };
    }

    if (i % 7 === 0) {
        // Force DLQ (max retries reached)
        return {
            id: `dlq_${i}`,
            tenantId: "123",
            retries: 3,
            payload: {
                type: "force_fail",
                message: `DLQ event ${i}`,
            },
        };
    }

    if (i % 5 === 0) {
        // Retry scenario
        return {
            id: `retry_${i}`,
            tenantId: "123",
            retries: 1,
            payload: {
                type: "flaky",
                message: `Retry event ${i}`,
            },
        };
    }

    if (i % 3 === 0) {
        // Slow processing simulation
        return {
            id: `slow_${i}`,
            tenantId: "123",
            retries: 0,
            payload: {
                type: "slow",
                message: `Slow event ${i}`,
            },
        };
    }

    // Normal event
    return {
        id: `event_${i}`,
        tenantId: "123",
        retries: 0,
        payload: {
            type: "normal",
            message: `Normal event ${i}`,
        },
    };
}

async function pushEvents() {
    console.log("Pushing test events...\n");

    for (let i = 1; i <= TOTAL_EVENTS; i++) {
        const event = generateEvent(i);

        await queueRedisClient.lpush(
            "meeting_queue",
            JSON.stringify(event)
        );

        console.log(`Enqueued ${event.id}`);

        // Idempotency test (duplicate event)
        if (i % 15 === 0) {
            await queueRedisClient.lpush(
                "meeting_queue",
                JSON.stringify(event)
            );

            console.log(`Duplicate enqueued ${event.id}`);
        }
    }

    console.log("\n All events pushed");
    process.exit(0);
}

pushEvents();