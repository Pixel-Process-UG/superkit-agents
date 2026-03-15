---
name: auto-improvement
description: Use when the system needs to track its own effectiveness, learn from errors, adapt workflows, and continuously improve performance - activates automatically every session to collect metrics, classify errors, recognize patterns, and implement evidence-based workflow improvements
---

## Overview

The auto-improvement skill implements a self-improving feedback loop that tracks effectiveness metrics, learns from errors, identifies recurring failure patterns, and adapts workflows to prevent repeated mistakes. It enables the agent to become measurably better over time through structured self-assessment rather than ad-hoc adjustments. Without this skill, the same mistakes repeat across sessions — with it, every error becomes a permanent improvement.

**This skill is ALWAYS active.** It runs automatically on every session and cannot be disabled.

---

## Phase 1: Metric Collection

At the start of every task, instrument key decision points:

1. Record task start time and initial estimate
2. Define expected outcome and success criteria
3. Track each decision point (approach chosen, alternatives considered)
4. Log revision count (how many times the output was revised)
5. Track user corrections as improvement signals

### Core Metrics

| Metric | Formula | Target | Measurement Period |
|--------|---------|--------|--------------------|
| First-attempt success rate | Tasks without revision / Total tasks | >80% | Per session |
| Average revision count | Total revisions / Total tasks | <1.5 | Per session |
| Error recurrence rate | Repeated errors / Total errors | <10% | Rolling 10 sessions |
| Time-to-completion accuracy | Actual time / Estimated time | 0.8-1.2 | Per task |
| User correction rate | User corrections / Total outputs | <5% | Per session |

### Tracking Template

```markdown
## Session Metrics -- [Date]

### Tasks
| Task | Estimated | Actual | Revisions | Success | Error Type |
|------|-----------|--------|-----------|---------|------------|
| ...  | 30m       | 45m    | 1         | Partial | Execution  |

### Summary
- Tasks completed: X
- First-attempt success: X/Y (Z%)
- Total revisions: N
- Errors by category: Comprehension(n), Execution(n), Process(n)
- Improvement actions taken: [list]
```

> **STOP: Complete metric collection setup before proceeding to error analysis. Do NOT skip instrumentation.**

---

## Phase 2: Error Analysis

When an error occurs, classify it immediately using the taxonomy:

### Error Taxonomy

| Category | Subcategory | Example | Typical Root Cause |
|----------|-------------|---------|-------------------|
| **Comprehension** | Misread requirement | Built feature X when Y was asked | Insufficient clarification |
| **Comprehension** | Wrong assumption | Assumed REST when GraphQL was used | Missing context discovery |
| **Execution** | Syntax error | Invalid TypeScript type annotation | Unfamiliar API surface |
| **Execution** | Logic error | Off-by-one in pagination | Insufficient test coverage |
| **Execution** | Integration error | Wrong API endpoint or payload format | Missing documentation check |
| **Process** | Skipped step | Forgot to run tests before commit | Process not followed |
| **Process** | Wrong order | Wrote code before understanding spec | Eagerness over methodology |
| **Judgment** | Over-engineering | Built abstraction for single use case | Premature optimization |
| **Judgment** | Under-engineering | Skipped error handling for "simple" task | Underestimated complexity |
| **Knowledge** | Unknown API | Used deprecated method | Outdated training data |
| **Knowledge** | Framework gap | Wrong Next.js pattern for app router | Need to check docs first |

### Severity Levels

| Level | Definition | Response Required |
|-------|-----------|------------------|
| **Critical** | Task must be completely redone | Immediate root cause analysis + add guardrail |
| **Major** | Significant rework needed (>50% of task) | Root cause analysis + add checklist item |
| **Minor** | Small fix needed (<30 minutes) | Log pattern, review if recurring |
| **Cosmetic** | Style or preference issue | Note for future, no process change |

### Error Log Format

```markdown
## Error Log Entry

**ID:** ERR-[YYYY]-[MMDD]-[NNN]
**Date:** [date]
**Task:** [what was being done]
**Severity:** [Critical / Major / Minor / Cosmetic]
**Category:** [Category > Subcategory]

### What Happened
[Description of the error and its observable impact]

### Root Cause
[Why this error occurred — the actual underlying reason]

### What Was Tried
1. [First attempt to resolve]
2. [Second attempt if applicable]
3. [Final resolution]

### Resolution
[What ultimately fixed the problem]

### Time Lost
[Estimated time wasted due to this error]

### Prevention
- **New checklist item:** [if applicable]
- **Memory update:** [what was persisted]
- **Guardrail added:** [if applicable]

### Recurrence Check
- [ ] Similar error seen before? [Yes/No — reference previous ID]
- [ ] Guardrail added? [Yes/No]
```

> **STOP: Every error MUST be classified and logged before proceeding to fix it. Do NOT skip the log entry.**

---

## Phase 3: Pattern Recognition

After accumulating 3+ errors, analyze for patterns:

1. Group related errors into failure categories
2. Identify environmental triggers (specific file types, frameworks, patterns)
3. Detect workflow bottlenecks causing consistent slowdowns
4. Recognize successful patterns worth reinforcing
5. Map anti-patterns to their corrective actions

### Pattern Detection Decision Table

| Signal | Pattern | Action |
|--------|---------|--------|
| Same error >2 times | Recurring failure | Create guardrail (mandatory) |
| Same category >3 times | Systemic weakness | Add pre-flight checklist for that category |
| Time estimate off by >50% consistently | Estimation blind spot | Adjust estimation heuristics |
| User corrections in same area | Knowledge gap | Deep-dive learning for that domain |
| Success rate >90% in specific area | Strength pattern | Document and reinforce |
| Errors cluster around specific framework | Framework knowledge gap | Run context discovery for that framework |

### Positive Pattern Reinforcement

When a pattern consistently leads to success, document it:

```markdown
## Positive Pattern: [Name]
OBSERVATION: [What was done and why it worked]
EVIDENCE: [Sessions/tasks where this pattern succeeded, with success rate]
REINFORCEMENT: [How to ensure this pattern continues to be applied]
```

> **STOP: Pattern recognition must be evidence-based. Do NOT create patterns from single occurrences.**

---

## Phase 4: Adaptation

Generate and implement improvements based on identified patterns:

### Pre-Flight Checklists

Create checklists that run before high-risk operations:

```markdown
## Pre-Flight: Before Writing [Framework] Code
- [ ] Identify the framework and version (check package.json / composer.json)
- [ ] Identify the routing pattern (pages/ vs app/, file-based vs code-based)
- [ ] Check for existing patterns in the codebase (find similar files)
- [ ] Verify the API surface in documentation (do not assume from memory)
- [ ] Check for project-specific conventions (linter config, type config)
```

### Guardrail Rules

```markdown
## Guardrail: [Operation Type]
BEFORE [specific operation]:
1. [Check 1]
2. [Check 2]
3. [Check 3]
4. [Check 4]

TRIGGERED BY: [keywords or conditions that activate this guardrail]
ADDED BECAUSE: [Error ID that caused this guardrail to be created]
EFFECTIVENESS: [Track whether this guardrail has prevented errors]
```

### Adaptation Decision Table

| Error Pattern | Adaptation Type | Example |
|--------------|----------------|---------|
| Recurring comprehension errors | Add clarification step to workflow | "Before implementing, restate the requirement in your own words" |
| Recurring execution errors | Add pre-flight checklist | "Before writing framework code, check version and router type" |
| Recurring process errors | Add hard checkpoint | "STOP marker before commit: did you run tests?" |
| Recurring judgment errors | Add decision criteria table | "When to abstract vs. inline: frequency >3, complexity >medium" |
| Recurring knowledge errors | Add context discovery step | "Before using API, check current docs, not memory" |

> **STOP: Every adaptation must be validated against historical data before being persisted.**

---

## Phase 5: Feedback Loop and Validation

Measure whether improvements actually work:

1. Compare current error rates against baseline (pre-improvement)
2. Track each guardrail's prevention count
3. Archive improvements that demonstrably reduce errors
4. Revert improvements that do not reduce errors or add overhead
5. Share learnings across sessions via memory files

### Retrospective Template

```markdown
## Retrospective -- [Period]

### What Went Well
- [Pattern/approach that consistently succeeded]
- [New technique that improved outcomes]

### What Went Poorly
- [Recurring error pattern with frequency]
- [Process gap that caused rework]

### Error Trends
| Category | This Period | Last Period | Trend |
|----------|------------ |-------------|-------|
| Comprehension | 3 | 5 | Improving |
| Execution | 7 | 4 | Worsening -- investigate |
| Process | 1 | 3 | Improving |
| Knowledge | 4 | 4 | Stable |

### Root Cause Analysis (Top 3 Errors)
1. **[Error pattern]** -- Root cause: [analysis] -- Fix: [action]
2. **[Error pattern]** -- Root cause: [analysis] -- Fix: [action]
3. **[Error pattern]** -- Root cause: [analysis] -- Fix: [action]

### Improvement Actions
| Action | Priority | Status | Expected Impact | Actual Impact |
|--------|----------|--------|-----------------|---------------|
| Add pre-flight check for X | High | Done | -30% execution errors | [measured] |
| Update memory with Y pattern | Medium | Done | -20% knowledge errors | [measured] |
| Create guardrail for Z | High | In Progress | Prevent critical error class | [pending] |

### Metrics vs. Targets
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| First-attempt success | >80% | 75% | Below target |
| Revision count | <1.5 | 1.8 | Below target |
| Error recurrence | <10% | 8% | On target |
```

---

## Memory File Integration

### What to Persist

| File | Update When | Content |
|------|------------|---------|
| `memory/learned-patterns.md` | New pattern discovered or error pattern identified | Coding conventions, framework patterns, anti-patterns |
| `memory/user-preferences.md` | User corrects style, format, or approach | Communication preferences, code style, tool choices |
| `memory/decisions-log.md` | Significant architectural or approach decision | Decision, rationale, alternatives considered |
| `memory/project-context.md` | New project context discovered | Tech stack, architecture, dependencies |

### Update Protocol

1. Identify the learning from the error or success
2. Check if it conflicts with existing memory entries
3. If conflict: update the existing entry with new information and date
4. If new: add entry with context, evidence, and date
5. Remove entries that are no longer valid (tech changed, project evolved)

> **Do NOT persist gut feelings as patterns. Evidence required: 2+ occurrences minimum.**

---

## Continuous Improvement Cycle

```
Execute Tasks -> Collect Metrics -> Analyze Errors -> Identify Patterns
      ^                                                       |
      |                                                       v
      +-- Persist to Memory <-- Validate Impact <-- Implement Improvements
                                      |
                                      +-- Did not work? -> Revert, try different approach
```

---

## Anti-Patterns / Common Mistakes

| What NOT to Do | Why It Fails | What to Do Instead |
|----------------|-------------|-------------------|
| Same mistake 3 times without guardrail | Errors keep recurring with no prevention | Create guardrail after 2nd occurrence |
| Track metrics without acting on them | Measurement theater — effort without outcome | Every metric must have an action threshold |
| Over-correct from single error | One bad experience does not justify avoiding a tool forever | Require 2+ occurrences before creating a pattern |
| Treat all errors equally | Wastes effort on cosmetic issues | Prioritize by frequency x impact |
| Update memory without evidence | Poisons future sessions with wrong patterns | Require 2+ examples before persisting |
| Create so many checklists they become overhead | Checklist fatigue leads to skipping all of them | Max 5 items per checklist, retire unused ones |
| Blame external factors only | Misses internal process improvements | Always examine what YOU could have done differently |
| Skip validation of improvements | No way to know if improvements actually work | Compare error rates before and after |
| Persist outdated patterns | Stale advice causes new errors | Review and prune memory periodically |
| Never do retrospectives | Lose the big picture, focus only on individual errors | Schedule retrospective after every 10 tasks |

---

## Anti-Rationalization Guards

| Thought | Reality |
|---------|---------|
| "This error is a one-off" | Log it anyway. If it happens again, you have the data. |
| "Metrics collection slows me down" | Not collecting metrics means repeating the same mistakes. |
| "The checklist is overkill for this task" | The checklist exists because a similar task failed before. Use it. |
| "I will remember this lesson" | You will not. Sessions are independent. Persist to memory. |
| "The error was not my fault" | External or internal, log the pattern. Prevention is your job. |
| "Retrospectives are a waste of time" | Without retrospectives, you cannot see trends. Do them. |
| "My success rate is good enough" | Good enough stagnates. The target is continuous improvement. |

> **Do NOT skip error logging. Do NOT skip metric collection. These are mandatory.**

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `self-learning` | Provides project context that prevents knowledge errors |
| `resilient-execution` | Failed retries feed into error analysis |
| `circuit-breaker` | Stagnation events are major error signals |
| `verification-before-completion` | Verification failures trigger error logging |
| `planning` | Improvement actions inform future plan quality |
| `code-review` | Review findings feed into pattern recognition |

---

## Concrete Examples

### Guardrail Created from Error Pattern
```
Error: ERR-2026-0212-003 — Dropped production table during migration
Error: ERR-2026-0301-007 — Applied migration without rollback plan

Pattern: Database operations without safety checks (2 occurrences)

Guardrail Created:
## Guardrail: Database Operations
BEFORE any database migration or schema change:
1. Check if there is an existing migration framework
2. Verify the current schema state
3. Create a rollback plan
4. Test migration on a copy first

TRIGGERED BY: any task involving database, schema, migration, model
ADDED BECAUSE: ERR-2026-0212-003, ERR-2026-0301-007
EFFECTIVENESS: 0 errors in 5 subsequent database tasks
```

### Positive Pattern Documentation
```
## Positive Pattern: Context Discovery First
OBSERVATION: Tasks where project context was gathered first had
a 92% first-attempt success rate vs. 64% without.
EVIDENCE: Sessions 2026-02-01 through 2026-03-15 (47 tasks)
REINFORCEMENT: Always run context discovery before implementation.
Minimum: check package.json, read existing code in same domain,
identify conventions.
```

---

## Skill Type

**RIGID** — Error tracking, classification, and the improvement cycle must be followed consistently. Every recurring error (2+ occurrences) must result in a concrete preventive action. Memory files must be updated with evidence-based patterns only. Metric collection and error logging are mandatory on every session. Do not skip retrospectives.
