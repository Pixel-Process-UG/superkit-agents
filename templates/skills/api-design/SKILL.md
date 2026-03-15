---
name: api-design
description: "Use when designing API endpoints, defining request/response schemas, generating OpenAPI specifications, choosing between REST/GraphQL/tRPC, or establishing API conventions for a project"
---

# API Design

## Overview

Structured API endpoint design through guided discovery. Produces consistent, well-documented API designs with OpenAPI/Swagger specifications. Covers resource modeling, authentication, pagination, error handling, and versioning — ensuring consumer-centric design before any implementation begins.

**Announce at start:** "I'm using the api-design skill to design the API."

## Phase 1: Discovery

Ask these questions ONE AT A TIME:

### Resource Questions

| # | Question | What It Determines |
|---|----------|-------------------|
| 1 | What entities/resources does this API manage? | Resource naming |
| 2 | What are the relationships between them? | Nested routes, includes |
| 3 | What operations are needed for each? (CRUD, search, batch) | HTTP methods, endpoints |

### Consumer Questions

| # | Question | What It Determines |
|---|----------|-------------------|
| 4 | Who will consume this API? (frontend, mobile, third-party, internal) | Response shape, auth model |
| 5 | What authentication/authorization is needed? | Security scheme |
| 6 | What rate limits or quotas apply? | Rate limiting headers |

### Constraint Questions

| # | Question | What It Determines |
|---|----------|-------------------|
| 7 | REST, GraphQL, or tRPC? | API paradigm |
| 8 | Versioning strategy? (URL path, header, query param) | URL structure |
| 9 | Pagination approach? (cursor, offset, keyset) | List response shape |
| 10 | Existing API conventions in the codebase? | Consistency constraints |

### API Paradigm Decision Table

| Factor | Choose REST | Choose GraphQL | Choose tRPC |
|--------|------------|---------------|-------------|
| Consumers | Multiple, diverse | Frontend-heavy, flexible queries | TypeScript monorepo |
| Caching needs | Strong (HTTP caching) | Moderate (client-side) | Low (internal only) |
| Data shape | Predictable, resource-oriented | Nested, variable-shape | Type-safe RPC |
| Team familiarity | Universal | Requires schema knowledge | Requires TypeScript |
| Real-time needs | WebSocket addon | Subscriptions built-in | Subscription support |

STOP after discovery — present a summary of resources, operations, and constraints. Get confirmation before designing endpoints.

## Phase 2: Design Endpoints

For each endpoint, define:

```markdown
### [METHOD] /api/v1/[resource]

**Purpose:** [what this endpoint does]

**Request:**
- Headers: `Authorization: Bearer <token>`
- Query params: `?page=1&limit=20&sort=created_at:desc`
- Body:
  ```json
  {
    "field": "type — description"
  }
  ```

**Response (200):**
```json
{
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

**Error Responses:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid request body |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 404 | NOT_FOUND | Resource doesn't exist |
| 409 | CONFLICT | Resource already exists |

**Authorization:** [who can access this]
```

### HTTP Method Decision Table

| Operation | Method | Status (success) | Idempotent |
|-----------|--------|-----------------|------------|
| List resources | GET | 200 | Yes |
| Get single resource | GET | 200 | Yes |
| Create resource | POST | 201 | No |
| Full replace | PUT | 200 | Yes |
| Partial update | PATCH | 200 | No |
| Delete resource | DELETE | 204 | Yes |
| Bulk create | POST | 201 | No |
| Search (complex) | POST | 200 | Yes (safe) |

### Pagination Decision Table

| Approach | When to Use | Pros | Cons |
|----------|------------|------|------|
| **Cursor** | Real-time feeds, large datasets | Consistent, no skipping | Cannot jump to page N |
| **Offset** | Small datasets, admin panels | Simple, jumpable | Skips/duplicates on insert |
| **Keyset** | Time-series, logs | Efficient on large tables | Requires sortable key |

### Error Response Format

All endpoints must use a consistent error shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### Status Code Reference

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST that creates |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation failure |
| 401 | Unauthorized | Missing or invalid credentials |
| 403 | Forbidden | Valid credentials, insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate or state conflict |
| 422 | Unprocessable Entity | Valid JSON but semantic error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |

STOP after endpoint design — present each endpoint for review and approval.

## Phase 3: Generate OpenAPI Spec

```yaml
openapi: 3.1.0
info:
  title: [API Name]
  version: 1.0.0
  description: [API description]

servers:
  - url: http://localhost:3000/api/v1
    description: Development
  - url: https://api.example.com/v1
    description: Production

paths:
  /resource:
    get:
      summary: List resources
      parameters: [...]
      responses: [...]
    post:
      summary: Create resource
      requestBody: [...]
      responses: [...]

components:
  schemas: [...]
  securitySchemes: [...]
```

STOP after spec generation — validate the YAML and present for final approval.

## Phase 4: Save and Transition

After explicit approval:

1. Save OpenAPI spec to `docs/api/YYYY-MM-DD-<api-name>.yaml`
2. Commit with message: `docs(api): add OpenAPI spec for <api-name>`
3. Determine next step based on user intent

### Transition Decision Table

| User Intent | Next Skill | Rationale |
|-------------|-----------|-----------|
| "Let's implement this" | `planning` | Create implementation plan from API spec |
| "Write specs for this" | `spec-writing` | Behavioral specs for each endpoint |
| "Generate client SDK" | Manual | Use OpenAPI codegen tools |
| "Just save the design" | None | API design is the deliverable |
| "Add tests" | `testing-strategy` | Define API test approach |

## Design Principles

| Principle | Rule |
|-----------|------|
| Consistent naming | Plural nouns for collections (`/users`, not `/user`) |
| Proper HTTP methods | GET reads, POST creates, PUT replaces, PATCH updates, DELETE removes |
| Proper status codes | Use the right code for the right situation (see table above) |
| Consistent error format | Same error shape across all endpoints |
| Pagination by default | All list endpoints paginated |
| Filtering and sorting | Query params for list endpoints |
| Idempotency | PUT and DELETE are always idempotent |
| HATEOAS | Include links for discoverability (when appropriate) |

## Anti-Patterns / Common Mistakes

| Mistake | Why It Is Wrong | What To Do Instead |
|---------|----------------|-------------------|
| Verb-based URLs (`/getUsers`) | Not RESTful, breaks conventions | Use nouns: `GET /users` |
| Inconsistent plural/singular | Confuses consumers | Always plural for collections |
| Returning 200 for errors | Hides failures from clients | Use proper status codes |
| No pagination on list endpoints | Performance bomb on large datasets | Always paginate |
| Different error formats per endpoint | Clients can't build generic error handling | One error shape for all |
| Exposing internal IDs in URLs | Security and coupling risk | Use UUIDs or slugs |
| No versioning strategy | Breaking changes break clients | Version from day one |
| Designing without knowing consumers | API serves no one well | Discovery phase first |

## Anti-Rationalization Guards

- **Do NOT** skip the discovery phase — understand consumers and constraints first
- **Do NOT** design endpoints without defining error responses
- **Do NOT** skip pagination for any list endpoint
- **Do NOT** use inconsistent naming across endpoints
- **Do NOT** generate the OpenAPI spec without user approval of endpoint designs
- **Do NOT** mix API paradigms (REST + GraphQL) without explicit justification

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `spec-writing` | Downstream: API design informs behavioral specifications |
| `planning` | Downstream: API endpoints become implementation tasks |
| `tech-docs-generator` | Downstream: OpenAPI spec feeds API reference docs |
| `testing-strategy` | Downstream: API design informs integration test strategy |
| `security-review` | Downstream: auth/authz model reviewed for vulnerabilities |
| `database-schema-design` | Upstream: data model informs resource design |
| `prd-generation` | Upstream: PRD requirements drive API resource identification |

## Verification Gate

Before claiming the API design is complete:

1. VERIFY all endpoints have request/response schemas
2. VERIFY all error responses are documented with consistent format
3. VERIFY authentication is specified for each endpoint
4. VERIFY pagination is defined for all list endpoints
5. VERIFY the OpenAPI spec is valid YAML
6. VERIFY user has approved each endpoint individually

## Skill Type

**Flexible** — Adapt API paradigm, pagination style, and auth model to project needs while preserving the discovery-first approach, consistent error handling, and consumer-centric design principles.
