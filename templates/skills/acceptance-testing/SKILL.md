---
name: acceptance-testing
description: "Use when validating that implementation meets specification requirements — applies acceptance-driven backpressure with behavioral validation gates that prevent completion claims without passing tests. Triggers: spec-to-code validation, feature completion verification, pre-merge acceptance gate, release readiness check."
---

# Acceptance Testing

## Overview

Acceptance-driven backpressure connects specification acceptance criteria directly to test requirements, creating a validation chain that prevents premature completion claims. The system cannot cheat — you cannot claim a feature is done unless tests derived from spec acceptance criteria actually pass.

**Announce at start:** "I'm using the acceptance-testing skill to validate against specification criteria."

---

## The Backpressure Chain

```
+------------+     derives      +------------+     validates    +------------+
|   SPECS    |---------------->|   TESTS    |---------------->|   CODE     |
|            |                  |            |                  |            |
| Acceptance |                  | Test cases |                  | Must pass  |
| Criteria   |                  | from AC    |                  | all tests  |
+------------+                  +------------+                  +------------+
      ^                                                              |
      |                    backpressure                               |
      +--------------------------------------------------------------+
      If tests fail, implementation must change (not the spec or test)
```

---

## Phase 1: Extract Acceptance Criteria

**Goal:** From each specification file, extract all Given/When/Then acceptance criteria.

### Actions

1. Locate all specification files (`specs/*.md`)
2. Extract every acceptance criterion with its ID
3. Document in structured format

### Example Extraction

```markdown
## From spec: 01-color-extraction.md

### AC-1: Extract dominant colors
- Given an uploaded image (PNG, JPG, or WebP)
- When color extraction is triggered
- Then 5-10 dominant colors are returned
- And each color includes hex, RGB, and HSL representations

### AC-2: Handle invalid images
- Given a corrupted or unsupported file
- When color extraction is attempted
- Then an appropriate error is returned
- And no partial results are produced
```

### STOP — HARD-GATE: Do NOT proceed to Phase 2 until:
- [ ] All spec files are located and read
- [ ] Every acceptance criterion is extracted with an ID
- [ ] Criteria are in Given/When/Then format
- [ ] No criteria are ambiguous (if ambiguous, clarify with spec author)

---

## Phase 2: Derive Test Cases

**Goal:** Map every acceptance criterion to at least one test case.

```
┌─────────────────────────────────────────────────────────────────┐
│  HARD-GATE: Every acceptance criterion must have at least one   │
│  corresponding test. No exceptions. If a criterion has no       │
│  test, the feature is NOT complete.                             │
└─────────────────────────────────────────────────────────────────┘
```

### Traceability Table

| Acceptance Criterion | Test Type | Test Description | Test File:Line |
|---------------------|-----------|-----------------|----------------|
| AC-1: Extract dominant colors | Integration | Upload valid image, verify 5-10 colors with hex/RGB/HSL | test/color.test.js:15 |
| AC-2: Handle invalid images | Integration | Upload corrupted file, verify error, verify no partial data | test/color.test.js:42 |

### Decision Table: Test Type for Acceptance Criteria

| Criterion Type | Test Type | Rationale |
|---------------|-----------|-----------|
| Data input/output behavior | Integration | Tests real data flow |
| Error handling behavior | Integration | Tests error paths end-to-end |
| Performance requirement | Load test | Requires measurement under load |
| UI behavior | E2E (Playwright) | Tests real browser interaction |
| Subjective quality | LLM-as-judge | Cannot be deterministically tested |
| Security requirement | Integration + security test | Tests authorization and input validation |

### STOP — HARD-GATE: Do NOT proceed to Phase 3 until:
- [ ] Every acceptance criterion has at least one test mapped
- [ ] Test types are appropriate for the criterion type
- [ ] Test file locations are identified

---

## Phase 3: Write Tests Before Implementation

**Goal:** Write acceptance tests that will fail until the feature is correctly implemented.

### Actions

This phase integrates with `test-driven-development`:

1. Write test from acceptance criterion (RED)
2. Implement feature to pass test (GREEN)
3. Refactor while keeping test green (REFACTOR)

### Behavioral Outcome Focus

| Verify This (Behavioral) | NOT This (Implementation) |
|--------------------------|--------------------------|
| "5-10 colors are returned" | "K-means runs with k=8" |
| "Response time < 200ms" | "Cache is hit on second call" |
| "Error message is user-friendly" | "CustomError class is thrown" |
| "Data persists across sessions" | "PostgreSQL INSERT executes" |
| "UI updates within 500ms" | "WebSocket message is received" |

### STOP — HARD-GATE: Do NOT proceed to Phase 4 until:
- [ ] All acceptance tests are written
- [ ] Tests fail before implementation (RED confirmed)
- [ ] Tests verify behavioral outcomes, not implementation details

---

## Phase 4: Validation Gates

**Goal:** Before claiming any task complete, ALL gates must pass.

| Gate | Check | Tool | Required |
|------|-------|------|----------|
| Unit tests | All pass | Test runner | Always |
| Integration tests | All pass | Test runner | Always |
| Acceptance tests | All AC-derived tests pass | Test runner | Always |
| Build | Compiles without errors | Build tool | Always |
| Lint | No violations | Linter | Always |
| Typecheck | No type errors | Type checker | When applicable |

```
┌─────────────────────────────────────────────────────────────────┐
│  HARD-GATE: ACCEPTANCE                                         │
│                                                                 │
│  Cannot claim completion without ALL acceptance tests passing.  │
│  If any acceptance test fails, the feature is NOT done.        │
│  Fix the implementation, not the spec or the test.             │
└─────────────────────────────────────────────────────────────────┘
```

### STOP — HARD-GATE: Do NOT proceed to Phase 5 until:
- [ ] All validation gates pass
- [ ] Acceptance tests pass with green status
- [ ] No gates are skipped or marked as "will fix later"

---

## Phase 5: Traceability Report

**Goal:** Produce a report linking every spec criterion to its test and result.

### Report Template

```markdown
## Acceptance Test Report

| Spec | Criterion | Test | Status |
|------|-----------|------|--------|
| 01-color-extraction.md | AC-1: Extract dominant colors | test/color.test.js:15 | PASS |
| 01-color-extraction.md | AC-2: Handle invalid images | test/color.test.js:42 | PASS |
| 02-palette-rendering.md | AC-1: Render palette grid | test/palette.test.js:8 | PASS |

### Summary
- Total criteria: N
- Tested: N
- Passing: N
- Failing: 0
- Coverage: 100%
```

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Changing specs to match implementation | Defeats the purpose of specification | Fix the implementation, not the spec |
| Skipping edge case criteria | Edge cases cause production bugs | ALL acceptance criteria get tests |
| Testing implementation details | Brittle tests that break on refactor | Test observable behavioral outcomes |
| Claiming "tests pass" without acceptance tests | Unit tests alone are insufficient | Acceptance tests are a separate, required category |
| Writing acceptance tests after implementation | Tests shaped to pass, not to specify | Write BEFORE implementation (TDD) |
| Deferring acceptance tests to "later" | Later never comes | Write them in Phase 2, before coding |
| Marking failing tests as "known issues" | Hides incomplete implementation | Fix the code until tests pass |

---

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "The unit tests cover this" | Unit tests test components in isolation; acceptance tests verify integrated behavior |
| "The spec is obvious, no need for formal tests" | Obvious specs still need verifiable tests |
| "We can manually verify this" | Manual verification is not repeatable or trustworthy |
| "The acceptance criteria are too vague to test" | Clarify the criteria; vague specs produce vague code |
| "This is just a cosmetic change" | Cosmetic changes can break layout, accessibility, and UX |

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `spec-writing` | Acceptance criteria come from specs |
| `test-driven-development` | TDD cycle uses acceptance-derived tests |
| `llm-as-judge` | For subjective criteria that cannot be deterministically tested |
| `verification-before-completion` | Final verification includes acceptance test check |
| `autonomous-loop` | Exit gate requires acceptance tests passing |
| `code-review` | Review checks acceptance test coverage |
| `planning` | Plan includes acceptance test writing as explicit tasks |

---

## Skill Type

**RIGID** — The backpressure chain must not be bypassed. Every acceptance criterion must have a test. No completion without passing acceptance tests. Fix the implementation, not the spec or the test.
