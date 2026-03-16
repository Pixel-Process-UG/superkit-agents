---
name: laravel-boost
description: >
  Use when setting up or configuring Laravel Boost for AI-assisted development — package
  installation, MCP server configuration, guideline customization, skill authoring,
  documentation API integration.
  Trigger conditions: install Laravel Boost, configure MCP for IDE, create custom
  AI guidelines, write project-specific skills, verify MCP tool connectivity,
  update Boost after dependency changes, extend Boost for custom agents.
---

# Laravel Boost

## Overview

Laravel Boost is an official Laravel package that accelerates AI-assisted development by providing composable guidelines, on-demand agent skills, an MCP (Model Context Protocol) server, and a documentation API with semantic search across 17,000+ Laravel-specific knowledge pieces. It bridges AI coding tools and the Laravel ecosystem, ensuring that AI agents generate high-quality, convention-compliant Laravel code.

Apply this skill when setting up, configuring, or extending Laravel Boost in a project, or when integrating AI agents with a Laravel application.

## Multi-Phase Process

### Phase 1: Assessment

1. Confirm Laravel version compatibility (10.x, 11.x, 12.x)
2. Identify the AI IDE or agent in use (Cursor, Claude Code, Codex, Gemini CLI, GitHub Copilot, Junie)
3. Check if an MCP configuration already exists (`.mcp.json`)
4. Review existing guideline and skill customizations in `.ai/`

> **STOP — Do NOT install Boost without confirming Laravel version compatibility and target IDE.**

### Phase 2: Installation and Configuration

1. Install the package and run the installer
2. Configure MCP server for the target IDE
3. Set up automatic updates via Composer hooks
4. Verify MCP tools are accessible from the AI agent

> **STOP — Do NOT proceed until MCP server connectivity is verified with at least one tool call.**

### Phase 3: Customization

1. Add project-specific guidelines in `.ai/guidelines/`
2. Create domain-specific skills in `.ai/skills/`
3. Override built-in guidelines or skills where project conventions differ
4. Register custom agents if extending to unsupported IDEs

> **STOP — Do NOT override built-in guidelines unless project conventions genuinely differ from Laravel defaults.**

### Phase 4: Validation

1. Confirm MCP server responds to tool calls (Application Info, Database Schema, Search Docs)
2. Verify guidelines load in the AI agent's context window
3. Test skill activation for domain-relevant tasks
4. Check that `boost:update` keeps resources current after dependency changes

## IDE Setup Decision Table

| IDE / Agent | Setup Method | Configuration File |
|---|---|---|
| **Claude Code** | CLI command | `.mcp.json` (auto-generated) |
| **Codex** | CLI command | `.mcp.json` |
| **Gemini CLI** | CLI command | `.mcp.json` |
| **Cursor** | Command Palette GUI | `.cursor/mcp.json` |
| **GitHub Copilot** | Command Palette GUI | `.mcp.json` |
| **Junie** | Settings GUI | `.mcp.json` |
| **Custom / Unsupported** | Custom agent class | Manual MCP config |

## Installation

```bash
# Install as a development dependency
composer require laravel/boost --dev

# Run the installer — generates .mcp.json, guideline files, and boost.json
php artisan boost:install
```

The installer generates:
- `.mcp.json` — MCP server configuration for IDE integration
- Guideline files (`CLAUDE.md`, `AGENTS.md`, etc.) tailored to detected packages
- `boost.json` — Boost configuration file

### IDE-Specific MCP Setup

| IDE / Agent | Setup Command or Action |
|---|---|
| **Claude Code** | `claude mcp add -s local -t stdio laravel-boost php artisan boost:mcp` |
| **Codex** | `codex mcp add laravel-boost -- php "artisan" "boost:mcp"` |
| **Gemini CLI** | `gemini mcp add -s project -t stdio laravel-boost php artisan boost:mcp` |
| **Cursor** | Command Palette -> "Open MCP Settings" -> toggle on `laravel-boost` |
| **GitHub Copilot** | Command Palette -> "MCP: List Servers" -> select `laravel-boost` -> "Start server" |
| **Junie** | Shift-Shift -> "MCP Settings" -> check `laravel-boost` -> Apply |

### Manual MCP Configuration

```json
{
    "mcpServers": {
        "laravel-boost": {
            "command": "php",
            "args": ["artisan", "boost:mcp"]
        }
    }
}
```

### Keeping Resources Updated

```bash
# Manual update after dependency changes
php artisan boost:update

# Automatic updates — add to composer.json scripts
{
    "scripts": {
        "post-update-cmd": [
            "@php artisan boost:update --ansi"
        ]
    }
}
```

## MCP Server Tools

Laravel Boost exposes the following tools through its MCP server, giving AI agents direct access to application context:

| Tool | Purpose | Typical Use |
|---|---|---|
| **Application Info** | Read PHP and Laravel versions, database engine, ecosystem packages, Eloquent models | Context discovery at session start |
| **Database Schema** | Read full database schema | Migration planning, model generation |
| **Database Query** | Execute queries against the database | Data inspection, debugging |
| **Database Connections** | Inspect available database connections | Multi-database configuration |
| **Search Docs** | Semantic search across Laravel documentation API | Finding best practices, API references |
| **Last Error** | Read the most recent application log error | Debugging workflow |
| **Read Log Entries** | Read last N log entries | Monitoring, debugging |
| **Browser Logs** | Read logs and errors from browser | Frontend debugging |
| **Get Absolute URL** | Convert relative path URIs to absolute URLs | Link generation |

## AI Guidelines

Guidelines are composable instruction files loaded upfront into the AI agent's context, providing broad conventions and best practices.

### Available Built-in Guidelines

| Package | Versions Supported |
|---|---|
| Laravel Framework | Core, 10.x, 11.x, 12.x |
| Livewire | Core, 2.x, 3.x, 4.x |
| Flux UI | Core, Free, Pro |
| Inertia | React, Vue, Svelte (1.x-3.x) |
| Tailwind CSS | Core, 3.x, 4.x |
| Pest | Core, 3.x, 4.x |
| PHPUnit, Pint, Sail, Pennant, Volt, Wayfinder, Folio, Herd, MCP | Core |

### Custom Guidelines

Create `.blade.php` or `.md` files in `.ai/guidelines/`:

```
.ai/guidelines/team-conventions.md
.ai/guidelines/billing/stripe-patterns.blade.php
```

Override a built-in guideline by matching its path:

```
.ai/guidelines/inertia-react/2/forms.blade.php
```

### Third-Party Package Guidelines

Package authors can ship guidelines at:

```
resources/boost/guidelines/core.blade.php
```

## Agent Skills

Skills are on-demand knowledge modules activated only when relevant, reducing context window bloat.

### Available Built-in Skills

| Skill | Domain |
|---|---|
| `livewire-development` | Livewire components and reactivity |
| `inertia-react-development` | Inertia.js with React |
| `inertia-vue-development` | Inertia.js with Vue |
| `inertia-svelte-development` | Inertia.js with Svelte |
| `pest-testing` | Pest test patterns |
| `fluxui-development` | Flux UI components |
| `folio-routing` | Folio page-based routing |
| `tailwindcss-development` | Tailwind CSS utility classes |
| `volt-development` | Volt single-file Livewire components |
| `pennant-development` | Pennant feature flags |
| `wayfinder-development` | Wayfinder type-safe routing |
| `mcp-development` | MCP server/tool development |

### Custom Skills

Create `.ai/skills/{skill-name}/SKILL.md`:

```markdown
---
name: invoice-management
description: Build and work with invoice features including PDF generation and payment tracking.
---

# Invoice Management

## When to use this skill
Use when working with the invoicing module...
```

### Guidelines vs Skills Decision Table

| Question | Guidelines | Skills |
|---|---|---|
| When is it loaded? | Always — upfront context | On-demand — when the task matches |
| How broad is the scope? | Foundational conventions | Focused implementation patterns |
| Impact on context window? | Constant (always present) | Minimal (loaded only when needed) |
| Best for? | Coding standards, package versions | Step-by-step implementation guides |
| Content changes often? | Rarely (stable conventions) | Frequently (evolving patterns) |
| Team-wide applicability? | High (everyone follows) | Varies (domain-specific) |

## Documentation API

Boost provides semantic search across 17,000+ documentation pieces covering:

| Package | Versions |
|---|---|
| Laravel Framework | 10.x, 11.x, 12.x |
| Filament | 2.x, 3.x, 4.x, 5.x |
| Flux UI | 2.x Free, 2.x Pro |
| Inertia | 1.x, 2.x |
| Livewire | 1.x, 2.x, 3.x, 4.x |
| Nova | 4.x, 5.x |
| Pest | 3.x, 4.x |
| Tailwind CSS | 3.x, 4.x |

The `Search Docs` MCP tool queries this API. Guidelines and skills automatically instruct agents to use it when they need implementation details.

## When to Use vs When Not Needed

| Scenario | Use Laravel Boost? | Why |
|---|---|---|
| Laravel project with AI-assisted development | Yes | Primary use case |
| Team uses Cursor, Claude Code, Copilot, or other AI IDE | Yes | MCP integration improves output |
| Need consistent Laravel conventions across AI-generated code | Yes | Guidelines enforce standards |
| Non-Laravel PHP project | No | Boost is Laravel-specific |
| No AI coding tools in workflow | No | Boost's value is in AI agent integration |
| Production runtime performance optimization | No | Boost is dev-time only, not a runtime optimizer |
| Already have comprehensive custom AI prompts | Optional | Boost may supplement or replace them |

## Extending Boost

### Custom Agent Registration

For AI tools not supported out of the box:

```php
// In AppServiceProvider::boot()
use Laravel\Boost\Boost;

Boost::registerAgent('custom-ide', CustomAgent::class);
```

The custom agent class must extend `Laravel\Boost\Install\Agents\Agent` and implement the relevant interfaces:
- `SupportsGuidelines` — for guideline file generation
- `SupportsMcp` — for MCP server configuration
- `SupportsSkills` — for skill file generation

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | What To Do Instead |
|---|---|---|
| Installing in production | Boost is dev-time only, adds unnecessary overhead | Use `composer require --dev` |
| Overriding every built-in guideline | Drifts from Laravel core team recommendations | Override only where project genuinely differs |
| Ignoring `boost:update` | Guidelines fall out of sync with installed packages | Run after every `composer update` |
| Overly broad custom skills | Wastes context window tokens when activated | Focus each skill on a single domain |
| Skipping MCP verification | Misconfigured MCP silently degrades AI agent quality | Test tool calls after installation |
| Not committing `.mcp.json` | Team members get inconsistent AI agent experience | Commit to version control |
| Mixing guidelines and skills | Context window pollution with always-loaded content | Conventions in guidelines, patterns in skills |
| Not running installer after upgrade | Missing new guideline files and MCP tools | Run `php artisan boost:install` after major upgrades |

## Anti-Rationalization Guards

- Do NOT skip MCP verification because "the install succeeded" -- test at least one tool call.
- Do NOT override built-in guidelines without a documented reason for the deviation.
- Do NOT create broad skills -- if it covers more than one domain, split it.
- Do NOT install Boost in production -- it is a `--dev` dependency exclusively.
- Do NOT forget to run `boost:update` after dependency changes -- stale guidelines degrade AI output.

## Documentation Lookup (Context7)

Use `mcp__context7__resolve-library-id` then `mcp__context7__query-docs` for up-to-date docs. Returned docs override memorized knowledge.
- `laravel/framework` — for core Laravel APIs, configuration, or Artisan commands
- `livewire` — for component lifecycle, wire directives, or Alpine.js integration

---

## Integration Points

| Skill | How It Connects |
|---|---|
| `laravel-specialist` | Boost guidelines and skills enhance AI-generated Laravel code quality |
| `php-specialist` | Boost respects PHP version and PSR standards in generated guidelines |
| `mcp-builder` | Boost's MCP server is an example of the MCP pattern; extend it for custom tools |
| `self-learning` | Boost's Application Info tool feeds project context into the learning phase |
| `senior-backend` | Boost's Database Schema and Query tools support backend architecture decisions |
| `test-driven-development` | Boost's Pest skill provides testing patterns for AI-generated tests |

## Skill Type

**FLEXIBLE** — Adapt the process phases to what the project needs. A new project requires full installation and IDE setup (Phases 1-4). An existing Boost installation may only need customization (Phase 3) or validation after a Laravel upgrade (Phase 4). The non-negotiable minimum: verify MCP server connectivity and confirm guidelines match installed package versions.
