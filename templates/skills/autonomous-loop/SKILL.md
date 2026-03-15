---
name: autonomous-loop
description: Use when running Ralph-style iterative autonomous development — orchestrates PLANNING → BUILDING → STATUS cycles with deterministic context loading, subagent delegation, and dual-condition exit gates
---

# Autonomous Loop

## Overview

The autonomous loop implements Ralph's iterative development methodology. Each iteration loads identical context (PROMPT + AGENTS files), executes one focused task, reports structured status, and persists state to disk for the next iteration. The loop continues until the dual-condition exit gate is satisfied.

**Core Innovation:** Deterministic conditions allow Claude to autonomously plan, build, and iterate toward quality without human intervention in the loop.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 AUTONOMOUS LOOP                  │
│                                                  │
│  ┌──────────┐    ┌──────────┐    ┌───────────┐  │
│  │ PLANNING │───▶│ BUILDING │───▶│  STATUS   │  │
│  │   MODE   │    │   MODE   │    │  CHECK    │  │
│  └──────────┘    └──────────┘    └─────┬─────┘  │
│       ▲                                │        │
│       │            ┌───────────┐       │        │
│       └────────────│ EXIT GATE │◀──────┘        │
│                    │  (dual)   │                 │
│                    └─────┬─────┘                 │
│                          │                       │
│                    PASS: EXIT                    │
│                    FAIL: LOOP                    │
└─────────────────────────────────────────────────┘
```

## Process

### Phase 1: PLANNING MODE (Gap Analysis)

**[HARD-GATE]** Planning mode produces NO implementation code.

1. **Knowledge Gathering** — Deploy up to 250 parallel Sonnet subagents to study specs, existing implementation plans, and utility libraries
2. **Code Analysis** — Deploy up to 500 parallel subagents to study `src/*` against `specs/*`, identifying gaps between specification and implementation
3. **Synthesis** — Deploy Opus subagent to synthesize findings and prioritize incomplete work
4. **Plan Refresh** — Update `IMPLEMENTATION_PLAN.md` as organized, prioritized bullet list

**Critical Constraints:**
- Verify ALL assumptions through code search — never assume something is absent
- Treat `src/lib` as authoritative standard library — consolidate, don't duplicate
- Output is a prioritized task list with missing specs identified

### Phase 2: BUILDING MODE (Implementation)

**"ONE task per loop"** — Each iteration selects and completes exactly one task.

1. **Study** — Read specs and current IMPLEMENTATION_PLAN.md
2. **Select** — Choose the most important remaining task
3. **Search** — Find existing code patterns (don't assume implementations are missing)
4. **Implement** — Write complete, production-quality code (no placeholders, no stubs)
5. **Test** — Run tests immediately after implementation
6. **Update** — Refresh IMPLEMENTATION_PLAN.md with findings and progress
7. **Commit** — Descriptive conventional commit message with rationale

**Subagent Rules:**
- Up to 500 parallel Sonnet subagents for reading and searching
- Only 1 Sonnet subagent for building and testing
- Main context stays at 40-60% utilization (the "smart zone")

### Phase 3: STATUS CHECK

After each BUILD iteration, produce a RALPH_STATUS block (invoke `ralph-status` skill).

Evaluate exit conditions:
- **Continue** if tasks remain in IMPLEMENTATION_PLAN.md
- **Exit** only when dual-condition gate passes (see Exit Conditions below)

## Exit Conditions — Dual-Condition Gate

**[HARD-GATE:EXIT]** Both conditions must be true simultaneously:

| Condition | Threshold | Purpose |
|-----------|-----------|---------|
| Completion indicators | >= 2 recent occurrences | Heuristic detection of "done" language |
| Explicit EXIT_SIGNAL | `EXIT_SIGNAL: true` in status block | Intentional declaration |

**EXIT_SIGNAL may only be `true` when ALL of:**
- IMPLEMENTATION_PLAN.md has no remaining tasks
- All tests pass
- No errors in latest iteration
- No meaningful work remains

This prevents false positives where completion language appears while productive work continues.

## Context Efficiency

| Resource | Budget | Strategy |
|----------|--------|----------|
| Main context | 40-60% of window | Keep focused; delegate heavy lifting |
| Read subagents | Up to 500 parallel | Searching, file reading, pattern matching |
| Build subagents | 1 at a time | Implementation, test execution |
| Token format | Markdown over JSON | ~30% more efficient |

## Steering Mechanisms

### Upstream Steering (Shaping Inputs)
- First ~5,000 tokens allocated to detailed specs
- Load identical files each iteration (determinism)
- Use existing code patterns as generation guides

### Downstream Steering (Validation Gates)
- Tests reject invalid implementations
- Builds catch compilation errors
- Linters enforce style consistency
- Typecheckers verify contracts
- LLM-as-judge evaluates subjective criteria (invoke `llm-as-judge` skill)

## State Persistence

The only persistent state between iterations is the file system:

| File | Purpose | Managed By |
|------|---------|-----------|
| `IMPLEMENTATION_PLAN.md` | Task list and progress | Planning & Building modes |
| `specs/*.md` | Specification files | `spec-writing` skill |
| `AGENTS.md` | Operational notes and learnings | Building mode |
| Source code + tests | The actual implementation | Building mode |

**IMPLEMENTATION_PLAN.md is disposable** — it can be regenerated from specs at any time by running a planning iteration.

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `ralph-status` | Produces status blocks after each iteration |
| `circuit-breaker` | Monitors loop health, halts on stagnation |
| `spec-writing` | Creates specs consumed by planning mode |
| `acceptance-testing` | Validates behavioral outcomes |
| `resilient-execution` | Task-level retry (complementary to loop-level circuit breaker) |
| `task-management` | Tracks individual tasks within an iteration |

## Anti-Patterns

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| Multiple tasks per iteration | ONE task per loop — reduces context switching |
| Assuming code is missing | Always search first — code may exist elsewhere |
| Skipping tests after implementation | Run tests IMMEDIATELY — backpressure is essential |
| Modifying IMPLEMENTATION_PLAN.md during planning only | Update during BOTH planning and building |
| Keeping stale plans | Regenerate liberally — planning is cheap |
| Manual context management | Trust subagent delegation — main context stays focused |

## Skill Type

**Rigid** — Follow this process exactly. The determinism of the loop depends on consistent execution.
