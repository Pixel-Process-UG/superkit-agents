# FAQ

## Installation

### Do I need to install all 64 skills?

No. The interactive wizard lets you pick exactly what you want. Only `self-learning` and `auto-improvement` are mandatory. Use `--skills` for selective CLI installs.

### What's the difference between plugin and direct mode?

**Plugin mode** (default) installs into `.claude-plugin/`, keeping the toolkit isolated. **Direct mode** installs into `.claude/`, merging with existing config. Plugin mode is recommended.

### Can I use this alongside other Claude Code plugins?

Yes. Plugin mode namespaces everything so there are no conflicts.

### Does it modify my existing CLAUDE.md?

It wraps toolkit content in `<!-- TOOLKIT START -->` / `<!-- TOOLKIT END -->` markers. Your existing content is preserved. A backup is created before any modification.

## Usage

### How do I update?

```bash
superkit-agents update
```

Or re-run the installer. Your preferences are saved in `~/.superkit-agents/config.json`.

### Which skills are loaded automatically?

Only `using-toolkit` is loaded into context via the SessionStart hook. Other skills are invoked on-demand when Claude Code detects a relevant task or you use a slash command.

### Can I create custom skills?

Yes. Create a directory under `.claude/skills/` or `.claude-plugin/skills/` with a `SKILL.md` file. See the [Skill Authoring Guide](skill-authoring.md).

## Compatibility

### What versions of Node.js are supported?

Node.js 18 and above. The CI matrix tests on Node 18, 20, and 22.

### Does it work on Windows?

Yes. The installer detects your OS and provides appropriate install commands. Plugin and direct modes both work on Windows.

### Does it work with Laravel?

Yes. The installer auto-detects Laravel projects via `composer.json` and offers to install Laravel-specific skills and Laravel Boost.

## Troubleshooting

### Skills aren't loading in Claude Code

1. Make sure you started a **new** Claude Code session after installation
2. Check that hooks are installed: look for `hooks/hooks.json` in your install directory
3. Verify the session-start script is executable: `chmod +x .claude-plugin/hooks/session-start`

### The wizard isn't showing up

Make sure you're running the command without `--all` or `--skills` flags. Those trigger non-interactive mode.

### Plugin install fails

- Check that the plugin has a valid `superkit-plugin.json` in its root
- For npm plugins, ensure the package is published and accessible
- For local plugins, use the `--local` flag
