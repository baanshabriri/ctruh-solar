import { consumerLogger } from "../logger/index.js";
import { PermanentError, TransientError } from "../utils/queueErrors.js"


async function sendNotification(event) {
    if (Math.random() < 0.3) {
        throw new TransientError("Webhook failed");
    }
    consumerLogger.info({
        message: "Notification sent",
        eventId: event.id,
        tenantId: event.tenantId,
    });
}

export async function processEvent(event) {
    const start = Date.now();
    try {
        if (!event?.id || !event?.tenantId) {
            throw new PermanentError("Invalid event");
        }
        const type = event.payload?.type || "normal";
        if (type === "slow") {
            await new Promise((res) => setTimeout(res, 1000));
        }

        // Forced permanent failure → DLQ
        if (type === "force_fail") {
            throw new PermanentError("Forced failure");
        }

        // transient failure
        if (type === "flaky" && Math.random() < 0.5) {
            throw new TransientError("Flaky failure");
        }

        // Actual processing
        await sendNotification(event);

        consumerLogger.info({
            message: "Event processed",
            eventId: event.id,
            type,
            latencyMs: Date.now() - start,
        });

    } catch (err) {
        consumerLogger.error({
            message: "Event processing failed",
            eventId: event.id,
            error: err.message,
            errorType: err.name,
            latencyMs: Date.now() - start,
        });

        throw err;
    }
}