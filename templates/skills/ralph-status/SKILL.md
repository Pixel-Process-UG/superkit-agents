---
name: ralph-status
description: Use when reporting progress in autonomous loop iterations — produces structured RALPH_STATUS blocks with exit signal protocol for machine-parseable progress tracking
---

# Ralph Status Reporting

## Overview

The Ralph status block is a structured, machine-parseable progress report included at the end of every autonomous loop iteration. It enables automated monitoring, exit detection, and progress tracking.

## Status Block Format

**[HARD-GATE]** Every loop iteration MUST end with this exact format:

```
---RALPH_STATUS---
STATUS: [IN_PROGRESS | COMPLETE | BLOCKED]
TASKS_COMPLETED_THIS_LOOP: [number]
FILES_MODIFIED: [number]
TESTS_STATUS: [PASSING | FAILING | NOT_RUN]
WORK_TYPE: [IMPLEMENTATION | TESTING | DOCUMENTATION | REFACTORING]
EXIT_SIGNAL: [false | true]
RECOMMENDATION: [one-line summary of next action or completion state]
---END_RALPH_STATUS---
```

## Field Definitions

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `STATUS` | enum | `IN_PROGRESS`, `COMPLETE`, `BLOCKED` | Current iteration outcome |
| `TASKS_COMPLETED_THIS_LOOP` | integer | 0+ | Number of tasks finished in this iteration |
| `FILES_MODIFIED` | integer | 0+ | Number of files changed (created, edited, deleted) |
| `TESTS_STATUS` | enum | `PASSING`, `FAILING`, `NOT_RUN` | State of test suite after this iteration |
| `WORK_TYPE` | enum | `IMPLEMENTATION`, `TESTING`, `DOCUMENTATION`, `REFACTORING` | Primary activity category |
| `EXIT_SIGNAL` | boolean | `false`, `true` | Whether all work is complete |
| `RECOMMENDATION` | string | Free text (one line) | Next action or final summary |

## STATUS Values

### IN_PROGRESS
Work is ongoing. Tasks remain in IMPLEMENTATION_PLAN.md. The loop should continue.

### COMPLETE
All planned work is finished. This should accompany `EXIT_SIGNAL: true`.

### BLOCKED
Cannot proceed without external input. Describe the blocker in RECOMMENDATION.

**When BLOCKED:**
1. Clearly describe what is blocking progress
2. Set `EXIT_SIGNAL: false` (blocked is not complete)
3. The circuit breaker may activate if blocked state persists

## EXIT_SIGNAL Protocol

**[HARD-GATE:EXIT]** EXIT_SIGNAL may only be `true` when ALL conditions are met:

| Condition | Verification |
|-----------|-------------|
| No remaining tasks | `IMPLEMENTATION_PLAN.md` has no unchecked items |
| All tests pass | `TESTS_STATUS: PASSING` |
| No errors in latest iteration | Clean execution, no unresolved exceptions |
| No meaningful work remains | Code review complete, docs updated, no TODOs |

### Dual-Condition Exit Gate

The loop orchestrator uses TWO independent signals to confirm exit:

1. **Heuristic detection:** Completion language ("all done", "everything passes", "no remaining work") appears >= 2 times in recent output
2. **Explicit declaration:** `EXIT_SIGNAL: true` in the status block

Both must be true simultaneously. This prevents:
- False positives from casual completion language
- Premature exits when Claude says "done" while still working productively

## Examples

### Typical IN_PROGRESS Status
```
---RALPH_STATUS---
STATUS: IN_PROGRESS
TASKS_COMPLETED_THIS_LOOP: 1
FILES_MODIFIED: 3
TESTS_STATUS: PASSING
WORK_TYPE: IMPLEMENTATION
EXIT_SIGNAL: false
RECOMMENDATION: Next: implement user authentication middleware
---END_RALPH_STATUS---
```

### Completion Status
```
---RALPH_STATUS---
STATUS: COMPLETE
TASKS_COMPLETED_THIS_LOOP: 1
FILES_MODIFIED: 2
TESTS_STATUS: PASSING
WORK_TYPE: DOCUMENTATION
EXIT_SIGNAL: true
RECOMMENDATION: All tasks complete, tests passing, documentation updated
---END_RALPH_STATUS---
```

### Blocked Status
```
---RALPH_STATUS---
STATUS: BLOCKED
TASKS_COMPLETED_THIS_LOOP: 0
FILES_MODIFIED: 0
TESTS_STATUS: PASSING
WORK_TYPE: IMPLEMENTATION
EXIT_SIGNAL: false
RECOMMENDATION: Blocked: need database credentials for integration test setup
---END_RALPH_STATUS---
```

### Test Failure Status
```
---RALPH_STATUS---
STATUS: IN_PROGRESS
TASKS_COMPLETED_THIS_LOOP: 1
FILES_MODIFIED: 4
TESTS_STATUS: FAILING
WORK_TYPE: TESTING
EXIT_SIGNAL: false
RECOMMENDATION: 3 tests failing in auth module — investigating root cause
---END_RALPH_STATUS---
```

## Integration Points

| Consumer | Usage |
|----------|-------|
| `autonomous-loop` | Reads status to decide continue/exit |
| `circuit-breaker` | Monitors for stagnation patterns (repeated BLOCKED, 0 tasks) |
| Monitoring dashboard | Displays real-time progress |
| Log aggregation | Historical performance analysis |

## Process

1. Complete the iteration's work (implementation, testing, docs, or refactoring)
2. Count tasks completed and files modified
3. Run the test suite and record result
4. Evaluate EXIT_SIGNAL conditions
5. Write the RALPH_STATUS block
6. Include a clear, actionable RECOMMENDATION

## Skill Type

**Rigid** — The status block format must be followed exactly. Machine parsing depends on consistent structure.
