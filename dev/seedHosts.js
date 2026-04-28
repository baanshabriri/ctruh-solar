// scripts/seed.js
import mongoose from "mongoose";
import Host from "../src/models/host.model.js";
import { cacheHostLocation } from "../src/services/geo.service.js";

await mongoose.connect("mongodb://localhost:27017/solar_host");

const hosts = [
    {
        name: "Host A",
        tenantId: "123",
        location: { type: "Point", coordinates: [77.5946, 12.9716] },
    },
    {
        name: "Host B",
        tenantId: "123",
        location: { type: "Point", coordinates: [77.6, 12.97] },
    },
    {
        name: "Host C",
        tenantId: "123",
        location: { type: "Point", coordinates: [77.58, 12.98] },
    },
    {
        name: "Host D",
        tenantId: "123",
        location: { type: "Point", coordinates: [77.59, 12.96] },
    },
    {
        name: "Host E",
        tenantId: "123",
        location: { type: "Point", coordinates: [77.57, 12.99] },
    },
    {
        name: "Host F",
        tenantId: "123",
        location: { type: "Point", coordinates: [77.56, 12.98] },
    }
];

for (const host of hosts) {
    const saved = await Host.create(host);

    await cacheHostLocation({
        hostId: saved._id.toString(),
        lng: host.location.coordinates[0],
        lat: host.location.coordinates[1],
        tenantId: host.tenantId,
    });
}

console.log("✅ Seeded");
process.exit(0);