# Changelog

## [1.3.0] - 2026-03-16

### Changed
- **CLAUDE.md template** (~30% smaller): Removed §1-§3 (duplicated in using-toolkit), condensed §4 skill catalog to single-line format, replaced §6 command reference with pointer to using-toolkit
- **using-toolkit/SKILL.md** (~20% smaller): Condensed phases, anti-patterns, integration points, core rules, and skill types sections
- **Context7 boilerplate** condensed across 11 skill files: replaced 11-14 line boilerplate with 3-line compact reference
- **Agent Coordination sections** compacted in 10 agent templates: replaced verbose tables with single-line dispatch references
- **dispatching-parallel-agents** Agent Tool Reference condensed from 44 lines to 13 lines
- **Session-start hook** streamlined: removed verbose wrapper tags, reduced by ~50 tokens per session
- **Version bumped** to 1.3.0 in package.json, cli.ts
- **Tests updated** to match new CLAUDE.md content structure

### Estimated Impact
- ~2,500+ tokens saved per session through deduplication and condensing
- No functional changes — all skills, agents, commands, and hooks work identically

## [1.2.0] - 2026-03-15

### Added
- **Concrete `Agent` tool references** across all subagent dispatch instructions — every "dispatch", "deploy", or "invoke" now explicitly names the `Agent` tool with parameters (`prompt`, `description`, `subagent_type`, `run_in_background`, `model`)
- **Agent Tool Invocation Reference** section in `dispatching-parallel-agents` skill with parameter table, parallel dispatch examples, background dispatch, and named agent dispatch
- **Agent Coordination sections** in 10 agent templates (`backend-architect`, `database-architect`, `architect-reviewer`, `planner`, `mobile-developer`, `frontend-developer`, `context-manager`, `spec-reviewer`, `quality-reviewer`, `loop-orchestrator`) with concrete `Agent(description=..., prompt=...)` invocation examples
- **Dispatch mechanism notes** in `subagent-driven-development` skill linking each phase to the `Agent` tool and the corresponding prompt template file
- **How to Dispatch Subagents** reference in CLAUDE.md template (§12) with parameter table and concrete tool references

### Changed
- **15 skill templates** updated: all subagent dispatch tables now use `Agent` tool with `subagent_type` instead of vague "Explore subagents" or "Dedicated subagent" language
- **laravel-developer** and **php-developer** agents: "Consult" language replaced with concrete `Agent(...)` invocations
- **CLAUDE.md template** version bumped to 1.2.0, §12 dispatch rules now reference `Agent` tool throughout

## [1.1.0] - 2026-03-15

### Added
- **Plugin system**: `superkit-agents plugin add|list|remove|search` commands for extending the toolkit with third-party or custom plugins via `superkit-plugin.json` manifests
- **System requirements checker**: Validates Node.js >= 18, Git, and Claude Code CLI at startup with OS-aware install suggestions (macOS, Linux apt/yum, Windows choco/winget)
- **Context7 integration**: 10 framework/library skills now include a "Documentation Lookup (Context7)" section for real-time doc fetching via MCP
- **Laravel docs verification protocol**: Hard-gate in `laravel-specialist` skill requiring verification via Context7 MCP or official Laravel docs before using uncertain APIs
- **Subagent dispatch guidance**: 8 skills now include "Subagent Dispatch Opportunities" tables with specific patterns for parallel work
- **Comprehensive documentation**: 9 docs in `docs/` folder (getting-started, configuration, skill/agent/command authoring, plugin development, architecture, API reference, FAQ)
- **CONTRIBUTING.md**: Contribution guidelines with commit conventions and skill contribution process
- **`--skip-checks` CLI flag**: Skip system requirements check when not needed
- **README rewrite**: Collapsible sections, prerequisites, plugin system docs, FAQ with 8 common questions

### Changed
- **README.md**: Restructured with collapsible `<details>` sections, friendlier tone, and plugin system documentation
- **CLI**: Now runs `checkRequirements()` before installation wizard

## [1.0.0] - 2026-03-15

### Added
- **64 expert-level skills** across 12 categories (Core, Process, Quality, Documentation, Design, Operations, Creative, Business, Document Processing, Productivity, Communication, Frameworks)
- **20 agent definitions** for specialized task dispatch (planner, code-reviewer, prd-writer, laravel-developer, php-developer, etc.)
- **31 slash commands** for quick skill activation (/plan, /brainstorm, /tdd, /laravel, /php, etc.)
- Laravel/PHP support: `laravel-specialist`, `php-specialist`, `laravel-boost` skills with auto-detection of Laravel projects via `composer.json`
- Laravel Boost integration prompt when Laravel project detected
- Self-learning and auto-improvement are always active (mandatory, cannot be disabled)
- `superkit-agents update` command for checking and applying updates with saved config persistence
- Session-start hooks with memory system and self-learning activation
- Ralph autonomous loop protocol with circuit breaker and exit gate
- JTBD specification methodology with Given/When/Then acceptance criteria
- Plugin manifest for Claude Code integration

### Changed
- Rebranded from `@fwartner/claude-toolkit` to `@pixelandprocess/superkit-agents`
- All 64 skills enhanced to 200-400+ lines with CSO-optimized frontmatter, decision tables, anti-patterns, integration points, and concrete examples
- ESLint migrated to typescript-eslint v8 flat config
- CI pipeline updated with explicit lint step

### Fixed
- ESLint configuration (was broken with old config format)
- GitHub Actions release pipeline (added lint step before publish)
