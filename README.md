# superkit-agents

**Complete AI-optimized development environment for Claude Code**

[![npm version](https://img.shields.io/npm/v/@pixelandprocess/superkit-agents)](https://www.npmjs.com/package/@pixelandprocess/superkit-agents)
[![license](https://img.shields.io/npm/l/@pixelandprocess/superkit-agents)](LICENSE)
[![node](https://img.shields.io/node/v/@pixelandprocess/superkit-agents)](package.json)
[![CI](https://github.com/fwartner/claude-master/actions/workflows/ci.yml/badge.svg)](https://github.com/fwartner/claude-master/actions/workflows/ci.yml)
[![Test](https://github.com/fwartner/claude-master/actions/workflows/test.yml/badge.svg)](https://github.com/fwartner/claude-master/actions/workflows/test.yml)

## Quick Start

```bash
npx @pixelandprocess/superkit-agents
```

The interactive wizard guides you through selecting skills, agents, commands, hooks, and memory — then installs everything into your project or global `.claude/` directory.

For a full non-interactive install:

```bash
npx @pixelandprocess/superkit-agents --all
```

## What's Included

| 64 Skills | 20 Agents | 31 Commands | Hooks | Memory System |
|:---------:|:--------:|:-----------:|:-----:|:-------------:|
| Structured workflows for every phase of development | Specialized sub-agents for parallel work | Slash commands that trigger skills | Session-start context injection | Persistent project knowledge |

Now with **Ralph integration** — autonomous iterative development loops with circuit breakers, structured status reporting, JTBD specifications, and acceptance-driven backpressure.

---

## Skills

### Core (6)

| Skill | Description |
|-------|-------------|
| `using-toolkit` | Master skill — establishes how to find and use all toolkit skills |
| `self-learning` | Auto-discover and remember project context |
| `resilient-execution` | Never fail — retry with alternative approaches |
| `circuit-breaker` | Loop stagnation detection, rate limiting, and recovery patterns |
| `auto-improvement` | Self-improving system, tracks effectiveness, learns from errors |
| `verification-before-completion` | 5-step verification gate before any completion claim |

### Process & Workflow (9)

| Skill | Description |
|-------|-------------|
| `brainstorming` | Creative exploration and design before planning |
| `planning` | Structured planning before any implementation work |
| `task-management` | Break work into discrete tracked steps |
| `executing-plans` | Step-by-step execution of approved plan documents |
| `subagent-driven-development` | Same-session execution with two-stage review gates |
| `dispatching-parallel-agents` | Coordinate multiple independent agents in parallel |
| `autonomous-loop` | Ralph-style iterative development with autonomous planning and building loops |
| `ralph-status` | Structured status reporting with exit signal protocol |
| `task-decomposition` | Hierarchical breakdown, dependency mapping, parallelization |

### Quality Assurance (17)

| Skill | Description |
|-------|-------------|
| `code-review` | Quality verification against plan and standards |
| `test-driven-development` | TDD workflow with RED-GREEN-REFACTOR cycle |
| `testing-strategy` | Choose testing approach based on project context |
| `systematic-debugging` | 4-phase debugging methodology with root cause analysis |
| `security-review` | OWASP Top 10, auth patterns, input validation, secrets |
| `performance-optimization` | Profiling, caching, bundle optimization, Web Vitals |
| `acceptance-testing` | Acceptance-driven backpressure with behavioral validation gates |
| `llm-as-judge` | Non-deterministic validation for subjective quality criteria |
| `senior-frontend` | React/Next.js/TypeScript specialist, >85% test coverage |
| `senior-backend` | API design, microservices, event-driven architecture |
| `senior-architect` | System design, scalability, trade-off analysis, ADRs |
| `senior-fullstack` | End-to-end development across the full stack |
| `clean-code` | SOLID, DRY, code smells, refactoring patterns |
| `react-best-practices` | React hooks, context, suspense, server components |
| `webapp-testing` | Playwright-based web testing, screenshots, browser logs |
| `senior-prompt-engineer` | Prompt design, optimization, chain-of-thought |
| `senior-data-scientist` | ML pipelines, statistical analysis, experiment design |

### Design (3)

| Skill | Description |
|-------|-------------|
| `api-design` | Structured API endpoint design with OpenAPI spec |
| `frontend-ui-design` | Component architecture, responsive design, accessibility |
| `database-schema-design` | Data modeling, migrations, indexing, query optimization |

### Documentation (5)

| Skill | Description |
|-------|-------------|
| `prd-generation` | Generate Product Requirements Documents |
| `tech-docs-generator` | Generate technical documentation from code |
| `writing-skills` | Create new skills with TDD and best practices |
| `spec-writing` | JTBD-based specification writing with acceptance criteria |
| `reverse-engineering-specs` | Generate implementation-free specs from existing codebases |

### Operations (7)

| Skill | Description |
|-------|-------------|
| `deployment` | CI/CD pipeline generation and deploy checklists |
| `using-git-worktrees` | Isolated development environments with git worktrees |
| `finishing-a-development-branch` | Structured branch completion with merge options |
| `git-commit-helper` | Conventional commits, semantic versioning, changelogs |
| `senior-devops` | CI/CD, Docker, Kubernetes, infrastructure-as-code |
| `mcp-builder` | MCP server development, tools, resources, transport layers |
| `agent-development` | Building AI agents, tool use, memory, planning |

### Creative (6)

| Skill | Description |
|-------|-------------|
| `ui-ux-pro-max` | Full UI/UX design intelligence with 67 styles, 161 palettes, 57 fonts |
| `ui-design-system` | Design tokens, component libraries, Tailwind CSS, responsive patterns |
| `canvas-design` | HTML Canvas, SVG, data visualization, generative art |
| `mobile-design` | React Native, Flutter, SwiftUI, platform HIG compliance |
| `ux-researcher-designer` | User research, personas, journey maps, usability testing |
| `artifacts-builder` | Generate standalone artifacts, interactive demos, prototypes |

### Business (3)

| Skill | Description |
|-------|-------------|
| `seo-optimizer` | Technical SEO, meta tags, structured data, Core Web Vitals |
| `content-research-writer` | Research methodology, long-form content, citations |
| `content-creator` | Marketing copy, social media, brand voice |

### Document Processing (3)

| Skill | Description |
|-------|-------------|
| `docx-processing` | Word document generation, template filling |
| `pdf-processing` | PDF generation, form filling, OCR, merge/split |
| `xlsx-processing` | Excel manipulation, formulas, charts |

### Productivity (1)

| Skill | Description |
|-------|-------------|
| `file-organizer` | Project structure, file naming, directory architecture |

### Communication (1)

| Skill | Description |
|-------|-------------|
| `email-composer` | Professional email drafting, tone adjustment |

### Frameworks & Languages (3)

| Skill | Description |
|-------|-------------|
| `laravel-specialist` | Laravel development — Eloquent, Blade, Livewire, queues, Pest testing |
| `php-specialist` | Modern PHP 8.x — enums, fibers, readonly, PSR standards, static analysis |
| `laravel-boost` | Laravel Boost performance optimization — caching, database, Octane |

---

## Commands

Slash commands trigger skills directly in Claude Code:

| Command | Description |
|---------|-------------|
| `/plan` | Start structured planning |
| `/brainstorm` | Start brainstorming session |
| `/execute` | Execute an approved plan |
| `/tdd` | Start TDD workflow |
| `/debug` | Start debugging methodology |
| `/review` | Request code review |
| `/verify` | Verify completion claim |
| `/prd` | Generate a PRD |
| `/learn` | Scan and learn project context |
| `/docs` | Generate technical docs |
| `/worktree` | Set up git worktree |
| `/ralph` | Start Ralph autonomous development loop |
| `/specs` | Write or audit specifications |
| `/loop` | Start autonomous loop iteration |
| `/frontend` | Senior frontend development |
| `/backend` | Senior backend development |
| `/architect` | Architecture design and review |
| `/fullstack` | Full-stack development |
| `/design-system` | Design system generation |
| `/ui-ux` | UI/UX design intelligence |
| `/mobile` | Mobile design patterns |
| `/clean` | Clean code review |
| `/devops` | DevOps and infrastructure |
| `/agent` | AI agent development |
| `/seo` | SEO optimization |
| `/email` | Email composition |
| `/mcp` | MCP server development |
| `/commit` | Git commit helper |
| `/decompose` | Task decomposition |
| `/laravel` | Laravel development |
| `/php` | Modern PHP development |

---

## Agents

Specialized sub-agents dispatched for parallel or focused work:

| Agent | Description |
|-------|-------------|
| `planner` | Senior architect creating implementation plans |
| `code-reviewer` | Reviews code against plan and standards |
| `prd-writer` | Generates PRD from collected requirements |
| `doc-generator` | Generates technical documentation from code |
| `spec-reviewer` | Reviews implementation against spec compliance |
| `quality-reviewer` | Reviews code quality, patterns, performance, security |
| `loop-orchestrator` | Manages autonomous development loop iterations |
| `spec-writer` | Generates JTBD specifications with acceptance criteria |
| `acceptance-judge` | Evaluates subjective quality via LLM-as-judge pattern |
| `frontend-developer` | Three-phase frontend dev with context discovery, development, handoff |
| `ui-ux-designer` | Design system generation, component specs, style guides |
| `backend-architect` | Service boundaries, contract-first API, scaling |
| `context-manager` | Project context tracking, dependency mapping |
| `database-architect` | Multi-DB strategy, domain-driven design, event sourcing |
| `architect-reviewer` | Architecture review, scalability assessment, tech debt |
| `typescript-pro` | Advanced type patterns, conditional types, branded types |
| `task-decomposer` | Hierarchical task breakdown, parallelization strategy |
| `mobile-developer` | Cross-platform mobile, platform-specific patterns |
| `laravel-developer` | Laravel specialist with Eloquent, Blade, Livewire, and Pest expertise |
| `php-developer` | Modern PHP 8.x development with PSR compliance and static analysis |

---

## Ralph Integration

The toolkit integrates key concepts from [Ralph](https://github.com/frankbria/ralph-claude-code) and the [Ralph Playbook](https://github.com/ClaytonFarr/ralph-playbook) — an autonomous AI development methodology by Geoffrey Huntley.

### Autonomous Loop (`/ralph` or `/loop`)

Iterative development cycle: **PLANNING** → **BUILDING** → **STATUS CHECK** → repeat until done.

- **ONE task per loop** — each iteration selects and completes exactly one task
- **Context efficiency** — main context at 40-60% utilization, up to 500 parallel read subagents
- **Upstream/downstream steering** — specs shape inputs, tests/builds/lints create backpressure
- **Dual-condition exit gate** — requires both completion language AND explicit `EXIT_SIGNAL: true`

### Circuit Breaker

Safety mechanism preventing infinite loops and resource exhaustion:

- Opens after 3 loops with no progress, 5 identical errors, or 70% output decline
- 30-minute cooldown before retry
- Rate limiting (configurable calls per hour)
- File protection prevents accidental config deletion

### JTBD Specifications (`/specs`)

Jobs to Be Done methodology for writing implementation-free specs:

- Break requirements into topics of concern
- "One Sentence Without 'And'" test for proper scoping
- Acceptance criteria in Given/When/Then format
- SLC (Simple/Lovable/Complete) release planning

### Acceptance Testing & LLM-as-Judge

- **Acceptance testing** — backpressure chain: specs → tests → code (fix code, not specs)
- **LLM-as-judge** — structured rubric evaluation for subjective criteria (tone, UX, readability)

---

## Installation

### Modes

| Mode | Directory | Use Case |
|------|-----------|----------|
| **Plugin** (default) | `.claude-plugin/` | Isolated, portable, easy to update |
| **Direct** | `.claude/` | Merged into existing Claude Code config |

### Scope

| Scope | Path | Use Case |
|-------|------|----------|
| **Project** (default) | `./.claude/` or `./.claude-plugin/` | Per-project setup |
| **Global** | `~/.claude/` or `~/.claude-plugin/` | Available everywhere |

### Interactive vs CLI

```bash
# Interactive wizard (recommended)
npx @pixelandprocess/superkit-agents

# Full install, no prompts
npx @pixelandprocess/superkit-agents --all

# Global plugin install
npx @pixelandprocess/superkit-agents --all --global

# Direct install (no plugin wrapper)
npx @pixelandprocess/superkit-agents --all --direct

# Selective skills
npx @pixelandprocess/superkit-agents --skills planning,tdd,code-review,autonomous-loop
```

---

## Update

Check for updates and get the latest version:

```bash
superkit-agents update
```

This checks the npm registry for newer versions and provides upgrade instructions. Your installation preferences are automatically saved and reused on update.

---

## Laravel Detection

When running in a Laravel project directory (detected via `composer.json`), superkit-agents automatically:

1. Detects the Laravel framework dependency
2. Prompts to install **Laravel Boost** (`composer require laravel/boost`) for performance optimization
3. Auto-selects `laravel-specialist`, `php-specialist`, and `laravel-boost` skills

---

## CLI Flags

| Flag | Description |
|------|-------------|
| `--all` | Install everything non-interactively |
| `--global` | Install to `~/.claude/` instead of `./.claude/` |
| `--plugin` | Install as a `.claude-plugin/` plugin |
| `--direct` | Install directly into `.claude/` directories |
| `--skills <list>` | Comma-separated list of skills to install |
| `--no-hooks` | Skip hooks installation |
| `--no-memory` | Skip memory structure creation |
| `--no-claude-md` | Skip CLAUDE.md generation |
| `--dry-run` | Show what would be installed without making changes |

---

## Hooks & Session Start

The toolkit installs a `hooks.json` that triggers on Claude Code session events:

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup|resume|clear|compact",
      "hooks": [{
        "type": "command",
        "command": "'${CLAUDE_PLUGIN_ROOT}/hooks/session-start'"
      }]
    }]
  }
}
```

On every session start, resume, clear, or compact:
1. The `using-toolkit` skill is loaded into context
2. Memory files (`project-context.md`, `learned-patterns.md`, `user-preferences.md`) are injected
3. Claude Code receives the toolkit's full skill catalog and workflow guidance

---

## Memory System

Four persistent memory files store project knowledge across sessions:

| File | Purpose |
|------|---------|
| `project-context.md` | Tech stack, architecture, dependencies |
| `learned-patterns.md` | Coding conventions and patterns |
| `user-preferences.md` | Communication and workflow preferences |
| `decisions-log.md` | Architectural decisions with rationale |
| `improvement-log.md` | Self-improvement tracking and effectiveness metrics |

- Auto-loaded on session start via the session-start hook
- Updated by the `self-learning` skill (`/learn`)
- Persists across conversations for continuity

---

## CLAUDE.md Merge Behavior

When installing, the toolkit handles existing `CLAUDE.md` files safely:

- Wraps toolkit content in `<!-- TOOLKIT START -->` / `<!-- TOOLKIT END -->` markers
- Backs up existing `CLAUDE.md` before modifying
- Preserves all user content outside the markers
- Re-running the installer updates only the toolkit section

---

## Workflow Examples

### New Feature

```
/brainstorm     → explore the idea, create design doc
/specs          → write specifications with JTBD methodology
/plan           → create implementation plan with tasks
/execute        → execute plan with TDD and progress tracking
/review         → verify against plan and standards
/verify         → confirm everything works with fresh evidence
```

### Bug Fix

```
/debug          → systematic 4-phase debugging methodology
/tdd            → write test that reproduces bug, then fix
/review         → verify the fix
/verify         → confirm fix with fresh evidence
```

### Ralph Autonomous Session

```
/specs          → write or audit specifications
/ralph          → start autonomous loop
                  → PLANNING: analyze specs, generate implementation plan
                  → BUILDING: select task, implement, test, commit
                  → STATUS: produce RALPH_STATUS, evaluate exit gate
                  → repeat until dual-condition exit gate passes
/review         → final code review
/verify         → verify all acceptance tests pass
```

### Legacy Codebase Onboarding

```
/learn                      → scan and discover project context
reverse-engineering-specs   → generate specs from existing code
/specs                      → audit and refine generated specs
/plan                       → plan improvements
```

### Documentation

```
/docs           → generate technical documentation from code
/prd            → create Product Requirements Documents
```

---

## Architecture

```
templates/
├── skills/                    # 64 skill directories
│   ├── using-toolkit/SKILL.md
│   ├── planning/SKILL.md
│   ├── brainstorming/SKILL.md
│   ├── task-management/SKILL.md
│   ├── executing-plans/SKILL.md
│   ├── subagent-driven-development/
│   ├── dispatching-parallel-agents/SKILL.md
│   ├── code-review/SKILL.md
│   ├── test-driven-development/
│   ├── testing-strategy/SKILL.md
│   ├── systematic-debugging/
│   ├── security-review/
│   ├── performance-optimization/
│   ├── api-design/SKILL.md
│   ├── frontend-ui-design/SKILL.md
│   ├── database-schema-design/SKILL.md
│   ├── prd-generation/SKILL.md
│   ├── tech-docs-generator/SKILL.md
│   ├── writing-skills/
│   ├── deployment/SKILL.md
│   ├── using-git-worktrees/SKILL.md
│   ├── finishing-a-development-branch/SKILL.md
│   ├── self-learning/SKILL.md
│   ├── resilient-execution/SKILL.md
│   ├── verification-before-completion/SKILL.md
│   ├── autonomous-loop/SKILL.md        # NEW: Ralph loop
│   ├── circuit-breaker/SKILL.md        # NEW: Stagnation detection
│   ├── ralph-status/SKILL.md           # NEW: Status reporting
│   ├── spec-writing/SKILL.md           # NEW: JTBD specs
│   ├── reverse-engineering-specs/SKILL.md  # NEW: Legacy specs
│   ├── acceptance-testing/SKILL.md     # NEW: Backpressure
│   ├── llm-as-judge/SKILL.md          # NEW: Subjective quality
│   ├── laravel-specialist/SKILL.md    # NEW: Laravel development
│   ├── php-specialist/SKILL.md        # NEW: Modern PHP 8.x
│   └── laravel-boost/SKILL.md         # NEW: Laravel Boost optimization
├── agents/                    # 20 agent definitions
│   ├── planner.md
│   ├── code-reviewer.md
│   ├── prd-writer.md
│   ├── doc-generator.md
│   ├── spec-reviewer.md
│   ├── quality-reviewer.md
│   ├── loop-orchestrator.md            # NEW
│   ├── spec-writer.md                  # NEW
│   ├── acceptance-judge.md             # NEW
│   ├── laravel-developer.md           # NEW: Laravel specialist
│   └── php-developer.md               # NEW: PHP specialist
├── commands/                  # 31 slash commands
│   ├── plan.md
│   ├── brainstorm.md
│   ├── execute.md
│   ├── tdd.md
│   ├── debug.md
│   ├── review.md
│   ├── verify.md
│   ├── prd.md
│   ├── learn.md
│   ├── docs.md
│   ├── worktree.md
│   ├── ralph.md                        # NEW
│   ├── specs.md                        # NEW
│   ├── loop.md                         # NEW
│   ├── laravel.md                      # NEW: Laravel development
│   └── php.md                          # NEW: PHP development
├── hooks/
│   ├── hooks.json
│   └── session-start
├── memory/
│   ├── project-context.md
│   ├── learned-patterns.md
│   ├── user-preferences.md
│   └── decisions-log.md
├── claude-plugin/
│   └── plugin.json
└── CLAUDE.md
```

---

## CI/CD

The toolkit includes GitHub Actions workflows:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **test.yml** | Push to main/develop, PRs | Run tests on Node 18/20/22 matrix with coverage |
| **ci.yml** | Push to main, PRs | Lint + dry-run CLI validation |
| **release.yml** | Tag push (`v*`) | Publish to npm with provenance, create GitHub Release |
| **claude.yml** | `@claude` in issues/PRs | Claude Code action for automated assistance |

### Required Secrets

| Secret | Purpose |
|--------|---------|
| `NPM_TOKEN` | npm publish authentication |
| `ANTHROPIC_API_KEY` | Claude Code action (optional) |

---

## Configuration & Customization

### Selective Skill Installation

Install only the skills you need:

```bash
npx @pixelandprocess/superkit-agents --skills planning,tdd,code-review,autonomous-loop
```

Or use the interactive wizard to pick categories and individual skills.

### Custom Skills

Add your own skills alongside toolkit ones. Each skill is a directory containing a `SKILL.md` file:

```
.claude/skills/my-custom-skill/SKILL.md
```

### Find More Skills

When the toolkit's 64 skills don't cover your needs:

```bash
npx skills find [query]                    # Search the ecosystem
npx skills add <owner/repo@skill> -g -y    # Install
npx skills check                           # Check for updates
```

---

## Skill Format Reference

Skills use markdown with YAML frontmatter:

```markdown
---
name: my-skill
description: What this skill does (one line)
triggers:
  - keyword or phrase that activates this skill
  - another trigger phrase
---

## Purpose
What this skill accomplishes.

## Process
Step-by-step instructions Claude follows when this skill is invoked.

## Output
What the skill produces.
```

The `name` and `description` fields are required. `triggers` help Claude identify when to use the skill automatically.

---

## License

[MIT](LICENSE)
