---
name: using-toolkit
description: Use when starting any conversation, receiving a new task, or when uncertain which skill applies - establishes how to find and use all 64 toolkit skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## Overview

Master catalog and dispatch system for all 64 toolkit skills. Ensures proper skill identification at conversation start.

## How to Access Skills

**In Claude Code:** Use the `Skill` tool. When you invoke a skill, its content is loaded and presented to you — follow it directly. Never use the Read tool on skill files.

---

## Phase 1: Skill Identification

Before ANY action: scan catalog, identify ALL matching skills (even 1% relevance), invoke via Skill tool.

---

## Phase 2: Skill Prioritization

Invoke in order: (1) Process (brainstorming, planning) → (2) Specialist (frontend, backend, architect) → (3) Quality (TDD, review) → (4) Docs → (5) Design → (6) Ops → (7) Terminal (verification).

---

## Phase 3: Skill Execution

**Rigid skills:** Follow exactly. **Flexible skills:** Adapt to context. Always invoke `verification-before-completion` before claiming done.

---

## Available Skills (64 Total)

### Core Skills (6)
| Skill | When to Use |
|-------|------------|
| `using-toolkit` | Session start — establishes skill usage |
| `self-learning` | Starting work on unfamiliar projects, or when corrected |
| `resilient-execution` | When an approach fails — ensures retry with alternatives |
| `circuit-breaker` | Autonomous loops, repeated operations, stagnation detection |
| `auto-improvement` | Self-improving system, tracks effectiveness, learns from errors |
| `verification-before-completion` | Before claiming ANY task is complete |

### Process & Workflow Skills (9)
| Skill | When to Use |
|-------|------------|
| `planning` | Before ANY implementation — forces structured planning |
| `brainstorming` | Before creative work — exploring ideas, features, designs |
| `task-management` | Breaking work into tracked steps during implementation |
| `executing-plans` | Executing approved plan documents step by step |
| `subagent-driven-development` | Multi-task execution with two-stage review gates |
| `dispatching-parallel-agents` | Running multiple independent tasks concurrently |
| `autonomous-loop` | Ralph-style iterative autonomous development loops |
| `ralph-status` | End of every autonomous loop iteration — structured progress reporting |
| `task-decomposition` | Hierarchical task breakdown, dependency mapping, parallelization |

### Quality Assurance Skills (17)
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
| `senior-frontend` | React/Next.js/TypeScript specialist with >85% test coverage |
| `senior-backend` | API design, microservices, event-driven architecture |
| `senior-architect` | System design, scalability, trade-off analysis, ADRs |
| `senior-fullstack` | End-to-end development across the full stack |
| `clean-code` | SOLID, DRY, code smells, refactoring patterns |
| `react-best-practices` | React hooks, context, suspense, server components |
| `webapp-testing` | Playwright-based web testing, screenshots, browser logs |
| `senior-prompt-engineer` | Prompt design, optimization, chain-of-thought |
| `senior-data-scientist` | ML pipelines, statistical analysis, experiment design |

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

### Operations Skills (7)
| Skill | When to Use |
|-------|------------|
| `deployment` | Setting up CI/CD pipelines and deploy checklists |
| `using-git-worktrees` | Creating isolated development environments |
| `finishing-a-development-branch` | Completing work on a branch, preparing to merge |
| `git-commit-helper` | Conventional commits, semantic versioning, changelogs |
| `senior-devops` | CI/CD, Docker, Kubernetes, infrastructure-as-code |
| `mcp-builder` | MCP server development, tools, resources, transport layers |
| `agent-development` | Building AI agents, tool use, memory, planning |

### Creative Skills (6)
| Skill | When to Use |
|-------|------------|
| `ui-ux-pro-max` | Full UI/UX design intelligence with styles, palettes, fonts, UX guidelines |
| `ui-design-system` | Design tokens, component libraries, Tailwind CSS, responsive patterns |
| `canvas-design` | HTML Canvas, SVG, data visualization, generative art |
| `mobile-design` | React Native, Flutter, SwiftUI, platform HIG compliance |
| `ux-researcher-designer` | User research, personas, journey maps, usability testing |
| `artifacts-builder` | Generate standalone artifacts, interactive demos, prototypes |

### Business Skills (3)
| Skill | When to Use |
|-------|------------|
| `seo-optimizer` | Technical SEO, meta tags, structured data, Core Web Vitals |
| `content-research-writer` | Research methodology, long-form content, citations |
| `content-creator` | Marketing copy, social media, brand voice |

### Document Processing Skills (3)
| Skill | When to Use |
|-------|------------|
| `docx-processing` | Word document generation, template filling |
| `pdf-processing` | PDF generation, form filling, OCR, merge/split |
| `xlsx-processing` | Excel manipulation, formulas, charts |

### Frameworks & Languages Skills (3)
| Skill | When to Use |
|-------|------------|
| `laravel-specialist` | Laravel development — Eloquent, Blade, Livewire, queues, Pest |
| `php-specialist` | Modern PHP 8.x — PSR standards, static analysis, Composer |
| `laravel-boost` | Laravel Boost performance optimization — caching, queries, N+1 |

### Productivity Skills (1)
| Skill | When to Use |
|-------|------------|
| `file-organizer` | Project structure, file naming, directory architecture |

### Communication Skills (1)
| Skill | When to Use |
|-------|------------|
| `email-composer` | Professional email drafting, tone adjustment |

---

## Decision Table: Choosing the Right Skill

| User Request Contains | Primary Skill | Supporting Skills |
|----------------------|---------------|-------------------|
| "build", "implement", "create feature" | `planning` | `brainstorming`, `tdd`, `code-review` |
| "fix", "bug", "error", "broken" | `systematic-debugging` | `tdd`, `resilient-execution` |
| "test", "coverage", "spec" | `test-driven-development` | `testing-strategy`, `acceptance-testing` |
| "review", "check", "audit" | `code-review` | `security-review`, `clean-code` |
| "plan", "how should we" | `planning` | `brainstorming`, `task-decomposition` |
| "deploy", "CI/CD", "pipeline" | `deployment` | `senior-devops` |
| "API", "endpoint", "REST", "GraphQL" | `api-design` | `senior-backend` |
| "React", "Next.js", "component" | `senior-frontend` | `react-best-practices`, `frontend-ui-design` |
| "Laravel", "Eloquent", "Blade", "Livewire" | `laravel-specialist` | `php-specialist`, `laravel-boost` |
| "PHP", "Composer", "PSR" | `php-specialist` | `laravel-specialist` |
| "database", "schema", "migration" | `database-schema-design` | `senior-backend` |
| "design", "UI", "UX" | `ui-ux-pro-max` | `ui-design-system`, `frontend-ui-design` |
| "mobile", "iOS", "Android" | `mobile-design` | `ui-ux-pro-max` |
| "document", "docs", "README" | `tech-docs-generator` | `prd-generation` |
| "spec", "requirements", "PRD" | `spec-writing` | `prd-generation` |
| "autonomous", "loop", "ralph" | `autonomous-loop` | `ralph-status`, `circuit-breaker` |
| "performance", "optimize", "slow" | `performance-optimization` | `laravel-boost` |
| "security", "vulnerability", "auth" | `security-review` | `senior-backend` |
| "SEO", "meta tags", "search engine" | `seo-optimizer` | `content-research-writer` |
| "email", "draft", "compose" | `email-composer` | `content-creator` |
| "PDF", "Word", "Excel" | `pdf-processing` / `docx-processing` / `xlsx-processing` | — |
| "agent", "AI", "tool use" | `agent-development` | `mcp-builder` |
| "MCP", "server", "transport" | `mcp-builder` | `agent-development` |

---

## Workflow Patterns

| Pattern | Skill Chain |
|---------|-------------|
| "Build feature X" | brainstorming -> planning -> executing-plans -> code-review -> verification |
| "Fix bug Y" | systematic-debugging -> TDD -> code-review -> verification |
| "Write new code" | test-driven-development (always) |
| "Run autonomously" | autonomous-loop -> ralph-status -> circuit-breaker |
| "Write specs" | spec-writing (JTBD methodology) |
| "Understand legacy code" | reverse-engineering-specs -> spec-writing (audit) |
| "Check acceptance criteria" | acceptance-testing (backpressure chain) |
| "Validate subjective quality" | llm-as-judge (rubric-based evaluation) |
| "Document the API" | tech-docs-generator or api-design |
| "Create a PRD for Z" | prd-generation |
| "Set up CI/CD" | deployment |
| "How should we test?" | testing-strategy |
| "Design the database" | database-schema-design |
| "Build a UI component" | frontend-ui-design |
| "Check for security issues" | security-review |
| "Make it faster" | performance-optimization |
| "Done with this branch" | finishing-a-development-branch |
| "Design a UI" | ui-ux-pro-max -> ui-design-system -> frontend-ui-design |
| "Build mobile app" | mobile-design -> planning -> tdd |
| "Optimize SEO" | seo-optimizer |
| "Write marketing copy" | content-creator |
| "Process documents" | docx-processing / pdf-processing / xlsx-processing |
| "Compose email" | email-composer |
| "Build an AI agent" | agent-development -> planning -> tdd |
| "Set up infrastructure" | senior-devops -> deployment |
| "Decompose complex task" | task-decomposition -> dispatching-parallel-agents |
| "Build Laravel feature" | laravel-specialist -> planning -> tdd -> code-review |
| "Optimize Laravel app" | laravel-boost -> performance-optimization -> verification |
| "Write PHP code" | php-specialist -> tdd -> clean-code |

---

## Anti-Patterns

- Never skip skill check for "simple" tasks — always check catalog
- Never invoke skills from memory — use Skill tool for current version
- Never read skill files with Read tool — use Skill tool
- Never skip verification — always invoke `verification-before-completion` last
- Never respond before checking skills — skill check is ALWAYS first

---

## Anti-Rationalization Guards

If you think "This is just simple / I need context first / Let me explore first / This doesn't need a skill / I remember this skill / The skill is overkill / I'll do one thing first" — STOP. Check for skills FIRST. No exceptions.

---

## Integration Points

Key integrations: `self-learning` (project context), `verification-before-completion` (terminal checkpoint), `circuit-breaker` (stall safety), `auto-improvement` (effectiveness tracking), `planning` (most common first skill), `resilient-execution` (failure recovery).

---

## Core Rules

Plan before coding. TDD always. Verify completion with evidence. Review before merge. Use subagents for parallel work. Self-learn continuously. Try 3 approaches before escalating. Report RALPH_STATUS in loops. Protect config files. Write specs with acceptance criteria.

---

## Skill Types

**Rigid** (TDD, debugging, planning, verification, code-review, autonomous-loop, circuit-breaker, spec-writing, acceptance-testing): Follow exactly.
**Flexible** (brainstorming, tech-docs, api-design, frontend, database, performance, security-review, prd-generation, laravel-specialist, php-specialist): Adapt to context.

---

## Find Missing Skills

`npx skills find [query]` to search, `npx skills add <owner/repo@skill> -g -y` to install. Prefer 1K+ weekly installs from reputable sources.

---

## Skill Type

**RIGID** — Skill checking is mandatory. Every task begins with a catalog scan. No exceptions. No rationalization.
