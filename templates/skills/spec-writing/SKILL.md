---
name: spec-writing
description: Use when writing specifications for features, projects, or requirements — applies Jobs to Be Done (JTBD) methodology with acceptance criteria focus, no implementation details, and SLC release planning
---

# Specification Writing

## Overview

Specifications define WHAT the software should do, never HOW. This skill applies the Jobs to Be Done (JTBD) methodology to break requirements into properly scoped, testable specification files that drive autonomous implementation.

## The Cardinal Rule

**[HARD-GATE]** Specifications must NEVER contain implementation details.

| Forbidden | Allowed |
|-----------|---------|
| Code blocks or snippets | Behavioral descriptions |
| Variable names or function signatures | Observable outcomes |
| Technology choices ("use React", "use PostgreSQL") | Capability requirements ("renders in browser", "persists data") |
| Algorithm suggestions ("use K-means clustering") | Success criteria ("extracts 5-10 dominant colors") |
| Architecture patterns ("use MVC") | User-facing behaviors |

**Why:** Implementation-free specs preserve flexibility. Ralph can choose the best approach for the codebase, technology, and constraints — and change course without spec updates.

## Process

### Phase 1: Jobs to Be Done (JTBD)

Identify the user's or system's jobs:

```
When [situation], I want to [motivation], so I can [expected outcome].
```

**Examples:**
- "When I upload an image, I want to extract its color palette, so I can use those colors in my design."
- "When I receive an API request, I want to validate the payload, so I can reject malformed data before processing."

### Phase 2: Topics of Concern

Break each job into discrete topics. Apply the **"One Sentence Without 'And'" test:**

| Test | Result |
|------|--------|
| "This spec covers color extraction." | PASS — single topic |
| "This spec covers color extraction and palette rendering." | FAIL — two topics, split them |
| "This spec covers user authentication and session management." | FAIL — split into two specs |

Each topic becomes one specification file.

### Phase 3: Write Specification Files

**File naming convention:** `<int>-<descriptive-name>.md`

```
specs/
├── 01-color-extraction.md
├── 02-palette-rendering.md
├── 03-export-formats.md
└── 04-color-accessibility.md
```

### Specification File Format

```markdown
# [Topic Name]

## Job to Be Done
When [situation], I want to [motivation], so I can [expected outcome].

## Acceptance Criteria

### [Criterion 1 Name]
- Given [precondition]
- When [action]
- Then [observable outcome]
- And [additional observable outcome]

### [Criterion 2 Name]
- Given [precondition]
- When [action]
- Then [observable outcome]

## Edge Cases
- [Describe boundary condition and expected behavior]
- [Describe error condition and expected behavior]

## Data Contracts
- Input: [Describe shape, constraints, valid ranges]
- Output: [Describe shape, guarantees, invariants]

## Non-Functional Requirements
- Performance: [measurable target, e.g., "responds within 200ms for 95th percentile"]
- Accessibility: [specific standard, e.g., "WCAG 2.1 AA"]
- Security: [specific requirement, e.g., "input sanitized against XSS"]
```

### Phase 4: Story Map Organization

Organize specs into a story map for release planning:

```
CAPABILITY 1    CAPABILITY 2    CAPABILITY 3    CAPABILITY 4
─────────────   ─────────────   ─────────────   ─────────────
basic upload    auto-extract    manual arrange  export PNG
bulk upload     palette gen     templates       export SVG
drag-drop       color names     grid layout     share link
                accessibility   animation       collaborate
```

- **Horizontal rows** = candidate releases
- **Top row** = minimum viable release
- Each row adds capabilities across the board

### Phase 5: SLC Release Criteria

For each horizontal slice, evaluate:

| Criterion | Question | Standard |
|-----------|----------|----------|
| **Simple** | Can it ship fast with narrow scope? | Weeks, not months |
| **Lovable** | Will people actually want to use it? | Delightful, not just functional |
| **Complete** | Does it fully accomplish a job? | End-to-end, not half-done |

A release must satisfy ALL three. "Simple but incomplete" is not shippable. "Complete but not lovable" is not shippable.

## Acceptance Criteria Rules

### Good Acceptance Criteria
- Describe **observable behavioral outcomes**
- Are **testable** — you can write a test that verifies them
- Are **specific** — measurable numbers, concrete states
- Are **independent** — each criterion stands alone

### Examples

| Bad (Implementation Detail) | Good (Behavioral Outcome) |
|----------------------------|--------------------------|
| "Use K-means clustering with k=8" | "Extracts 5-10 dominant colors from any image" |
| "Store in PostgreSQL JSONB column" | "Color data persists across sessions" |
| "Use WebSocket for real-time updates" | "Palette changes appear within 500ms" |
| "Implement with React useEffect hook" | "Palette renders when image loads" |
| "Use bcrypt with 12 salt rounds" | "Passwords cannot be recovered from stored data" |

## Parallel Subagent Usage

When auditing or updating specs:
- Deploy up to 100 parallel subagents for updating existing spec files
- Deploy subagents to cross-reference specs against implementation
- Each subagent handles one spec file independently

## Specs Audit Mode

Run a dedicated audit pass to enforce quality:

1. Read all spec files in `specs/`
2. Check each against the cardinal rules (no code, no implementation details)
3. Verify "One Sentence Without 'And'" test
4. Ensure consistent naming convention
5. Flag violations and auto-fix where possible

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `autonomous-loop` | Planning mode reads specs to identify implementation gaps |
| `acceptance-testing` | Tests are derived directly from spec acceptance criteria |
| `reverse-engineering-specs` | Generates specs from existing code (brownfield) |
| `prd-generation` | PRD provides high-level requirements; specs detail them |
| `planning` | Plans reference spec acceptance criteria for task definition |

## Skill Type

**Rigid** — The no-implementation-details rule and JTBD structure must be followed exactly. Acceptance criteria format is non-negotiable.
