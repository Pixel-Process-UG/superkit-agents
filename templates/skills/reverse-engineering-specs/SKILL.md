---
name: reverse-engineering-specs
description: Use when onboarding to an existing codebase that lacks specifications — exhaustively traces code paths and produces implementation-free behavioral specifications for safe refactoring and feature addition
---

# Reverse Engineering Specifications

## Overview

For brownfield/legacy projects without documentation, this skill generates implementation-free specifications by exhaustively analyzing existing code. The output is a complete behavioral description that can drive Ralph-style autonomous development on top of the existing codebase.

**Key principle:** Document actual behavior, including bugs. Bugs are "documented features" until explicitly marked for fixing.

## Process

### Phase 1: Exhaustive Code Investigation

**[HARD-GATE]** Every code path must be traced. No assumptions, no skipping.

Deploy parallel subagents (up to 500) to analyze:

| Analysis Target | What to Document |
|----------------|-----------------|
| Entry points | All ways the system can be invoked (HTTP, CLI, events, cron, etc.) |
| Code paths | Every branch, loop, conditional, and early return |
| Data flows | Input → transformation → output for every pipeline |
| State mutations | Every place state is read, written, or deleted |
| Error handling | Try/catch blocks, error codes, fallback behaviors |
| Side effects | External calls, file I/O, database writes, event emissions |
| Configuration | Environment variables, config files, feature flags |
| Dependencies | External services, libraries, APIs consumed |
| Concurrency | Async operations, race conditions, locking mechanisms |

### Phase 2: Behavioral Specification Generation

Transform code analysis into implementation-free specs following the `spec-writing` skill format.

**Rules:**
1. Strip ALL implementation details — no function names, variable names, or technology references
2. Describe WHAT the system does, not HOW
3. Document actual behavior (bugs included as "current behavior")
4. Use Given/When/Then format for acceptance criteria
5. Include data contracts (input shapes, output shapes, invariants)

### Phase 3: Specification Organization

Create spec files following the naming convention:

```
specs/
├── 01-[first-capability].md
├── 02-[second-capability].md
├── ...
├── NN-[last-capability].md
└── KNOWN_ISSUES.md          # Bugs documented as "current behavior"
```

### Phase 4: Quality Verification

Run the completeness checklist:

| Check | Question | Status |
|-------|----------|--------|
| Entry points | Are ALL entry points documented? | [ ] |
| Code paths | Are ALL branches and conditionals traced? | [ ] |
| Data flows | Are ALL input→output pipelines described? | [ ] |
| State mutations | Are ALL state changes captured? | [ ] |
| Error handling | Are ALL error paths documented? | [ ] |
| Side effects | Are ALL external interactions noted? | [ ] |
| Edge cases | Are boundary conditions described? | [ ] |
| Concurrency | Are async behaviors documented? | [ ] |
| Configuration | Are ALL config options listed? | [ ] |
| Dependencies | Are ALL external dependencies identified? | [ ] |

**[HARD-GATE]** All checks must be marked complete before Phase 4 is done.

## KNOWN_ISSUES.md Format

```markdown
# Known Issues

## [Issue Title]
- **Current behavior:** [What actually happens]
- **Expected behavior:** [What should happen, if known]
- **Affected specs:** [Which spec files reference this behavior]
- **Severity:** [Critical | High | Medium | Low]
- **Notes:** [Additional context]
```

## Example Transformation

### Code (input — what you analyze):
```
// Authentication middleware
function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
```

### Spec (output — what you produce):
```markdown
# Request Authentication

## Acceptance Criteria

### Valid Credentials
- Given a request with valid credentials in the authorization header
- When the request is processed
- Then the request proceeds to the next handler
- And the authenticated user identity is available to downstream handlers

### Missing Credentials
- Given a request without credentials
- When the request is processed
- Then a 401 status is returned
- And an error message indicates missing credentials

### Invalid Credentials
- Given a request with invalid or expired credentials
- When the request is processed
- Then a 403 status is returned
- And an error message indicates invalid credentials

## Data Contracts
- Input: Authorization header in "Bearer <credential>" format
- Output on success: User identity object attached to request context
- Output on failure: JSON error response with appropriate status code
```

Notice: No mention of JWT, middleware, Express, environment variables, or any implementation detail.

## Workflow After Reverse Engineering

1. **Reverse-engineer specs** (this skill) → behavioral specs from code
2. **Audit specs** (`spec-writing` skill) → verify quality and completeness
3. **Plan** (`planning` skill) → identify gaps and improvements
4. **Implement** (`autonomous-loop` skill) → add features or fix issues with specs as guide

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `spec-writing` | Output follows spec-writing format; use for audit |
| `autonomous-loop` | Specs feed into planning mode for gap analysis |
| `acceptance-testing` | Tests derived from reverse-engineered acceptance criteria |
| `self-learning` | Populate memory files with discovered project context |

## Skill Type

**Rigid** — The exhaustive investigation and implementation-free output rules must be followed exactly. No code paths may be skipped.
