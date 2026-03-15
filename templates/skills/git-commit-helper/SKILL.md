---
name: git-commit-helper
description: >
  Use when the user needs help with conventional commits, semantic versioning, changelog generation,
  or commit message quality improvement. Triggers: user says "commit", "version bump", "changelog",
  "commit message", staging changes for commit, preparing a release.
---

# Git Commit Helper

## Overview

Enforce conventional commit standards, guide semantic versioning decisions, generate changelogs, and ensure commit message quality. This skill provides a structured approach to version control communication that enables automated tooling and clear project history.

## Phase 1: Analyze Changes

Analyze the staged diff to understand what was changed:

```bash
git diff --cached --stat
git diff --cached
```

1. Identify the files and modules affected
2. Determine the nature of the change (new feature, bug fix, refactoring, etc.)
3. Check if the change is breaking (API changes, removed features, changed contracts)

**STOP — Do NOT write a commit message until you understand the full scope of changes.**

## Phase 2: Classify and Compose

### Commit Type Decision Table

| Type | When to Use | Version Bump | Example |
|---|---|---|---|
| `feat` | New feature for the user | MINOR | `feat(auth): add OAuth2 login flow` |
| `fix` | Bug fix for the user | PATCH | `fix(api): handle null response in user endpoint` |
| `docs` | Documentation only changes | None | `docs(readme): update installation steps` |
| `style` | Formatting, missing semicolons, etc. | None | `style(lint): fix trailing whitespace` |
| `refactor` | Code change with no behavior change | None | `refactor(utils): extract date formatting helpers` |
| `perf` | Performance improvement | PATCH | `perf(query): add index for user lookup` |
| `test` | Adding or correcting tests | None | `test(auth): add login failure scenarios` |
| `chore` | Maintenance, deps, tooling | None | `chore(deps): update typescript to 5.4` |
| `ci` | CI/CD configuration changes | None | `ci(github): add Node 20 to test matrix` |
| `build` | Build system or external dependencies | None | `build(webpack): optimize chunk splitting` |

### Conventional Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Scope Guidelines

Scope should identify the area of the codebase affected:

| Scope Strategy | Examples | When to Use |
|---|---|---|
| By module | `auth`, `billing`, `dashboard`, `api` | Feature-organized codebases |
| By layer | `db`, `ui`, `middleware`, `config` | Layer-organized codebases |
| By package | `@app/core`, `@app/shared` | Monorepos |
| General | `deps`, `ci`, `lint`, `types` | Cross-cutting changes |

Rules:
- Lowercase, kebab-case
- Keep consistent within a project
- Optional but recommended for projects with 10+ files changed regularly
- Omit scope for truly cross-cutting changes

### Description Rules

- Use imperative mood: "add" not "added" or "adds"
- No capital first letter
- No period at the end
- Maximum 72 characters (type + scope + description combined)
- Describe WHAT changed, not HOW

## Phase 3: Write the Commit Message

### Body Guidelines

```
feat(cart): add quantity update functionality

Users can now change item quantities directly in the cart
without removing and re-adding items. The quantity selector
supports values from 1 to 99 with real-time price updates.

Closes #234
```

- Wrap at 72 characters
- Explain WHY the change was made (motivation)
- Explain WHAT changed at a high level
- Use blank line to separate from description and footer

### Breaking Changes

```
feat(api)!: change user endpoint response format

BREAKING CHANGE: The /api/users endpoint now returns a paginated
response object instead of a plain array. Clients must update
to read from the `data` field.

Migration guide:
- Before: const users = await fetch('/api/users').json()
- After:  const { data: users } = await fetch('/api/users').json()
```

Two ways to indicate breaking changes:
1. `!` after type/scope: `feat(api)!: description`
2. `BREAKING CHANGE:` footer (provides space for migration details)

Both trigger a MAJOR version bump.

**STOP — Present the commit message to the user for approval before committing.**

## Phase 4: Assess Version Impact

### Semantic Versioning (SemVer): MAJOR.MINOR.PATCH

| Component | Increment When | Example |
|---|---|---|
| MAJOR | Breaking changes (incompatible API changes) | 1.0.0 -> 2.0.0 |
| MINOR | New features (backward compatible) | 1.0.0 -> 1.1.0 |
| PATCH | Bug fixes (backward compatible) | 1.0.0 -> 1.0.1 |

### Version Bumping Rules

```
Commits since last release:
  fix(auth): handle expired tokens       -> PATCH
  feat(search): add fuzzy matching       -> MINOR (overrides PATCH)
  fix(ui): correct button alignment      -> already MINOR
  feat(api)!: change response format     -> MAJOR (overrides MINOR)

Result: MAJOR bump (highest wins)
```

### Pre-Release Versions

```
1.0.0-alpha.1    -> Early testing
1.0.0-beta.1     -> Feature complete, testing
1.0.0-rc.1       -> Release candidate
1.0.0            -> Stable release
```

### Initial Development (0.x.y)

- 0.1.0: First usable version
- 0.x.y: API is not stable; MINOR can include breaking changes
- 1.0.0: First stable release; SemVer rules fully apply

## Phase 5: Generate Changelog (if applicable)

### CHANGELOG.md Format

```markdown
# Changelog

## [1.2.0] - 2025-03-15

### Added
- Fuzzy search matching for product catalog (#234)
- Bulk export functionality for reports (#245)

### Fixed
- Handle expired authentication tokens gracefully (#230)
- Correct button alignment on mobile viewports (#232)

### Changed
- Update TypeScript to 5.4 (#240)

## [1.1.0] - 2025-02-28
...
```

### Commit Type to Changelog Section Mapping

| Commit Type | Changelog Section |
|---|---|
| `feat` | Added |
| `fix` | Fixed |
| `perf` | Performance |
| `refactor` | Changed |
| `docs` | Documentation |
| `BREAKING CHANGE` | Breaking Changes (top of release) |
| `chore`, `ci`, `build`, `style`, `test` | Typically excluded |

### Automation Tools

| Tool | Use Case |
|---|---|
| `conventional-changelog` | Generate changelog from git history |
| `semantic-release` | Fully automated versioning + publishing |
| `changeset` | Manual changeset files for monorepos |
| `release-please` | Google's release automation |

## Commit Message Quality Checklist

### Must Pass

- [ ] Uses conventional commit format (`type(scope): description`)
- [ ] Type is from the allowed list
- [ ] Description uses imperative mood
- [ ] Description is under 72 characters total
- [ ] No period at end of description
- [ ] Breaking changes are clearly marked

### Should Pass

- [ ] Scope accurately identifies the affected area
- [ ] Body explains WHY, not just WHAT (for non-trivial changes)
- [ ] References issue/ticket number (`Closes #123`, `Refs #456`)
- [ ] Single logical change per commit (atomic commits)
- [ ] No "WIP" or "temp" commits in main branch history

## Commit Splitting Guide

### When to Split Decision Table

| Condition | Action |
|---|---|
| Changes to different modules/features | Split into separate commits |
| Refactor combined with feature addition | Split: refactor first, then feature |
| Test additions for existing code + new feature | Split: tests first, then feature |
| Config changes + code changes | Split into separate commits |
| Single logical change across multiple files | Keep as one commit |

### How to Split

```bash
# Interactive staging for partial commits
git add -p                    # Stage hunks interactively
git add path/to/specific/file # Stage specific files

# Example: split refactor + feature
git add src/utils/date.ts
git commit -m "refactor(utils): extract date formatting helpers"

git add src/components/DatePicker.tsx src/components/DatePicker.test.tsx
git commit -m "feat(ui): add date range picker component"
```

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | What to Do Instead |
|---|---|---|
| `fix` type for a new feature | Misleads version bump automation | Use `feat` for new functionality |
| Squashing meaningful history | Loses context of development process | Keep atomic commits, squash only WIP |
| Using `--no-verify` to skip hooks | Bypasses quality gates | Fix the hook failure instead |
| Amending published/pushed commits | Breaks other developers' history | Create new commit instead |
| Empty or "." commit messages | Zero information for future readers | Write a descriptive message |
| Mixing formatting with logic changes | Cannot revert one without the other | Separate into distinct commits |
| "change X to Y" duplicating the diff | Adds no information beyond the diff | Describe WHY the change was made |
| Huge commits touching 20+ files | Impossible to review or bisect | Split into logical atomic commits |

## Integration Points

| Skill | Integration |
|---|---|
| `finishing-a-development-branch` | Squash commit message follows conventional format |
| `code-review` | Commit quality is part of review checklist |
| `deployment` | Version bumps trigger release pipelines |
| `planning` | Commit scoping aligns with plan task granularity |
| `verification-before-completion` | Verify tests pass before committing |

## Skill Type

**FLEXIBLE** — Conventional commit format is strongly recommended but can be adapted to existing project conventions. Version bumping rules are deterministic when conventional commits are used. Changelog sections map directly from commit types.
