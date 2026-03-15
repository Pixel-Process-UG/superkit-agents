---
name: agent-development
description: >
  Use when the user needs to build AI agents — tool use patterns, memory management, planning strategies,
  multi-agent coordination, evaluation, and safety guardrails. Triggers: user says "agent", "build an agent",
  "tool use", "agent loop", "multi-agent", "memory management", "guardrails", "agent evaluation".
---

# Agent Development

## Overview

Design and build AI agents that effectively use tools, manage memory, plan multi-step tasks, coordinate with other agents, and operate within safety guardrails. This skill covers the full agent development lifecycle from architecture through evaluation, with emphasis on observable, testable, and safe agent behavior.

## Phase 1: Agent Design

1. Define the agent's purpose and scope
2. Identify required tools and capabilities
3. Design memory architecture (short-term, long-term)
4. Plan agent loop structure (observe, think, act)
5. Define safety boundaries and guardrails

**STOP — Present agent design to user for approval before implementation.**

### Agent Architecture Decision Table

| Agent Type | When to Use | Loop Pattern | Complexity |
|---|---|---|---|
| Single-turn tool user | Simple queries with tool calls | Request -> Tool -> Response | Low |
| ReAct agent | Multi-step reasoning tasks | Thought -> Action -> Observation -> loop | Medium |
| Plan-and-execute | Complex tasks with dependencies | Plan -> Execute steps -> Validate | Medium-High |
| Multi-agent orchestrator | Parallel/specialized sub-tasks | Dispatch -> Collect -> Synthesize | High |
| Autonomous loop (Ralph-style) | Long-running iterative development | Plan -> Build -> Verify -> Exit gate | High |

## Phase 2: Implementation

1. Build the agent loop with tool dispatch
2. Implement memory management (context window, persistence)
3. Add planning and decomposition logic
4. Integrate error recovery and retry patterns
5. Implement output validation

**STOP — Run smoke tests on the agent loop before adding complexity.**

### Tool Use Patterns

#### Tool Definition Best Practices

| Principle | Rule | Example |
|---|---|---|
| Clear naming | verb-noun format | `search_documents`, `create_file` |
| Detailed descriptions | Include when to use AND when NOT to use | "Use for keyword search. Do NOT use for semantic similarity." |
| Well-typed parameters | Descriptions and examples on every param | `query: string // "e.g., 'user authentication'"` |
| Predictable returns | Consistent format across tools | Always return `{ success, data, error }` |
| Self-correcting errors | Help agent recover | "Invalid date format. Expected ISO 8601: YYYY-MM-DD" |

#### Tool Selection Strategy

```
Given a task:
1. Identify required information and actions
2. Map to available tools
3. Determine tool call order (dependencies)
4. Execute with result validation
5. Retry or try alternative tool on failure
```

#### Tool Design Principles

- **Composable**: small tools that combine for complex tasks
- **Idempotent**: safe to retry without side effects (where possible)
- **Observable**: return enough context for the agent to verify success
- **Bounded**: timeouts and size limits on all operations
- **Documented**: every parameter and return value described

### Memory Management

#### Memory Type Decision Table

| Type | Duration | Storage | Use Case |
|---|---|---|---|
| Working Memory | Current turn | Context window | Active reasoning |
| Short-term Memory | Current session | In-context or buffer | Recent conversation |
| Long-term Memory | Across sessions | Database/file | Learned patterns, user prefs |
| Episodic Memory | Specific events | Indexed store | Past task outcomes |
| Semantic Memory | Knowledge | Vector DB | Domain knowledge retrieval |

#### Context Window Management

```
Strategy: Sliding window with importance-based retention

1. Always retain: system prompt, tool definitions, current task
2. Summarize: older conversation turns into compressed summaries
3. Evict: least relevant context when approaching limit
4. Retrieve: pull relevant long-term memory on demand

Budget allocation:
  System prompt + tools: ~20%
  Current task context:  ~40%
  Conversation history:  ~25%
  Retrieved memory:      ~15%
```

#### Memory Update Triggers

| Trigger | Action |
|---|---|
| User correction | Update learned patterns |
| Task completion | Store outcome and approach |
| Error recovery | Record what failed and what worked |
| New domain knowledge | Index for future retrieval |

### Planning Strategies

#### Hierarchical Task Decomposition

```
1. Break high-level goal into sub-goals
2. For each sub-goal, identify required actions
3. Order actions by dependencies
4. Execute with checkpoints between phases
5. Re-plan if intermediate results change the approach
```

#### ReAct Pattern (Reason + Act)

```
Thought: I need to find the user's recent orders to answer their question.
Action: search_orders(user_id="123", limit=5)
Observation: Found 5 orders, most recent is #456 from yesterday.
Thought: The user asked about order #456. I have the details now.
Action: respond with order details
```

#### Plan-and-Execute Pattern

```
1. Create a complete plan before any action
2. Execute each step, checking preconditions
3. After each step, validate the result
4. If a step fails, re-plan from current state
5. Never modify the plan mid-step (finish or abort first)
```

#### Reflection Pattern

```
After completing a task:
1. Was the result correct?
2. Was the approach efficient?
3. What could be improved?
4. Should any memory be updated?
```

## Phase 3: Evaluation and Safety

1. Build evaluation harness with test scenarios
2. Measure accuracy, efficiency, and safety metrics
3. Test edge cases and adversarial inputs
4. Add monitoring and logging
5. Implement circuit breakers for runaway behavior

**STOP — All safety guardrails must be tested before deployment.**

### Multi-Agent Coordination

#### Coordination Pattern Decision Table

| Pattern | Description | Use When |
|---|---|---|
| Orchestrator | Central agent delegates to specialists | Clear task hierarchy |
| Pipeline | Agents process in sequence | Linear workflows |
| Debate | Agents propose and critique | Need diverse perspectives |
| Voting | Multiple agents, majority wins | Uncertainty in approach |
| Supervisor | One agent monitors others | Safety-critical tasks |

#### Communication Protocol

```
Agent-to-Agent message:
{
  "from": "planner",
  "to": "executor",
  "type": "task_assignment",
  "content": { "task": "...", "context": "...", "constraints": "..." },
  "priority": "high",
  "deadline": "2025-01-15T10:00:00Z"
}
```

#### Coordination Rules

- Define clear ownership boundaries
- Use structured messages between agents
- Implement deadlock detection
- Set timeouts for inter-agent communication
- Log all inter-agent messages for debugging

### Evaluation Framework

#### Metrics Decision Table

| Metric | What It Measures | How to Measure | Target |
|---|---|---|---|
| Task Success Rate | Correct completions / total | Automated + human eval | > 90% |
| Efficiency | Steps vs optimal path | Step count comparison | < 2x optimal |
| Tool Accuracy | Correct tool calls / total | Log analysis | > 95% |
| Safety | Violations / total interactions | Guardrail checks | 0 violations |
| Latency | Time to complete task | Wall clock | < SLA |
| Cost | Token usage per task | API usage tracking | Within budget |

#### Evaluation Dataset Structure

```json
{
  "test_cases": [
    {
      "id": "tc_001",
      "input": "Find all orders over $100 from last week",
      "expected_tools": ["search_orders"],
      "expected_output_contains": ["order_id", "amount"],
      "category": "retrieval",
      "difficulty": "easy"
    }
  ]
}
```

### Safety Guardrails

#### Input Guardrails

- Detect and reject prompt injection attempts
- Validate all user inputs before processing
- Rate limit requests per user/session
- Content filtering for harmful requests

#### Output Guardrails

- Validate tool call arguments before execution
- Check outputs for sensitive information (PII, secrets)
- Enforce response format constraints
- Prevent infinite tool call loops

#### Operational Guardrails

- Maximum tool calls per task (circuit breaker)
- Maximum tokens per response
- Timeout for total task duration
- Escalation to human when confidence is low
- Audit logging for all actions

#### Circuit Breaker Thresholds

| Condition | Threshold | Action |
|---|---|---|
| Max tool calls per task | 20 | Stop execution, return error |
| Max consecutive errors | 3 | Stop, log, return graceful error |
| Max task duration | 5 minutes | Timeout, return partial result |
| Max tokens generated | 10,000 | Stop generation |
| Pattern repeats | 5 identical errors | Open circuit, alert operator |

### Prompt Engineering for Agents

#### System Prompt Structure

```
1. Identity and purpose (who the agent is)
2. Available tools (what it can do)
3. Constraints (what it must not do)
4. Output format (how to respond)
5. Examples (few-shot demonstrations)
6. Error handling (what to do when stuck)
```

#### Key Prompt Patterns

- **Scratchpad**: encourage step-by-step reasoning before action
- **Self-correction**: "If your first approach fails, try..."
- **Confidence calibration**: "Only proceed if you are confident"
- **Graceful degradation**: "If you cannot complete the task, explain why"

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | What to Do Instead |
|---|---|---|
| Calling tools without reasoning | Wastes calls, misses context | Use ReAct pattern (think first) |
| No max iteration limit | Infinite loops, runaway costs | Set circuit breaker thresholds |
| Trusting all tool outputs | Corrupted data propagates | Validate tool results |
| Hardcoded tool sequences | No adaptability to failures | Dynamic tool selection based on state |
| No error recovery strategy | Agent gets stuck on first failure | Implement retry with alternatives |
| Apologizing instead of acting | Wastes user time | Take corrective action, then report |
| Over-reliance on single tool | Fragile if that tool fails | Provide fallback tools |
| No evaluation framework | Shipping blind, no quality signal | Build eval harness before deployment |
| Unlimited context growth | Context overflow, degraded quality | Implement memory management |

## Integration Points

| Skill | Integration |
|---|---|
| `mcp-builder` | MCP servers provide tools for agents |
| `planning` | Agent planning uses structured plan generation |
| `autonomous-loop` | Ralph-style loops are a specialized agent pattern |
| `dispatching-parallel-agents` | Multi-agent coordination pattern |
| `circuit-breaker` | Operational safety for agent loops |
| `verification-before-completion` | Agent output validation |
| `test-driven-development` | TDD for agent tool implementations |

## Skill Type

**FLEXIBLE** — Adapt the agent architecture, memory strategy, and coordination patterns to the specific use case. Safety guardrails and evaluation frameworks are strongly recommended for all production agents.
