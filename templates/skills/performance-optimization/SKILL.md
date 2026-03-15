---
name: performance-optimization
description: "Use when optimizing application performance, reducing load times, improving database queries, meeting performance budgets, or diagnosing bottlenecks in web applications or APIs. Triggers: slow page loads, poor Web Vitals, database timeouts, large bundle size, user-reported sluggishness, scaling preparation."
---

# Performance Optimization

## Overview

Systematically identify and resolve performance bottlenecks using measurement-driven methodology. This skill enforces a strict MEASURE-IDENTIFY-OPTIMIZE-VERIFY cycle, preventing premature optimization and speculation. Every optimization must produce measurable improvement or be reverted.

**Announce at start:** "I'm using the performance-optimization skill to diagnose and resolve bottlenecks."

---

## Phase 1: MEASURE (Establish Baseline)

**Goal:** Capture real metrics before changing anything.

### Actions

```bash
# Web: Lighthouse CI
npx lighthouse https://your-app.com --output=json --output-path=baseline.json

# API: load test with k6
k6 run --out json=baseline.json loadtest.js

# Database: slow query log
# PostgreSQL: SET log_min_duration_statement = 100;  -- log queries > 100ms
```

Record these numbers. They are the baseline against which improvement is measured.

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Baseline metrics are captured and saved
- [ ] Specific metric targets are defined (e.g., LCP < 2.5s)
- [ ] Measurement methodology is documented (so it can be repeated)

---

## Phase 2: IDENTIFY (Find the Actual Bottleneck)

**Goal:** Use profiling tools to find WHERE time is spent. Do NOT guess.

### Profiling Tool Selection Table

| Layer | Tool | What It Shows |
|-------|------|--------------|
| Frontend rendering | React DevTools Profiler, Chrome Performance tab | Component render times |
| Network | Chrome Network tab, WebPageTest | Request waterfall, TTFB |
| JavaScript | Chrome Performance tab, `console.time()` | Function execution time |
| Node.js server | `--prof` flag, clinic.js, 0x | CPU flame graphs |
| Database | `EXPLAIN ANALYZE`, pg_stat_statements | Query plans, slow queries |
| Memory | Chrome Memory tab, heapdump | Allocation patterns, leaks |
| Bundle size | webpack-bundle-analyzer, vite-bundle-visualizer | Module sizes |

The bottleneck is almost never where you assume it is. Measure first.

### STOP — Do NOT proceed to Phase 3 until:
- [ ] Profiling tool appropriate to the layer has been used
- [ ] Specific bottleneck is identified with data
- [ ] Bottleneck accounts for a significant portion of the problem

---

## Phase 3: OPTIMIZE (Fix the Identified Bottleneck)

**Goal:** Apply the targeted fix. Change ONE thing at a time.

### Optimization Decision Table

| Bottleneck Type | Optimization Approach | Example |
|----------------|----------------------|---------|
| Large bundle | Code splitting, tree shaking, dynamic imports | `React.lazy(() => import('./HeavyComponent'))` |
| Slow API response | Caching, query optimization, pagination | Add Redis cache with 5min TTL |
| Slow database query | Add index, optimize query plan, materialized view | `CREATE INDEX idx_user_email ON users(email)` |
| Excessive re-renders | Memoization, virtualization, state restructuring | `React.memo`, `useMemo` |
| Large images | Compression, lazy loading, responsive images | `<img loading="lazy" srcset="...">` |
| Slow TTFB | Server-side caching, CDN, edge rendering | Stale-while-revalidate pattern |
| Memory leak | Fix event listener cleanup, weak references | Proper `useEffect` cleanup |

### STOP — Do NOT proceed to Phase 4 until:
- [ ] Only ONE change has been made
- [ ] Change directly targets the identified bottleneck
- [ ] No unrelated changes were made alongside the optimization

---

## Phase 4: VERIFY (Measure Again)

**Goal:** Re-run the exact same measurement from Phase 1.

### Actions

1. Run the same profiling/measurement as Phase 1
2. Compare results:
   - Did the metric improve?
   - By how much?
   - Did any other metrics regress?
3. **If improvement is not measurable, REVERT the change.**

Optimization that cannot be measured is not optimization.

### STOP — Verification complete when:
- [ ] Same measurement methodology used as Phase 1
- [ ] Improvement is quantified (e.g., "LCP reduced from 3.2s to 2.1s")
- [ ] No regressions in other metrics
- [ ] If no improvement: change reverted

---

## Caching Strategy Decision Table

| Cache Type | Use When | TTL Guidance | Invalidation |
|------------|----------|--------------|-------------|
| **In-memory (LRU)** | Single-instance, hot data, computed values | Seconds to minutes | Eviction policy |
| **Redis/Memcached** | Multi-instance, shared cache, sessions | Minutes to hours | Event-based or TTL |
| **CDN** | Static assets, public pages, API responses | Hours to days | Deploy-triggered purge |
| **Browser** | Repeat visits, static resources | Days to months (versioned) | Cache-busting hash |

### Cache-Control Headers

```
# Immutable assets (hashed filenames)
Cache-Control: public, max-age=31536000, immutable

# API responses (cacheable but must revalidate)
Cache-Control: public, max-age=0, must-revalidate
ETag: "abc123"

# Private user data
Cache-Control: private, no-store

# Stale-while-revalidate (fast response + background refresh)
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

---

## Bundle Optimization Techniques

| Technique | Impact | Implementation |
|-----------|--------|---------------|
| Route-level code splitting | High | `React.lazy()` + `Suspense` per route |
| Tree shaking | High | ES modules only, `sideEffects: false` |
| Dynamic imports | Medium | `await import('heavy-lib')` on user action |
| Image optimization | High | next/image, WebP/AVIF, responsive srcset |
| Font optimization | Medium | `next/font`, `font-display: swap`, subset |
| Dependency replacement | Medium | day.js for moment.js, lodash-es for lodash |

### Bundle Analysis Commands

```bash
# Webpack
npx webpack-bundle-analyzer stats.json

# Vite
npx vite-bundle-visualizer

# Next.js
ANALYZE=true next build
```

---

## Database Query Tuning

### Index Optimization

```sql
-- Find missing indexes (PostgreSQL)
SELECT schemaname, tablename, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_scan DESC;
```

### Index Rules

| Rule | Explanation |
|------|------------|
| Index WHERE, JOIN, ORDER BY columns | These are the columns the DB searches |
| Equality columns first in composite index | Most selective filtering first |
| Range columns last in composite index | Less selective, applied after equality |
| Remove unused indexes | They slow down writes |
| Use partial indexes for filtered queries | Smaller index, faster lookups |

### Query Plan Red Flags

| Red Flag in EXPLAIN ANALYZE | Meaning | Fix |
|----------------------------|---------|-----|
| **Seq Scan** on large table | Full table scan | Add index |
| **Nested Loop** with many rows | O(n*m) join | Add index or restructure query |
| **Sort** with high memory | Sorting in memory | Add index matching ORDER BY |
| Actual rows >> estimated rows | Stale statistics | Run ANALYZE |
| **Hash Join** with large build | Memory-intensive | Ensure join columns are indexed |

---

## Web Vitals Targets

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5-4s | > 4s |
| **INP** (Interaction to Next Paint) | < 200ms | 200-500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 |

### Web Vitals Optimization Table

| Metric | Optimization | Implementation |
|--------|-------------|---------------|
| LCP | Preload LCP resource | `<link rel="preload">` or `fetchpriority="high"` |
| LCP | Inline critical CSS | Extract above-fold CSS inline |
| LCP | Optimize TTFB | CDN, edge rendering, server caching |
| INP | Break long tasks | `requestIdleCallback`, `scheduler.yield()` |
| INP | Debounce input handlers | 100-300ms debounce on expensive handlers |
| INP | Web Workers | Move computation off main thread |
| CLS | Explicit dimensions | Set `width`/`height` on images and videos |
| CLS | Reserve space for dynamic content | Placeholder sizing for ads, embeds |
| CLS | Use transform animations | Avoid layout-triggering properties |

---

## Load Testing

### Test Types

| Type | Users | Duration | Purpose |
|------|-------|----------|---------|
| Smoke | 1-2 | 1 minute | Verify test works |
| Load | Expected traffic | 10-30 min | Normal performance |
| Stress | 2-3x expected | 10-30 min | Find breaking point |
| Soak | Normal load | 2-8 hours | Find memory leaks |

### Key Metrics

- Response time percentiles (p50, p95, p99) — not averages
- Error rate under load
- Throughput (requests per second)
- Resource utilization (CPU, memory, connections)

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Optimizing without measuring | You do not know what to fix | MEASURE first, always |
| Premature optimization | Wastes time on non-bottlenecks | Profile to find actual bottleneck |
| Memoizing everything | Adds complexity without proven benefit | Profile first, memoize second |
| Caching without invalidation strategy | Stale data causes bugs | Define invalidation before adding cache |
| Optimizing averages instead of percentiles | Averages hide tail latency | Track p95 and p99 |
| Multiple optimizations at once | Cannot attribute improvement | One change at a time |
| Keeping optimizations that do not measurably help | Dead code and complexity | Revert if no measurable improvement |
| Adding indexes without checking query patterns | Unused indexes slow writes | Check slow query log first |

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `senior-frontend` | Frontend performance uses bundle and Web Vitals optimization |
| `senior-backend` | Backend performance uses caching and query tuning |
| `testing-strategy` | Load tests are part of the testing pyramid |
| `code-review` | Review checks for performance regressions |
| `systematic-debugging` | Performance issues follow the same investigation methodology |
| `acceptance-testing` | Performance targets become acceptance criteria |

---

## Skill Type

**FLEXIBLE** — Adapt the depth of optimization to the project context. The MEASURE-IDENTIFY-OPTIMIZE-VERIFY cycle is mandatory for every optimization. Revert any change that does not produce measurable improvement.
