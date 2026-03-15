---
name: circuit-breaker
description: Use when running autonomous loops, repeated operations, or when detecting stagnation patterns - enforces rate limits, protects configuration files, manages recovery with cooldown periods, and prevents infinite loops during autonomous development
---

## Overview

The circuit-breaker skill is a safety mechanism that prevents infinite loops, resource exhaustion, and accidental destruction during autonomous development. It operates at the **loop level** (complementing `resilient-execution` which operates at the **task level**). Without circuit-breaker protection, autonomous loops can waste hours on stagnant problems, exhaust API limits, or accidentally destroy configuration files. This skill enforces hard boundaries that keep autonomous operations productive and safe.

**Announce at start:** "Circuit breaker is active — monitoring for stagnation, rate limits, and file protection."

---

## Phase 1: Circuit State Check

Before each loop iteration, check the current circuit state:

```
+-----------+     threshold     +-----------+     cooldown     +------------+
|  CLOSED   |----exceeded----->|   OPEN    |----elapsed------>| HALF-OPEN  |
|  (normal) |                  |  (halted) |                  |  (probe)   |
+-----------+                  +-----------+                  +-----+------+
     ^                                                              |
     |                          success                             |
     +--------------------------------------------------------------+
     |                          failure                             |
     |                    +-----------+                              |
     +--------------------+   OPEN    |<----------------------------+
                          +-----------+
```

| State | Meaning | Action |
|-------|---------|--------|
| **CLOSED** | Normal operation | Execute iteration, monitor all thresholds |
| **OPEN** | Halted due to threshold breach | Report status, wait for cooldown, or escalate |
| **HALF-OPEN** | Probing after cooldown | Allow ONE iteration. If success: close. If failure: re-open. |

> **STOP: Check circuit state BEFORE executing any loop iteration. Do NOT execute if circuit is OPEN.**

---

## Phase 2: Stagnation Detection

Monitor these thresholds continuously during autonomous operation:

| Condition | Threshold | Detection Method | Action |
|-----------|-----------|-----------------|--------|
| No progress | 3 consecutive loops with zero meaningful changes | Track files modified + tasks completed per loop | OPEN circuit |
| Identical errors | 5 consecutive loops producing the same error | Compare error messages across iterations | OPEN circuit |
| Output decline | 70% decline in output volume across iterations | Compare output line count across last 3 iterations | OPEN circuit |
| Permission denials | 3 consecutive tool permission failures | Track permission errors | OPEN circuit |
| Test fix loop | >80% of effort spent on test fixes only | Track work type per iteration | OPEN circuit, investigate root cause |
| Circular approach | Same 2-3 approaches alternating without resolution | Track approach history | OPEN circuit |

### Stagnation Scoring

Each iteration, compute a progress score:

| Indicator | Score |
|-----------|-------|
| New test passing that was previously failing | +3 |
| Task marked complete | +5 |
| File modified with meaningful changes | +1 |
| Build/lint error resolved | +2 |
| Same error as previous iteration | -2 |
| No files modified | -3 |
| Reverted previous changes | -1 |

**Threshold:** If cumulative score across 3 iterations is negative, OPEN the circuit.

> **STOP: If any threshold is breached, OPEN the circuit immediately. Do NOT attempt "one more try."**

---

## Phase 3: Recovery Protocol

When the circuit opens, follow this recovery sequence:

### Cooldown Period
- **Default:** 30 minutes before retry
- **Purpose:** Prevents rapid cycling through the same failing state
- **After cooldown:** Circuit enters HALF-OPEN state

### HALF-OPEN Behavior
1. Allow exactly ONE iteration to execute
2. If successful (positive progress score): Close circuit, resume normal operation
3. If failed (same stagnation pattern): Re-open circuit, double the cooldown timer

### Recovery Strategy Decision Table

| Stagnation Type | Strategy 1 | Strategy 2 | Strategy 3 | Strategy 4 |
|----------------|-----------|-----------|-----------|-----------|
| No progress (stuck on same task) | Regenerate plan with fresh analysis | Break stuck task into 3+ subtasks | Skip to next task, return later | Escalate to user |
| Identical errors (same error repeating) | Change approach entirely | Check if error is environmental | Search for known issue/workaround | Escalate with error log |
| Test fix loop (tests keep breaking) | Review test assumptions | Check if implementation approach is flawed | Simplify implementation scope | Escalate with test analysis |
| Circular approach (alternating same fixes) | Step back and re-analyze root cause | Try approach NOT yet attempted | Reduce scope to minimal working version | Escalate with approach history |

> **STOP: After recovery, monitor the next 3 iterations closely. If stagnation recurs, escalate immediately.**

---

## Phase 4: Rate Limiting

Track and enforce API usage limits:

| Parameter | Default | Purpose |
|-----------|---------|---------|
| MAX_CALLS_PER_HOUR | 100 | Prevents API overuse |
| Reset window | Hourly (rolling) | Automatic counter reset |
| Countdown display | Active | Shows remaining calls before limit |

### Rate Limit Behavior
1. Track API calls per rolling hour
2. At 80% of limit: display warning, prioritize remaining calls
3. At 100% of limit: pause execution, display countdown to reset
4. Never exceed limit — wait for reset window

### Three-Layer Timeout Detection

For long-running operations (especially API calls with extended limits):

| Layer | Detection | Fallback |
|-------|-----------|----------|
| 1. Timeout guard | Exit code 124 or timeout signal | Capture partial output, log what completed |
| 2. JSON validation | Parse response structure | Attempt text extraction from raw response |
| 3. Text fallback | Raw output capture | Log everything, report for human review |

---

## Phase 5: File Protection

<HARD-GATE>
Configuration files must NEVER be deleted during autonomous operations. This is non-negotiable.
</HARD-GATE>

### Protected Paths

| Path | Type | Why Protected |
|------|------|--------------|
| `.ralph/` | Directory | Loop state and configuration |
| `.ralphrc` | File | Ralph configuration |
| `IMPLEMENTATION_PLAN.md` | File | Current plan — source of truth for loop |
| `AGENTS.md` | File | Agent definitions |
| `specs/` | Directory | Specifications — source of truth for features |
| `.claude/` | Directory | Claude Code configuration |
| `CLAUDE.md` | File | Agent operating manual |
| `memory/` | Directory | Persisted learnings across sessions |

### Protection Mechanisms

| Mechanism | How It Works | When It Triggers |
|-----------|-------------|-----------------|
| Allowlist enforcement | Only permitted tools can modify protected files | Before any file write to protected path |
| Integrity validation | Check protected files exist after each iteration | End of every loop iteration |
| Pre-operation checks | Verify protected files before destructive operations | Before `rm`, `git clean`, `git checkout .` |
| Restricted commands | Block `git clean`, `git rm` on protected paths, `rm -rf` on config dirs | When command targets protected path |

### Pre-Destructive Operation Checklist

Before any `rm`, `git clean`, or `git checkout .`:
1. List all files that will be affected
2. Check each against the protected paths list
3. If ANY protected file would be affected: ABORT and report
4. If safe: proceed with caution
5. After operation: verify all protected files still exist

> **STOP: If a protected file is missing after any operation, halt immediately and restore it.**

---

## Phase 6: Monitoring and Metrics

Track these metrics across loop iterations:

| Metric | Purpose | Alert Threshold |
|--------|---------|----------------|
| Loop count | Total iterations executed | >20 for a single task |
| Tasks completed | Progress measurement | 0 for 3+ iterations |
| Files modified | Change velocity | 0 for 3+ iterations |
| Test pass rate | Quality trend | Declining for 3+ iterations |
| Error frequency | Stagnation early warning | Increasing for 3+ iterations |
| Output volume | Productivity trend | 70% decline |
| API calls remaining | Rate limit proximity | <20% remaining |
| Progress score | Overall health | Negative for 3 iterations |

### Per-Iteration Status Log

```markdown
## Iteration [N] — [timestamp]
- Circuit state: CLOSED / HALF-OPEN
- Tasks completed: [N]
- Files modified: [list]
- Tests: [X passed, Y failed, Z skipped]
- Errors encountered: [list]
- Progress score: [+/- N]
- API calls remaining: [N]
- Stagnation risk: LOW / MEDIUM / HIGH
```

---

## Anti-Patterns / Common Mistakes

| What NOT to Do | Why It Fails | What to Do Instead |
|----------------|-------------|-------------------|
| Ignore stagnation signals | Wastes hours on unsolvable problems | Open circuit at threshold breach |
| Manually override open circuit | Bypasses safety mechanism | Follow recovery protocol properly |
| Skip file protection checks | Config deletion derails entire project | Always verify protected files after operations |
| Set cooldown to zero | Rapid cycling through same failure | Respect 30-minute minimum cooldown |
| Count test-fix-only iterations as progress | Masks the real problem (flawed approach) | Flag >80% test-fix effort as stagnation |
| Delete and recreate protected files | Loses configuration state | Never delete protected files, only update |
| Ignore rate limit warnings | Hits hard limit mid-operation | Prioritize when at 80% of limit |
| Run destructive commands without pre-checks | May delete protected files | Always check affected files first |

---

## Anti-Rationalization Guards

| Thought | Reality |
|---------|---------|
| "One more try will fix it" | That is what you said 3 iterations ago. Open the circuit. |
| "The error is almost fixed" | "Almost" for 5 iterations means the approach is wrong. |
| "I cannot stop now, I am so close" | Sunk cost fallacy. Open circuit, reassess. |
| "The cooldown is too long" | The cooldown prevents wasting more time on the same failure. |
| "These config files are not important" | They are protected for a reason. Do not delete them. |
| "The rate limit will not be hit" | Track it. Do not guess. |
| "This is a different error" | Check if it is truly different or the same root cause manifesting differently. |

> **Do NOT override an open circuit. Follow the recovery protocol.**

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `resilient-execution` | Task-level retries (3 attempts). Circuit-breaker activates AFTER resilient-execution exhausts retries within individual tasks. |
| `autonomous-loop` | Circuit-breaker monitors the loop. Opens circuit when loop-level stagnation detected. |
| `ralph-status` | Status block provides metrics for stagnation detection. |
| `verification-before-completion` | Circuit-breaker ensures verification passes before closing a loop. |
| `self-learning` | Stagnation patterns are persisted to memory for future avoidance. |
| `auto-improvement` | Circuit-breaker events feed into improvement metrics. |

### Scope Clarification

| Scope | Skill | Behavior |
|-------|-------|----------|
| Task-level | `resilient-execution` | Try 3 approaches for a single failing task |
| Loop-level | `circuit-breaker` | Halt the entire loop when patterns indicate systemic failure |

The circuit breaker activates AFTER resilient-execution has exhausted its retries within individual tasks. If tasks keep failing despite 3 retries each, the circuit breaker detects the pattern.

---

## Process Summary

1. **Before each loop iteration:** Check circuit state (CLOSED/HALF-OPEN/OPEN)
2. **If OPEN:** Report status, wait for cooldown, or escalate
3. **If HALF-OPEN:** Allow one probe iteration, evaluate result
4. **If CLOSED:** Execute normally, monitor all thresholds
5. **After each iteration:** Update metrics, compute progress score, evaluate thresholds
6. **If threshold exceeded:** Open circuit, report reason, begin cooldown
7. **After cooldown:** Enter HALF-OPEN, allow one probe
8. **After probe:** Close if successful, re-open with doubled cooldown if failed

---

## Skill Type

**RIGID** — Thresholds and protection rules must be followed exactly. Do not relax circuit breaker conditions. Do not override open circuits. Do not skip file protection checks. Do not ignore stagnation signals.
