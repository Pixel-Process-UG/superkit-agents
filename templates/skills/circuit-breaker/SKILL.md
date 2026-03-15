---
name: circuit-breaker
description: Use when running autonomous loops or repeated operations — detects stagnation, enforces rate limits, protects configuration files, and manages recovery with cooldown periods
---

# Circuit Breaker

## Overview

The circuit breaker is a safety mechanism that prevents infinite loops, resource exhaustion, and accidental destruction during autonomous development. It operates at the **loop level** (complementing `resilient-execution` which operates at the **task level**).

## Circuit Breaker States

```
┌──────────┐     threshold     ┌──────────┐     cooldown     ┌───────────┐
│  CLOSED  │────exceeded──────▶│   OPEN   │────elapsed──────▶│ HALF-OPEN │
│ (normal) │                   │ (halted) │                   │  (probe)  │
└──────────┘                   └──────────┘                   └─────┬─────┘
     ▲                                                              │
     │                          success                             │
     └──────────────────────────────────────────────────────────────┘
     │                          failure                             │
     │                    ┌──────────┐                               │
     └────────────────────│   OPEN   │◀─────────────────────────────┘
                          └──────────┘
```

## Stagnation Detection Thresholds

| Condition | Threshold | Action |
|-----------|-----------|--------|
| No progress | 3 consecutive loops with zero meaningful changes | OPEN circuit |
| Identical errors | 5 consecutive loops producing the same error | OPEN circuit |
| Output decline | 70% decline in output volume across iterations | OPEN circuit |
| Permission denials | 3 consecutive tool permission failures | OPEN circuit |
| Test loop percentage | >80% of effort spent on test fixes only | OPEN circuit (investigate root cause) |

## Recovery Protocol

### Cooldown Period
- **Default:** 30 minutes before retry
- **Purpose:** Prevents rapid cycling through the same failing state
- **After cooldown:** Circuit enters HALF-OPEN state

### HALF-OPEN Behavior
1. Allow exactly ONE iteration to execute
2. If successful (progress detected): Close circuit, resume normal operation
3. If failed (same stagnation pattern): Re-open circuit, reset cooldown timer

### Recovery Strategies (when circuit opens)

1. **Regenerate plan** — Run a fresh PLANNING iteration to reassess
2. **Change approach** — Try alternative implementation strategy
3. **Reduce scope** — Break the stuck task into smaller subtasks
4. **Escalate** — Report the blockage with full context for human review

## Rate Limiting

| Parameter | Default | Purpose |
|-----------|---------|---------|
| MAX_CALLS_PER_HOUR | 100 | Prevents API overuse |
| Reset window | Hourly | Automatic counter reset |
| Countdown display | Active | Shows remaining calls before limit |

### Rate Limit Behavior
- Track API calls per rolling hour
- When limit reached: pause execution, display countdown to reset
- Never exceed limit — wait for reset window

## Three-Layer Timeout Detection

For long-running operations (especially API calls with 5-hour limits):

| Layer | Detection | Fallback |
|-------|-----------|----------|
| 1. Timeout guard | Exit code 124 | Capture partial output |
| 2. JSON validation | Parse response structure | Attempt text extraction |
| 3. Text fallback | Raw output capture | Log and report for review |

## File Protection

**[HARD-GATE]** Configuration files must NEVER be deleted during autonomous operations.

### Protected Files
- `.ralph/` directory and all contents
- `.ralphrc` configuration file
- `IMPLEMENTATION_PLAN.md`
- `AGENTS.md`
- `specs/` directory
- `.claude/` directory and all contents
- `CLAUDE.md`

### Protection Mechanisms
1. **Allowlist enforcement** — Only permitted tools can modify files
2. **Integrity validation** — Check protected files exist after each iteration
3. **Pre-operation checks** — Verify protected files before destructive operations (rm, git clean, etc.)
4. **Restricted commands** — Block `git clean`, `git rm` on protected paths, `rm -rf` on config dirs

## Monitoring Metrics

Track these across loop iterations:

| Metric | Purpose |
|--------|---------|
| Loop count | Total iterations executed |
| Tasks completed | Progress measurement |
| Files modified | Change velocity |
| Test pass rate | Quality trend |
| Error frequency | Stagnation early warning |
| Output volume | Productivity trend |
| API calls remaining | Rate limit proximity |

## Integration with `resilient-execution`

| Scope | Skill | Behavior |
|-------|-------|----------|
| Task-level | `resilient-execution` | Try 3 approaches for a single failing task |
| Loop-level | `circuit-breaker` | Halt the entire loop when patterns indicate systemic failure |

The circuit breaker activates AFTER resilient-execution has exhausted its retries within individual tasks. If tasks keep failing despite 3 retries each, the circuit breaker detects the pattern.

## Process

1. **Before each loop iteration:** Check circuit state (CLOSED/HALF-OPEN/OPEN)
2. **If OPEN:** Report status, wait for cooldown, or escalate
3. **If HALF-OPEN:** Allow one probe iteration, evaluate result
4. **If CLOSED:** Execute normally, monitor all thresholds
5. **After each iteration:** Update metrics, evaluate thresholds
6. **If threshold exceeded:** Open circuit, report reason, begin cooldown

## Skill Type

**Rigid** — Thresholds and protection rules must be followed exactly. Do not relax circuit breaker conditions.
