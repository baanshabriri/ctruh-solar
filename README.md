# 🚀 Ctruh Solar — Backend System

A scalable backend system for **geospatial search, real-time tracking, and resilient event processing**, built with Node.js, Redis, MongoDB, and Socket.io.

---

## 🧠 Overview

This system enables:

* 🔍 **Nearby host discovery** using geo queries
* 📡 **Real-time consultant tracking** via sockets
* ⚡ **Fast lookups** with Redis geospatial indexing
* 📨 **Reliable event processing** with retry + DLQ
* 🔐 **Secure APIs** with JWT, rate limiting, and validation
* 📊 **Observability** using Prometheus + Grafana

---

## 🏗️ Architecture (High Level)

```text
Client → API (Express)
       → Redis (GEO + Cache + Queue)
       → MongoDB (persistent storage)
       → Socket.io (real-time updates)

Prometheus → /metrics → Grafana
```

---

## ⚙️ Tech Stack

* **Backend:** Node.js (Express)
* **Database:** MongoDB (2dsphere index)
* **Cache & Queue:** Redis (GEO + lists)
* **Realtime:** Socket.io
* **Auth:** JWT
* **Validation:** Joi
* **Observability:** Prometheus + Grafana
* **Containerization:** Docker + Docker Compose

---

## 🔥 Features

### A. Scalable APIs & Real-time

* **Geospatial Search**

  * `GET /api/hosts/nearby`
  * Redis (fast path) + MongoDB (fallback)
  * Optimized for low latency

* **Multi-Tenancy**

  * Strict isolation using `tenantId`
  * Enforced via headers + middleware

* **GPS Streaming**

  * Socket.io-based location updates
  * Redis storage with TTL = 300s

---

### B. Messaging & Resiliency

* Redis-based queue (SQS simulation)
* Retry with **exponential backoff**
* **Dead Letter Queue (DLQ)** for failed events
* **Idempotency** to prevent duplicate processing

---

### C. Security (OWASP-aligned)

* JWT-based authentication
* Rate limiting (Redis-backed)
* Input validation using Joi
* Tenant-level access enforcement

---

### D. Monitoring & Observability

* Prometheus metrics:

  * API latency (p95)
  * Cache hit/miss ratio
  * Active socket connections
* Grafana dashboard for visualization

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/baanshabriri/ctruh-solar.git
cd ctruh-solar
```

---

### 2. Start services

```bash
docker compose up -d --build
```

---

### 3. Services

| Service    | URL                                            |
| ---------- | ---------------------------------------------- |
| API        | [http://localhost:3000](http://localhost:3000) |
| Prometheus | [http://localhost:9090](http://localhost:9090) |
| Grafana    | [http://localhost:3001](http://localhost:3001) |

---

## 🔐 Authentication Flow

### Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"username":"user1","password":"pass123","tenantId":"test"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"user1","password":"pass123"}'
```

Save token:

```bash
TOKEN=<your_token>
```

---

## 🌍 API Usage

### Nearby Hosts

```bash
curl "http://localhost:3000/api/hosts/nearby?lat=12.9716&lng=77.5946" \
-H "Authorization: Bearer $TOKEN" \
-H "x-tenant-id: test"
```

---

## 📡 Socket Testing

```bash
node scripts/test-consultants.js
```

---

## 📨 Event Queue Testing

```bash
node scripts/test-events.js
```

Check DLQ:

```bash
redis-cli LRANGE meeting_dlq 0 -1
```

---

## 📊 Metrics

### Prometheus

```bash
curl http://localhost:3000/metrics
```

### Key Queries

```promql
# p95 latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[1m]))

# request rate
rate(http_request_duration_seconds_count[1m])

# cache hit ratio
rate(cache_hits_total[1m]) /
(rate(cache_hits_total[1m]) + rate(cache_misses_total[1m]))

# active sockets
active_socket_connections
```

---

## 📈 Grafana

* URL: [http://localhost:3001]
* Username: `admin`
* Password: `admin`

Connect datasource
```bash
http://solar-prometheus:9090
```

Import dashboard from:

```text
grafana-dashboard.json
```

---

## 🧪 Testing

* Curl-based API testing (see above)
* Socket simulation script
* Load + rate limit testing script

---

## 📁 Project Structure (Simplified)

```text
src/
  controllers/
  services/
  models/
  middleware/
  sockets/
  databases/
  metrics/
  routes/
  utils/
```

---

## 🎯 Key Design Decisions

* Redis-first for performance, Mongo fallback for accuracy
* TTL-based location storage for real-time systems
* Queue + retry + DLQ for reliability
* Middleware-driven security & multi-tenancy
* Prometheus-based observability

---

## 🏗️ Architecture Diagram

![Architecture](./assets/architecture.png)

---

## 🧠 Notes

* Designed for scalability and low-latency geo queries
* Follows clean separation of concerns
* Production-oriented patterns (retry, idempotency, metrics)

---

## 👤 Author

Abhinandan Das

---
