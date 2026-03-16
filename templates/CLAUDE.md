# @pixelandprocess/superkit-agents — Agent Operating Manual

> See `using-toolkit` skill for identity, hard-gates, workflow state machines, and full command reference.

---

## §4 SKILL CATALOG (64 Skills)

**Core (6):** `using-toolkit`, `self-learning` `/learn`, `resilient-execution`, `circuit-breaker`, `auto-improvement`, `verification-before-completion` `/verify`

**Process (9):** `planning` `/plan`, `brainstorming` `/brainstorm`, `task-management`, `executing-plans` `/execute`, `subagent-driven-development`, `dispatching-parallel-agents`, `autonomous-loop` `/ralph` `/loop`, `ralph-status`, `task-decomposition` `/decompose`

**QA (17):** `code-review` `/review`, `test-driven-development` `/tdd`, `testing-strategy`, `systematic-debugging` `/debug`, `security-review`, `performance-optimization`, `acceptance-testing`, `llm-as-judge`, `senior-frontend` `/frontend`, `senior-backend` `/backend`, `senior-architect` `/architect`, `senior-fullstack` `/fullstack`, `clean-code` `/clean`, `react-best-practices`, `webapp-testing`, `senior-prompt-engineer`, `senior-data-scientist`

**Docs (5):** `prd-generation` `/prd`, `tech-docs-generator` `/docs`, `writing-skills`, `spec-writing` `/specs`, `reverse-engineering-specs`

**Design (3):** `api-design`, `frontend-ui-design`, `database-schema-design`

**Ops (7):** `deployment`, `using-git-worktrees` `/worktree`, `finishing-a-development-branch`, `git-commit-helper` `/commit`, `senior-devops` `/devops`, `mcp-builder` `/mcp`, `agent-development` `/agent`

**Creative (6):** `ui-ux-pro-max` `/ui-ux`, `ui-design-system` `/design-system`, `canvas-design`, `mobile-design` `/mobile`, `ux-researcher-designer`, `artifacts-builder`

**Business (3):** `seo-optimizer` `/seo`, `content-research-writer`, `content-creator`

**Doc Processing (3):** `docx-processing`, `pdf-processing`, `xlsx-processing`

**Productivity (1):** `file-organizer`

**Communication (1):** `email-composer` `/email`

**Frameworks (3):** `laravel-specialist` `/laravel`, `php-specialist` `/php`, `laravel-boost`

**Rigid skills:** Follow exactly. **Flexible skills:** Adapt to context.

---

## §5 AGENT DISPATCH TABLE (20 Agents)


| Agent                | Purpose                                                 | When to Dispatch                             | Expected Output                                                |
| -------------------- | ------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------- |
| `planner`            | Create implementation plans                             | Before any multi-step feature work           | Prioritized task list with file paths and TDD steps            |
| `code-reviewer`      | Review code quality                                     | After task completion, before merge          | Categorized issues (Critical/Important/Suggestions) with fixes |
| `prd-writer`         | Generate PRDs                                           | When product requirements need documentation | Structured PRD with user stories, requirements (P0/P1/P2)      |
| `doc-generator`      | Generate technical docs                                 | When code needs documentation                | API references, architecture overviews, getting-started guides |
| `spec-reviewer`      | Verify spec compliance                                  | After implementation, before review          | Compliance report with gaps and violations                     |
| `quality-reviewer`   | Assess code quality                                     | During review phase                          | Quality assessment covering patterns, performance, security    |
| `loop-orchestrator`  | Manage autonomous loops                                 | During Ralph-style iterative development     | RALPH_STATUS blocks, task selection, exit evaluation           |
| `spec-writer`        | Write specifications                                    | When features need behavioral specs          | JTBD specs with Given/When/Then acceptance criteria            |
| `acceptance-judge`   | Evaluate subjective quality                             | When objective tests aren't sufficient       | Scored rubric with pass/fail and improvement suggestions       |
| `frontend-developer` | Three-phase frontend dev with context discovery         | Frontend feature work                        | Component code with tests                                      |
| `ui-ux-designer`     | Design system generation, component specs               | Design system creation                       | Style guides, component specs                                  |
| `backend-architect`  | Service boundaries, contract-first API                  | Service architecture                         | API contracts, scaling plan                                    |
| `context-manager`    | Project context tracking, dependency mapping            | Context discovery                            | Dependency map, tech stack summary                             |
| `database-architect` | Multi-DB strategy, event sourcing                       | Database design                              | Schema, migrations, indexes                                    |
| `architect-reviewer` | Architecture review, tech debt assessment               | Architecture decisions                       | ADR, scalability assessment                                    |
| `typescript-pro`     | Advanced type patterns, branded types                   | TypeScript type design                       | Type definitions, utility types                                |
| `task-decomposer`    | Hierarchical task breakdown                             | Task planning                                | Task tree, dependency graph                                    |
| `mobile-developer`   | Cross-platform mobile patterns                          | Mobile development                           | Platform-specific code                                         |
| `laravel-developer`  | Laravel specialist with Eloquent, Blade, Livewire, Pest | Laravel project work                         | Laravel-specific code                                          |
| `php-developer`      | Modern PHP 8.x with PSR compliance, static analysis     | PHP project work                             | PHP-specific code                                              |


---

## §6 COMMAND REFERENCE

See `using-toolkit` skill for full command list (31 commands).


---

## §7 RALPH AUTONOMOUS LOOP PROTOCOL

### Architecture

The Ralph loop is an iterative development cycle inspired by Geoffrey Huntley's technique. Each iteration loads identical context, executes one focused task, and persists state to disk.

### "ONE Task Per Loop" Principle

Each iteration selects and completes exactly ONE task from `IMPLEMENTATION_PLAN.md`. This reduces context switching and enables clear progress measurement.

### Context Efficiency


| Resource            | Budget             | Strategy                                  |
| ------------------- | ------------------ | ----------------------------------------- |
| Main context window | 40-60% utilization | The "smart zone" — enough room to think   |
| Read subagents      | Up to 500 parallel | Via `Agent` tool with `subagent_type="Explore"` |
| Build subagents     | 1 at a time        | Via `Agent` tool with `subagent_type="general-purpose"` |
| Token format        | Prefer Markdown    | ~30% more efficient than JSON             |


### Steering Mechanisms

**Upstream Steering (shaping inputs):**

- Detailed specs loaded first (~5,000 tokens)
- Identical PROMPT + AGENTS files each iteration
- Existing code patterns guide new generation

**Downstream Steering (validation gates):**

- Tests → reject invalid implementations
- Builds → catch compilation errors
- Linters → enforce style consistency
- Typecheckers → verify contracts
- LLM-as-judge → evaluate subjective criteria

### RALPH_STATUS Block

**[HARD-GATE:STATUS]** Every loop iteration ends with:

```
---RALPH_STATUS---
STATUS: [IN_PROGRESS | COMPLETE | BLOCKED]
TASKS_COMPLETED_THIS_LOOP: [number]
FILES_MODIFIED: [number]
TESTS_STATUS: [PASSING | FAILING | NOT_RUN]
WORK_TYPE: [IMPLEMENTATION | TESTING | DOCUMENTATION | REFACTORING]
EXIT_SIGNAL: [false | true]
RECOMMENDATION: [one-line next action or completion summary]
---END_RALPH_STATUS---
```

### Dual-Condition Exit Gate

**[HARD-GATE:EXIT]** Both must be true to exit:

1. **Completion indicators** — "done" language appears >= 2 times in recent output
2. **Explicit EXIT_SIGNAL** — `EXIT_SIGNAL: true` in status block

EXIT_SIGNAL is true ONLY when: no remaining tasks, all tests pass, no errors, no meaningful work left.

### Circuit Breaker Thresholds


| Condition        | Threshold                              | Action                  |
| ---------------- | -------------------------------------- | ----------------------- |
| No progress      | 3 consecutive loops, 0 tasks completed | OPEN circuit            |
| Identical errors | 5 consecutive identical errors         | OPEN circuit            |
| Output decline   | 70% decline in output volume           | OPEN circuit            |
| Cooldown         | 30 minutes                             | Before retry after OPEN |


### File Protection

**[HARD-GATE:PROTECT]** These paths must NEVER be deleted during autonomous operations:

- `.ralph/`, `.ralphrc`, `IMPLEMENTATION_PLAN.md`, `AGENTS.md`
- `.claude/`, `CLAUDE.md`, `specs/`

---

## §8 SPECIFICATION METHODOLOGY

### JTBD → Topics → Specs → Story Map

1. **Identify Jobs:** "When [situation], I want to [motivation], so I can [outcome]."
2. **Break into Topics:** Apply "One Sentence Without 'And'" test
3. **Write Specs:** Given/When/Then acceptance criteria, no implementation details
4. **Organize:** Story map with capabilities × release slices

### The Cardinal Rule

**[HARD-GATE:SPEC]** Specs must NEVER contain implementation details:


| Forbidden                   | Allowed                                  |
| --------------------------- | ---------------------------------------- |
| Code blocks, function names | Behavioral descriptions                  |
| Technology choices          | Capability requirements                  |
| Algorithm suggestions       | Success criteria with measurable targets |


### Acceptance Criteria Format

```markdown
### [Criterion Name]
- Given [precondition]
- When [action]
- Then [observable behavioral outcome]
```

### SLC Release Criteria


| Criterion    | Question                             |
| ------------ | ------------------------------------ |
| **Simple**   | Can it ship fast with narrow scope?  |
| **Lovable**  | Will people actually want to use it? |
| **Complete** | Does it fully accomplish a job?      |


All three must be satisfied for a release.

### Reverse Engineering (Brownfield)

For existing codebases without specs:

1. Exhaustively trace every code path, data flow, state mutation
2. Produce specs stripped of implementation details
3. Document actual behavior (bugs = "documented features")
4. Run completeness checklist (all entry points, branches, errors documented)

---

## §9 QUALITY & VALIDATION PROTOCOL

### The Backpressure Chain

```
SPECS ──derives──▶ TESTS ──validates──▶ CODE
  ▲                                       │
  └──────── backpressure ─────────────────┘
  (if tests fail, fix code — not specs or tests)
```

### Validation Gates (all must pass before completion)


| Gate              | Tool                       | Required                |
| ----------------- | -------------------------- | ----------------------- |
| Unit tests        | Test runner                | Always                  |
| Integration tests | Test runner                | When applicable         |
| Acceptance tests  | Test runner (from spec AC) | Always                  |
| Build             | Build tool                 | Always                  |
| Lint              | Linter                     | Always                  |
| Typecheck         | Type checker               | When applicable         |
| LLM-as-judge      | Subagent evaluation        | For subjective criteria |
| Code review       | code-reviewer agent        | Before merge            |


### TDD RED-GREEN-REFACTOR

1. **RED:** Write a failing test that defines desired behavior
2. **GREEN:** Write minimal code to make test pass
3. **REFACTOR:** Clean up while keeping tests green

**[HARD-GATE:TDD]** No production code without a failing test first.

### LLM-as-Judge Pattern

For subjective criteria (tone, aesthetics, UX, readability):

1. Define rubric dimensions with weights (sum to 1.0)
2. Set anchor points (1=worst, 5=adequate, 10=best)
3. Set passing threshold (5.0 minimum viable, 7.0 production, 8.5 excellence)
4. Evaluate artifact against rubric
5. Score, reason, suggest improvements
6. Pass/fail against threshold

### Code Review Checklist

1. **Plan alignment** — Does code match the approved plan?
2. **Code quality** — Clean, readable, maintainable?
3. **Architecture** — Consistent with existing patterns?
4. **Tests** — Adequate coverage? Acceptance tests present?
5. **Documentation** — Updated where needed?

Issue categorization: **Critical** (must fix) | **Important** (should fix) | **Suggestions** (consider)

---

## §10 MEMORY MANAGEMENT PROTOCOL

### Memory Files


| File                  | Purpose                                | Updated By                     |
| --------------------- | -------------------------------------- | ------------------------------ |
| `project-context.md`  | Tech stack, architecture, dependencies | `self-learning`, manual        |
| `learned-patterns.md` | Coding conventions and patterns        | `self-learning`, `code-review` |
| `user-preferences.md` | Communication and workflow preferences | `self-learning`, manual        |
| `decisions-log.md`    | Architectural decisions with rationale | `planning`, `brainstorming`    |


### Auto-Loading

Memory files are loaded on every session start via the session-start hook. They persist across conversations.

### Update Triggers

- `**/learn`** — Full project scan, populate all memory files
- **User correction** — Update `learned-patterns.md` or `user-preferences.md`
- **Architectural decision** — Update `decisions-log.md`
- **New discovery** — Update `project-context.md`

### Decay Rules

- Review memory files periodically for outdated information
- Remove patterns that no longer match the codebase
- Update tech stack info when dependencies change
- Decisions log is append-only (historical record)

---

## §11 ERROR HANDLING & RECOVERY

### Error Classification


| Type          | Example                       | Strategy                        |
| ------------- | ----------------------------- | ------------------------------- |
| **Transient** | Network timeout, rate limit   | Retry with backoff              |
| **Permanent** | Missing dependency, wrong API | Change approach                 |
| **Unknown**   | Unexpected error format       | Investigate, classify, then act |


### Retry Strategy (resilient-execution)

**[HARD-GATE:RETRY]** Try at least 3 different approaches before escalating:

1. **Approach 1:** Direct solution (most obvious fix)
2. **Approach 2:** Alternative method (different technique)
3. **Approach 3:** Workaround (solve the underlying problem differently)
4. **Escalate:** Report with full context — what was tried, what failed, why

### Circuit Breaker Recovery

When circuit opens:

1. Regenerate plan (fresh PLANNING iteration)
2. Change approach (try alternative strategy)
3. Reduce scope (break stuck task into subtasks)
4. Escalate (report blockage for human review)

### File Protection During Cleanup

Before any destructive operation (`rm`, `git clean`, `git checkout .`):

1. Check if operation targets protected files
2. If yes: ABORT and report
3. If no: Proceed with caution
4. After operation: Verify protected files still exist

---

## §12 SUBAGENT DISPATCH RULES

### How to Dispatch Subagents

All subagent dispatch uses the **`Agent` tool**. To run multiple agents in parallel, invoke multiple `Agent` tool calls in a **single message**.

**Key parameters:**

| Parameter | Description |
|---|---|
| `prompt` | Detailed task description with all necessary context |
| `description` | Short label (3-5 words) |
| `subagent_type` | `"Explore"` (fast codebase search), `"Plan"` (architecture), `"general-purpose"` (default) |
| `run_in_background` | `true` for async — you'll be notified on completion |
| `model` | Optional override: `"sonnet"`, `"opus"`, `"haiku"` |

### When to Dispatch vs Do Inline


| Scenario                                  | Action                          |
| ----------------------------------------- | ------------------------------- |
| 2+ independent tasks with no shared state | `Agent` tool — multiple parallel calls in one message |
| Single focused task                       | Do inline                       |
| Heavy reading/searching across codebase   | `Agent` tool with `subagent_type="Explore"` |
| Build or test execution                   | `Agent` tool — 1 at a time only |
| Code review                               | `Agent` tool dispatching `code-reviewer` agent |
| Quality evaluation                        | `Agent` tool dispatching `acceptance-judge` agent |


### Parallelism Limits


| Operation              | Max Parallel | Rationale                         |
| ---------------------- | ------------ | --------------------------------- |
| File reading/searching | 500          | I/O bound, safe to parallelize    |
| Spec auditing/updating | 100          | Independent file operations       |
| Building/testing       | 1            | Must serialize to detect failures |
| Code review            | 1            | Needs holistic view of changes    |


### Two-Stage Review Gates (subagent-driven-development)

1. **Stage 1: Spec Review** — Does implementation match specification?
2. **Stage 2: Quality Review** — Does code meet quality standards?

Both gates must pass before task is marked complete.

### Result Aggregation

When parallel `Agent` tool calls return:

1. Collect all results
2. Check for conflicts or contradictions
3. Synthesize into unified view
4. Report any disagreements for human review

---

## §13 GIT & BRANCH PROTOCOLS

### Conventional Commits

```
<type>(<scope>): <description>

Types: feat, fix, docs, test, refactor, chore, style, perf, ci, build
```

Examples:

- `feat(auth): add OAuth2 login flow`
- `fix(api): handle null response from payment gateway`
- `test(user): add acceptance tests for registration`
- `docs(readme): update installation instructions`

### Ralph-Friendly Work Branches

Scope autonomous work to feature branches:

```
git checkout -b ralph/<scope>
```

Each branch gets its own `IMPLEMENTATION_PLAN.md`. Only tasks for that scope are included.

### Branch Completion

Use `finishing-a-development-branch` skill for structured options:

- Merge to main/develop
- Create pull request
- Cleanup and archive

### Safety Rules

- **Never** skip hooks (`--no-verify`)
- **Never** force-push without explicit user confirmation
- **Never** amend published commits without confirmation
- **Always** use conventional commit format
- **Always** include rationale in commit messages

---

## §14 ANTI-PATTERNS & RATIONALIZATION PREVENTION

These thoughts mean STOP — you are rationalizing:


| Red-Flag Thought                            | Correct Response                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| "This is just a simple question"            | Questions are tasks. Check for skills.                                        |
| "I need more context first"                 | Skill check comes BEFORE clarifying questions.                                |
| "Let me explore the codebase first"         | Skills tell you HOW to explore. Check first.                                  |
| "This doesn't need a formal skill"          | If a skill exists, use it. No exceptions.                                     |
| "I remember this skill"                     | Skills evolve. Read current version via Skill tool.                           |
| "The skill is overkill"                     | Simple things become complex. Use it.                                         |
| "I'll just do this one thing first"         | Check for skills BEFORE doing anything.                                       |
| "Tests aren't needed for this"              | [HARD-GATE:TDD] TDD is not optional. Write the test first.                    |
| "I'll review later"                         | [HARD-GATE:REVIEW] Review NOW. No merge without review.                       |
| "I can skip verification"                   | [HARD-GATE:VERIFY] Verification is mandatory.                                 |
| "The loop is stuck, let me skip ahead"      | Circuit breaker protocol. Don't skip — diagnose.                              |
| "The spec is obvious, I'll skip writing it" | [HARD-GATE:SPEC] Write it. JTBD methodology.                                  |
| "I can eyeball the quality"                 | Use deterministic tests or LLM-as-judge. Never eyeball.                       |
| "Let me just push this quick fix"           | Plan → TDD → Review → Verify. Even for "quick" fixes.                         |
| "The acceptance criteria are implicit"      | Make them explicit. Given/When/Then. Always.                                  |
| "I'll add tests after"                      | RED comes before GREEN. Tests first. Always.                                  |
| "This refactor doesn't need tests"          | If behavior changes, tests change. If it doesn't, existing tests protect you. |


---

## §15 FIND-SKILLS INTEGRATION

When toolkit skills don't cover a specific need:

### Discovery

```bash
npx skills find [query]       # Search the skills ecosystem
```

### Quality Verification


| Criterion         | Minimum                                   |
| ----------------- | ----------------------------------------- |
| Weekly installs   | 1,000+ preferred                          |
| Source reputation | Prefer vercel-labs, anthropics, microsoft |
| GitHub stars      | Consider as secondary signal              |


### Installation

```bash
npx skills add <owner/repo@skill> -g -y    # Install globally
npx skills check                            # Check for updates
npx skills update                           # Update all
```

### When to Search

- Task requires domain-specific knowledge not covered by 64 toolkit skills
- User asks about capabilities the toolkit doesn't have
- A specialized framework or technology needs dedicated guidance

---

## §16 WORKFLOW EXAMPLES

### New Feature (Full Lifecycle)

```
1. /brainstorm     → Explore the idea, create design doc
2. /specs          → Write specifications with JTBD methodology
3. /plan           → Create implementation plan with bite-sized tasks
4. /execute        → Execute plan with TDD and tracked progress
5. /review         → Verify against plan and standards
6. /verify         → Confirm everything works with fresh evidence
7. finish-branch   → Merge, PR, or cleanup
```

### Bug Fix

```
1. /debug          → Systematic 4-phase debugging methodology
2. /tdd            → Write test that reproduces bug, then fix
3. /review         → Verify the fix
4. /verify         → Confirm fix with fresh evidence
```

### Ralph Autonomous Session

```
1. /specs          → Write or audit specifications
2. /ralph          → Start autonomous loop
   → PLANNING MODE: analyze specs, generate IMPLEMENTATION_PLAN.md
   → BUILDING MODE: select task, implement, test, commit
   → STATUS CHECK: produce RALPH_STATUS, evaluate exit gate
   → LOOP until dual-condition exit gate passes
3. /review         → Final code review
4. /verify         → Verify all acceptance tests pass
```

### Legacy Codebase Onboarding

```
1. /learn          → Scan and discover project context
2. reverse-engineering-specs → Generate specs from existing code
3. /specs          → Audit and refine generated specs
4. /plan           → Plan improvements or new features
5. /execute        → Implement with full test coverage
```

### API Design & Implementation

```
1. api-design      → Design endpoints, generate OpenAPI spec
2. /specs          → Write behavioral specifications
3. /plan           → Create implementation plan
4. testing-strategy → Define test approach
5. /tdd            → Implement with tests
6. security-review → Check for vulnerabilities
```

### Frontend Component Development

```
1. frontend-ui-design → Component architecture, a11y, responsive design
2. /plan              → Create implementation plan
3. /tdd               → Implement with tests
4. performance-opt    → Check bundle size, Web Vitals
5. /review            → Code review
```

### Database Schema Change

```
1. database-schema-design → Model data, plan migrations, indexing
2. /plan                  → Create implementation plan
3. /tdd                   → Implement with migration tests
4. /verify                → Verify migrations work both directions
```

### Documentation Generation

```
1. /docs           → Generate technical documentation from code
2. /prd            → Create Product Requirements Documents
3. llm-as-judge    → Evaluate documentation quality
```

### Security Audit

```
1. security-review → OWASP Top 10, auth patterns, input validation
2. /plan           → Plan remediation
3. /tdd            → Fix vulnerabilities with regression tests
4. /verify         → Confirm all issues resolved
```

### Performance Optimization

```
1. performance-optimization → Profile, identify bottlenecks
2. /plan                    → Plan optimization approach
3. /tdd                     → Implement with benchmark tests
4. /verify                  → Confirm performance targets met
```

