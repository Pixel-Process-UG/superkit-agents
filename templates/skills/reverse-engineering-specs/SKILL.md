---
name: reverse-engineering-specs
description: "Use when onboarding to an existing codebase that lacks specifications — exhaustively traces code paths and produces implementation-free behavioral specifications for safe refactoring, feature addition, or legacy modernization"
---

# Reverse Engineering Specifications

## Overview

For brownfield/legacy projects without documentation, this skill generates implementation-free specifications by exhaustively analyzing existing code. The output is a complete behavioral description that drives autonomous development on top of the existing codebase — enabling safe refactoring, feature addition, and modernization.

**Key principle:** Document actual behavior, including bugs. Bugs are "documented features" until explicitly marked for fixing.

**This is a RIGID skill.** Every code path must be traced. No assumptions, no skipping.

## Phase 1: Exhaustive Code Investigation

**[HARD-GATE]** Every code path must be traced. No assumptions, no skipping.

Deploy parallel subagents (up to 500) to analyze:

| Analysis Target | What to Document | Priority |
|----------------|-----------------|----------|
| Entry points | All ways the system can be invoked (HTTP, CLI, events, cron) | P0 |
| Code paths | Every branch, loop, conditional, early return | P0 |
| Data flows | Input → transformation → output for every pipeline | P0 |
| State mutations | Every place state is read, written, or deleted | P0 |
| Error handling | Try/catch blocks, error codes, fallback behaviors | P0 |
| Side effects | External calls, file I/O, database writes, event emissions | P1 |
| Configuration | Environment variables, config files, feature flags | P1 |
| Dependencies | External services, libraries, APIs consumed | P1 |
| Concurrency | Async operations, race conditions, locking mechanisms | P2 |
| Implicit behavior | Convention-based routing, middleware chains, decorators | P2 |

### Investigation Strategy Decision Table

| Codebase Size | Strategy | Subagent Count |
|--------------|----------|---------------|
| Small (<50 files) | Single-pass full scan | 5-10 |
| Medium (50-500 files) | Module-by-module scan | 50-100 |
| Large (500+ files) | Entry-point-first, then depth scan | 200-500 |

STOP after investigation — present a summary of discovered entry points, data flows, and behaviors. Get confirmation before generating specs.

## Phase 2: Behavioral Specification Generation

Transform code analysis into implementation-free specs following the `spec-writing` skill format.

### Transformation Rules

| Rule | Explanation |
|------|-------------|
| Strip ALL implementation details | No function names, variable names, technology references |
| Describe WHAT, never HOW | Observable behavior only |
| Document actual behavior (bugs included) | Bugs become "current behavior" in specs |
| Use Given/When/Then format | For all acceptance criteria |
| Include data contracts | Input shapes, output shapes, invariants |
| Separate known issues | Bugs go in KNOWN_ISSUES.md, not inline |

### Implementation Detail Stripping

| Code Artifact | What You See | What You Write in Spec |
|--------------|-------------|----------------------|
| `jwt.verify(token, secret)` | Token validation with JWT | "Credentials are validated against the authentication system" |
| `redis.get(cacheKey)` | Redis cache lookup | "Previously computed results are retrieved from cache" |
| `if (user.role === 'admin')` | Role check | "Privileged operations require administrator access" |
| `res.status(429).json(...)` | Rate limiting response | "Excessive requests receive a rate limit error" |
| `bcrypt.hash(pw, 12)` | Password hashing | "Passwords are stored in a non-reversible format" |

STOP after spec generation — run the completeness checklist before organizing.

## Phase 3: Specification Organization

Create spec files following the naming convention:

```
specs/
├── 01-[first-capability].md
├── 02-[second-capability].md
├── ...
├── NN-[last-capability].md
└── KNOWN_ISSUES.md
```

### KNOWN_ISSUES.md Format

```markdown
# Known Issues

## [Issue Title]
- **Current behavior:** [What actually happens]
- **Expected behavior:** [What should happen, if known]
- **Affected specs:** [Which spec files reference this behavior]
- **Severity:** [Critical | High | Medium | Low]
- **Notes:** [Additional context]
```

### Severity Classification

| Severity | Criteria | Action |
|----------|----------|--------|
| **Critical** | Data loss, security vulnerability, system crash | Fix before any new features |
| **High** | Incorrect results, broken workflow | Fix in next release |
| **Medium** | Poor UX, performance issue | Plan for future fix |
| **Low** | Cosmetic, minor inconsistency | Fix opportunistically |

STOP after organization — present the spec file list and KNOWN_ISSUES for review.

## Phase 4: Quality Verification

**[HARD-GATE]** All checks must pass before this phase is complete.

| # | Check | Question | Status |
|---|-------|----------|--------|
| 1 | Entry points | Are ALL entry points documented? | [ ] |
| 2 | Code paths | Are ALL branches and conditionals traced? | [ ] |
| 3 | Data flows | Are ALL input→output pipelines described? | [ ] |
| 4 | State mutations | Are ALL state changes captured? | [ ] |
| 5 | Error handling | Are ALL error paths documented? | [ ] |
| 6 | Side effects | Are ALL external interactions noted? | [ ] |
| 7 | Edge cases | Are boundary conditions described? | [ ] |
| 8 | Concurrency | Are async behaviors documented? | [ ] |
| 9 | Configuration | Are ALL config options listed? | [ ] |
| 10 | Dependencies | Are ALL external dependencies identified? | [ ] |
| 11 | Implementation-free | Zero code, tech names, or architecture in specs? | [ ] |
| 12 | Given/When/Then | All acceptance criteria in correct format? | [ ] |

## Concrete Example: Code to Spec Transformation

### Code (input — what you analyze):
```javascript
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

## Job to Be Done
When a request arrives at a protected endpoint, I want to verify the
caller's identity, so I can ensure only authorized users access the system.

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

## Edge Cases
- Malformed authorization header (missing "Bearer" prefix): treated as missing credentials
- Expired credentials: treated as invalid credentials

## Data Contracts
- Input: Authorization header in "Bearer <credential>" format
- Output on success: User identity object attached to request context
- Output on failure: JSON error response with appropriate status code
```

Notice: No mention of JWT, middleware, Express, environment variables, or any implementation detail.

## Anti-Patterns / Common Mistakes

| Mistake | Why It Is Wrong | What To Do Instead |
|---------|----------------|-------------------|
| Skipping "boring" code paths | Undocumented behavior causes bugs during refactoring | Trace EVERY path, even error handlers |
| Leaking implementation details into specs | Defeats the purpose of behavioral specs | Strip all tech names, function names, code |
| Marking bugs as "correct behavior" | Loses the information that it is a bug | Document in KNOWN_ISSUES.md with severity |
| Skipping async/concurrency analysis | Race conditions are the hardest bugs to find | Document all async behavior |
| Analyzing only happy paths | Most bugs live in error paths | Document ALL error handling paths |
| Guessing behavior instead of tracing code | Spec becomes fiction | Read every line — no assumptions |
| Generating specs without user review | Misunderstandings propagate | Present for review after each phase |

## Anti-Rationalization Guards

- **[HARD-GATE]** Do NOT skip any code path — every branch, conditional, and error handler must be traced
- **[HARD-GATE]** Do NOT include ANY implementation details in specs — no code, tech names, or architecture
- **[HARD-GATE]** Do NOT mark the completeness checklist as done until ALL 12 items pass
- **Do NOT skip** concurrency analysis — even if the code "looks synchronous"
- **Do NOT skip** configuration analysis — env vars and feature flags change behavior
- **Do NOT** assume behavior from function names — read the actual code
- **Do NOT** fix bugs while reverse-engineering — document them in KNOWN_ISSUES.md

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `spec-writing` | Output follows spec-writing format; use for audit after generation |
| `autonomous-loop` | Specs feed into planning mode for gap analysis |
| `acceptance-testing` | Tests derived from reverse-engineered acceptance criteria |
| `self-learning` | Populate memory files with discovered project context |
| `planning` | After specs exist, plan improvements or new features |
| `systematic-debugging` | Known issues inform debugging priorities |

## Workflow After Reverse Engineering

| Step | Skill | Purpose |
|------|-------|---------|
| 1 | `reverse-engineering-specs` (this) | Generate behavioral specs from code |
| 2 | `spec-writing` (audit mode) | Verify quality and completeness |
| 3 | `planning` | Identify gaps, plan improvements |
| 4 | `autonomous-loop` | Implement features or fixes with specs as guide |

## Verification Gate

Before claiming reverse engineering is complete:

1. VERIFY the completeness checklist (all 12 items) passes
2. VERIFY zero implementation details in any spec file
3. VERIFY all acceptance criteria use Given/When/Then format
4. VERIFY KNOWN_ISSUES.md exists and categorizes all discovered bugs
5. VERIFY the user has reviewed the spec set and KNOWN_ISSUES

## Skill Type

**Flexible** — Adapt investigation depth and subagent count to codebase size while preserving the exhaustive-investigation and implementation-free output rules. No code paths may be skipped.
