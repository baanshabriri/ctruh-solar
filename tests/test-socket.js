import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

const NUM_CONSULTANTS = 100;
const UPDATE_INTERVAL = 2000;
const TENANT_ID = "123";

function randomLocation(baseLat, baseLng) {
    return {
        lat: baseLat + (Math.random() - 0.5) * 0.02,
        lng: baseLng + (Math.random() - 0.5) * 0.02,
    };
}

function startConsultant(consultantId) {
    const socket = io(SERVER_URL, {
        auth: {
            tenantId: TENANT_ID,
        },
    });

    socket.on("connect", () => {
        console.log(`Consultant ${consultantId} connected`);

        // Join tenant room
        socket.emit("join", { tenantId: TENANT_ID });

        // Send location updates continuously
        setInterval(() => {
            const { lat, lng } = randomLocation(12.9716, 77.5946);

            socket.emit("location_update", {
                tenantId: TENANT_ID,
                consultantId,
                lat,
                lng,
            });

            console.log(`${consultantId} → ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }, UPDATE_INTERVAL);
    });

    socket.on("disconnect", () => {
        console.log(`Consultant ${consultantId} disconnected`);
    });

    socket.on("connect_error", (err) => {
        console.error(`${consultantId} connection error:`, err.message);
    });

    return socket;
}

// Start multiple consultants
for (let i = 1; i <= NUM_CONSULTANTS; i++) {
    startConsultant(`consultant_${i}`);
}