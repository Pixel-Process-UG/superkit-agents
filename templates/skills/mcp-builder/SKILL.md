---
name: mcp-builder
description: When the user needs to build MCP (Model Context Protocol) servers — tool definitions, resource management, prompt templates, transport layers, and client integration.
---

# MCP Builder

## Overview

Build production-quality MCP (Model Context Protocol) servers that expose tools, resources, and prompts to AI clients. This skill covers the full development lifecycle: tool definition, resource management, prompt templates, transport configuration (stdio, SSE), error handling, security hardening, testing, and client integration.

## Process

### Phase 1: Design
1. Identify capabilities to expose (tools, resources, prompts)
2. Define tool schemas with Zod/JSON Schema
3. Plan resource URI patterns
4. Design error handling strategy
5. Choose transport layer (stdio for CLI, SSE for web)

### Phase 2: Implementation
1. Set up MCP server project structure
2. Implement tool handlers with input validation
3. Implement resource providers
4. Add prompt templates
5. Configure transport and authentication

### Phase 3: Hardening
1. Add comprehensive error handling
2. Implement rate limiting and timeouts
3. Security review (input sanitization, permission checks)
4. Write integration tests
5. Document tools and resources for clients

## Tool Definition Patterns

### Basic Tool Definition
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
- **Clear naming**: verb-noun format (`search-documents`, `create-issue`, `get-status`)
- **Descriptive descriptions**: explain what the tool does, when to use it, and what it returns
- **Validated inputs**: use Zod schemas with `.describe()` on every field
- **Structured outputs**: return well-formatted text or structured data
- **Idempotent when possible**: same input produces same result
- **Error messages**: actionable, specific error responses

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
          text: `Review this code with ${severity} standards:\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide feedback on: correctness, performance, security, readability.`,
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

### Transport Selection
| Transport | Use Case | Pros | Cons |
|---|---|---|---|
| Stdio | CLI tools, local MCP clients | Simple, no network | Local only |
| SSE | Web apps, remote clients | Network-accessible, real-time | Requires HTTP server |

## Error Handling

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
    // Unexpected errors — log and return generic message
    console.error('Unexpected error:', error);
    return {
      content: [{ type: 'text', text: 'An unexpected error occurred. Please try again.' }],
      isError: true,
    };
  }
});
```

### Error Handling Rules
- Never expose stack traces to clients
- Return `isError: true` for all error responses
- Log unexpected errors server-side
- Provide actionable error messages
- Handle timeouts for external service calls
- Validate all inputs before processing

## Security Considerations

### Input Validation
- Validate all tool inputs with Zod schemas
- Sanitize file paths (prevent path traversal: `../../../etc/passwd`)
- Limit string lengths to prevent abuse
- Validate URLs before fetching
- Sanitize SQL/command injection vectors

### Permission Model
- Principle of least privilege for file system access
- Whitelist allowed directories and operations
- Rate limit tool invocations
- Log all tool calls for auditing
- Separate read-only and write tools

### Secrets
- Never expose API keys in tool responses
- Use environment variables for credentials
- Rotate secrets regularly
- Mask sensitive data in logs

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

## Project Structure

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

## Anti-Patterns

- Tools that do too many things (split into focused tools)
- Missing input validation (always use Zod schemas)
- Returning raw error stack traces to clients
- No timeout on external calls
- Hardcoded secrets in source code
- Tools without descriptions (clients cannot discover their purpose)
- Blocking the event loop with synchronous operations

## Skill Type

**RIGID** — All tools must have Zod-validated inputs and descriptive documentation. Error handling with `isError` flag is mandatory. Security review is required before deployment. Testing with in-memory transport is required.
