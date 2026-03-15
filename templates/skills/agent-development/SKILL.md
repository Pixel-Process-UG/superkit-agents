---
name: agent-development
description: When the user needs to build AI agents — tool use patterns, memory management, planning strategies, multi-agent coordination, evaluation, and safety guardrails.
---

# Agent Development

## Overview

Design and build AI agents that effectively use tools, manage memory, plan multi-step tasks, coordinate with other agents, and operate within safety guardrails. This skill covers the full agent development lifecycle from architecture to evaluation.

## Process

### Phase 1: Agent Design
1. Define the agent's purpose and scope
2. Identify required tools and capabilities
3. Design memory architecture (short-term, long-term)
4. Plan agent loop structure (observe, think, act)
5. Define safety boundaries and guardrails

### Phase 2: Implementation
1. Build the agent loop with tool dispatch
2. Implement memory management (context window, persistence)
3. Add planning and decomposition logic
4. Integrate error recovery and retry patterns
5. Implement output validation

### Phase 3: Evaluation and Safety
1. Build evaluation harness with test scenarios
2. Measure accuracy, efficiency, and safety metrics
3. Test edge cases and adversarial inputs
4. Add monitoring and logging
5. Implement circuit breakers for runaway behavior

## Tool Use Patterns

### Tool Definition Best Practices
```
1. Clear, specific tool names (verb-noun: search_documents, create_file)
2. Detailed descriptions including when to use and when NOT to use
3. Well-typed parameters with descriptions and examples
4. Predictable return formats
5. Error messages that help the agent self-correct
```

### Tool Selection Strategy
```
Given a task:
1. Identify required information and actions
2. Map to available tools
3. Determine tool call order (dependencies)
4. Execute with result validation
5. Retry or try alternative tool on failure
```

### Tool Design Principles
- **Composable**: small tools that combine for complex tasks
- **Idempotent**: safe to retry without side effects (where possible)
- **Observable**: return enough context for the agent to verify success
- **Bounded**: timeouts and size limits on all operations
- **Documented**: every parameter and return value described

## Memory Management

### Memory Types
| Type | Duration | Storage | Use Case |
|---|---|---|---|
| Working Memory | Current turn | Context window | Active reasoning |
| Short-term Memory | Current session | In-context or buffer | Recent conversation |
| Long-term Memory | Across sessions | Database/file | Learned patterns, user prefs |
| Episodic Memory | Specific events | Indexed store | Past task outcomes |
| Semantic Memory | Knowledge | Vector DB | Domain knowledge retrieval |

### Context Window Management
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

### Memory Update Triggers
- User correction: update learned patterns
- Task completion: store outcome and approach
- Error recovery: record what failed and what worked
- New domain knowledge: index for future retrieval

## Planning Strategies

### Hierarchical Task Decomposition
```
1. Break high-level goal into sub-goals
2. For each sub-goal, identify required actions
3. Order actions by dependencies
4. Execute with checkpoints between phases
5. Re-plan if intermediate results change the approach
```

### ReAct Pattern (Reason + Act)
```
Thought: I need to find the user's recent orders to answer their question.
Action: search_orders(user_id="123", limit=5)
Observation: Found 5 orders, most recent is #456 from yesterday.
Thought: The user asked about order #456. I have the details now.
Action: respond with order details
```

### Plan-and-Execute Pattern
```
1. Create a complete plan before any action
2. Execute each step, checking preconditions
3. After each step, validate the result
4. If a step fails, re-plan from current state
5. Never modify the plan mid-step (finish or abort first)
```

### Reflection Pattern
```
After completing a task:
1. Was the result correct?
2. Was the approach efficient?
3. What could be improved?
4. Should any memory be updated?
```

## Multi-Agent Coordination

### Patterns
| Pattern | Description | Use When |
|---|---|---|
| Orchestrator | Central agent delegates to specialists | Clear task hierarchy |
| Pipeline | Agents process in sequence | Linear workflows |
| Debate | Agents propose and critique | Need diverse perspectives |
| Voting | Multiple agents, majority wins | Uncertainty in approach |
| Supervisor | One agent monitors others | Safety-critical tasks |

### Communication Protocol
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

### Coordination Rules
- Define clear ownership boundaries
- Use structured messages between agents
- Implement deadlock detection
- Set timeouts for inter-agent communication
- Log all inter-agent messages for debugging

## Evaluation Frameworks

### Metrics
| Metric | What It Measures | How to Measure |
|---|---|---|
| Task Success Rate | Correct completions / total tasks | Automated + human eval |
| Efficiency | Steps taken vs optimal path | Step count comparison |
| Tool Accuracy | Correct tool calls / total calls | Log analysis |
| Safety | Violations / total interactions | Automated guardrail checks |
| Latency | Time to complete task | Wall clock measurement |
| Cost | Token usage per task | API usage tracking |

### Evaluation Dataset Structure
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

### A/B Testing Agents
- Test prompt variations with same evaluation set
- Compare tool use efficiency across versions
- Measure user satisfaction when applicable
- Statistical significance: minimum 100 test cases

## Safety Guardrails

### Input Guardrails
- Detect and reject prompt injection attempts
- Validate all user inputs before processing
- Rate limit requests per user/session
- Content filtering for harmful requests

### Output Guardrails
- Validate tool call arguments before execution
- Check outputs for sensitive information (PII, secrets)
- Enforce response format constraints
- Prevent infinite tool call loops

### Operational Guardrails
- Maximum tool calls per task (circuit breaker)
- Maximum tokens per response
- Timeout for total task duration
- Escalation to human when confidence is low
- Audit logging for all actions

### Circuit Breaker Pattern
```
Thresholds:
- Max tool calls per task: 20
- Max consecutive errors: 3
- Max task duration: 5 minutes
- Max tokens generated: 10,000

On breach:
1. Stop execution immediately
2. Log the violation with full context
3. Return graceful error to user
4. Alert operator if pattern repeats
```

## Prompt Engineering for Agents

### System Prompt Structure
```
1. Identity and purpose (who the agent is)
2. Available tools (what it can do)
3. Constraints (what it must not do)
4. Output format (how to respond)
5. Examples (few-shot demonstrations)
6. Error handling (what to do when stuck)
```

### Key Prompt Patterns
- **Scratchpad**: encourage step-by-step reasoning before action
- **Self-correction**: "If your first approach fails, try..."
- **Confidence calibration**: "Only proceed if you are confident"
- **Graceful degradation**: "If you cannot complete the task, explain why"

## Anti-Patterns

- Agents that call tools without reasoning about the results
- No maximum iteration limit (infinite loops)
- Trusting all tool outputs without validation
- Hardcoded tool sequences (no adaptability)
- No error recovery strategy
- Agents that apologize instead of taking corrective action
- Over-reliance on a single tool for all tasks
- No evaluation framework (shipping blind)

## Skill Type

**FLEXIBLE** — Adapt the agent architecture, memory strategy, and coordination patterns to the specific use case. The safety guardrails and evaluation requirements are strongly recommended for production agents.
