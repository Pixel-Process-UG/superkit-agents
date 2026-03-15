---
name: spec-writing
description: "Use when writing specifications for features, projects, or requirements — applies Jobs to Be Done (JTBD) methodology with acceptance criteria focus, no implementation details, and SLC release planning"
---

# Specification Writing

## Overview

Specifications define WHAT the software should do, never HOW. This skill applies the Jobs to Be Done (JTBD) methodology to break requirements into properly scoped, testable specification files that drive autonomous implementation. Every spec produces Given/When/Then acceptance criteria free of implementation details.

**This is a RIGID skill.** Every phase, gate, and format rule must be followed exactly.

## The Cardinal Rule

**[HARD-GATE:SPEC]** Specifications must NEVER contain implementation details.

| Forbidden | Allowed |
|-----------|---------|
| Code blocks or snippets | Behavioral descriptions |
| Variable names or function signatures | Observable outcomes |
| Technology choices ("use React", "use PostgreSQL") | Capability requirements ("renders in browser", "persists data") |
| Algorithm suggestions ("use K-means clustering") | Success criteria ("extracts 5-10 dominant colors") |
| Architecture patterns ("use MVC") | User-facing behaviors |
| Library references ("use Zod for validation") | Validation requirements ("rejects malformed input") |

**Why:** Implementation-free specs preserve flexibility. The implementing agent can choose the best approach for the codebase, technology, and constraints — and change course without spec updates.

## Phase 1: Jobs to Be Done (JTBD)

Identify the user's or system's jobs using this format:

```
When [situation], I want to [motivation], so I can [expected outcome].
```

**Examples:**
- "When I upload an image, I want to extract its color palette, so I can use those colors in my design."
- "When I receive an API request, I want to validate the payload, so I can reject malformed data before processing."

Gather jobs through discovery questions:
1. Who is the user/actor?
2. What situation triggers this need?
3. What outcome do they want?
4. What happens if they cannot accomplish this?

STOP after JTBD identification — present all jobs to the user for confirmation before breaking into topics.

## Phase 2: Topics of Concern

Break each job into discrete topics. Apply the **"One Sentence Without 'And'" test:**

| Test | Result | Action |
|------|--------|--------|
| "This spec covers color extraction." | PASS | Single topic — one spec file |
| "This spec covers color extraction and palette rendering." | FAIL | Two topics — split into two spec files |
| "This spec covers user authentication and session management." | FAIL | Split into two specs |
| "This spec covers input validation for the registration form." | PASS | Single topic — one spec file |

Each topic becomes one specification file.

STOP after topic breakdown — confirm the list of spec files before writing them.

## Phase 3: Write Specification Files

**File naming convention:** `<int>-<descriptive-name>.md`

```
specs/
├── 01-color-extraction.md
├── 02-palette-rendering.md
├── 03-export-formats.md
└── 04-color-accessibility.md
```

### Specification File Template

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

### Acceptance Criteria Quality Rules

| Rule | Good Example | Bad Example |
|------|-------------|-------------|
| Observable behavioral outcome | "Extracts 5-10 dominant colors from any image" | "Use K-means clustering with k=8" |
| Testable | "Color data persists across sessions" | "Store in PostgreSQL JSONB column" |
| Specific and measurable | "Palette changes appear within 500ms" | "Use WebSocket for real-time updates" |
| Independent (stands alone) | "Palette renders when image loads" | "Implement with React useEffect hook" |
| Implementation-free | "Passwords cannot be recovered from stored data" | "Use bcrypt with 12 salt rounds" |

STOP after writing specs — run the audit checklist before proceeding to Phase 4.

### Spec Audit Checklist

| # | Check | Pass Criteria |
|---|-------|--------------|
| 1 | No implementation details | Zero code, function names, or tech choices |
| 2 | One Sentence Without 'And' test | Each spec covers exactly one topic |
| 3 | All criteria are Given/When/Then | No free-form prose criteria |
| 4 | All criteria are testable | Each can be verified by a test |
| 5 | Edge cases documented | At least 2 per spec |
| 6 | Data contracts defined | Input and output shapes specified |
| 7 | Consistent naming | `<int>-<descriptive-name>.md` format |

## Phase 4: Story Map Organization

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

### SLC Release Criteria

For each horizontal slice, evaluate:

| Criterion | Question | Standard |
|-----------|----------|----------|
| **Simple** | Can it ship fast with narrow scope? | Weeks, not months |
| **Lovable** | Will people actually want to use it? | Delightful, not just functional |
| **Complete** | Does it fully accomplish a job? | End-to-end, not half-done |

**[HARD-GATE]** A release must satisfy ALL three. "Simple but incomplete" is not shippable. "Complete but not lovable" is not shippable.

STOP after story map — get user confirmation on release slicing before finalizing.

## Phase 5: Specs Audit Mode

When auditing existing specs (rather than writing new ones):

1. Read all spec files in `specs/`
2. Check each against the Cardinal Rule (no code, no implementation details)
3. Verify "One Sentence Without 'And'" test
4. Ensure consistent naming convention
5. Verify Given/When/Then format for all acceptance criteria
6. Flag violations and auto-fix where possible

Deploy up to 100 parallel subagents — one per spec file — for large spec sets.

## Anti-Patterns / Common Mistakes

| Mistake | Why It Is Wrong | What To Do Instead |
|---------|----------------|-------------------|
| Including code snippets in specs | Locks implementation approach | Describe behavior, not mechanism |
| Naming technologies ("use Redis") | Prevents better alternatives | Describe capability ("caches results") |
| Combining topics with "and" | Spec too broad, hard to implement/test | Split into separate spec files |
| Vague acceptance criteria ("works well") | Cannot write a test for it | Specific measurable outcome |
| Missing edge cases | Bugs in boundary conditions | Document at least 2 edge cases per spec |
| Skipping data contracts | Input/output ambiguity | Always define shapes and constraints |
| Writing specs after code | Specs justify code instead of driving it | Specs come BEFORE implementation |
| Acceptance criteria that describe UI layout | Implementation detail | Describe what the user can accomplish |

## Anti-Rationalization Guards

- **[HARD-GATE]** Do NOT include ANY implementation details — no code, no tech names, no architecture
- **[HARD-GATE]** Do NOT skip the "One Sentence Without 'And'" test — split every compound topic
- **[HARD-GATE]** Do NOT accept acceptance criteria that are not in Given/When/Then format
- **[HARD-GATE]** Do NOT skip the audit checklist before finalizing specs
- **Do NOT skip** edge cases — every spec needs at least 2
- **Do NOT skip** data contracts — every spec needs input/output shapes
- **Do NOT** write specs after implementation — specs drive code, not the reverse

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `autonomous-loop` | Planning mode reads specs to identify implementation gaps |
| `acceptance-testing` | Tests are derived directly from spec acceptance criteria |
| `reverse-engineering-specs` | Generates specs from existing code (brownfield) |
| `prd-generation` | PRD provides high-level requirements; specs detail them |
| `planning` | Plans reference spec acceptance criteria for task definition |
| `test-driven-development` | Red phase writes tests matching spec acceptance criteria |
| `writing-skills` | Skills can be specified using this methodology |

## Concrete Example: Complete Spec File

```markdown
# Image Color Extraction

## Job to Be Done
When I upload an image to the design tool, I want to automatically extract
its dominant colors, so I can use those colors in my design palette.

## Acceptance Criteria

### Dominant Color Extraction
- Given an uploaded image in PNG, JPG, or WebP format
- When the extraction process completes
- Then 5-10 dominant colors are returned as hex values
- And colors are ordered by prominence (most dominant first)

### Transparent Image Handling
- Given an uploaded image with transparent regions
- When the extraction process completes
- Then transparent regions are excluded from color analysis
- And at least 3 dominant colors are still returned

### Processing Feedback
- Given an image upload has started
- When extraction is in progress
- Then the user sees a progress indicator
- And extraction completes within 3 seconds for images up to 10MB

## Edge Cases
- Single-color image: returns 1 color (not an error)
- Very large image (>50MB): returns an error with size limit message
- Corrupted image file: returns an error with clear message, no crash
- Animated GIF: extracts colors from the first frame only

## Data Contracts
- Input: Image file (PNG, JPG, WebP), max 50MB
- Output: Array of 1-10 hex color strings, ordered by prominence
- Error output: Error object with code and human-readable message

## Non-Functional Requirements
- Performance: <3s for images up to 10MB, <10s for images up to 50MB
- Accessibility: Color values include WCAG contrast ratio against white/black
```

## Verification Gate

Before claiming specs are complete:

1. VERIFY the Cardinal Rule — zero implementation details in any spec
2. VERIFY every spec passes the "One Sentence Without 'And'" test
3. VERIFY all acceptance criteria use Given/When/Then format
4. VERIFY every spec has edge cases and data contracts
5. VERIFY the story map has at least one complete SLC release slice
6. VERIFY the user has confirmed the spec set

## Skill Type

**Rigid** — The no-implementation-details rule, JTBD structure, Given/When/Then format, and audit checklist must be followed exactly. No elements may be skipped or adapted.
