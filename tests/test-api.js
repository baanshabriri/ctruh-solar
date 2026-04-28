import axios from "axios";

const BASE_URL = "http://localhost:3000";
const TENANT_ID = "123";

const TOTAL_REQUESTS = 500;
const CONCURRENCY = 3;

async function login() {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        username: "user1",
        password: "pass123",
    });

    return res.data.token;
}
async function callNearby(token, index) {
    try {
        const res = await axios.get(
            `${BASE_URL}/api/hosts/nearby`,
            {
                params: {
                    lat: 12.9716,
                    lng: 77.5946,
                    radius: 2000,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-tenant-id": TENANT_ID,
                },
            }
        );

        console.log(`✅ [${index}] Success (${res.status})`);
        return "success";

    } catch (err) {
        if (err.response) {
            console.log(`❌ [${index}] ${err.response.status}`);

            if (err.response.status === 429) {
                return "rate_limited";
            }

            return "error";
        } else {
            console.log(`❌ [${index}] Network error`);
            return "error";
        }
    }
}

async function runTest() {
    const token = await login();

    console.log("🔐 Token acquired");
    console.log("🚀 Starting test...\n");

    let success = 0;
    let rateLimited = 0;
    let error = 0;

    const tasks = [];

    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        tasks.push(callNearby(token, i));
    }

    const results = await Promise.all(tasks);

    results.forEach((r) => {
        if (r === "success") success++;
        else if (r === "rate_limited") rateLimited++;
        else error++;
    });

    console.log("\n📊 RESULTS:");
    console.log("✅ Success:", success);
    console.log("🚫 Rate Limited:", rateLimited);
    console.log("❌ Errors:", error);
}

runTest();