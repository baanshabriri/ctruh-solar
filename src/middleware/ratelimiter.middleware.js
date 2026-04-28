import { redisClient } from "../databases/redis.js";

export function rateLimiter({ window = 60, limit = 10 }) {
    return async (req, res, next) => {
        try {
            const key = `rate:${req.user.userId}:${req.tenantId}`;
            const current = await redisClient.incr(key);
            if (current === 1) {
                await redisClient.expire(key, window);
            }
            if (current > limit) {
                return res.status(429).json({
                    error: "Too many requests",
                });
            }
            next();
        } catch (err) {
            next(); // fail open
        }
    };
}