import config from '../config/config.js';
import { redisClient } from '../databases/redis.js';
import Host from '../models/host.model.js';
import { systemLogger } from '../logger/index.js';
import { cacheHits, cacheMisses } from '../metrics/index.js';

const { GEO_HOSTS_CACHE_KEY_PREFIX } = config;
function getGeoCacheKey(tenantId) {
    return `${GEO_HOSTS_CACHE_KEY_PREFIX}:${tenantId}`;
}

export async function cacheHostLocation({ tenantId, hostId, lat, lng }) {
    try {
        const key = getGeoCacheKey(tenantId);
        await redisClient.geoadd(key, lng, lat, hostId);
    } catch (err) {
        systemLogger.error({
            message: `Error caching host location ${hostId} for tenant ${tenantId}`,
            error: err.message,
        });
    }
}

export async function getNearbyHosts({ tenantId, lat, lng, radius = 5000, count = 20 }) {
    try {
        const key = getGeoCacheKey(tenantId);
        let nearbyHostIds = await redisClient.georadius(key, lng, lat, radius, 'm', "WITHDIST", "COUNT", count, "ASC");
        if (nearbyHostIds.length > 0) {
            cacheHits.inc();
            return nearbyHostIds.map(([id, distance]) => ({
                hostId: id,
                distance: parseFloat(distance),
                source: 'cache',
            }));
        }
        cacheMisses.inc();
        nearbyHostIds = await Host.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [lng, lat],
                    },
                    distanceField: "distance",
                    maxDistance: radius,
                    spherical: true,
                    query: { tenantId },
                },
            },
            {
                $limit: count,
            }
        ]);
        return nearbyHostIds.map(host => ({
            hostId: host._id.toString(),
            distance: host.distance,
            source: 'db',
        }));

    } catch (err) {
        systemLogger.error({
            message: `Error fetching nearby hosts for tenant ${tenantId}`,
            error: err.message,
        });
        return [];
    }
}