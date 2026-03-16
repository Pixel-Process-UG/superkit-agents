---
name: senior-devops
description: >
  Use when the user needs CI/CD pipelines, Docker configuration, Kubernetes deployment,
  infrastructure-as-code, monitoring, or zero-downtime deployment strategies. Triggers: user says
  "devops", "docker", "kubernetes", "CI/CD", "infrastructure", "monitoring", "deploy to production",
  "container", "terraform", "observability".
---

# Senior DevOps Engineer

## Overview

Design, build, and maintain production infrastructure and deployment pipelines. This skill covers Docker containerization, Kubernetes orchestration, CI/CD with GitHub Actions, infrastructure-as-code with Terraform/Pulumi, monitoring with Prometheus/Grafana, alerting strategies, zero-downtime deployments, and rollback procedures.

## Phase 1: Infrastructure Design

1. Define deployment topology (single server, cluster, multi-region)
2. Choose containerization strategy (Docker, Buildpacks)
3. Select orchestration platform (Kubernetes, ECS, Cloud Run)
4. Plan networking (load balancers, DNS, TLS)
5. Design secret management approach

**STOP — Present infrastructure design to user for approval before implementation.**

### Infrastructure Decision Table

| Scale | Topology | Orchestration | Recommended |
|---|---|---|---|
| Hobby / MVP | Single server | Docker Compose | Railway, Fly.io |
| Startup (< 100k users) | Small cluster | ECS, Cloud Run | AWS ECS, GCP Cloud Run |
| Growth (100k - 1M users) | Multi-AZ cluster | Kubernetes | EKS, GKE |
| Enterprise (1M+ users) | Multi-region | Kubernetes + service mesh | EKS/GKE + Istio |
| Compliance-heavy | Dedicated/private cloud | Kubernetes | Self-managed K8s |

## Phase 2: Pipeline Implementation

1. Build CI pipeline (lint, test, build, security scan)
2. Build CD pipeline (deploy to staging, production)
3. Configure environment-specific settings
4. Set up artifact registry (container images, packages)
5. Implement deployment strategy (blue-green, canary, rolling)

**STOP — Validate pipeline config syntax and present for review.**

## Phase 3: Observability

1. Deploy monitoring stack (Prometheus, Grafana)
2. Configure alerting rules and escalation
3. Set up log aggregation
4. Implement distributed tracing
5. Create runbooks for common incidents

**STOP — Verify monitoring covers all critical services before declaring complete.**

## Dockerfile Best Practices

```dockerfile
# 1. Use specific version tags (not :latest)
FROM node:20-alpine AS base

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies in separate layer (cache optimization)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --prod

FROM base AS build-deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# 4. Build in separate stage
FROM build-deps AS builder
COPY . .
RUN pnpm build

# 5. Production image — minimal size
FROM base AS runner
ENV NODE_ENV=production

# 6. Don't run as root
RUN addgroup --system --gid 1001 app && \
    adduser --system --uid 1001 app
USER app

# 7. Copy only what's needed
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# 8. Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

# 9. Expose port and set entrypoint
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Key Dockerfile Rules

| Rule | Why |
|---|---|
| Multi-stage builds | Minimize image size |
| `.dockerignore` file | Exclude node_modules, .git, tests |
| Non-root user | Security hardening |
| Specific base image versions | Reproducible builds |
| Layer ordering (deps before src) | Cache efficiency |
| HEALTHCHECK instruction | Container health monitoring |
| No secrets in build args/layers | Prevent credential leaks |

## Docker Compose Patterns

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5

  cache:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## GitHub Actions Workflow

```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test -- --coverage

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx audit-ci --moderate
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: fs
          severity: HIGH,CRITICAL

  build-and-push:
    needs: [lint-and-test, security-scan]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: echo "Deploying ${{ github.sha }}"
```

## Terraform / Pulumi Patterns

### Terraform Structure

```
modules/
  vpc/
    main.tf, variables.tf, outputs.tf
  ecs/
    main.tf, variables.tf, outputs.tf
environments/
  staging/
    main.tf, terraform.tfvars
  production/
    main.tf, terraform.tfvars
```

### Key IaC Rules

| Rule | Why |
|---|---|
| Remote state backend (S3 + DynamoDB) | Shared state, locking |
| State locking | Prevent concurrent modifications |
| Environment-specific variable files | Separation of concerns |
| Module versioning | Reproducible shared infra |
| `terraform plan` in CI | Catch issues before apply |
| Drift detection on schedule | Detect manual changes |
| Tag all resources | Ownership, cost allocation |

## Monitoring (Prometheus + Grafana)

### USE Method (Resources)

| Resource | Utilization | Saturation | Errors |
|---|---|---|---|
| CPU | cpu_usage_percent | cpu_throttled | — |
| Memory | memory_usage_bytes | oom_kills | — |
| Disk | disk_usage_percent | io_wait | disk_errors |
| Network | bytes_total | queue_length | errors_total |

### RED Method (Services)

- **Rate**: requests per second
- **Errors**: error rate per second
- **Duration**: latency distribution (p50, p95, p99)

### Alerting Rules

```yaml
groups:
  - name: app-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
```

### Alerting Best Practices

| Practice | Why |
|---|---|
| Alert on symptoms, not causes | Reduces noise, focuses on impact |
| Every alert has a runbook link | Enables fast response |
| Tiered severity | critical=page, warning=ticket, info=log |
| Aggregate before alerting | Avoid flapping |
| Review and prune quarterly | Prevent alert fatigue |

## Zero-Downtime Deployment Strategies

| Strategy | How It Works | Risk | Rollback Speed |
|---|---|---|---|
| Rolling | Replace instances one at a time | Low | Medium |
| Blue-Green | Switch traffic between two environments | Low | Instant |
| Canary | Route small % to new version, gradually increase | Very Low | Instant |
| Feature Flags | Deploy code dark, enable via flag | Very Low | Instant |

### Rollback Procedures

1. **Automated**: health check fails -> automatic rollback
2. **Manual**: `kubectl rollout undo deployment/app`
3. **Database**: forward-only migrations with backward compatibility
4. **Config**: revert via secret manager version

### Database Migration Safety

| Rule | Rationale |
|---|---|
| Migrations must be backward compatible | Old code + new schema must work |
| Never rename/drop columns in same deploy | Two-phase change required |
| Two-phase: add column -> deploy -> remove old | Zero-downtime schema evolution |
| Always test rollback of each migration | Ensure reversibility |

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | What to Do Instead |
|---|---|---|
| Manual production deployments | No audit trail, error-prone | Automate via CI/CD |
| Shared or hardcoded secrets | Security breach risk | Use secrets manager |
| No rollback plan before deploying | Stuck if deploy fails | Document rollback before every deploy |
| `latest` tag for production images | Non-reproducible | Pin specific version tags |
| Running containers as root | Security vulnerability | Use non-root user in Dockerfile |
| Alert fatigue from non-actionable alerts | Real issues get missed | Alert on symptoms, tune thresholds |
| Skipping staging environment | Bugs found in production | Always deploy to staging first |
| Snowflake servers with manual config | Cannot reproduce, cannot scale | Infrastructure as code |
| Monitoring without alerting | Nobody notices problems | Wire alerts to monitoring |

## Key Principles

- Infrastructure as code — no manual changes to production
- Immutable infrastructure — replace, do not patch
- Cattle, not pets — servers are disposable
- Shift left security — scan early in pipeline
- Least privilege — minimal permissions everywhere
- Automate everything that runs more than twice
- Test the disaster recovery plan regularly

## Documentation Lookup (Context7)

Use `mcp__context7__resolve-library-id` then `mcp__context7__query-docs` for up-to-date docs. Returned docs override memorized knowledge.
- `docker` — for Dockerfile syntax, compose configuration, or multi-stage builds
- `kubernetes` — for resource manifests, kubectl commands, or Helm charts
- `terraform` — for provider configuration, resource blocks, or state management

---

## Integration Points

| Skill | Integration |
|---|---|
| `deployment` | Provides higher-level deploy pipeline orchestration |
| `security-review` | Security scan stage in CI pipeline |
| `planning` | Infrastructure changes are planned like features |
| `verification-before-completion` | Post-deploy verification gate |
| `finishing-a-development-branch` | Merge triggers deployment pipeline |
| `mcp-builder` | MCP servers need containerization and deployment |

## Skill Type

**FLEXIBLE** — Adapt tooling and patterns to the project's cloud provider, team size, and operational maturity. The principles (IaC, immutability, observability) are constant; the specific tools are interchangeable.
