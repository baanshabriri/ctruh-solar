import config from "../config/config.js";
import { systemLogger } from "../logger/index.js";
import { redisClient } from "../databases/redis.js";
const GEO_CONSULTANTS_CACHE_KEY_PREFIX = config.GEO_CONSULTANTS_CACHE_KEY_PREFIX || "geo:consultants";

export async function updateConsultantLocation({ tenantId, consultantId, lat, lng }) {
    try {
        if (!consultantId || lat == null || lng == null) {
            systemLogger.warn({
                message: `Invalid location_update data, JOIN skipped. Data: ${JSON.stringify(data)}`,
                data,
            });
            return;
        }
        const key = `consultant:${tenantId}:${consultantId}:location`;
        await redisClient.set(
            key,
            JSON.stringify({ lat, lng }),
            "EX",
            300
        );
        // add to GEO set for fast radius queries
        const geoKey = `${GEO_CONSULTANTS_CACHE_KEY_PREFIX}:${tenantId}`;
        await redisClient.geoadd(
            geoKey,
            lng,
            lat,
            consultantId.toString()
        );
        // Occasionally update last known location in DB (10% of updates) via pushing an event to queue for async processing to avoid DB write bottleneck    
        // if (Math.random() < 0.1) {
        //     await Consultant.updateOne(
        //         { _id: consultantId.toString() },
        //         { lastLocation: { type: "Point", coordinates: [lng, lat] } }
        //     );
        // }

    } catch (err) {
        systemLogger.error({
            message: "Socket location_update error",
            error: err.message,
        });
    }
}