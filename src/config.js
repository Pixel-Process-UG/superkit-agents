export const SKILLS = {
  'using-toolkit': {
    name: 'using-toolkit',
    description: 'Master skill - establishes how to find and use all toolkit skills',
    category: 'core',
  },
  'planning': {
    name: 'planning',
    description: 'Structured planning before any implementation work',
    category: 'process',
  },
  'brainstorming': {
    name: 'brainstorming',
    description: 'Creative exploration and design before planning',
    category: 'process',
  },
  'task-management': {
    name: 'task-management',
    description: 'Break work into discrete tracked steps',
    category: 'process',
  },
  'prd-generation': {
    name: 'prd-generation',
    description: 'Generate Product Requirements Documents',
    category: 'documentation',
  },
  'self-learning': {
    name: 'self-learning',
    description: 'Auto-discover and remember project context',
    category: 'core',
  },
  'code-review': {
    name: 'code-review',
    description: 'Quality verification against plan and standards',
    category: 'quality',
  },
  'tech-docs-generator': {
    name: 'tech-docs-generator',
    description: 'Generate technical documentation from code',
    category: 'documentation',
  },
  'resilient-execution': {
    name: 'resilient-execution',
    description: 'Never fail - retry with alternative approaches',
    category: 'core',
  },
  'api-design': {
    name: 'api-design',
    description: 'Structured API endpoint design with OpenAPI spec',
    category: 'design',
  },
  'testing-strategy': {
    name: 'testing-strategy',
    description: 'Choose testing approach based on project context',
    category: 'quality',
  },
  'deployment': {
    name: 'deployment',
    description: 'CI/CD pipeline generation and deploy checklists',
    category: 'operations',
  },
  'test-driven-development': {
    name: 'test-driven-development',
    description: 'TDD workflow with RED-GREEN-REFACTOR cycle',
    category: 'quality',
  },
  'systematic-debugging': {
    name: 'systematic-debugging',
    description: '4-phase debugging methodology with root cause analysis',
    category: 'quality',
  },
  'verification-before-completion': {
    name: 'verification-before-completion',
    description: '5-step verification gate before any completion claim',
    category: 'core',
  },
  'executing-plans': {
    name: 'executing-plans',
    description: 'Step-by-step execution of approved plan documents',
    category: 'process',
  },
  'subagent-driven-development': {
    name: 'subagent-driven-development',
    description: 'Same-session execution with two-stage review gates',
    category: 'process',
  },
  'dispatching-parallel-agents': {
    name: 'dispatching-parallel-agents',
    description: 'Coordinate multiple independent agents in parallel',
    category: 'process',
  },
  'using-git-worktrees': {
    name: 'using-git-worktrees',
    description: 'Isolated development environments with git worktrees',
    category: 'operations',
  },
  'finishing-a-development-branch': {
    name: 'finishing-a-development-branch',
    description: 'Structured branch completion with merge options',
    category: 'operations',
  },
  'writing-skills': {
    name: 'writing-skills',
    description: 'Create new skills with TDD and best practices',
    category: 'documentation',
  },
  'frontend-ui-design': {
    name: 'frontend-ui-design',
    description: 'Component architecture, responsive design, accessibility',
    category: 'design',
  },
  'database-schema-design': {
    name: 'database-schema-design',
    description: 'Data modeling, migrations, indexing, query optimization',
    category: 'design',
  },
  'security-review': {
    name: 'security-review',
    description: 'OWASP Top 10, auth patterns, input validation, secrets',
    category: 'quality',
  },
  'performance-optimization': {
    name: 'performance-optimization',
    description: 'Profiling, caching, bundle optimization, Web Vitals',
    category: 'quality',
  },
  'autonomous-loop': {
    name: 'autonomous-loop',
    description: 'Ralph-style iterative development with autonomous planning and building loops',
    category: 'process',
  },
  'circuit-breaker': {
    name: 'circuit-breaker',
    description: 'Loop stagnation detection, rate limiting, and recovery patterns',
    category: 'core',
  },
  'ralph-status': {
    name: 'ralph-status',
    description: 'Structured status reporting with exit signal protocol',
    category: 'process',
  },
  'spec-writing': {
    name: 'spec-writing',
    description: 'JTBD-based specification writing with acceptance criteria',
    category: 'documentation',
  },
  'reverse-engineering-specs': {
    name: 'reverse-engineering-specs',
    description: 'Generate implementation-free specs from existing codebases',
    category: 'documentation',
  },
  'acceptance-testing': {
    name: 'acceptance-testing',
    description: 'Acceptance-driven backpressure with behavioral validation gates',
    category: 'quality',
  },
  'llm-as-judge': {
    name: 'llm-as-judge',
    description: 'Non-deterministic validation for subjective quality criteria',
    category: 'quality',
  },
};

export const AGENTS = {
  'planner': {
    name: 'planner',
    description: 'Senior architect creating implementation plans',
  },
  'code-reviewer': {
    name: 'code-reviewer',
    description: 'Reviews code against plan and standards',
  },
  'prd-writer': {
    name: 'prd-writer',
    description: 'Generates PRD from collected requirements',
  },
  'doc-generator': {
    name: 'doc-generator',
    description: 'Generates technical documentation from code',
  },
  'spec-reviewer': {
    name: 'spec-reviewer',
    description: 'Reviews implementation against spec compliance',
  },
  'quality-reviewer': {
    name: 'quality-reviewer',
    description: 'Reviews code quality, patterns, performance, security',
  },
  'loop-orchestrator': {
    name: 'loop-orchestrator',
    description: 'Manages autonomous development loop iterations',
  },
  'spec-writer': {
    name: 'spec-writer',
    description: 'Generates JTBD specifications with acceptance criteria',
  },
  'acceptance-judge': {
    name: 'acceptance-judge',
    description: 'Evaluates subjective quality via LLM-as-judge pattern',
  },
};

export const COMMANDS = {
  'plan': { name: 'plan', skill: 'planning', description: 'Start structured planning' },
  'review': { name: 'review', skill: 'code-review', description: 'Request code review' },
  'prd': { name: 'prd', skill: 'prd-generation', description: 'Generate a PRD' },
  'learn': { name: 'learn', skill: 'self-learning', description: 'Scan and learn project context' },
  'docs': { name: 'docs', skill: 'tech-docs-generator', description: 'Generate technical docs' },
  'tdd': { name: 'tdd', skill: 'test-driven-development', description: 'Start TDD workflow' },
  'debug': { name: 'debug', skill: 'systematic-debugging', description: 'Start debugging methodology' },
  'verify': { name: 'verify', skill: 'verification-before-completion', description: 'Verify completion claim' },
  'execute': { name: 'execute', skill: 'executing-plans', description: 'Execute an approved plan' },
  'worktree': { name: 'worktree', skill: 'using-git-worktrees', description: 'Set up git worktree' },
  'brainstorm': { name: 'brainstorm', skill: 'brainstorming', description: 'Start brainstorming session' },
  'ralph': { name: 'ralph', skill: 'autonomous-loop', description: 'Start Ralph autonomous development loop' },
  'specs': { name: 'specs', skill: 'spec-writing', description: 'Write or audit specifications' },
  'loop': { name: 'loop', skill: 'autonomous-loop', description: 'Start autonomous loop iteration' },
};

export const MEMORY_FILES = [
  'project-context.md',
  'learned-patterns.md',
  'user-preferences.md',
  'decisions-log.md',
];

export const SKILL_CATEGORIES = {
  core: 'Core (always recommended)',
  process: 'Process & Workflow',
  quality: 'Quality Assurance',
  documentation: 'Documentation',
  design: 'Design',
  operations: 'Operations',
};
