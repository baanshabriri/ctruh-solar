import { httpRequestDuration } from "../metrics/index.js";

export function metricsMiddleware(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestDuration.labels(req.method, req.route?.path || req.url, res.statusCode).observe(duration);
    });

    next();
}