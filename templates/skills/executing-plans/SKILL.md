---
name: executing-plans
description: "Use when you have an approved implementation plan document and need to execute it step by step. Triggers on /execute command, when transitioning from planning with an approved plan, or when resuming execution of a partially completed plan. Provides batch-based execution with TDD, checkpoint reviews, and verification gates."
---

# Executing Plans

## Overview

This skill turns an approved plan document into working code through disciplined, batch-based execution. Each step is implemented with TDD, verified before proceeding, and reviewed at checkpoints. It provides the structural framework for moving from plan to production code with consistent quality gates.

**Announce at start:** "I'm using the executing-plans skill to implement the approved plan at [plan path]."

## Trigger Conditions

- An approved plan document exists and is ready for implementation
- `/execute` command invoked with a plan reference
- Resuming a partially completed plan execution
- Transition from planning skill after plan approval

---

## Phase 1: Read the Plan

**Goal:** Thoroughly understand the plan before writing any code.

1. Read the entire plan document from start to finish
2. Identify all implementation steps and count them
3. Map dependencies between steps (what must be done first)
4. Note any ambiguities or open questions
5. Confirm understanding with the user before proceeding

### Plan Comprehension Checklist

| Check | Question |
|-------|---------|
| Goal clarity | Can you explain the plan's goal in one sentence? |
| Step count | How many implementation steps are there? |
| Dependencies | Which steps depend on which? |
| Ambiguities | Are there any unclear or underspecified steps? |
| Verification | Does every step have a verification method? |

**STOP — Do NOT proceed to Phase 2 until:**
- [ ] You can explain the plan's goal in one sentence
- [ ] You can list all implementation steps
- [ ] Dependencies are mapped
- [ ] Any ambiguities are noted and resolved with user
- [ ] User has confirmed you may proceed

---

## Phase 2: Create Task Batch

**Goal:** Break the plan into small, executable task batches.

### Batch Size Decision Table

| Task Complexity | Batch Size | Examples |
|----------------|-----------|---------|
| Simple (config, boilerplate) | Up to 5 tasks | ENV vars, imports, type definitions |
| Standard (features, logic) | 3 tasks | Endpoints, services, components |
| Complex (integrations, security) | 2 tasks | OAuth flows, payment processing |
| Critical (data migration, auth) | 1 task | Database migrations, credential handling |

### Task Requirements (STIC)

| Criterion | Description |
|-----------|------------|
| **S**pecific | Clear definition of what to implement |
| **T**estable | Can be verified with automated tests |
| **I**ndependent | Minimal coupling to other tasks in the batch (where possible) |
| **C**ompact | Completable in a focused session (2-5 minutes) |

### Task Template

```
Task: [concise description]
Plan Step: [reference to plan section]
Files to Create/Modify: [list of exact file paths]
Acceptance Criteria:
  - [specific, testable criterion 1]
  - [specific, testable criterion 2]
Dependencies: [other tasks that must be done first, or "none"]
Verification: [exact command to run]
```

**STOP — Do NOT proceed to Phase 3 until:**
- [ ] Tasks created for the current batch
- [ ] Each task has clear acceptance criteria
- [ ] Dependencies are satisfied (previous tasks complete)
- [ ] Tasks ordered by dependency (independent tasks first)

---

## Phase 3: Execute Tasks

**Goal:** Execute each task one at a time using TDD.

### Per-Task Workflow

```
1. ANNOUNCE which task you are starting
2. IMPLEMENT using test-driven-development skill:
   a. Write failing test (RED)
   b. Write minimal code to pass (GREEN)
   c. Refactor (REFACTOR)
   d. Repeat RED-GREEN-REFACTOR for each behavior
3. VERIFY using verification-before-completion skill:
   a. Run full test suite (not just new tests)
   b. Run lint, type-check, build as applicable
   c. Confirm all checks pass
4. MARK task as complete
5. PROCEED to next task
```

### Execution Rules

| Rule | Rationale |
|------|-----------|
| One task at a time | Do not start task 2 until task 1 is verified |
| Follow TDD strictly | No production code without a failing test |
| Do not deviate from the plan | If plan needs changes, stop and discuss with user |
| Do not skip verification | Every task must pass verification before marking complete |
| Report progress | Announce start and completion of each task |

### Task Outcome Decision Table

| Outcome | Action | Next Step |
|---------|--------|-----------|
| Verification passes | Mark complete | Next task |
| Test failure, obvious fix | Fix and re-verify | Same task |
| Test failure, unclear cause | Invoke `systematic-debugging` | Same task after fix |
| Plan step is ambiguous | Stop and ask user | Wait for clarification |
| Plan step is not feasible | Report blocker | Wait for direction |
| Unexpected dependency found | Report and reorder | Adjust batch |

**STOP — Do NOT proceed to next task until:**
- [ ] Current task's acceptance criteria are met
- [ ] All tests pass (new and existing)
- [ ] Verification-before-completion has been executed
- [ ] Task marked as complete

---

## Phase 4: Batch Checkpoint

**Goal:** After completing all tasks in a batch, perform a full checkpoint review.

### Checkpoint Steps

1. Run full test suite — all tests, not just those from the current batch
2. Run all verification commands — lint, type-check, build, format
3. Review what was implemented — summarize completed tasks and outcomes
4. Assess progress against the plan — how far through are we?
5. Identify any issues or risks that came up during execution
6. Report to user and ask for direction

### Checkpoint Report Template

```
BATCH CHECKPOINT
================
Batch: [N] of [estimated total]
Tasks Completed: [list]

Verification Results:
  Tests:      [X passed, Y failed, Z skipped]
  Build:      [pass/fail]
  Lint:       [pass/fail, N warnings]
  Type-check: [pass/fail]

Progress: [N of M plan steps complete] ([percentage]%)

Issues Encountered:
  - [issue 1 and how it was resolved]

Risks or Concerns:
  - [risk 1]

Next Batch Preview:
  - [task 1]
  - [task 2]
  - [task 3]

Awaiting direction: Continue with next batch / Adjust plan / Other?
```

**STOP — Do NOT proceed to next batch until:**
- [ ] Full test suite passes
- [ ] All verification commands pass
- [ ] Checkpoint report presented to user
- [ ] User has confirmed to continue

---

## Phase 5: Continue, Adjust, or Complete

**Goal:** Act on user direction after each checkpoint.

### Direction Decision Table

| User Direction | Action | Next Phase |
|---------------|--------|-----------|
| "Continue" | Create next batch of tasks | Phase 2 |
| "Adjust plan" | Discuss changes, update plan document | Phase 2 (with updated plan) |
| "Stop here" | Summarize progress, note remaining work | Completion |
| "Skip ahead to [step]" | Verify dependencies are met, then jump | Phase 2 (at new step) |
| "Go back and redo [task]" | Revert if needed, re-execute with corrections | Phase 3 |

Never proceed to the next batch without explicit user approval.

---

## Critical Blocker Handling

When you encounter something that prevents task completion, do NOT work around it. Stop and escalate.

### Blocker Classification

| Type | Examples | Action |
|------|---------|--------|
| Ambiguous spec | Plan step could mean multiple things | Present interpretations, ask user |
| Missing dependency | Required API or library unavailable | Report with alternatives |
| Contradiction | Step conflicts with another part of the plan | Identify both sides, ask user |
| Security concern | Planned approach has vulnerability | Report risk, propose safer alternative |
| Feasibility | Step cannot be implemented as described | Explain why, propose alternatives |

### Blocker Report Format

```
CRITICAL BLOCKER
================
Task: [which task is blocked]
Blocker: [clear description of the problem]
Impact: [what cannot proceed until this is resolved]
Options:
  A. [option with tradeoffs]
  B. [option with tradeoffs]
  C. [skip this step and continue]

Awaiting direction before proceeding.
```

**Do NOT** guess what the user intended. **Do NOT** implement a workaround without approval. **Do NOT** skip the blocked task silently. **DO** present options with clear tradeoffs. **DO** continue with non-blocked tasks if possible (but flag the skip).

---

## Subagent Dispatch Option

For larger plans, individual tasks can be dispatched to subagents for parallel execution.

### When to Suggest Subagent Dispatch

| Condition | Threshold |
|-----------|-----------|
| Independent tasks in plan | 10+ tasks with few dependencies |
| Task specification quality | Each task has clear acceptance criteria |
| Speed requirement | User has indicated urgency |
| Task interdependency | Low coupling between tasks |

When conditions are met, suggest switching to the `subagent-driven-development` skill for the remaining work.

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Implementing entire plan at once | No checkpoints, no quality gates | Batch-based execution with checkpoints |
| Skipping TDD because "it's simple" | Bugs accumulate, regressions appear | Every task uses TDD, no exceptions |
| Working around blockers silently | User unaware, wrong assumptions baked in | Stop and escalate blockers |
| Proceeding without approval after batch | Direction may have changed | Always checkpoint and wait |
| Deviating from the plan | Unauthorized changes, scope creep | Discuss changes before implementing |
| Running only new tests | Regressions go undetected | Full test suite at checkpoints |
| Marking tasks complete without verification | False progress, accumulated bugs | Verification is mandatory |
| Batches larger than 5 tasks | Hard to review, too much risk per batch | Keep batches small |
| Skipping checkpoint report | User loses visibility into progress | Always present full checkpoint |
| Not committing at batch boundaries | Huge diffs, hard to revert | Commit after each batch |

---

## Anti-Rationalization Guards

<HARD-GATE>
Do NOT skip any verification step. Do NOT proceed past a checkpoint without user approval. Do NOT deviate from the approved plan without discussion.
</HARD-GATE>

If you catch yourself thinking:
- "I know what comes next, I'll skip the checkpoint..." — No. Report and wait.
- "This verification is redundant..." — Run it anyway. Fresh evidence only.
- "The plan is close enough, I'll adjust as I go..." — Discuss adjustments first.

---

## Integration Points

| Skill | Relationship | When |
|-------|-------------|------|
| `planning` | Upstream — provides approved plan document | Plan is the input to this skill |
| `test-driven-development` | Per-task — TDD cycle for every code task | Phase 3 execution |
| `verification-before-completion` | Per-task — verification gate | Before marking any task complete |
| `systematic-debugging` | On failure — investigate unexpected failures | When task encounters errors |
| `code-review` | At checkpoints — review code quality | Phase 4 batch review |
| `subagent-driven-development` | Alternative — parallel execution path | For large independent task sets |
| `resilient-execution` | On failure — retry with alternatives | When task approaches fail |
| `task-management` | Complementary — provides task tracking | Can be used together |

---

## Concrete Examples

### Example: Batch Creation from Plan

Plan: "Add user authentication with JWT"

```
Batch 1 (3 tasks):
  Task 1: Write failing test for JWT token generation
    Files: tests/auth/jwt.test.ts
    Verification: npm test -- --grep "JWT generation" → FAIL (expected)

  Task 2: Implement JWT token generation
    Files: src/auth/jwt.ts
    Verification: npm test -- --grep "JWT generation" → PASS

  Task 3: Write failing test for auth middleware
    Files: tests/middleware/auth.test.ts
    Verification: npm test -- --grep "auth middleware" → FAIL (expected)

[CHECKPOINT after batch 1]

Batch 2 (3 tasks):
  Task 4: Implement auth middleware
  Task 5: Write failing test for login endpoint
  Task 6: Implement login endpoint

[CHECKPOINT after batch 2]
```

---

## Completion Criteria

The plan execution is complete when:
1. All plan steps have been implemented as tasks
2. All tasks have passed verification
3. Full test suite passes
4. Final checkpoint report presented to user
5. User confirms the plan is complete

---

## Skill Type

**RIGID** — Follow this process exactly. Batches, checkpoints, and verification gates are non-negotiable. No task is complete without verification. No batch proceeds without user approval.
