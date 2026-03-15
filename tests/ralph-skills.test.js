import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '..', 'templates');

const RALPH_SKILLS = [
  'autonomous-loop',
  'circuit-breaker',
  'ralph-status',
  'spec-writing',
  'reverse-engineering-specs',
  'acceptance-testing',
  'llm-as-judge',
];

const RALPH_AGENTS = [
  'loop-orchestrator',
  'spec-writer',
  'acceptance-judge',
];

const RALPH_COMMANDS = [
  'ralph',
  'specs',
  'loop',
];

describe('Ralph Skills', () => {
  for (const skill of RALPH_SKILLS) {
    it(`${skill}/SKILL.md exists and has valid frontmatter`, async () => {
      const skillPath = path.join(templatesDir, 'skills', skill, 'SKILL.md');
      expect(await fs.pathExists(skillPath)).toBe(true);

      const content = await fs.readFile(skillPath, 'utf8');
      expect(content).toMatch(/^---\n/);
      expect(content).toMatch(/name:\s+/);
      expect(content).toMatch(/description:\s+/);
    });
  }

  it('autonomous-loop contains RALPH_STATUS reference', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'skills', 'autonomous-loop', 'SKILL.md'),
      'utf8',
    );
    expect(content).toContain('RALPH_STATUS');
    expect(content).toContain('ONE task per loop');
    expect(content).toContain('EXIT_SIGNAL');
  });

  it('circuit-breaker contains stagnation thresholds', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'skills', 'circuit-breaker', 'SKILL.md'),
      'utf8',
    );
    expect(content).toContain('stagnation');
    expect(content).toContain('cooldown');
    expect(content).toContain('OPEN');
  });

  it('spec-writing contains JTBD methodology', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'skills', 'spec-writing', 'SKILL.md'),
      'utf8',
    );
    expect(content).toContain('Jobs to Be Done');
    expect(content).toContain('One Sentence Without');
    expect(content).toContain('Given');
  });

  it('llm-as-judge contains rubric pattern', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'skills', 'llm-as-judge', 'SKILL.md'),
      'utf8',
    );
    expect(content).toContain('rubric');
    expect(content).toContain('threshold');
    expect(content).toContain('weighted');
  });
});

describe('Ralph Agents', () => {
  for (const agent of RALPH_AGENTS) {
    it(`${agent}.md exists and has valid frontmatter`, async () => {
      const agentPath = path.join(templatesDir, 'agents', `${agent}.md`);
      expect(await fs.pathExists(agentPath)).toBe(true);

      const content = await fs.readFile(agentPath, 'utf8');
      expect(content).toMatch(/^---\n/);
      expect(content).toMatch(/name:\s+/);
      expect(content).toMatch(/description:\s+/);
    });
  }
});

describe('Ralph Commands', () => {
  for (const cmd of RALPH_COMMANDS) {
    it(`${cmd}.md exists and is user-invocable`, async () => {
      const cmdPath = path.join(templatesDir, 'commands', `${cmd}.md`);
      expect(await fs.pathExists(cmdPath)).toBe(true);

      const content = await fs.readFile(cmdPath, 'utf8');
      expect(content).toContain('user-invocable: true');
    });
  }
});
