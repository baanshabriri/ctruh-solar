import client from "prom-client";

export const eventsProcessed = new client.Counter({
    name: "events_processed_total",
    help: "Total events processed successfully",
});

export const eventsFailed = new client.Counter({
    name: "events_failed_total",
    help: "Total events failed",
});

export const eventsRetried = new client.Counter({
    name: "events_retried_total",
    help: "Total events retried",
});

export const eventsDLQ = new client.Counter({
    name: "events_dlq_total",
    help: "Total events moved to DLQ",
});

export const eventProcessingTime = new client.Histogram({
    name: "event_processing_duration_seconds",
    help: "Time taken to process events",
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
});

export const queueSize = new client.Gauge({
    name: "queue_size",
    help: "Current queue size",
});