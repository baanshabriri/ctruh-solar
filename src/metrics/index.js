import client from "prom-client";

client.collectDefaultMetrics();

export const register = client.register;

export const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "API request latency",
    labelNames: ["method", "route", "status"],
    buckets: [0.05, 0.1, 0.2, 0.5, 1, 2],
});

export const cacheHits = new client.Counter({
    name: "cache_hits_total",
    help: "Total cache hits",
});

export const cacheMisses = new client.Counter({
    name: "cache_misses_total",
    help: "Total cache misses",
});

export const activeConnections = new client.Gauge({
    name: "active_socket_connections",
    help: "Active socket.io connections",
});

export const consultantLocationUpdates = new client.Gauge({
    name: "consultant_location_updates",
    help: "Total consultant location updates",
});