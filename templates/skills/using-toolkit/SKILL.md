---
name: using-toolkit
description: Use when starting any conversation - establishes how to find and use all toolkit skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## How to Access Skills

**In Claude Code:** Use the `Skill` tool. When you invoke a skill, its content is loaded and presented to you — follow it directly. Never use the Read tool on skill files.

# Using Toolkit Skills

## The Rule

**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means you should invoke the skill to check.

## Available Skills (32 Total)

### Core Skills (4)
| Skill | When to Use |
|-------|------------|
| `using-toolkit` | Session start — establishes skill usage |
| `self-learning` | Starting work on unfamiliar projects, or when corrected |
| `resilient-execution` | When an approach fails — ensures retry with alternatives |
| `circuit-breaker` | Autonomous loops, repeated operations, stagnation detection |

### Process & Workflow Skills (7)
| Skill | When to Use |
|-------|------------|
| `planning` | Before ANY implementation — forces structured planning |
| `brainstorming` | Before creative work — exploring ideas, features, designs |
| `task-management` | Breaking work into tracked steps during implementation |
| `executing-plans` | Executing approved plan documents step by step |
| `subagent-driven-development` | Multi-task execution with two-stage review gates |
| `dispatching-parallel-agents` | Running multiple independent tasks concurrently |
| `autonomous-loop` | Ralph-style iterative autonomous development loops |

### Quality Assurance Skills (8)
| Skill | When to Use |
|-------|------------|
| `code-review` | After completing tasks, before committing |
| `test-driven-development` | Writing any new code (RED-GREEN-REFACTOR) |
| `systematic-debugging` | Investigating bugs, errors, unexpected behavior |
| `testing-strategy` | Choosing testing approach for a project |
| `security-review` | Reviewing for vulnerabilities, auth, input validation |
| `performance-optimization` | Optimizing speed, reducing load times |
| `acceptance-testing` | Validating implementation meets spec acceptance criteria |
| `llm-as-judge` | Evaluating subjective quality (tone, UX, readability, aesthetics) |

### Documentation Skills (5)
| Skill | When to Use |
|-------|------------|
| `prd-generation` | Generating Product Requirements Documents |
| `tech-docs-generator` | Generating or updating technical documentation |
| `writing-skills` | Creating new skills, commands, or agent definitions |
| `spec-writing` | Writing specifications with JTBD methodology and acceptance criteria |
| `reverse-engineering-specs` | Generating implementation-free specs from existing codebases |

### Design Skills (3)
| Skill | When to Use |
|-------|------------|
| `api-design` | Designing API endpoints and generating specs |
| `frontend-ui-design` | Component architecture, responsive design, accessibility |
| `database-schema-design` | Data modeling, migrations, indexing |

### Operations Skills (3)
| Skill | When to Use |
|-------|------------|
| `deployment` | Setting up CI/CD pipelines and deploy checklists |
| `using-git-worktrees` | Creating isolated development environments |
| `finishing-a-development-branch` | Completing work on a branch, preparing to merge |

### Status & Reporting Skills (2)
| Skill | When to Use |
|-------|------------|
| `ralph-status` | End of every autonomous loop iteration — structured progress reporting |
| `verification-before-completion` | Before claiming ANY task is complete |

## Skill Priority

When multiple skills could apply, use this order:

1. **Process skills first** (brainstorming, planning, task-management, autonomous-loop) — HOW to approach
2. **Quality skills second** (TDD, code-review, testing-strategy, acceptance-testing) — validate the work
3. **Documentation skills third** (prd-generation, tech-docs-generator, spec-writing) — capture the work
4. **Design skills fourth** (api-design, frontend-ui-design, database-schema-design) — guide specifics
5. **Operations skills fifth** (deployment, git-worktrees) — ship the work
6. **Status skills last** (ralph-status, verification-before-completion) — report and verify

## Workflow Patterns

- **"Build feature X"** → brainstorming → planning → executing-plans → code-review → verification
- **"Fix bug Y"** → systematic-debugging → TDD → code-review → verification
- **"Write new code"** → test-driven-development (always)
- **"Run autonomously"** → autonomous-loop → ralph-status → circuit-breaker
- **"Write specs"** → spec-writing (JTBD methodology)
- **"Understand legacy code"** → reverse-engineering-specs → spec-writing (audit)
- **"Check acceptance criteria"** → acceptance-testing (backpressure chain)
- **"Validate subjective quality"** → llm-as-judge (rubric-based evaluation)
- **"Document the API"** → tech-docs-generator or api-design
- **"Create a PRD for Z"** → prd-generation
- **"Set up CI/CD"** → deployment
- **"How should we test?"** → testing-strategy
- **"Design the database"** → database-schema-design
- **"Build a UI component"** → frontend-ui-design
- **"Check for security issues"** → security-review
- **"Make it faster"** → performance-optimization
- **"Done with this branch"** → finishing-a-development-branch

## Red Flags

These thoughts mean STOP — you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "I can skip verification" | NO. Verification-before-completion is mandatory. |
| "Tests aren't needed for this" | TDD is not optional. Write the test first. |
| "I'll review later" | Review NOW. No merge without review. |
| "The loop is stuck, skip ahead" | Circuit breaker protocol. Diagnose, don't skip. |
| "The spec is obvious" | Write it. JTBD methodology. No exceptions. |
| "I can eyeball the quality" | Use LLM-as-judge or deterministic tests. |
| "Acceptance criteria are implicit" | Make them explicit. Given/When/Then. Always. |

## Core Behavioral Rules

1. **Always plan before coding** — No code without an approved plan
2. **Always use TDD** — No production code without a failing test first
3. **Always verify completion** — No claims without fresh evidence
4. **Always review code** — No merge without review
5. **Always use subagents** — Dispatch for independent parallel tasks without asking
6. **Always self-learn** — Continuously discover and remember project context
7. **Never fail** — Try at least 3 approaches before escalating
8. **Always report status** — Produce RALPH_STATUS in autonomous loops
9. **Always protect files** — Never delete config files during autonomous operations
10. **Always write specs** — No implementation without behavioral acceptance criteria

## Skill Types

**Rigid** (TDD, debugging, planning, verification, task-management, code-review, autonomous-loop, circuit-breaker, ralph-status, spec-writing, reverse-engineering-specs, acceptance-testing): Follow exactly. Don't adapt away discipline.

**Flexible** (brainstorming, tech-docs, api-design, frontend, database, performance, security-review, testing-strategy, llm-as-judge, prd-generation): Adapt principles to context.

## Find Missing Skills

When toolkit skills don't cover the need:
```bash
npx skills find [query]                    # Search ecosystem
npx skills add <owner/repo@skill> -g -y    # Install
npx skills check                           # Check for updates
```

Prefer skills with 1K+ weekly installs from reputable sources (vercel-labs, anthropics, microsoft).
