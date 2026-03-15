import { describe, it, expect } from 'vitest';
import { REQUIREMENTS, detectPlatform } from '../src/requirements';
import type { Platform } from '../src/requirements';

describe('Requirements', () => {
  it('defines at least 3 requirements', () => {
    expect(REQUIREMENTS.length).toBeGreaterThanOrEqual(3);
  });

  it('each requirement has name, check, required, and installCmd', () => {
    for (const req of REQUIREMENTS) {
      expect(req.name).toBeTruthy();
      expect(typeof req.check).toBe('function');
      expect(typeof req.required).toBe('boolean');
      expect(typeof req.installCmd).toBe('object');
    }
  });

  it('Node.js >= 18 check passes in test environment', async () => {
    const nodeReq = REQUIREMENTS.find(r => r.name === 'Node.js >= 18');
    expect(nodeReq).toBeDefined();
    expect(await nodeReq!.check()).toBe(true);
  });

  it('Git check passes in test environment', async () => {
    const gitReq = REQUIREMENTS.find(r => r.name === 'Git');
    expect(gitReq).toBeDefined();
    expect(await gitReq!.check()).toBe(true);
  });

  it('Node.js and Git are required', () => {
    const nodeReq = REQUIREMENTS.find(r => r.name === 'Node.js >= 18');
    const gitReq = REQUIREMENTS.find(r => r.name === 'Git');
    expect(nodeReq!.required).toBe(true);
    expect(gitReq!.required).toBe(true);
  });

  it('Claude Code CLI is recommended (not required)', () => {
    const claudeReq = REQUIREMENTS.find(r => r.name === 'Claude Code CLI');
    expect(claudeReq).toBeDefined();
    expect(claudeReq!.required).toBe(false);
  });

  it('each requirement has install commands for macos', () => {
    for (const req of REQUIREMENTS) {
      expect(req.installCmd['macos']).toBeTruthy();
    }
  });

  it('detectPlatform returns a valid platform', () => {
    const platform = detectPlatform();
    const validPlatforms: Platform[] = ['macos', 'linux-apt', 'linux-yum', 'windows-choco', 'windows-winget'];
    expect(validPlatforms).toContain(platform);
  });
});
