---
name: mcp-builder
description: >
  Use when the user needs to build MCP (Model Context Protocol) servers — tool definitions, resource
  management, prompt templates, transport layers, and client integration. Triggers: user says "MCP",
  "MCP server", "model context protocol", building tools for AI clients, creating AI integrations.
---

# MCP Builder

## Overview

Build production-quality MCP (Model Context Protocol) servers that expose tools, resources, and prompts to AI clients. This skill covers the full development lifecycle: tool definition, resource management, prompt templates, transport configuration (stdio, SSE), error handling, security hardening, testing, and client integration.

## Phase 1: Design

1. Identify capabilities to expose (tools, resources, prompts)
2. Define tool schemas with Zod/JSON Schema
3. Plan resource URI patterns
4. Design error handling strategy
5. Choose transport layer (stdio for CLI, SSE for web)

**STOP — Present the capability inventory and transport choice to user for approval.**

### Capability Selection Decision Table

| What You Have | MCP Primitive | Example |
|---|---|---|
| Actions that modify state | Tool | `create-issue`, `send-email`, `deploy-app` |
| Actions that read/query | Tool | `search-documents`, `get-status` |
| Data the AI should read | Resource | `config://settings`, `docs://api/endpoints` |
| Reusable prompt patterns | Prompt | `code-review`, `summarize-document` |
| Real-time data feeds | Resource (subscribable) | `metrics://cpu/current` |

### Transport Selection Decision Table

| Context | Transport | Why |
|---|---|---|
| CLI tool, local client (Claude Desktop) | Stdio | Simple, no network overhead |
| Web application, remote clients | SSE | Network-accessible, real-time |
| Both local and remote | Stdio + SSE | Support both use cases |
| High-throughput, bidirectional | WebSocket (custom) | Lower latency than SSE |

## Phase 2: Implementation

1. Set up MCP server project structure
2. Implement tool handlers with input validation
3. Implement resource providers
4. Add prompt templates
5. Configure transport and authentication

**STOP — Run basic smoke tests before moving to hardening.**

### Project Structure

```
src/
  index.ts          # Server entry point
  tools/
    search.ts       # Tool implementations
    create.ts
  resources/
    documents.ts    # Resource providers
    config.ts
  prompts/
    review.ts       # Prompt templates
  lib/
    database.ts     # Shared utilities
    validation.ts
tests/
  tools.test.ts
  resources.test.ts
package.json
tsconfig.json
```

### Tool Definition Pattern

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'my-mcp-server',
  version: '1.0.0',
});

server.tool(
  'search-documents',
  'Search documents by query. Returns matching documents with relevance scores.',
  {
    query: z.string().describe('Search query string'),
    limit: z.number().min(1).max(100).default(10).describe('Maximum results to return'),
    filter: z.object({
      type: z.enum(['article', 'page', 'note']).optional(),
      dateAfter: z.string().datetime().optional(),
    }).optional().describe('Optional filters'),
  },
  async ({ query, limit, filter }) => {
    const results = await searchEngine.search(query, { limit, ...filter });
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results, null, 2),
      }],
    };
  }
);
```

### Tool Design Principles

| Principle | Rule |
|---|---|
| Clear naming | verb-noun format: `search-documents`, `create-issue` |
| Descriptive descriptions | Explain what, when, and return value |
| Validated inputs | Zod schemas with `.describe()` on every field |
| Structured outputs | Well-formatted text or JSON |
| Idempotent when possible | Same input produces same result |
| Actionable errors | Specific error messages with `isError: true` |

### Tool Response Patterns

```typescript
// Text response
return { content: [{ type: 'text', text: 'Operation completed successfully' }] };

// Structured data response
return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };

// Multi-part response
return {
  content: [
    { type: 'text', text: `Found ${results.length} results:` },
    { type: 'text', text: results.map(r => `- ${r.title}: ${r.summary}`).join('\n') },
  ],
};

// Image response
return { content: [{ type: 'image', data: base64Data, mimeType: 'image/png' }] };

// Error response
return {
  content: [{ type: 'text', text: `Error: ${error.message}` }],
  isError: true,
};
```

## Resource Management

### Resource Definition

```typescript
// Static resource
server.resource(
  'config',
  'config://app/settings',
  { mimeType: 'application/json' },
  async () => ({
    contents: [{
      uri: 'config://app/settings',
      mimeType: 'application/json',
      text: JSON.stringify(appConfig),
    }],
  })
);

// Dynamic resource with URI template
server.resource(
  'document',
  new ResourceTemplate('docs://{category}/{id}', { list: undefined }),
  { mimeType: 'text/markdown' },
  async (uri, { category, id }) => ({
    contents: [{
      uri: uri.href,
      mimeType: 'text/markdown',
      text: await getDocument(category, id),
    }],
  })
);
```

### Resource URI Conventions

```
file:///path/to/file          — Local files
https://api.example.com/data  — Remote HTTP resources
db://database/table/id        — Database records
config://app/settings         — Configuration
docs://category/slug          — Documentation
```

## Prompt Templates

```typescript
server.prompt(
  'code-review',
  'Generate a code review for the given file',
  {
    filePath: z.string().describe('Path to the file to review'),
    severity: z.enum(['strict', 'normal', 'lenient']).default('normal'),
  },
  async ({ filePath, severity }) => {
    const code = await readFile(filePath, 'utf-8');
    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `Review this code with ${severity} standards:\n\n\`\`\`\n${code}\n\`\`\``,
        },
      }],
    };
  }
);
```

## Transport Layers

### Stdio Transport (CLI tools, local development)

```typescript
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const transport = new StdioServerTransport();
await server.connect(transport);
```

### SSE Transport (Web applications, remote servers)

```typescript
import express from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = express();

app.get('/sse', async (req, res) => {
  const transport = new SSEServerTransport('/messages', res);
  await server.connect(transport);
});

app.post('/messages', async (req, res) => {
  // Handle incoming messages
});

app.listen(3001);
```

## Phase 3: Hardening

1. Add comprehensive error handling
2. Implement rate limiting and timeouts
3. Security review (input sanitization, permission checks)
4. Write integration tests
5. Document tools and resources for clients

**STOP — All tests must pass and security review must be complete before deployment.**

### Error Handling

```typescript
server.tool('risky-operation', 'Performs an operation that might fail', {
  input: z.string(),
}, async ({ input }) => {
  try {
    const result = await performOperation(input);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        content: [{ type: 'text', text: `Invalid input: ${error.message}` }],
        isError: true,
      };
    }
    if (error instanceof NotFoundError) {
      return {
        content: [{ type: 'text', text: `Resource not found: ${error.message}` }],
        isError: true,
      };
    }
    console.error('Unexpected error:', error);
    return {
      content: [{ type: 'text', text: 'An unexpected error occurred. Please try again.' }],
      isError: true,
    };
  }
});
```

### Error Handling Rules

| Rule | Why |
|---|---|
| Never expose stack traces to clients | Security risk |
| Return `isError: true` for all errors | Client can distinguish success/failure |
| Log unexpected errors server-side | Debugging and monitoring |
| Provide actionable error messages | Client can self-correct |
| Handle timeouts for external calls | Prevent hanging requests |
| Validate all inputs before processing | Reject bad data early |

### Security Considerations

| Category | Rules |
|---|---|
| Input validation | Zod schemas, path traversal prevention, length limits |
| Permission model | Least privilege, whitelist directories, separate read/write tools |
| Secrets | Env vars only, never in responses, mask in logs, rotate regularly |
| Rate limiting | Limit tool invocations per client |
| Auditing | Log all tool calls with timestamps |

## Testing MCP Servers

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('MCP Server', () => {
  let server: McpServer;
  let client: Client;

  beforeEach(async () => {
    server = createServer();
    client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
  });

  test('search-documents returns results', async () => {
    const result = await client.callTool({
      name: 'search-documents',
      arguments: { query: 'test', limit: 5 },
    });
    expect(result.content[0].type).toBe('text');
    const data = JSON.parse(result.content[0].text);
    expect(data.length).toBeLessThanOrEqual(5);
  });

  test('handles invalid input gracefully', async () => {
    const result = await client.callTool({
      name: 'search-documents',
      arguments: { query: '', limit: -1 },
    });
    expect(result.isError).toBe(true);
  });
});
```

## Client Integration

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/server/dist/index.js"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | What to Do Instead |
|---|---|---|
| Tools that do too many things | Hard to use, hard to test | Split into focused single-purpose tools |
| Missing input validation | Crashes, security holes | Always use Zod schemas |
| Returning raw stack traces | Security risk, confusing for AI | Return `isError: true` with clean message |
| No timeout on external calls | Hangs indefinitely | Set timeouts on all I/O |
| Hardcoded secrets in source | Credential exposure | Use environment variables |
| Tools without descriptions | Clients cannot discover purpose | Write clear descriptions |
| Blocking event loop with sync ops | Server becomes unresponsive | Use async/await for all I/O |
| No tests | Regressions go undetected | Test with InMemoryTransport |

## Documentation Lookup (Context7)

Use `mcp__context7__resolve-library-id` then `mcp__context7__query-docs` for up-to-date docs. Returned docs override memorized knowledge.
- `@anthropic-ai/sdk` — for Claude API client, tool definitions, or streaming

---

## Integration Points

| Skill | Integration |
|---|---|
| `senior-devops` | Containerize and deploy MCP servers |
| `agent-development` | MCP servers provide tools for agents |
| `security-review` | Security hardening of tool inputs/outputs |
| `test-driven-development` | TDD for tool implementation |
| `deployment` | CI/CD pipeline for MCP server releases |
| `planning` | MCP server design is part of the implementation plan |

## Skill Type

**FLEXIBLE** — Adapt project structure, transport choice, and tooling to the use case. Tool validation with Zod and error handling with `isError` are strongly recommended. Security review is recommended before production deployment.
