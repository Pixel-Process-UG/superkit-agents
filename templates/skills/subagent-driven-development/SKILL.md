---
name: subagent-driven-development
description: "Use when executing multi-task plans where each task can be implemented independently by a subagent. Triggers when a plan has 3+ independent tasks, when speed of execution is important, when tasks have clear acceptance criteria suitable for delegation, or when two-stage review gates (spec compliance and code quality) are needed for iterative fix cycles."
---

# Subagent-Driven Development

## Overview

This skill orchestrates implementation through dedicated subagents with built-in quality gates. Each task is implemented by an implementer subagent, then reviewed by two specialized reviewer agents (spec compliance and code quality) before acceptance. Failed reviews trigger iterative fix cycles with a maximum of 3 retries before escalation. This ensures consistent quality at scale while maximizing parallel throughput.

**Announce at start:** "I'm using the subagent-driven-development skill to dispatch implementation tasks with two-stage review gates."

## Trigger Conditions

- Plan has 3+ tasks that can be implemented independently
- Tasks have well-specified acceptance criteria suitable for delegation
- Speed of execution is a priority
- Tasks have few interdependencies
- Quality gates are needed for delegated work

---

## Phase 1: Task Preparation

**Goal:** Ensure every task is fully specified before dispatching to any subagent.

### Task Specification Requirements (7 Sections)

Every task dispatched to a subagent MUST include ALL of these:

| Section | Content | Example |
|---------|---------|---------|
| 1. Task description | Clear, unambiguous statement | "Implement JWT token generation with RS256 signing" |
| 2. Files to create/modify | Explicit list | `src/auth/jwt.ts`, `tests/auth/jwt.test.ts` |
| 3. Acceptance criteria | Specific, testable conditions | "Tokens expire after 1 hour", "Invalid keys throw AuthError" |
| 4. TDD requirements | Tests to write, behaviors to cover | "Test: valid token generation, expired token rejection, invalid key handling" |
| 5. Quality standards | Code style, patterns, conventions | "Follow existing service pattern in src/services/, use Result type for errors" |
| 6. Context | Relevant code, interfaces, deps | "Logger API: logger.info(msg, meta). Import from ../utils/logger" |
| 7. Constraints | What NOT to do | "Do NOT modify existing auth middleware. Do NOT add new dependencies." |

### Pre-Dispatch Checklist

- [ ] Task spec has all 7 sections filled
- [ ] Task is independent (no unresolved dependencies on in-progress tasks)
- [ ] Acceptance criteria are specific and testable
- [ ] Files to modify are identified and accessible
- [ ] Relevant context has been gathered and included in the spec

### Task Independence Decision Table

| Dependency Type | Can Dispatch? | Action |
|----------------|--------------|--------|
| No dependencies | Yes | Dispatch immediately |
| Depends on completed task | Yes | Include completed task's output as context |
| Depends on in-progress task | No | Wait for dependency to complete |
| Shared file with another task | No | Serialize — one task at a time for that file |
| Shared interface only | Yes | Include interface definition as context |

**STOP — Do NOT dispatch until:**
- [ ] All 7 spec sections are complete
- [ ] Independence is verified
- [ ] Acceptance criteria are testable

---

## Phase 2: Implementation Dispatch

**Goal:** Send the task to an implementer subagent with full context.

1. Prepare the implementer prompt using `implementer-prompt.md` template
2. Include the full task specification (all 7 sections)
3. Include relevant code context (existing files, interfaces, types)
4. Dispatch the implementer subagent
5. Collect the implementation output

### Implementer Expectations

The implementer subagent MUST:
- Follow the TDD cycle (RED-GREEN-REFACTOR)
- Write tests before production code
- Only modify files listed in the task spec
- Follow the quality standards specified
- Report any questions or blockers encountered
- Document all assumptions made

### Question Handling Protocol

| Question Type | During Implementation | Action |
|--------------|----------------------|--------|
| Non-blocking | Can proceed with reasonable assumption | Note assumption, continue, flag in output |
| Blocking | Cannot proceed without answer | STOP immediately, escalate to orchestrator |
| Scope question | Asks about work outside assigned task | Report it, do NOT fix it |

**STOP — Do NOT proceed to review until:**
- [ ] Implementer has returned complete output
- [ ] All listed files have been created/modified
- [ ] Tests exist for every acceptance criterion
- [ ] Any assumptions are documented

---

## Phase 3: Spec Review Gate

**Goal:** Verify the implementation matches the original task specification.

1. Prepare the spec reviewer prompt using `spec-reviewer-prompt.md` template
2. Provide the original task specification AND the implementer's output
3. Dispatch the spec-reviewer subagent
4. Collect the review result

### Spec Review Criteria

| Criterion | Assessment | What to Check |
|-----------|-----------|---------------|
| All acceptance criteria met | PASS / FAIL per criterion | Each criterion individually verified |
| Tests cover specified behaviors | PASS / FAIL | Test file contains tests for all behaviors |
| Files modified match spec | PASS / FAIL | No unauthorized file modifications |
| No out-of-scope changes | PASS / FAIL | Only listed files touched |
| Implementation matches intent | PASS / FAIL | Behavior is correct, not just syntactically valid |
| All constraints respected | PASS / FAIL | None of the "do NOT" items violated |

### Gate Decision

| Result | Action |
|--------|--------|
| All PASS | Proceed to Phase 4 (quality review) |
| Any FAIL | Return to implementer with specific failure details |

**STOP — Do NOT proceed to quality review if any spec criterion fails.**

---

## Phase 4: Quality Review Gate

**Goal:** Verify code meets quality standards independent of spec compliance.

1. Prepare the quality reviewer prompt using `code-quality-reviewer-prompt.md` template
2. Provide the implementation code, test code, and project quality standards
3. Dispatch the quality-reviewer subagent
4. Collect the review result

### Quality Review Areas

| Area | What to Check |
|------|--------------|
| Code quality | Readability, naming, structure, complexity |
| Pattern compliance | Follows project patterns and conventions |
| Security | No injection vulnerabilities, proper validation, safe defaults |
| Performance | No unnecessary allocations, efficient algorithms, no N+1 queries |
| Error handling | All error paths handled, meaningful error messages |
| Test quality | Tests are meaningful, not testing implementation details |

### Issue Severity Classification

| Severity | Definition | Action Required |
|----------|-----------|----------------|
| **Critical** | Security vulnerability, data loss risk, incorrect behavior | MUST fix before acceptance |
| **Important** | Performance issue, maintainability concern, missing error handling | SHOULD fix (escalate to user for decision) |
| **Suggestion** | Style improvement, alternative approach, documentation | MAY fix, at developer's discretion |

### Gate Decision

| Result | Action |
|--------|--------|
| No Critical or Important issues | PASS — proceed to acceptance |
| Any Critical issues | FAIL — must fix and re-review |
| Only Important issues | Conditional — escalate to user for decision |

---

## Phase 5: Fix and Re-Review Cycle

**Goal:** Iteratively fix review failures with a bounded retry limit.

### Fix Cycle Process

```
1. Collect all failure details from the failing review gate
2. Send failures back to implementer subagent with specific instructions
3. Implementer fixes the specific issues (not a full rewrite)
4. Re-run ONLY the failing review gate
5. If still failing: repeat (max 3 cycles)
6. After 3 failed cycles: escalate to user
```

### Retry Decision Table

| Attempt | Spec Review | Quality Review | Action |
|---------|------------|---------------|--------|
| 1 | FAIL | — | Return to implementer with failure details |
| 2 | FAIL | — | Return with additional context/examples |
| 3 | FAIL | — | Escalate to user |
| 1 | PASS | FAIL | Return to implementer with quality issues |
| 2 | PASS | FAIL | Return with project patterns as reference |
| 3 | PASS | FAIL | Escalate to user |

### Escalation Report Format

```
ESCALATION: REPEATED REVIEW FAILURE
====================================
Task: [task description]
Review Gate: [spec / quality]
Attempts: 3

Failure Pattern:
  Attempt 1: [what failed and why]
  Attempt 2: [what failed and why]
  Attempt 3: [what failed and why]

Root Cause Assessment: [why the implementer cannot resolve this]

Options:
  A. Simplify the task specification
  B. Provide additional context/examples
  C. Break into smaller sub-tasks
  D. Implement manually (skip subagent)

Awaiting direction.
```

---

## Phase 6: Acceptance and Integration

**Goal:** After both gates pass, integrate the work and verify no regressions.

1. Run the full project test suite (not just the new tests)
2. Run all verification commands (lint, type-check, build)
3. Confirm no regressions were introduced
4. Mark the task as complete
5. Proceed to next task or report completion

### Multi-Task Orchestration

```
1. Identify independent tasks (no dependencies on each other)
2. For each independent task: run Phases 2-6
3. After all independent tasks complete:
   a. Run full test suite
   b. Run all verification commands
   c. Checkpoint review
4. Identify next set of tasks (now that dependencies are met)
5. Repeat until all tasks complete
```

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Dispatching without complete task spec | Implementer makes wrong assumptions | Fill out all 7 spec sections first |
| Skipping spec review ("code looks right") | Spec deviations accumulate | Always run both review gates |
| Accepting despite Critical issues | Security/correctness compromised | Critical issues must be fixed |
| Letting implementer review its own code | Bias, blind spots | Separate agents for implementation and review |
| Dispatching dependent tasks in parallel | Race conditions, integration failures | Only parallelize independent tasks |
| Ignoring questions from implementer | Wrong assumptions baked into code | Address all questions before proceeding |
| More than 3 fix cycles without escalating | Diminishing returns, same mistakes | Escalate to user for direction |
| Skipping verification after acceptance | Regressions go unnoticed | Always run full verification |
| Vague acceptance criteria | Reviewer cannot assess objectively | Specific, testable criteria only |
| Not including constraints | Implementer touches files it should not | Explicit "do NOT" list in every spec |

---

## Anti-Rationalization Guards

<HARD-GATE>
Do NOT skip either review gate. Do NOT accept implementations with Critical issues. Do NOT dispatch tasks without complete specifications. Both review gates must PASS before any task is marked complete.
</HARD-GATE>

If you catch yourself thinking:
- "The implementation looks good enough..." — Run both review gates. Always.
- "The spec review is just a formality..." — Spec deviations cause integration failures. Run it.
- "Three retries is too many, just accept it..." — If it fails 3 times, escalate. Do not lower the bar.

---

## Integration Points

| Skill | Relationship | When |
|-------|-------------|------|
| `planning` | Upstream — provides approved plan with tasks | Task source |
| `executing-plans` | Upstream — may delegate to this skill | For independent tasks in plan |
| `test-driven-development` | Per-task — implementer follows TDD | Phase 2 implementation |
| `verification-before-completion` | Post-acceptance — final verification | Phase 6 integration |
| `code-review` | Complementary — quality review gate | Phase 4 quality review |
| `dispatching-parallel-agents` | Complementary — parallelization strategy | When dispatching independent tasks |
| `resilient-execution` | On failure — retry strategies | When fix cycles exhaust |
| `task-management` | Tracking — task status management | Progress tracking |

---

## Concrete Examples

### Example: Task Spec for Subagent

```
TASK SPECIFICATION
==================
1. Description: Implement user registration endpoint with email validation

2. Files:
   - Create: src/routes/auth/register.ts
   - Create: tests/routes/auth/register.test.ts
   - Modify: src/routes/index.ts (add route import)

3. Acceptance Criteria:
   - POST /api/auth/register accepts { email, password, name }
   - Returns 201 with user object (no password) on success
   - Returns 400 if email format is invalid
   - Returns 409 if email already exists
   - Password is hashed before storage

4. TDD Requirements:
   - Test: valid registration returns 201
   - Test: invalid email returns 400
   - Test: duplicate email returns 409
   - Test: password is not in response body
   - Test: password is hashed in database

5. Quality Standards:
   - Follow route pattern in src/routes/auth/login.ts
   - Use Zod for input validation (existing pattern)
   - Use Result<T, E> type for service errors

6. Context:
   - Auth service: src/services/auth.ts (has hashPassword method)
   - Route pattern: see src/routes/auth/login.ts
   - Zod schemas: see src/schemas/auth.ts

7. Constraints:
   - Do NOT modify auth service
   - Do NOT add new dependencies
   - Do NOT create migration files
```

---

## Prompt Templates

This skill uses three prompt templates:

| Template | Purpose | File |
|----------|---------|------|
| Implementer Prompt | Dispatches implementation work | `implementer-prompt.md` |
| Spec Reviewer Prompt | Reviews against task specification | `spec-reviewer-prompt.md` |
| Quality Reviewer Prompt | Reviews code quality | `code-quality-reviewer-prompt.md` |

Each template provides a structured format for the subagent interaction. See the individual files for details.

---

## Skill Type

**RIGID** — Follow this process exactly. All 7 spec sections are mandatory. Both review gates are mandatory. The 3-retry escalation limit is mandatory. No shortcuts.
