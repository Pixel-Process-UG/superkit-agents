import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { resolvePlugin, listPlugins } from '../src/plugins';
import { loadRegistry, validateManifest } from '../src/plugin-registry';
import type { PluginManifest } from '../src/plugin-registry';

describe('Plugin Registry', () => {
  it('loadRegistry returns empty registry when file does not exist', async () => {
    const registry = await loadRegistry();
    expect(registry).toHaveProperty('plugins');
    expect(typeof registry.plugins).toBe('object');
  });

  it('validateManifest throws on missing file', async () => {
    await expect(validateManifest('/nonexistent/superkit-plugin.json')).rejects.toThrow(
      'Plugin manifest not found',
    );
  });

  it('validateManifest throws on missing name field', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plugin-test-'));
    const manifestPath = path.join(tmpDir, 'superkit-plugin.json');
    await fs.writeJson(manifestPath, { version: '1.0.0' });

    await expect(validateManifest(manifestPath)).rejects.toThrow('name');
    await fs.remove(tmpDir);
  });

  it('validateManifest throws on missing version field', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plugin-test-'));
    const manifestPath = path.join(tmpDir, 'superkit-plugin.json');
    await fs.writeJson(manifestPath, { name: 'test' });

    await expect(validateManifest(manifestPath)).rejects.toThrow('version');
    await fs.remove(tmpDir);
  });

  it('validateManifest accepts valid manifest', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plugin-test-'));
    const manifestPath = path.join(tmpDir, 'superkit-plugin.json');
    const manifest: PluginManifest = {
      name: 'test-plugin',
      version: '1.0.0',
      description: 'A test plugin',
      skills: {
        'test-skill': {
          name: 'test-skill',
          description: 'A test skill',
          path: 'skills/test-skill',
        },
      },
    };
    await fs.writeJson(manifestPath, manifest);

    const result = await validateManifest(manifestPath);
    expect(result.name).toBe('test-plugin');
    expect(result.version).toBe('1.0.0');
    await fs.remove(tmpDir);
  });
});

describe('Plugin Resolution', () => {
  it('resolves a local plugin with valid manifest', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plugin-test-'));
    const manifest: PluginManifest = {
      name: 'local-test',
      version: '0.1.0',
      description: 'Local test plugin',
    };
    await fs.writeJson(path.join(tmpDir, 'superkit-plugin.json'), manifest);

    const result = await resolvePlugin(tmpDir, true);
    expect(result.manifest.name).toBe('local-test');
    expect(result.resolvedPath).toBe(tmpDir);
    await fs.remove(tmpDir);
  });

  it('rejects local plugin without manifest', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plugin-test-'));

    await expect(resolvePlugin(tmpDir, true)).rejects.toThrow('manifest not found');
    await fs.remove(tmpDir);
  });
});

describe('Plugin List', () => {
  it('returns empty array when no plugins installed', async () => {
    const plugins = await listPlugins();
    expect(Array.isArray(plugins)).toBe(true);
  });
});
