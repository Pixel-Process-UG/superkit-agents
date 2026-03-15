---
name: senior-fullstack
description: "Use when the user needs end-to-end TypeScript development — from database schema through API layer to UI — with tRPC, Prisma, Next.js, authentication, and deployment. Triggers: full-stack feature implementation, database-to-UI pipeline, tRPC router creation, Prisma schema design, auth setup, deployment configuration."
---

# Senior Fullstack Engineer

## Overview

Deliver complete, end-to-end TypeScript applications covering database design, API layer, frontend UI, authentication, and deployment. This skill specializes in the modern TypeScript full-stack: Next.js App Router, tRPC for type-safe APIs, Prisma for database access, and production deployment with monitoring.

**Announce at start:** "I'm using the senior-fullstack skill for end-to-end TypeScript development."

---

## Phase 1: Data Layer

**Goal:** Design the database schema and data access patterns.

### Actions

1. Design database schema with Prisma
2. Define relationships and indexes
3. Create seed data for development
4. Set up migrations workflow
5. Implement repository pattern for data access

### Prisma Schema Example

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([createdAt])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@index([published, createdAt])
}
```

### Index Strategy Decision Table

| Query Pattern | Index Type | Example |
|--------------|-----------|---------|
| Lookup by unique field | Unique index | `@@unique([email])` |
| Filter by foreign key | Standard index | `@@index([authorId])` |
| Filter + sort combination | Composite index | `@@index([published, createdAt])` |
| Full-text search | Full-text index | Database-specific |
| Geospatial query | Spatial index | Database-specific |

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Schema is defined with all relationships
- [ ] Indexes cover all query patterns
- [ ] Seed data script exists
- [ ] Migrations are generated and tested

---

## Phase 2: API Layer

**Goal:** Build type-safe API with tRPC and Zod validation.

### Actions

1. Define tRPC routers and procedures
2. Implement input validation with Zod
3. Add authentication middleware
4. Build business logic in service layer
5. Add error handling and logging

### tRPC Router Example

```typescript
export const userRouter = router({
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const where = search ? { name: { contains: search, mode: 'insensitive' } } : {};
      const [users, total] = await Promise.all([
        ctx.db.user.findMany({
          where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' },
        }),
        ctx.db.user.count({ where }),
      ]);
      return { users, total, totalPages: Math.ceil(total / pageSize) };
    }),

  create: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({ data: input });
    }),
});
```

### Authorization Pattern Decision Table

| Pattern | Use When | Example |
|---------|----------|---------|
| Role-based (RBAC) | Simple permission model | Admin vs User |
| Resource-level | Owner-only access | User can edit own posts |
| Attribute-based (ABAC) | Complex rules | Org membership + role + resource state |
| Feature flags | Gradual rollout | Premium features |

### STOP — Do NOT proceed to Phase 3 until:
- [ ] All tRPC routers are defined with Zod validation
- [ ] Auth middleware protects appropriate routes
- [ ] Business logic is in service layer (not in router)
- [ ] Error handling returns structured errors

---

## Phase 3: UI Layer

**Goal:** Build pages with Server Components by default, Client Components for interactivity.

### Actions

1. Build pages with Server Components (default)
2. Add Client Components for interactivity
3. Connect to API via tRPC hooks
4. Implement optimistic updates
5. Add loading and error states

### Component Type Decision Table

| Need | Component Type | Data Source |
|------|---------------|-------------|
| Static content, data display | Server Component | Direct DB/API call |
| Interactive form | Client Component | tRPC mutation hook |
| Real-time updates | Client Component | tRPC subscription or polling |
| Search/filter | Client Component | tRPC query with debounce |
| Navigation chrome | Server Component | Session data |

### STOP — Do NOT proceed to Phase 4 until:
- [ ] Pages use Server Components by default
- [ ] Client Components are minimal and justified
- [ ] Loading and error states exist for all data-fetching paths
- [ ] Optimistic updates work for mutations

---

## Phase 4: Production

**Goal:** Prepare for deployment with auth, monitoring, and CI/CD.

### Actions

1. Set up authentication (NextAuth.js / Clerk / Lucia)
2. Configure deployment (Vercel / Docker)
3. Add monitoring and error tracking
4. Implement CI/CD pipeline
5. Performance audit

### Auth Solution Decision Table

| Solution | Best For | SSR Support | Self-Hosted |
|----------|----------|-------------|-------------|
| NextAuth.js (Auth.js) | OAuth providers, JWT/session | Yes | Yes |
| Clerk | Fast setup, managed service | Yes | No |
| Lucia | Custom, lightweight | Yes | Yes |
| Supabase Auth | Supabase ecosystem | Yes | Partial |

### Monitoring Checklist

- [ ] Error tracking (Sentry) with source maps
- [ ] Performance monitoring (Vercel Analytics or custom)
- [ ] Database query performance (Prisma metrics)
- [ ] API endpoint latency and error rates
- [ ] Uptime monitoring (external ping)
- [ ] Log aggregation with structured logging
- [ ] Alerting for error rate spikes

### Docker Deployment

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### STOP — Production ready when:
- [ ] Auth is configured and tested
- [ ] Deployment pipeline works (preview + production)
- [ ] Monitoring and alerting are active
- [ ] Performance audit completed

---

## Full-Stack Type Safety Pipeline

```
Prisma Schema -> Prisma Client (types) -> tRPC Router -> tRPC Hooks -> React Components
     |                  |                     |              |              |
  Migration        Type-safe DB          Validated API    Auto-typed    Rendered UI
                   queries               with Zod         queries
```

---

## Project Structure

```
prisma/
  schema.prisma
  migrations/
  seed.ts
src/
  app/                    # Next.js App Router
    (auth)/               # Auth route group
    (dashboard)/          # Protected route group
    api/trpc/[trpc]/      # tRPC handler
  server/
    db.ts                 # Prisma client singleton
    trpc.ts               # tRPC init
    routers/              # tRPC routers
    services/             # Business logic
  components/
    ui/                   # Design system atoms
    features/             # Feature components
  hooks/                  # Custom React hooks
  lib/
    trpc.ts               # tRPC client
    auth.ts               # Auth configuration
    validators.ts         # Zod schemas
tests/
  unit/
  integration/
  e2e/
```

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Raw SQL in components | Bypasses type safety and security | Use Prisma through tRPC |
| Client-side fetch when Server Components work | Unnecessary JavaScript, slower | Server Components for static data |
| Sharing Prisma client with frontend | Security breach, exposes DB | Prisma only in server code |
| Missing indexes on foreign keys | Slow joins and lookups | Index every foreign key |
| Storing tokens in localStorage | XSS vulnerability | HttpOnly cookies |
| Skipping Zod validation | Runtime type errors | Validate all inputs at API boundary |
| Monolithic tRPC router | Hard to maintain, merge conflicts | Split by domain (user, post, etc.) |
| Business logic in tRPC procedures | Hard to test, not reusable | Extract to service layer |

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `senior-frontend` | UI layer follows frontend patterns |
| `senior-backend` | API layer follows backend patterns |
| `senior-architect` | Architecture decisions guide service boundaries |
| `security-review` | Auth implementation follows security patterns |
| `testing-strategy` | Full-stack testing uses strategy frameworks |
| `code-review` | Review covers all layers of the stack |
| `performance-optimization` | Optimization applies to all layers |

---

## Key Principles

- Single language (TypeScript) from database to browser
- Type safety across the entire stack (no runtime type mismatches)
- Server Components by default, Client Components by necessity
- Validate all inputs at the API boundary with Zod
- Database indexes for every query pattern
- Environment-based configuration (no hard-coded values)

---

## Skill Type

**FLEXIBLE** — Adapt the tech choices to the project context. The four-phase process is strongly recommended. Type safety across the stack is non-negotiable. All API inputs must be validated with Zod. Database schema changes must use migrations.
