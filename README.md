# @fwartner/claude-toolkit

**Complete AI-optimized development environment for Claude Code**

[![npm version](https://img.shields.io/npm/v/@fwartner/claude-toolkit)](https://www.npmjs.com/package/@fwartner/claude-toolkit)
[![license](https://img.shields.io/npm/l/@fwartner/claude-toolkit)](LICENSE)
[![node](https://img.shields.io/node/v/@fwartner/claude-toolkit)](package.json)

## Quick Start

```bash
npx @fwartner/claude-toolkit
```

The interactive wizard guides you through selecting skills, agents, commands, hooks, and memory — then installs everything into your project or global `.claude/` directory.

For a full non-interactive install:

```bash
npx @fwartner/claude-toolkit --all
```

## What's Included

| 25 Skills | 6 Agents | 11 Commands | Hooks | Memory System |
|:---------:|:--------:|:-----------:|:-----:|:-------------:|
| Structured workflows for every phase of development | Specialized sub-agents for parallel work | Slash commands that trigger skills | Session-start context injection | Persistent project knowledge |

---

## Skills

### Core Process (7)

| Skill | Description |
|-------|-------------|
| `using-toolkit` | Master skill — establishes how to find and use all toolkit skills |
| `brainstorming` | Creative exploration and design before planning |
| `planning` | Structured planning before any implementation work |
| `task-management` | Break work into discrete tracked steps |
| `executing-plans` | Step-by-step execution of approved plan documents |
| `subagent-driven-development` | Same-session execution with two-stage review gates |
| `dispatching-parallel-agents` | Coordinate multiple independent agents in parallel |

### Quality Assurance (6)

| Skill | Description |
|-------|-------------|
| `code-review` | Quality verification against plan and standards |
| `test-driven-development` | TDD workflow with RED-GREEN-REFACTOR cycle |
| `testing-strategy` | Choose testing approach based on project context |
| `systematic-debugging` | 4-phase debugging methodology with root cause analysis |
| `security-review` | OWASP Top 10, auth patterns, input validation, secrets |
| `performance-optimization` | Profiling, caching, bundle optimization, Web Vitals |

### Design (3)

| Skill | Description |
|-------|-------------|
| `api-design` | Structured API endpoint design with OpenAPI spec |
| `frontend-ui-design` | Component architecture, responsive design, accessibility |
| `database-schema-design` | Data modeling, migrations, indexing, query optimization |

### Documentation (3)

| Skill | Description |
|-------|-------------|
| `prd-generation` | Generate Product Requirements Documents |
| `tech-docs-generator` | Generate technical documentation from code |
| `writing-skills` | Create new skills with TDD and best practices |

### Operations (3)

| Skill | Description |
|-------|-------------|
| `deployment` | CI/CD pipeline generation and deploy checklists |
| `using-git-worktrees` | Isolated development environments with git worktrees |
| `finishing-a-development-branch` | Structured branch completion with merge options |

### Foundation (3)

| Skill | Description |
|-------|-------------|
| `self-learning` | Auto-discover and remember project context |
| `resilient-execution` | Never fail — retry with alternative approaches |
| `verification-before-completion` | 5-step verification gate before any completion claim |

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
npx @fwartner/claude-toolkit

# Full install, no prompts
npx @fwartner/claude-toolkit --all

# Global plugin install
npx @fwartner/claude-toolkit --all --global

# Direct install (no plugin wrapper)
npx @fwartner/claude-toolkit --all --direct

# Selective skills
npx @fwartner/claude-toolkit --skills planning,tdd,code-review
```

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

### Documentation

```
/docs           → generate technical documentation from code
/prd            → create Product Requirements Documents
```

### API Design

```
api-design skill → design endpoints, generate OpenAPI spec
/plan            → create implementation plan
testing-strategy → define test approach
/tdd             → implement with tests
```

---

## Architecture

```
templates/
├── skills/                    # 25 skill directories
│   ├── using-toolkit/SKILL.md
│   ├── planning/SKILL.md
│   ├── brainstorming/SKILL.md
│   ├── task-management/SKILL.md
│   ├── executing-plans/SKILL.md
│   ├── subagent-driven-development/
│   │   ├── SKILL.md
│   │   ├── implementer-prompt.md
│   │   ├── spec-reviewer-prompt.md
│   │   └── code-quality-reviewer-prompt.md
│   ├── dispatching-parallel-agents/SKILL.md
│   ├── code-review/SKILL.md
│   ├── test-driven-development/
│   │   ├── SKILL.md
│   │   └── testing-anti-patterns.md
│   ├── testing-strategy/SKILL.md
│   ├── systematic-debugging/
│   │   ├── SKILL.md
│   │   ├── root-cause-tracing.md
│   │   └── defense-in-depth.md
│   ├── security-review/
│   │   ├── SKILL.md
│   │   └── owasp-checklist.md
│   ├── performance-optimization/
│   │   ├── SKILL.md
│   │   └── performance-budgets.md
│   ├── api-design/SKILL.md
│   ├── frontend-ui-design/SKILL.md
│   ├── database-schema-design/SKILL.md
│   ├── prd-generation/SKILL.md
│   ├── tech-docs-generator/SKILL.md
│   ├── writing-skills/
│   │   ├── SKILL.md
│   │   └── anthropic-best-practices.md
│   ├── deployment/SKILL.md
│   ├── using-git-worktrees/SKILL.md
│   ├── finishing-a-development-branch/SKILL.md
│   ├── self-learning/SKILL.md
│   ├── resilient-execution/SKILL.md
│   └── verification-before-completion/SKILL.md
├── agents/                    # 6 agent definitions
│   ├── planner.md
│   ├── code-reviewer.md
│   ├── prd-writer.md
│   ├── doc-generator.md
│   ├── spec-reviewer.md
│   └── quality-reviewer.md
├── commands/                  # 11 slash commands
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
│   └── worktree.md
├── hooks/                     # Session hooks
│   ├── hooks.json
│   └── session-start
├── memory/                    # Memory templates
│   ├── project-context.md
│   ├── learned-patterns.md
│   ├── user-preferences.md
│   └── decisions-log.md
├── claude-plugin/
│   └── plugin.json
└── CLAUDE.md                  # Project guidelines template
```

---

## Configuration & Customization

### Selective Skill Installation

Install only the skills you need:

```bash
npx @fwartner/claude-toolkit --skills planning,tdd,code-review,systematic-debugging
```

Or use the interactive wizard to pick categories and individual skills.

### Custom Skills

Add your own skills alongside toolkit ones. Each skill is a directory containing a `SKILL.md` file:

```
.claude/skills/my-custom-skill/SKILL.md
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
