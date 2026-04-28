import mongoose from "mongoose";
import Host from "../src/models/host.model.js";
import { cacheHostLocation } from "../src/services/geo.service.js";

const TOTAL_HOSTS = 2000;
const TENANTS = ["T1", "T2", "T3", "T4", "T5"];

// Center (Bangalore)
const CENTER_LAT = 12.9716;
const CENTER_LNG = 77.5946;

// Generate random point within radius (km)
function generateRandomLocation(radiusKm) {
    // Convert radius from kilometers to degrees
    // ~111 km ≈ 1 degree latitude
    const radiusInDegrees = radiusKm / 111;

    // Generate two random numbers for uniform distribution
    const u = Math.random(); // controls distance from center
    const v = Math.random(); // controls angle

    // Adjust radius using sqrt(u) to ensure uniform distribution
    // (without this, points would cluster near the center)
    const w = radiusInDegrees * Math.sqrt(u);

    // Random angle (0 to 2π radians)
    const t = 2 * Math.PI * v;

    // Convert polar coordinates → Cartesian offsets
    const latOffset = w * Math.cos(t);

    // Longitude needs correction based on latitude
    // because longitude lines converge near poles
    const lngOffset =
        w * Math.sin(t) / Math.cos(CENTER_LAT * (Math.PI / 180));

    // Return final coordinates around the center point
    return {
        lat: CENTER_LAT + latOffset,
        lng: CENTER_LNG + lngOffset,
    };
}

async function seed() {
    await mongoose.connect("mongodb://localhost:27017/solar_host");

    console.log("Seeding hosts...");

    const bulkHosts = [];

    for (let i = 0; i < TOTAL_HOSTS; i++) {
        const { lat, lng } = generateRandomLocation(25); // 25 km radius

        const tenantId = TENANTS[i % TENANTS.length];

        bulkHosts.push({
            name: `Host_${i}`,
            tenantId,
            location: {
                type: "Point",
                coordinates: [lng, lat],
            },
        });
    }

    const insertedHosts = await Host.insertMany(bulkHosts);

    console.log("Mongo insert complete");

    // Cache into Redis GEO
    for (let i = 0; i < insertedHosts.length; i++) {
        const host = insertedHosts[i];

        await cacheHostLocation({
            hostId: host._id.toString(),
            lng: host.location.coordinates[0],
            lat: host.location.coordinates[1],
            tenantId: host.tenantId,
        });

        if (i % 100 === 0) {
            console.log(`Cached ${i} hosts`);
        }
    }

    console.log("Seeding complete");
    process.exit(0);
}

seed();