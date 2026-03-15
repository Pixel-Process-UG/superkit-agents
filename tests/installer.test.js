import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { install } from '../src/installer.js';
import { SKILLS, AGENTS, COMMANDS } from '../src/config.js';

describe('Installer', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'toolkit-test-'));
    process.chdir(tmpDir);
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('installs all 32 skills in plugin mode', async () => {
    await install({
      scope: 'project',
      format: 'plugin',
      skills: Object.keys(SKILLS),
      agents: [],
      commands: [],
      hooks: false,
      memory: false,
      claudeMd: false,
      dryRun: false,
    });

    for (const skill of Object.keys(SKILLS)) {
      const skillPath = path.join(tmpDir, 'skills', skill, 'SKILL.md');
      expect(await fs.pathExists(skillPath)).toBe(true);
    }

    const pluginPath = path.join(tmpDir, '.claude-plugin', 'plugin.json');
    expect(await fs.pathExists(pluginPath)).toBe(true);
  });

  it('installs all 32 skills in direct mode', async () => {
    await install({
      scope: 'project',
      format: 'direct',
      skills: Object.keys(SKILLS),
      agents: [],
      commands: [],
      hooks: false,
      memory: false,
      claudeMd: false,
      dryRun: false,
    });

    for (const skill of Object.keys(SKILLS)) {
      const skillPath = path.join(tmpDir, '.claude', 'skills', skill, 'SKILL.md');
      expect(await fs.pathExists(skillPath)).toBe(true);
    }
  });

  it('installs all 9 agents', async () => {
    await install({
      scope: 'project',
      format: 'plugin',
      skills: [],
      agents: Object.keys(AGENTS),
      commands: [],
      hooks: false,
      memory: false,
      claudeMd: false,
      dryRun: false,
    });

    for (const agent of Object.keys(AGENTS)) {
      const agentPath = path.join(tmpDir, 'agents', `${agent}.md`);
      expect(await fs.pathExists(agentPath)).toBe(true);
    }
  });

  it('installs all 14 commands', async () => {
    await install({
      scope: 'project',
      format: 'plugin',
      skills: [],
      agents: [],
      commands: Object.keys(COMMANDS),
      hooks: false,
      memory: false,
      claudeMd: false,
      dryRun: false,
    });

    for (const cmd of Object.keys(COMMANDS)) {
      const cmdPath = path.join(tmpDir, 'commands', `${cmd}.md`);
      expect(await fs.pathExists(cmdPath)).toBe(true);
    }
  });

  it('installs hooks in plugin mode with executable permission', async () => {
    await install({
      scope: 'project',
      format: 'plugin',
      skills: [],
      agents: [],
      commands: [],
      hooks: true,
      memory: false,
      claudeMd: false,
      dryRun: false,
    });

    const hookPath = path.join(tmpDir, 'hooks', 'session-start');
    expect(await fs.pathExists(hookPath)).toBe(true);

    const stat = await fs.stat(hookPath);
    expect(stat.mode & 0o111).toBeTruthy();

    // Plugin mode should use CLAUDE_PLUGIN_ROOT
    const hooksJson = await fs.readJson(path.join(tmpDir, 'hooks', 'hooks.json'));
    expect(JSON.stringify(hooksJson)).toContain('CLAUDE_PLUGIN_ROOT');
  });

  it('installs hooks in direct mode with correct paths', async () => {
    await install({
      scope: 'project',
      format: 'direct',
      skills: [],
      agents: [],
      commands: [],
      hooks: true,
      memory: false,
      claudeMd: false,
      dryRun: false,
    });

    const hookPath = path.join(tmpDir, '.claude', 'hooks', 'session-start');
    expect(await fs.pathExists(hookPath)).toBe(true);

    const stat = await fs.stat(hookPath);
    expect(stat.mode & 0o111).toBeTruthy();

    // Direct mode should NOT use CLAUDE_PLUGIN_ROOT
    const hooksJson = await fs.readJson(path.join(tmpDir, '.claude', 'hooks', 'hooks.json'));
    expect(JSON.stringify(hooksJson)).not.toContain('CLAUDE_PLUGIN_ROOT');
  });

  it('installs memory templates', async () => {
    await install({
      scope: 'project',
      format: 'plugin',
      skills: [],
      agents: [],
      commands: [],
      hooks: false,
      memory: true,
      claudeMd: false,
      dryRun: false,
    });

    const memDir = path.join(tmpDir, 'memory');
    expect(await fs.pathExists(path.join(memDir, 'project-context.md'))).toBe(true);
    expect(await fs.pathExists(path.join(memDir, 'learned-patterns.md'))).toBe(true);
    expect(await fs.pathExists(path.join(memDir, 'user-preferences.md'))).toBe(true);
    expect(await fs.pathExists(path.join(memDir, 'decisions-log.md'))).toBe(true);
  });

  it('does not overwrite existing memory files', async () => {
    const memDir = path.join(tmpDir, 'memory');
    await fs.ensureDir(memDir);
    await fs.writeFile(path.join(memDir, 'project-context.md'), '# Custom content');

    await install({
      scope: 'project',
      format: 'plugin',
      skills: [],
      agents: [],
      commands: [],
      hooks: false,
      memory: true,
      claudeMd: false,
      dryRun: false,
    });

    const content = await fs.readFile(path.join(memDir, 'project-context.md'), 'utf8');
    expect(content).toBe('# Custom content');
  });

  it('dry run creates no files', async () => {
    await install({
      scope: 'project',
      format: 'plugin',
      skills: Object.keys(SKILLS),
      agents: Object.keys(AGENTS),
      commands: Object.keys(COMMANDS),
      hooks: true,
      memory: true,
      claudeMd: true,
      dryRun: true,
    });

    const files = await fs.readdir(tmpDir);
    expect(files).toHaveLength(0);
  });

  it('creates CLAUDE.md with toolkit markers', async () => {
    await install({
      scope: 'project',
      format: 'plugin',
      skills: [],
      agents: [],
      commands: [],
      hooks: false,
      memory: false,
      claudeMd: true,
      dryRun: false,
    });

    const content = await fs.readFile(path.join(tmpDir, 'CLAUDE.md'), 'utf8');
    expect(content).toContain('<!-- TOOLKIT START -->');
    expect(content).toContain('<!-- TOOLKIT END -->');
    expect(content).toContain('HARD-GATES');
    expect(content).toContain('32 skills');
  });

  it('merges CLAUDE.md with existing content', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '# My Project\n\nExisting content.\n');

    await install({
      scope: 'project',
      format: 'plugin',
      skills: [],
      agents: [],
      commands: [],
      hooks: false,
      memory: false,
      claudeMd: true,
      dryRun: false,
    });

    const content = await fs.readFile(path.join(tmpDir, 'CLAUDE.md'), 'utf8');
    expect(content).toContain('# My Project');
    expect(content).toContain('Existing content.');
    expect(content).toContain('<!-- TOOLKIT START -->');
    expect(content).toContain('HARD-GATES');
  });

  it('installs skills with reference docs', async () => {
    await install({
      scope: 'project',
      format: 'plugin',
      skills: ['test-driven-development', 'systematic-debugging', 'security-review', 'performance-optimization'],
      agents: [],
      commands: [],
      hooks: false,
      memory: false,
      claudeMd: false,
      dryRun: false,
    });

    // Check reference docs are included
    expect(await fs.pathExists(path.join(tmpDir, 'skills', 'test-driven-development', 'testing-anti-patterns.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, 'skills', 'systematic-debugging', 'root-cause-tracing.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, 'skills', 'systematic-debugging', 'defense-in-depth.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, 'skills', 'security-review', 'owasp-checklist.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, 'skills', 'performance-optimization', 'performance-budgets.md'))).toBe(true);
  });
});
