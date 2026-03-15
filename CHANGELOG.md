# Changelog

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
