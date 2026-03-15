---
name: acceptance-testing
description: Use when validating that implementation meets specification requirements — applies acceptance-driven backpressure with behavioral validation gates that prevent completion claims without passing tests
---

# Acceptance Testing

## Overview

Acceptance-driven backpressure connects specification acceptance criteria directly to test requirements, creating a validation chain that prevents premature completion claims. The system cannot "cheat" — you cannot claim a feature is done unless tests derived from spec acceptance criteria actually pass.

## The Backpressure Chain

```
┌────────────┐     derives      ┌────────────┐     validates    ┌────────────┐
│   SPECS    │────────────────▶│   TESTS    │────────────────▶│   CODE     │
│            │                  │            │                  │            │
│ Acceptance │                  │ Test cases │                  │ Must pass  │
│ Criteria   │                  │ from AC    │                  │ all tests  │
└────────────┘                  └────────────┘                  └────────────┘
      ▲                                                              │
      │                    backpressure                               │
      └──────────────────────────────────────────────────────────────┘
      If tests fail, implementation must change (not the spec or test)
```

## Process

### Step 1: Extract Acceptance Criteria

From each specification file, extract all Given/When/Then acceptance criteria:

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

### Step 2: Derive Test Cases

**[HARD-GATE]** Every acceptance criterion must have at least one corresponding test.

| Acceptance Criterion | Test Type | Test Description |
|---------------------|-----------|-----------------|
| AC-1: Extract dominant colors | Integration | Upload valid image, verify 5-10 colors returned with hex/RGB/HSL |
| AC-2: Handle invalid images | Integration | Upload corrupted file, verify error response, verify no partial data |

### Step 3: Write Tests BEFORE Implementation

This skill integrates with `test-driven-development`:

1. Write test from acceptance criterion (RED)
2. Implement feature to pass test (GREEN)
3. Refactor while keeping test green (REFACTOR)

### Step 4: Validation Gates

Before claiming any task complete, ALL gates must pass:

| Gate | Check | Tool |
|------|-------|------|
| Unit tests | All pass | Test runner |
| Integration tests | All pass | Test runner |
| Acceptance tests | All AC-derived tests pass | Test runner |
| Build | Compiles without errors | Build tool |
| Lint | No violations | Linter |
| Typecheck | No type errors | Type checker |

**[HARD-GATE:ACCEPTANCE]** Cannot claim completion without ALL acceptance tests passing.

### Step 5: Traceability Report

After validation, produce a traceability report:

```markdown
## Acceptance Test Report

| Spec | Criterion | Test | Status |
|------|-----------|------|--------|
| 01-color-extraction.md | AC-1: Extract dominant colors | test/color.test.js:15 | PASS |
| 01-color-extraction.md | AC-2: Handle invalid images | test/color.test.js:42 | PASS |
| 02-palette-rendering.md | AC-1: Render palette grid | test/palette.test.js:8 | PASS |
```

## Behavioral Outcomes vs Implementation Checks

### What Acceptance Tests Verify

| Verify This (Behavioral) | NOT This (Implementation) |
|--------------------------|--------------------------|
| "5-10 colors are returned" | "K-means runs with k=8" |
| "Response time < 200ms" | "Cache is hit on second call" |
| "Error message is user-friendly" | "CustomError class is thrown" |
| "Data persists across sessions" | "PostgreSQL INSERT executes" |
| "UI updates within 500ms" | "WebSocket message is received" |

## Integration with Other Skills

| Skill | Relationship |
|-------|-------------|
| `spec-writing` | Acceptance criteria come from specs |
| `test-driven-development` | TDD cycle uses acceptance-derived tests |
| `llm-as-judge` | For subjective criteria that can't be deterministically tested |
| `verification-before-completion` | Final verification includes acceptance test check |
| `autonomous-loop` | Exit gate requires acceptance tests passing |
| `code-review` | Review checks acceptance test coverage |

## Anti-Patterns

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| Changing specs to match implementation | Fix the implementation, not the spec |
| Skipping edge case criteria | ALL acceptance criteria get tests |
| Testing implementation details | Test observable behavioral outcomes |
| Claiming "tests pass" without acceptance tests | Acceptance tests are a separate category — verify explicitly |
| Writing acceptance tests after implementation | Write BEFORE (TDD) or derive from specs BEFORE coding |

## Skill Type

**Rigid** — The backpressure chain must not be bypassed. Every acceptance criterion must have a test. No completion without passing acceptance tests.
