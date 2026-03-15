---
name: task-management
description: "Use when breaking work into discrete steps, tracking progress through multi-step implementations, or managing implementation task lists. Triggers when an approved plan needs to be converted into tracked tasks, when progress reporting is needed during execution, or when checkpoint reviews are required between task batches."
---

# Task Management

## Overview

Task management converts approved plans into bite-sized, trackable tasks and orchestrates their execution with progress reporting and checkpoint reviews. Each task is a single action that takes 2-5 minutes. The skill provides structured progress tracking, regular checkpoints, and integration with code review to maintain quality throughout execution.

**Announce at start:** "I'm using the task-management skill to break this plan into tracked tasks."

## Trigger Conditions

- An approved plan document needs to be converted into executable tasks
- Multi-step implementation needs structured progress tracking
- Work needs checkpoint reviews at regular intervals
- `/execute` command used with a plan that needs task breakdown
- Transition from planning skill with an approved plan

---

## Phase 1: Plan Parsing

**Goal:** Extract all tasks from the approved plan with correct ordering and dependencies.

1. Read the approved plan document from start to finish
2. Extract every implementation step as a discrete task
3. Identify dependencies between tasks (what must complete first)
4. Order tasks by dependency — independent tasks first
5. Confirm task list with the user before beginning execution

### Task Granularity Rules

| Granularity | Example | Verdict |
|------------|---------|---------|
| Single action, 2-5 min | "Write the failing test for UserService.create" | Correct |
| Single action, 2-5 min | "Run the test to verify it fails" | Correct |
| Single action, 2-5 min | "Implement the minimal code to pass the test" | Correct |
| Multiple actions, 30+ min | "Implement the authentication system" | Too large — decompose |
| Trivial, < 1 min | "Add a blank line" | Too small — merge with adjacent task |

### Task Specification Template

```
Task N: [Clear, specific description]
Files: [Exact paths to create/modify/test]
Depends on: [Task numbers that must complete first, or "none"]
Verification: [Exact command to confirm completion]
```

**STOP — Do NOT proceed to Phase 2 until:**
- [ ] Every plan step has been converted to 2-5 minute tasks
- [ ] Dependencies are mapped (no circular dependencies)
- [ ] Every task has a verification command
- [ ] Task list is confirmed with user

---

## Phase 2: Task Execution

**Goal:** Execute tasks one at a time with verification after each.

### Per-Task Workflow

1. **Announce** — Report which task is starting: `[N/Total] Starting: <description>`
2. **Set status** — Mark task as `in_progress`
3. **Execute** — Perform the task (follow TDD if writing code)
4. **Verify** — Run the verification command
5. **Read output** — Confirm verification matches success criteria
6. **Report** — Show completion: `[N/Total] Completed: <description>`
7. **Set status** — Mark task as `completed`

### Execution Rules

| Rule | Rationale |
|------|-----------|
| One task at a time | Prevents context switching errors |
| Verify before marking complete | No false completions |
| Read verification output fully | Do not assume success from partial output |
| Follow TDD for code tasks | RED-GREEN-REFACTOR cycle |
| Do not skip ahead | Dependencies may not be satisfied |

### Task Status Flow

```
pending → in_progress → completed
                     → blocked (needs user input)
                     → failed (invoke resilient-execution)
```

### Status Decision Table

| Outcome | New Status | Action |
|---------|-----------|--------|
| Verification passes | `completed` | Proceed to next task |
| Verification fails, fixable | `in_progress` | Fix and re-verify |
| Verification fails, unclear cause | `failed` | Invoke `resilient-execution` skill |
| Needs user decision | `blocked` | Report blocker, pause task |
| Task depends on blocked task | `pending` | Skip to next non-blocked task |

**Do NOT proceed to next task until current task verification passes.**

---

## Phase 3: Checkpoint Review

**Goal:** Pause every 3 tasks to assess progress and quality.

### Checkpoint Trigger Table

| Condition | Action |
|-----------|--------|
| 3 tasks completed since last checkpoint | Mandatory checkpoint |
| Logical batch complete (e.g., one component) | Checkpoint recommended |
| Test failure encountered | Immediate checkpoint |
| User requests status | Ad-hoc checkpoint |

### Checkpoint Steps

1. Show progress summary
2. Run full test suite (not just new tests)
3. Run lint, type-check, build as applicable
4. Dispatch `code-review` skill if significant code was written
5. Ask user if direction is still correct

### Progress Report Format

After each task:
```
[3/15] Task completed: Write failing test for UserService.create
       Files: tests/services/user.test.ts
       Verification: npm test -- --grep "UserService.create" — PASS
```

After each checkpoint:
```
── Checkpoint [6/15] ──
Completed: 6 | Remaining: 9 | Blocked: 0
Tests: 12 passing, 0 failing
Lint: clean | Build: passing
Next batch: Tasks 7-9 (API endpoint implementation)
Continue? [yes / adjust plan / stop here]
```

**STOP — Do NOT proceed to next batch until:**
- [ ] Full test suite passes
- [ ] Checkpoint report presented to user
- [ ] User has confirmed to continue

---

## Phase 4: Batch Review

**Goal:** After completing a logical group of tasks, perform quality review.

1. Dispatch `code-reviewer` agent to review the batch
2. Fix any Critical or Important issues before proceeding
3. Commit the batch with a descriptive conventional commit message
4. Update the plan document with completed status

### Review Issue Handling

| Severity | Action | Continue? |
|----------|--------|-----------|
| Critical | Must fix immediately | No — fix first |
| Important | Should fix before next batch | Conditional — user decides |
| Suggestion | Note for future | Yes — proceed |

**STOP — Do NOT start next batch until:**
- [ ] Review issues at Critical severity are resolved
- [ ] Batch is committed
- [ ] Plan document is updated

---

## Phase 5: Completion

**Goal:** Verify all tasks are done and report final status.

1. Confirm all tasks have `completed` status
2. Run final full test suite
3. Run all verification commands
4. Present final summary to user
5. Invoke `verification-before-completion` skill

### Final Summary Format

```
── FINAL SUMMARY ──
Total tasks: 15 | Completed: 15 | Failed: 0
Tests: 42 passing, 0 failing
Build: passing | Lint: clean
Commits: 5 (conventional format)

All tasks from plan docs/plans/2026-03-15-feature.md are complete.
Verification-before-completion: PASS
```

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Marking complete without verification | False progress, bugs accumulate | Run verification command, read output |
| Tasks larger than 5 minutes | Hard to track, prone to scope creep | Break into 2-5 minute tasks |
| Skipping checkpoints | Quality degrades, direction drifts | Checkpoint every 3 tasks |
| Running only new tests | Regressions go undetected | Full test suite at checkpoints |
| Parallelizing dependent tasks | Race conditions, merge conflicts | One task at a time unless truly independent |
| Proceeding past blocked tasks silently | User unaware of skipped work | Report all blockers explicitly |
| Not committing at batch boundaries | Large, hard-to-review changesets | Commit after each logical batch |
| "It works, I'll verify later" | Later never comes | Verify NOW |

---

## Anti-Rationalization Guards

<HARD-GATE>
NO TASK MARKED COMPLETE WITHOUT VERIFICATION. Run the verification command. Read the output. Confirm it matches expectations. Only then mark complete.
</HARD-GATE>

If you catch yourself thinking:
- "The code looks right, I don't need to run it..." — Run it. Always.
- "I'll batch the verifications..." — No. Verify each task individually.
- "This task is trivial, it obviously works..." — Prove it with verification.

---

## Integration Points

| Skill | Relationship | When |
|-------|-------------|------|
| `planning` | Upstream — provides approved plan | Task list source |
| `executing-plans` | Complementary — handles plan execution flow | Can be used together |
| `test-driven-development` | Per-task — TDD cycle for code tasks | Every code task |
| `verification-before-completion` | Per-task — verification gate | Before marking any task complete |
| `resilient-execution` | On failure — retry with alternatives | When task verification fails |
| `code-review` | At checkpoints — batch quality review | Every 3 tasks or batch boundary |
| `subagent-driven-development` | Alternative — parallel execution path | For independent task batches |
| `circuit-breaker` | Safety net — detects stagnation | When tasks repeatedly fail |

---

## Concrete Examples

### Example: Task Extraction from Plan

Plan step: "Add user registration endpoint with validation"

Extracted tasks:
```
Task 1: Write failing test for POST /api/users input validation
  Files: tests/api/users.test.ts
  Depends on: none
  Verification: npm test -- --grep "POST /api/users validation" → FAIL (expected)

Task 2: Implement input validation schema
  Files: src/schemas/user.ts
  Depends on: Task 1
  Verification: npm test -- --grep "POST /api/users validation" → PASS

Task 3: Write failing test for POST /api/users success case
  Files: tests/api/users.test.ts
  Depends on: Task 2
  Verification: npm test -- --grep "POST /api/users creates user" → FAIL (expected)

Task 4: Implement registration endpoint handler
  Files: src/routes/users.ts
  Depends on: Task 3
  Verification: npm test -- --grep "POST /api/users" → ALL PASS

Task 5: Commit registration endpoint
  Files: none (git operation)
  Depends on: Task 4
  Verification: git log --oneline -1 → shows conventional commit
```

### Example: Blocked Task Report

```
BLOCKED: Task 7 — Write integration test for payment webhook
Reason: Stripe test API key not configured in .env.test
Impact: Tasks 7-9 (payment flow) cannot proceed
Non-blocked tasks: Tasks 10-12 (profile page) can continue

Options:
A. User provides Stripe test key → unblocks Tasks 7-9
B. Skip payment tasks, continue with profile → revisit later
C. Mock Stripe entirely → reduces test fidelity

Awaiting direction.
```

---

## Key Principles

- **One task at a time** — Do not parallelize unless tasks are truly independent
- **Verify after each task** — Run the verification command before marking complete
- **Checkpoint regularly** — Every 3 tasks, pause and assess
- **Track everything** — No task without a status
- **Small commits** — Commit after each logical batch

---

## Skill Type

**RIGID** — Follow this process exactly. Every task gets verified. Every 3 tasks get a checkpoint. No exceptions.
