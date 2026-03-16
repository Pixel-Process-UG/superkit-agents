#!/usr/bin/env node

import { Command } from 'commander';
import { runWizard } from './wizard';
import { install } from './installer';
import { SKILLS, AGENTS, COMMANDS } from './config';
import type { InstallConfig } from './config';
import { checkForUpdates } from './updater';
import { checkRequirements } from './requirements';
import { installPlugin, listPlugins, removePlugin, searchPlugins } from './plugins';
import chalk from 'chalk';

const MANDATORY_SKILLS = ['self-learning', 'auto-improvement'];

const program = new Command();

program
  .name('superkit-agents')
  .description('Set up a complete AI-optimized development environment for Claude Code')
  .version('1.3.0')
  .option('--all', 'Install everything non-interactively')
  .option('--global', 'Install to ~/.claude/ instead of ./.claude/')
  .option('--plugin', 'Install as a .claude-plugin/ plugin')
  .option('--direct', 'Install directly into .claude/ directories')
  .option('--skills <list>', 'Comma-separated list of skills to install')
  .option('--no-hooks', 'Skip hooks installation')
  .option('--no-memory', 'Skip memory structure creation')
  .option('--no-claude-md', 'Skip CLAUDE.md generation')
  .option('--dry-run', 'Show what would be installed without making changes')
  .option('--skip-checks', 'Skip system requirements check')
  .action(async (options: Record<string, unknown>) => {
    console.log('');
    console.log(chalk.bold.cyan('  superkit-agents'));
    console.log(chalk.dim('  Complete AI-optimized development environment'));
    console.log('');

    // Check system requirements
    if (!options.skipChecks) {
      await checkRequirements();
    }

    let config: InstallConfig | null = null;

    if (options.all) {
      config = {
        scope: options.global ? 'global' : 'project',
        format: options.plugin ? 'plugin' : (options.direct ? 'direct' : 'plugin'),
        skills: Object.keys(SKILLS),
        agents: Object.keys(AGENTS),
        commands: Object.keys(COMMANDS),
        hooks: options.hooks !== false,
        memory: options.memory !== false,
        claudeMd: options.claudeMd !== false,
        dryRun: (options.dryRun as boolean) || false,
        laravelBoost: false,
      };
    } else if (options.skills) {
      const selectedSkills = (options.skills as string).split(',').map((s: string) => s.trim());
      // Enforce mandatory skills
      for (const mandatory of MANDATORY_SKILLS) {
        if (!selectedSkills.includes(mandatory)) {
          selectedSkills.push(mandatory);
        }
      }
      config = {
        scope: options.global ? 'global' : 'project',
        format: options.plugin ? 'plugin' : (options.direct ? 'direct' : 'plugin'),
        skills: selectedSkills,
        agents: Object.keys(AGENTS),
        commands: Object.keys(COMMANDS),
        hooks: options.hooks !== false,
        memory: options.memory !== false,
        claudeMd: options.claudeMd !== false,
        dryRun: (options.dryRun as boolean) || false,
        laravelBoost: false,
      };
    } else {
      config = await runWizard(options as { global?: boolean; dryRun?: boolean });
    }

    if (!config) {
      console.log(chalk.yellow('\n  Setup cancelled.\n'));
      process.exit(0);
    }

    await install(config);
  });

program
  .command('update')
  .description('Check for updates and re-install latest version')
  .action(async () => {
    console.log('');
    console.log(chalk.bold.cyan('  superkit-agents update'));
    console.log('');
    await checkForUpdates();
  });

// --- Plugin subcommands ---
const pluginCmd = program
  .command('plugin')
  .description('Manage plugins');

pluginCmd
  .command('add <nameOrPath>')
  .description('Install a plugin from npm or a local path')
  .option('--local', 'Install from a local directory (symlinks for live dev)')
  .option('--global', 'Install to global config')
  .option('--direct', 'Install into .claude/ instead of .claude-plugin/')
  .action(async (nameOrPath: string, options: Record<string, unknown>) => {
    console.log('');
    console.log(chalk.bold.cyan('  superkit-agents plugin add'));
    console.log('');

    const config: InstallConfig = {
      scope: options.global ? 'global' : 'project',
      format: options.direct ? 'direct' : 'plugin',
      skills: [],
      agents: [],
      commands: [],
      hooks: false,
      memory: false,
      claudeMd: false,
      dryRun: false,
      laravelBoost: false,
    };

    await installPlugin(nameOrPath, config, !!options.local);
  });

pluginCmd
  .command('list')
  .description('List installed plugins')
  .action(async () => {
    console.log('');
    console.log(chalk.bold.cyan('  Installed Plugins'));
    console.log('');

    const plugins = await listPlugins();

    if (plugins.length === 0) {
      console.log(chalk.dim('  No plugins installed.'));
    } else {
      for (const plugin of plugins) {
        const source = plugin.source === 'local' ? chalk.yellow('local') : chalk.blue('npm');
        console.log(`  ${chalk.bold(plugin.name)} ${chalk.dim(`v${plugin.version}`)} [${source}]`);
        if (plugin.manifest.description) {
          console.log(`    ${chalk.dim(plugin.manifest.description)}`);
        }
        const skills = plugin.manifest.skills ? Object.keys(plugin.manifest.skills).length : 0;
        const agents = plugin.manifest.agents ? Object.keys(plugin.manifest.agents).length : 0;
        const commands = plugin.manifest.commands ? Object.keys(plugin.manifest.commands).length : 0;
        const parts = [];
        if (skills > 0) parts.push(`${skills} skills`);
        if (agents > 0) parts.push(`${agents} agents`);
        if (commands > 0) parts.push(`${commands} commands`);
        if (parts.length > 0) {
          console.log(`    ${chalk.dim(parts.join(', '))}`);
        }
      }
    }
    console.log('');
  });

pluginCmd
  .command('remove <name>')
  .description('Remove an installed plugin')
  .option('--global', 'Remove from global config')
  .option('--direct', 'Remove from .claude/ instead of .claude-plugin/')
  .action(async (name: string, options: Record<string, unknown>) => {
    console.log('');
    console.log(chalk.bold.cyan('  superkit-agents plugin remove'));
    console.log('');

    const config: InstallConfig = {
      scope: options.global ? 'global' : 'project',
      format: options.direct ? 'direct' : 'plugin',
      skills: [],
      agents: [],
      commands: [],
      hooks: false,
      memory: false,
      claudeMd: false,
      dryRun: false,
      laravelBoost: false,
    };

    await removePlugin(name, config);
  });

pluginCmd
  .command('search [query]')
  .description('Search npm for superkit-agents plugins')
  .action(async (query?: string) => {
    console.log('');
    console.log(chalk.bold.cyan('  Plugin Search'));
    console.log('');

    const results = await searchPlugins(query);

    if (results.length === 0) {
      console.log(chalk.dim('  No plugins found.'));
    } else {
      for (const result of results) {
        console.log(`  ${chalk.bold(result.name)} ${chalk.dim(`v${result.version}`)}`);
        if (result.description) {
          console.log(`    ${chalk.dim(result.description)}`);
        }
      }
    }
    console.log('');
  });

program.parse();
