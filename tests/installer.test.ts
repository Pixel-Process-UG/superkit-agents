import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { install } from '../src/installer';
import { SKILLS, AGENTS, COMMANDS } from '../src/config';
import type { InstallConfig } from '../src/config';

describe('Installer', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'toolkit-test-'));
    process.chdir(tmpDir);
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  const makeConfig = (overrides: Partial<InstallConfig> = {}): InstallConfig => ({
    scope: 'project',
    format: 'plugin',
    skills: [],
    agents: [],
    commands: [],
    hooks: false,
    memory: false,
    claudeMd: false,
    dryRun: false,
    laravelBoost: false,
    ...overrides,
  });

  it('installs all 64 skills in plugin mode', async () => {
    await install(makeConfig({ skills: Object.keys(SKILLS) }));

    for (const skill of Object.keys(SKILLS)) {
      const skillPath = path.join(tmpDir, '.claude-plugin', 'skills', skill, 'SKILL.md');
      expect(await fs.pathExists(skillPath)).toBe(true);
    }

    const pluginPath = path.join(tmpDir, '.claude-plugin', 'plugin.json');
    expect(await fs.pathExists(pluginPath)).toBe(true);
  });

  it('installs all 64 skills in direct mode', async () => {
    await install(makeConfig({ format: 'direct', skills: Object.keys(SKILLS) }));

    for (const skill of Object.keys(SKILLS)) {
      const skillPath = path.join(tmpDir, '.claude', 'skills', skill, 'SKILL.md');
      expect(await fs.pathExists(skillPath)).toBe(true);
    }
  });

  it('installs all 20 agents', async () => {
    await install(makeConfig({ agents: Object.keys(AGENTS) }));

    for (const agent of Object.keys(AGENTS)) {
      const agentPath = path.join(tmpDir, '.claude-plugin', 'agents', `${agent}.md`);
      expect(await fs.pathExists(agentPath)).toBe(true);
    }
  });

  it('installs all 31 commands', async () => {
    await install(makeConfig({ commands: Object.keys(COMMANDS) }));

    for (const cmd of Object.keys(COMMANDS)) {
      const cmdPath = path.join(tmpDir, '.claude-plugin', 'commands', `${cmd}.md`);
      expect(await fs.pathExists(cmdPath)).toBe(true);
    }
  });

  it('installs hooks in plugin mode with executable permission', async () => {
    await install(makeConfig({ hooks: true }));

    const hookPath = path.join(tmpDir, '.claude-plugin', 'hooks', 'session-start');
    expect(await fs.pathExists(hookPath)).toBe(true);

    const stat = await fs.stat(hookPath);
    expect(stat.mode & 0o111).toBeTruthy();

    const hooksJson = await fs.readJson(path.join(tmpDir, '.claude-plugin', 'hooks', 'hooks.json'));
    expect(JSON.stringify(hooksJson)).toContain('CLAUDE_PLUGIN_ROOT');
  });

  it('installs hooks in direct mode with correct paths', async () => {
    await install(makeConfig({ format: 'direct', hooks: true }));

    const hookPath = path.join(tmpDir, '.claude', 'hooks', 'session-start');
    expect(await fs.pathExists(hookPath)).toBe(true);

    const stat = await fs.stat(hookPath);
    expect(stat.mode & 0o111).toBeTruthy();

    const hooksJson = await fs.readJson(path.join(tmpDir, '.claude', 'hooks', 'hooks.json'));
    expect(JSON.stringify(hooksJson)).not.toContain('CLAUDE_PLUGIN_ROOT');
  });

  it('installs memory templates', async () => {
    await install(makeConfig({ memory: true }));

    const memDir = path.join(tmpDir, '.claude-plugin', 'memory');
    expect(await fs.pathExists(path.join(memDir, 'project-context.md'))).toBe(true);
    expect(await fs.pathExists(path.join(memDir, 'learned-patterns.md'))).toBe(true);
    expect(await fs.pathExists(path.join(memDir, 'user-preferences.md'))).toBe(true);
    expect(await fs.pathExists(path.join(memDir, 'decisions-log.md'))).toBe(true);
    expect(await fs.pathExists(path.join(memDir, 'improvement-log.md'))).toBe(true);
  });

  it('does not overwrite existing memory files', async () => {
    const memDir = path.join(tmpDir, '.claude-plugin', 'memory');
    await fs.ensureDir(memDir);
    await fs.writeFile(path.join(memDir, 'project-context.md'), '# Custom content');

    await install(makeConfig({ memory: true }));

    const content = await fs.readFile(path.join(memDir, 'project-context.md'), 'utf8');
    expect(content).toBe('# Custom content');
  });

  it('dry run creates no files', async () => {
    await install(makeConfig({
      skills: Object.keys(SKILLS),
      agents: Object.keys(AGENTS),
      commands: Object.keys(COMMANDS),
      hooks: true,
      memory: true,
      claudeMd: true,
      dryRun: true,
    }));

    const files = await fs.readdir(tmpDir);
    expect(files).toHaveLength(0);
  });

  it('creates CLAUDE.md with toolkit markers', async () => {
    await install(makeConfig({ claudeMd: true }));

    const content = await fs.readFile(path.join(tmpDir, 'CLAUDE.md'), 'utf8');
    expect(content).toContain('<!-- TOOLKIT START -->');
    expect(content).toContain('<!-- TOOLKIT END -->');
    expect(content).toContain('Agent Operating Manual');
    expect(content).toContain('64 Skills');
  });

  it('merges CLAUDE.md with existing content', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '# My Project\n\nExisting content.\n');

    await install(makeConfig({ claudeMd: true }));

    const content = await fs.readFile(path.join(tmpDir, 'CLAUDE.md'), 'utf8');
    expect(content).toContain('# My Project');
    expect(content).toContain('Existing content.');
    expect(content).toContain('<!-- TOOLKIT START -->');
    expect(content).toContain('Agent Operating Manual');
  });

  it('installs skills with reference docs', async () => {
    await install(makeConfig({
      skills: ['test-driven-development', 'systematic-debugging', 'security-review', 'performance-optimization'],
    }));

    expect(await fs.pathExists(path.join(tmpDir, '.claude-plugin', 'skills', 'test-driven-development', 'testing-anti-patterns.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, '.claude-plugin', 'skills', 'systematic-debugging', 'root-cause-tracing.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, '.claude-plugin', 'skills', 'systematic-debugging', 'defense-in-depth.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, '.claude-plugin', 'skills', 'security-review', 'owasp-checklist.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, '.claude-plugin', 'skills', 'performance-optimization', 'performance-budgets.md'))).toBe(true);
  });
});
