import { systemLogger } from "../logger/index.js";

async function sendNotification(event) {
    if (Math.random() < 0.3) {
        throw new Error("Webhook failed");
    }
    systemLogger.info({
        message: "Notification sent",
        eventId: event.id,
    });
}

export async function processNotification(event) {
    if (!event.id || !event.tenantId) {
        throw new Error("Invalid event");
    }
    await sendNotification(event);
}