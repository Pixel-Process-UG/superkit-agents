---
name: senior-backend
description: "Use when the user needs API design, microservices architecture, event-driven systems, database integration, caching strategies, or backend observability. Triggers: REST/GraphQL API implementation, service architecture design, message queue setup, rate limiting, health checks, OpenTelemetry integration."
---

# Senior Backend Engineer

## Overview

Design and implement robust, scalable backend systems with a focus on API design, service architecture, data management, and operational excellence. This skill covers RESTful and GraphQL API patterns, message-driven architecture, caching strategies, rate limiting, health checks, and full observability with OpenTelemetry.

**Announce at start:** "I'm using the senior-backend skill for backend system design and implementation."

---

## Phase 1: API Design

**Goal:** Define the contract before writing implementation code.

### Actions

1. Define resource models and relationships
2. Design endpoint structure (REST) or schema (GraphQL)
3. Establish authentication and authorization strategy
4. Define rate limiting and throttling policies
5. Create API documentation (OpenAPI/GraphQL schema)

### API Style Decision Table

| Factor | REST | GraphQL | gRPC |
|--------|------|---------|------|
| Multiple consumers with different data needs | Poor fit | Strong fit | Poor fit |
| Simple CRUD operations | Strong fit | Overkill | Overkill |
| Real-time subscriptions | Requires WebSocket add-on | Built-in | Built-in (streaming) |
| Service-to-service | Good | Overkill | Strong fit |
| Public API | Strong fit | Good | Poor fit (tooling) |
| Mobile with bandwidth constraints | Overfetching risk | Strong fit | Strong fit |

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Resource models are defined
- [ ] Endpoint structure or schema is documented
- [ ] Auth strategy is chosen
- [ ] API contract is reviewable (OpenAPI/GraphQL schema)

---

## Phase 2: Implementation

**Goal:** Build the service layer with clear separation of concerns.

### Actions

1. Set up project structure with clear layering
2. Implement data access layer (repositories/DAOs)
3. Build service layer with business logic
4. Create API controllers/resolvers
5. Add middleware (auth, logging, error handling, CORS)
6. Implement caching strategy

### RESTful URL Structure

```
GET    /api/v1/users              # List users (paginated)
GET    /api/v1/users/:id          # Get single user
POST   /api/v1/users              # Create user
PUT    /api/v1/users/:id          # Full update
PATCH  /api/v1/users/:id          # Partial update
DELETE /api/v1/users/:id          # Delete user
GET    /api/v1/users/:id/orders   # Nested resources
POST   /api/v1/users/:id/activate # State transitions
```

### HTTP Status Code Decision Table

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST creating resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing or invalid auth |
| 403 | Forbidden | Auth valid but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate or state conflict |
| 422 | Unprocessable Entity | Semantically invalid input |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |

### Response Format

```json
// Success (single)
{ "data": { "id": "123", "name": "Alice" }, "meta": { "requestId": "req_abc123" } }

// Success (collection)
{ "data": [...], "meta": { "page": 1, "pageSize": 20, "totalCount": 150, "totalPages": 8 } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [...] } }
```

### Caching Strategy Decision Table

| Strategy | Description | Use Case |
|----------|------------|----------|
| Cache-Aside | App checks cache, falls back to DB | General purpose |
| Write-Through | Write to cache and DB simultaneously | Strong consistency |
| Write-Behind | Write to cache, async write to DB | High write throughput |
| Read-Through | Cache loads from DB on miss | Transparent caching |

### STOP — Do NOT proceed to Phase 3 until:
- [ ] Project structure follows layered architecture
- [ ] Input validation is at the edge (Zod, Joi, class-validator)
- [ ] Error handling returns structured error responses
- [ ] Caching strategy is implemented with invalidation plan

---

## Phase 3: Hardening

**Goal:** Prepare the service for production operation.

### Actions

1. Add comprehensive error handling
2. Implement health checks and readiness probes
3. Set up observability (traces, metrics, logs)
4. Load test critical paths
5. Document runbooks for operational scenarios

### Health Check Endpoints

```json
// GET /health — lightweight liveness check
{ "status": "healthy" }

// GET /health/ready — readiness with dependency checks
{
  "status": "healthy",
  "checks": {
    "database": { "status": "healthy", "latency": "5ms" },
    "redis": { "status": "healthy", "latency": "2ms" },
    "queue": { "status": "healthy", "latency": "8ms" }
  },
  "uptime": "72h15m",
  "version": "1.4.2"
}
```

### Observability: RED Method Metrics

| Metric | Description | Implementation |
|--------|------------|---------------|
| **Rate** | Requests per second | Counter incremented per request |
| **Errors** | Error rate per second | Counter incremented per error |
| **Duration** | Latency distribution | Histogram (p50, p95, p99) |

### Structured Logging Format

```json
{
  "timestamp": "2025-01-15T10:30:00.123Z",
  "level": "info",
  "message": "User created",
  "service": "user-service",
  "traceId": "abc123",
  "spanId": "def456",
  "userId": "usr_123",
  "duration": 45
}
```

### Rate Limiting Algorithm Decision Table

| Algorithm | Pros | Cons | Best For |
|-----------|------|------|----------|
| Fixed Window | Simple, low memory | Burst at boundaries | Internal APIs |
| Sliding Window | Smooth distribution | More memory | Public APIs |
| Token Bucket | Controlled bursts | Slightly complex | Industry standard |
| Leaky Bucket | Constant output | No burst allowed | Strict rate control |

### STOP — Hardening complete when:
- [ ] Health check endpoints respond correctly
- [ ] Structured logging is configured
- [ ] Metrics are exported (RED method)
- [ ] Load test completed on critical paths
- [ ] Error handling returns appropriate status codes

---

## Event-Driven Architecture Patterns

### Message Queue Pattern Decision Table

| Pattern | Use Case | Example |
|---------|----------|---------|
| Pub/Sub | Broadcast to multiple consumers | User registered -> email, analytics, CRM |
| Work Queue | Distribute tasks across workers | Image processing, PDF generation |
| Request/Reply | Async request with response | Price calculation service |
| Dead Letter | Handle failed messages | Retry policy exceeded |

### Event Schema

```json
{
  "eventId": "evt_abc123",
  "eventType": "user.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0",
  "source": "user-service",
  "data": { "userId": "usr_123", "email": "alice@example.com" },
  "metadata": { "correlationId": "corr_xyz789", "causationId": "cmd_def456" }
}
```

---

## GraphQL Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| N+1 queries | Performance degradation | DataLoader for batching |
| Unbounded queries | DoS vulnerability | Enforce depth and complexity limits |
| Over-fetching in resolvers | Wasted DB queries | Select only requested fields |

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Exposing database IDs directly | Security risk, coupling to DB | Use UUIDs or prefixed IDs |
| Synchronous external service calls in request path | Single point of failure, latency | Async with queues or circuit breaker |
| N+1 query patterns | Linear performance degradation | Eager loading or DataLoader |
| Catching and swallowing errors | Silent failures, impossible debugging | Log and propagate with context |
| Shared mutable state across handlers | Race conditions, unpredictable behavior | Stateless request handling |
| Skipping input validation | Injection, data corruption | Validate at the edge, always |
| Generic 500 for all errors | Poor developer experience | Specific error codes and messages |
| No API versioning | Breaking changes affect all consumers | Version from day one (`/v1/`) |

---

## Documentation Lookup (Context7)

Use `mcp__context7__resolve-library-id` then `mcp__context7__query-docs` for up-to-date docs. Returned docs override memorized knowledge.
- `express` — for middleware patterns, routing, or request/response API
- `fastify` — for plugin system, hooks, or schema validation
- `nestjs` — for decorators, modules, providers, or guards
- `prisma` — for schema syntax, client API, or migration commands

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `senior-architect` | Architecture decisions guide backend service boundaries |
| `security-review` | Backend security follows OWASP and auth patterns |
| `performance-optimization` | Backend performance uses caching and query tuning |
| `testing-strategy` | Backend test strategy defines integration test approach |
| `code-review` | Review verifies API design and error handling |
| `acceptance-testing` | API behavior becomes acceptance criteria |
| `senior-fullstack` | Backend serves the full-stack tRPC layer |

---

## Key Principles

- API versioning from day one (`/v1/`)
- Input validation at the edge (Zod, Joi, class-validator)
- Idempotency keys for non-GET endpoints
- Graceful shutdown (drain connections, finish in-flight requests)
- Circuit breaker for external service calls
- Database migrations versioned and reversible
- Secrets in environment variables, never in code

---

## Skill Type

**FLEXIBLE** — Adapt API style and architecture to the project context. The three-phase process (design, implement, harden) is strongly recommended. Health checks, structured logging, and error handling are non-negotiable for production services.
