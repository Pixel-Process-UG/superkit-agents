---
name: senior-architect
description: "Use when the user needs system design, architecture decision records, scalability analysis, trade-off evaluation, or non-functional requirements planning. Triggers: new system design, technology selection, scaling strategy, ADR creation, infrastructure topology, service boundary definition."
---

# Senior Architect

## Overview

Provide architecture-level guidance for system design decisions. This skill produces Architecture Decision Records (ADRs), trade-off analyses, scalability blueprints, and non-functional requirements specifications. Every recommendation includes explicit trade-offs and is grounded in proven patterns.

**Announce at start:** "I'm using the senior-architect skill for system design and architecture decisions."

---

## Phase 1: Requirements Analysis

**Goal:** Capture all functional and non-functional requirements before designing.

### Actions

1. Identify functional requirements (capabilities)
2. Define non-functional requirements (quality attributes)
3. Identify constraints (budget, team, timeline, compliance)
4. Map integration points with existing systems
5. Establish success criteria and SLOs

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Functional requirements are listed
- [ ] Non-functional requirements are quantified (not vague)
- [ ] Constraints are explicit
- [ ] Success criteria are measurable

---

## Phase 2: Architecture Design

**Goal:** Evaluate options and select the approach with the best trade-off profile.

### Actions

1. Evaluate architectural styles (monolith, microservices, event-driven)
2. Design component boundaries and interfaces
3. Define data architecture (storage, flow, consistency)
4. Plan infrastructure and deployment topology
5. Address cross-cutting concerns (auth, logging, monitoring)

### Architecture Style Decision Table

| Factor | Monolith | Modular Monolith | Microservices | Serverless |
|--------|----------|-----------------|---------------|------------|
| Team size < 10 | Preferred | Strong fit | Overkill | Good for bursty |
| Team size > 30 | Challenging | Good | Preferred | Depends |
| Domain well-understood | Good fit | Good fit | Not needed yet | Good fit |
| Domain evolving rapidly | Fine to start | Good fit | Too early | Good fit |
| Need independent deployment | Not possible | Limited | Key benefit | Built-in |
| Operational maturity low | Good fit | Good fit | High risk | Managed risk |
| Variable/bursty load | Over-provisioned | Over-provisioned | Possible | Strong fit |

### Default Recommendation

Start with **Modular Monolith**: clear module boundaries, single deployment. Extract to microservices only when you have proven need for independent scaling, deployment, or team autonomy.

### Trade-Off Analysis: Common Pairs

| Improving | May Degrade |
|-----------|-------------|
| Consistency | Availability, Latency |
| Performance | Maintainability, Cost |
| Security | Usability, Performance |
| Scalability | Simplicity, Cost |
| Flexibility | Performance, Complexity |
| Time to Market | Quality, Scalability |

### Decision Matrix Template

```
Weight each quality attribute (1-5), score each option (1-5), multiply and sum.

| Quality Attribute  | Weight | Option A | Option B | Option C |
|--------------------|--------|----------|----------|----------|
| Performance        |   4    |  4 (16)  |  3 (12)  |  5 (20)  |
| Maintainability    |   5    |  5 (25)  |  4 (20)  |  2 (10)  |
| Scalability        |   3    |  3 (9)   |  5 (15)  |  4 (12)  |
| Cost               |   4    |  4 (16)  |  2 (8)   |  3 (12)  |
| Total              |        |    66    |    55    |    54    |
```

### STOP — Do NOT proceed to Phase 3 until:
- [ ] At least 2 architectural options have been evaluated
- [ ] Trade-offs are explicitly documented
- [ ] Decision matrix scores support the recommendation
- [ ] Data architecture is defined

---

## Phase 3: Documentation and Validation

**Goal:** Record decisions and validate against requirements.

### Actions

1. Write Architecture Decision Records for key decisions
2. Create system context and container diagrams (C4 model)
3. Validate against non-functional requirements
4. Identify risks and mitigation strategies
5. Define evolutionary architecture guardrails

### ADR Format

```markdown
# ADR-{number}: {Title}

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-{number}

## Context
What is the issue motivating this decision?

## Decision
What change are we proposing?

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Risks
- [Risk and mitigation]

## Alternatives Considered
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Option A | ... | ... | Chosen |
| Option B | ... | ... | Rejected because... |
```

### C4 Model Levels

| Level | Shows | When to Use |
|-------|-------|-------------|
| Level 1: System Context | Users and external systems | Always |
| Level 2: Container | Major technical building blocks | Always |
| Level 3: Component | Components within containers | Complex services |
| Level 4: Code | Class-level detail | Critical/complex areas only |

### STOP — Documentation complete when:
- [ ] ADRs written for all key decisions
- [ ] System context diagram created
- [ ] NFRs validated against design
- [ ] Risks documented with mitigations

---

## Scalability Patterns

### Horizontal Scaling Decision Table

| Pattern | Use When | Implementation |
|---------|----------|---------------|
| Load Balancing | Multiple instances of same service | Round-robin, least connections, IP hash |
| Stateless Services | Need to add/remove instances freely | JWT/external session store |
| Auto-scaling | Variable load patterns | CPU/memory/request-rate triggers |
| Read Replicas | Read-heavy workloads | Route reads to replicas, writes to primary |

### Sharding Strategy Decision Table

| Strategy | How | Good For |
|----------|-----|----------|
| Hash-based | Consistent hash of key | Even distribution |
| Range-based | Date range, ID range | Time-series data |
| Geographic | By region/country | Data locality |
| Tenant-based | Per customer | Multi-tenant SaaS |

### Caching Layers

```
Client Cache (browser) -> CDN Cache -> API Gateway Cache ->
Application Cache (Redis) -> Database Query Cache -> Database
```

---

## Non-Functional Requirements Template

```markdown
## Performance
- Response time: p95 < 200ms, p99 < 500ms for API calls
- Throughput: 1000 RPS sustained, 5000 RPS peak
- Batch processing: 1M records/hour

## Availability
- Target: 99.9% (8.76h downtime/year)
- RTO (Recovery Time Objective): < 15 minutes
- RPO (Recovery Point Objective): < 5 minutes

## Scalability
- Current: 10K DAU
- 12-month target: 100K DAU
- Scale dimension: users, data volume, request rate

## Security
- Authentication: OAuth 2.0 / OIDC
- Authorization: RBAC with resource-level permissions
- Data encryption: at rest (AES-256) and in transit (TLS 1.3)

## Observability
- Logging: structured JSON, 30-day retention
- Metrics: RED method, custom business metrics
- Tracing: distributed tracing across all services
- Alerting: PagerDuty integration, tiered severity
```

### SLO/SLA/SLI Framework

| Term | Definition | Example |
|------|-----------|---------|
| **SLI** | Measurable metric | Request latency, error rate |
| **SLO** | Target value | 99.9% availability |
| **SLA** | Contractual commitment | 99.5% with penalty clause |
| **Error Budget** | 1 - SLO | 0.1% = 8.76h/year |

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Resume-driven architecture | Complexity without benefit | Choose simplest solution that works |
| Distributed monolith | All downsides of both | Either true monolith or true microservices |
| Premature optimization | Scaling for 1M users with 100 | Design for current + 10x, not 1000x |
| Golden hammer | One technology for everything | Right tool for each problem |
| Architecture without validation | Untested assumptions | Load test, failure test, validate |
| Big upfront design without iteration | Requirements change | Evolutionary architecture with guardrails |
| Vague NFRs ("fast", "scalable") | Cannot be validated | Quantified targets with measurement |

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `senior-backend` | Backend implementation follows architecture decisions |
| `senior-fullstack` | Full-stack architecture follows service boundaries |
| `security-review` | Security is a cross-cutting architectural concern |
| `performance-optimization` | Performance NFRs drive optimization targets |
| `planning` | Architecture decisions inform implementation planning |
| `code-review` | Review validates architectural consistency |
| `acceptance-testing` | NFRs become acceptance criteria |

---

## Key Principles

- Start with the simplest architecture that could work
- Make decisions reversible when possible
- Design for failure (everything will fail eventually)
- Optimize for team cognitive load, not technical elegance
- Document decisions, not just outcomes
- Prefer boring technology for critical paths
- Every architectural decision has a cost — make it explicit

---

## Skill Type

**FLEXIBLE** — Adapt architecture recommendations to the specific context. ADRs are strongly recommended for all significant decisions. Trade-off analysis is mandatory. NFRs must be quantified, not described vaguely.
