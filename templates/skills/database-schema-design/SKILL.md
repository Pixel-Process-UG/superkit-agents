---
name: database-schema-design
description: "Use when designing database schemas, creating migrations, modeling data relationships, optimizing database queries, adding indexes, or selecting between SQL and NoSQL storage"
---

# Database Schema Design

## Overview

Guide the design, implementation, and optimization of database schemas with sound data modeling, safe migrations, effective indexing, and appropriate query patterns. This skill covers the full lifecycle from conceptual modeling through physical optimization, ensuring schemas that are normalized, performant, and safely evolvable.

**Announce at start:** "I'm using the database-schema-design skill to design the database schema."

## Phase 1: Discovery and Conceptual Model

Ask these questions to understand the data requirements:

| # | Question | What It Determines |
|---|----------|-------------------|
| 1 | What entities does the system manage? | Table names |
| 2 | What are the relationships between entities? | Foreign keys, join tables |
| 3 | What are the key attributes of each entity? | Column definitions |
| 4 | What are the primary query patterns? | Index strategy |
| 5 | What is the expected data volume? (rows, growth rate) | Partitioning, scaling |
| 6 | What is the read/write ratio? | Normalization vs denormalization |
| 7 | SQL or NoSQL? (or both?) | Storage engine selection |

### Storage Engine Decision Table

| Factor | Choose SQL (PostgreSQL, MySQL) | Choose Document (MongoDB) | Choose Key-Value (Redis) |
|--------|-------------------------------|--------------------------|-------------------------|
| Data shape | Structured, relational | Semi-structured, nested | Simple lookups, caching |
| Query complexity | Complex joins, aggregations | Document-level queries | Key-based access only |
| Consistency needs | ACID required | Eventual consistency OK | Ephemeral or cached data |
| Schema evolution | Migrations manageable | Schema-free flexibility | No schema |
| Scale pattern | Vertical first, then read replicas | Horizontal sharding | In-memory, limited size |

STOP after discovery — present the conceptual model (entities, relationships, cardinality) for confirmation.

## Phase 2: Logical Model Design

Translate the conceptual model into tables, columns, types, and constraints.

### Column Design Rules

| Decision | Guidance |
|----------|----------|
| Primary keys | UUIDs for distributed systems, auto-increment for single-node |
| Column types | Use the most specific type (`timestamptz` not `varchar` for dates) |
| Nullability | Default NOT NULL; allow NULL only when absence is meaningful |
| Defaults | Set sensible defaults (`created_at DEFAULT now()`) |
| Constraints | Add CHECK, UNIQUE, and FK constraints at the schema level |
| Naming | `snake_case`, singular table names or plural — be consistent |

### Normalization Guide

| Normal Form | Rule | Violation Example | Fix |
|-------------|------|-------------------|-----|
| **1NF** | Atomic values, no repeating groups | `tags VARCHAR "urgent,priority,vip"` | Separate `order_tags` table |
| **2NF** | All non-key columns depend on entire PK | `product_name` in `order_items` (composite PK) | Move to `products` table |
| **3NF** | No transitive dependencies | `city` depends on `zip_code`, not `user_id` | Separate `zip_codes` table |

**Rule:** Always start normalized. Denormalize only with measured evidence.

### Denormalization Decision Table

| Scenario | Pattern | When to Apply |
|----------|---------|--------------|
| Read-heavy dashboards | Materialized views or summary tables | Measured slow query |
| Frequently joined data | Embed as JSONB column | Join is >80% of query time |
| Reporting / analytics | Separate denormalized reporting tables | OLAP workload |
| Caching layer | Computed columns refreshed on write | High-frequency reads |

### Relationship Patterns

| Relationship | Implementation | Index Needed |
|-------------|---------------|-------------|
| One-to-One | FK with UNIQUE constraint on child | On FK column |
| One-to-Many | FK on the "many" side | On FK column |
| Many-to-Many | Junction/join table with composite PK | On both FK columns |
| Polymorphic | Separate FK columns with CHECK constraint (preferred) or type+id pattern | On type+id or each FK |
| Self-referential (trees) | `parent_id` FK to same table; or `ltree`/materialized path | On parent_id or path |

STOP after logical model — present the table definitions for review.

## Phase 3: Physical Model and Indexing

### Index Type Decision Table

| Index Type | Best For | Example |
|-----------|---------|---------|
| **B-tree** (default) | Equality and range queries | `CREATE INDEX idx_users_email ON users(email)` |
| **GIN** | Full-text search, JSONB, arrays | `CREATE INDEX idx_posts_search ON posts USING GIN(to_tsvector('english', body))` |
| **Partial** | Subset of rows matching condition | `CREATE INDEX idx_active_users ON users(email) WHERE active = true` |
| **Covering (INCLUDE)** | Index-only scans avoiding table lookup | `CREATE INDEX idx_users_email ON users(email) INCLUDE (name)` |
| **Composite** | Multi-column queries | `CREATE INDEX idx_orders ON orders(tenant_id, status)` |

### Composite Index Column Order

| Position | Column Type | Reason |
|----------|------------|--------|
| First | High-cardinality equality columns | Most selective filter first |
| Middle | Additional equality columns | Further narrows results |
| Last | Range columns (dates, numbers) | Range scan on remaining rows |

**Rule:** A composite index on `(A, B, C)` supports queries on `A`, `A+B`, `A+B+C` — but NOT `B` alone or `C` alone.

### Query Optimization Checklist

| Signal in EXPLAIN ANALYZE | Problem | Fix |
|--------------------------|---------|-----|
| Seq Scan on large table | Missing index | Add appropriate index |
| Nested Loop with large outer table | Inefficient join | Add index or restructure query |
| High actual vs estimated rows | Stale statistics | Run `ANALYZE` on table |
| Hash Join high memory | `work_mem` too low | Tune `work_mem` or restructure |

### N+1 Detection and Prevention

```sql
-- N+1 problem (bad):
SELECT * FROM users;
-- Then for EACH user: SELECT * FROM orders WHERE user_id = ?;

-- Fixed with join:
SELECT u.*, o.* FROM users u LEFT JOIN orders o ON o.user_id = u.id;

-- Fixed with batch load:
SELECT * FROM orders WHERE user_id = ANY($1);
```

STOP after physical model — present indexes and optimization strategy for review.

## Phase 4: Migration Strategy

### Zero-Downtime Migration (Expand-Contract)

Never make a breaking change in a single migration. Use two phases:

**Expand phase** (backward compatible):
1. Add new column/table (nullable or with default)
2. Deploy code that writes to both old and new
3. Backfill existing data in batches
4. Deploy code that reads from new

**Contract phase** (after all code uses new schema):
1. Remove code that writes to old
2. Drop old column/table

### Migration Safety Rules

| Rule | Rationale |
|------|-----------|
| Every migration has a corresponding rollback | Safe to revert |
| Test rollback in staging before production | Verify reversibility |
| Data-destructive rollbacks need explicit approval | Prevent accidental data loss |
| Keep migration files immutable once applied | Reproducible state |
| Backfill large tables in batches (1000 rows) | Avoid table locks |

### Backfill Pattern

```sql
-- Backfill in chunks of 1000
UPDATE users SET display_name = username
WHERE display_name IS NULL
AND id IN (SELECT id FROM users WHERE display_name IS NULL LIMIT 1000);
```

### Migration Type Decision Table

| Change Type | Safe Approach | Dangerous Approach |
|------------|---------------|-------------------|
| Add column | Add nullable or with default | Add NOT NULL without default |
| Remove column | Expand-contract (two deploys) | Drop column directly |
| Rename column | Add new, copy data, drop old | ALTER RENAME (breaks queries) |
| Add index | `CREATE INDEX CONCURRENTLY` | `CREATE INDEX` (locks table) |
| Change column type | Add new column, migrate data | `ALTER COLUMN TYPE` (locks table) |

STOP after migration plan — confirm rollback strategy before finalizing.

## Phase 5: Save and Transition

After explicit approval:

1. Save schema design to `docs/database/` or generate migration files
2. Commit with message: `docs(db): add schema design for <feature>`

### Transition Decision Table

| User Intent | Next Skill | Rationale |
|-------------|-----------|-----------|
| "Create the migrations" | `planning` | Plan migration implementation |
| "Write specs for this" | `spec-writing` | Behavioral specs for data operations |
| "Implement the schema" | `test-driven-development` | TDD with migration tests |
| "Just save the design" | None | Schema design is the deliverable |
| "Review for performance" | `performance-optimization` | Analyze query patterns |

## ORM Guidance

| ORM | Language | Strength | Watch Out For |
|-----|----------|----------|---------------|
| **Prisma** | TypeScript | Type-safe schema, migrations | N+1 in nested queries, limited raw SQL |
| **Drizzle** | TypeScript | SQL-like API, lightweight | Newer ecosystem, fewer guides |
| **SQLAlchemy** | Python | Mature, flexible, raw SQL support | Complex session management |
| **GORM** | Go | Convention-based, auto-migrate | Silent failures, implicit behavior |

### ORM Best Practices

- Always review generated SQL (enable query logging in development)
- Use eager loading to prevent N+1 queries
- Write raw SQL for complex queries rather than fighting the ORM
- Use ORM migrations, not auto-sync in production
- Test query performance with realistic data volumes

## Connection Pooling

- Use a connection pooler (PgBouncer, built-in pool)
- Pool size formula: `connections = (CPU cores * 2) + disk spindles`
- Use transaction-level pooling for most workloads
- Application servers should not open raw connections

## Anti-Patterns / Common Mistakes

| Mistake | Why It Is Wrong | What To Do Instead |
|---------|----------------|-------------------|
| No foreign key constraints | Orphaned data, broken relationships | Always define FK constraints |
| VARCHAR for everything | Loses type safety, wastes storage | Use specific types (timestamptz, int, uuid) |
| No indexes on FK columns | Slow joins on related tables | Index every FK column |
| Premature denormalization | Complexity without measured benefit | Start normalized, denormalize with evidence |
| Dropping columns directly | Breaks running application code | Use expand-contract pattern |
| `CREATE INDEX` without CONCURRENTLY | Locks table during index creation | Always use `CONCURRENTLY` in production |
| Auto-sync schema in production | Unpredictable destructive changes | Use explicit migration files |
| No rollback plan for migrations | Cannot recover from failed deploy | Write down migration for every up migration |
| Nullable columns everywhere | Loses data integrity guarantees | Default NOT NULL, allow NULL intentionally |

## Anti-Rationalization Guards

- **Do NOT** skip the conceptual model — understand entities and relationships first
- **Do NOT** add indexes speculatively — measure query patterns first
- **Do NOT** denormalize without measured evidence of a performance problem
- **Do NOT** create migrations without rollback plans
- **Do NOT** skip the discovery phase — understand query patterns and data volume
- **Do NOT** drop columns or tables without expand-contract pattern in production

## Documentation Lookup (Context7)

Use `mcp__context7__resolve-library-id` then `mcp__context7__query-docs` for up-to-date docs. Returned docs override memorized knowledge.
- `prisma` — for schema syntax, relations, or migration API
- `typeorm` — for entity decorators, repository patterns, or query builder
- `knex` — for query builder syntax, migrations, or seed files

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `api-design` | Upstream: API resources map to database entities |
| `spec-writing` | Upstream: specs define data persistence requirements |
| `planning` | Downstream: schema design informs implementation plan |
| `test-driven-development` | Downstream: migration tests written before migration code |
| `performance-optimization` | Downstream: query optimization after schema is live |
| `reverse-engineering-specs` | Upstream: reverse-engineer existing schema behavior |
| `senior-backend` | Parallel: backend specialist for ORM and query patterns |

## Verification Gate

Before claiming the schema design is complete:

1. VERIFY all entities and relationships are modeled
2. VERIFY normalization is at least 3NF (or denormalization is justified)
3. VERIFY indexes are defined for all query patterns and FK columns
4. VERIFY migration strategy includes rollback for every step
5. VERIFY the user has approved the schema design
6. VERIFY connection pooling strategy is defined for production

## Skill Type

**Flexible** — Adapt storage engine, normalization level, and index strategy to project needs while preserving the conceptual-to-physical modeling progression, migration safety rules, and measured-evidence-before-denormalization principle.
