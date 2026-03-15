---
name: task-decomposition
description: "Use when hierarchical task breakdown is needed, when dependency mapping between tasks is required, when effort estimation and parallelization planning is needed, or when creating work breakdown structures. Triggers on /decompose command, when complex tasks need to be broken into manageable subtasks, when critical path analysis is needed for scheduling, or when identifying tasks that can run concurrently."
---

# Task Decomposition

## Overview

Task decomposition breaks complex tasks into manageable, well-defined subtasks with clear dependencies, effort estimates, and parallelization opportunities. It covers hierarchical work breakdown structures (WBS), dependency graph construction, critical path analysis, task sizing, and identification of concurrent execution opportunities. Essential for planning multi-step implementations, project estimation, and autonomous loop task selection.

**Announce at start:** "I'm using the task-decomposition skill to break this work into a structured hierarchy with dependencies and estimates."

## Trigger Conditions

- Complex task needs to be broken into subtasks
- Dependency mapping is needed between work items
- Effort estimation is required for planning
- Parallelization opportunities need to be identified
- `/decompose` command invoked
- Transition from planning skill for complex plans
- Autonomous loop needs task selection guidance

---

## Phase 1: Scope Definition

**Goal:** Define clear boundaries for the decomposition.

1. Define the overall deliverable and acceptance criteria
2. Identify the boundaries (what is in scope, what is not)
3. Determine the decomposition granularity level
4. Identify stakeholders and their requirements
5. Establish constraints (time, resources, dependencies)

### Granularity Decision Table

| Context | Target Level | Typical Duration | Rationale |
|---------|-------------|-----------------|-----------|
| Autonomous loop (Ralph) | L3-L4 (Task/Subtask) | 15 min - 4 hours | ONE task per loop iteration |
| Sprint planning | L2-L3 (Story/Task) | 0.5-2 days | Sprint-sized work items |
| Roadmap planning | L0-L1 (Epic/Feature) | 2-8 weeks | High-level milestone tracking |
| Bug fix | L3-L4 (Task/Subtask) | 15 min - 2 hours | Focused, specific fixes |

### Granularity Levels

| Level | Name | Typical Duration | Example |
|-------|------|-----------------|---------|
| L0 | Epic | 2-8 weeks | "User authentication system" |
| L1 | Feature | 2-5 days | "OAuth2 login flow" |
| L2 | Story | 0.5-2 days | "Google OAuth provider integration" |
| L3 | Task | 1-4 hours | "Implement Google callback handler" |
| L4 | Subtask | 15-60 minutes | "Parse OAuth token response" |

**STOP — Do NOT proceed to Phase 2 until:**
- [ ] Deliverable and acceptance criteria are defined
- [ ] Scope boundaries are clear (in/out)
- [ ] Target granularity level is chosen
- [ ] Constraints are identified

---

## Phase 2: Hierarchical Breakdown

**Goal:** Decompose the work into a tree structure meeting the INVEST criteria.

1. Identify top-level work streams (epics or major components)
2. Break each work stream into features or milestones
3. Decompose features into implementable tasks
4. Apply the "2-hour rule" — no task should exceed 2 hours of focused work
5. Ensure each task has a clear definition of done
6. Verify MECE (Mutually Exclusive, Collectively Exhaustive) coverage

### The INVEST Criteria for Tasks

| Criterion | Question | Bad Example | Good Example |
|-----------|---------|-------------|-------------|
| **I**ndependent | Can this be done without waiting for others? | "Implement auth after DB is ready" | "Implement auth with mock DB" |
| **N**egotiable | Is the approach flexible? | "Use Redis for caching" | "Add caching layer for user sessions" |
| **V**aluable | Does completing this deliver value? | "Set up folder structure" | "Create user registration endpoint" |
| **E**stimable | Can you estimate the effort? | "Improve performance" | "Add database index for user lookup query" |
| **S**mall | Can one person finish it in < 2 hours? | "Build the dashboard" | "Create dashboard chart component for revenue data" |
| **T**estable | Can you verify it is done? | "Make it better" | "Response time < 200ms for /api/users" |

### MECE Verification

| Check | Question |
|-------|---------|
| Mutually Exclusive | Does any task overlap with another? (Should not) |
| Collectively Exhaustive | Do all tasks together cover the full deliverable? (Should) |
| No orphans | Does every task contribute to the deliverable? |
| No gaps | Is there any work needed that has no task? |

**STOP — Do NOT proceed to Phase 3 until:**
- [ ] All work streams are identified
- [ ] Tasks meet INVEST criteria
- [ ] MECE coverage is verified
- [ ] No task exceeds 2 hours

---

## Phase 3: Dependency Mapping

**Goal:** Build a directed acyclic graph (DAG) of task dependencies.

1. Identify input/output dependencies between tasks
2. Classify dependency types
3. Build a directed acyclic graph (DAG)
4. Identify the critical path (longest dependency chain)
5. Flag circular dependencies as errors to resolve
6. Mark external dependencies (API access, approvals, third-party)

### Dependency Types

| Type | Symbol | Meaning | Example |
|------|--------|---------|---------|
| Finish-to-Start (FS) | A -> B | B cannot start until A finishes | "Deploy" after "Build passes" |
| Start-to-Start (SS) | A => B | B can start when A starts | "Write docs" when "Write code" starts |
| Finish-to-Finish (FF) | A =>> B | B cannot finish until A finishes | "Testing" finishes after "Development" |
| Start-to-Finish (SF) | A ~> B | B cannot finish until A starts | Rare — shift handoff scenarios |

### Dependency Notation Format

```
Task 1: Set up database schema
Task 2: Create data access layer         [depends: 1]
Task 3: Implement API endpoints          [depends: 2]
Task 4: Write unit tests for DAL         [depends: 2]
Task 5: Write API integration tests      [depends: 3, 4]
Task 6: Create frontend components       [depends: none]
Task 7: Connect frontend to API          [depends: 3, 6]
Task 8: End-to-end testing               [depends: 5, 7]

Parallel tracks:
  Track A: 1 -> 2 -> 3 -> 5 -> 8
  Track B: 1 -> 2 -> 4 -> 5 -> 8
  Track C: 6 -> 7 -> 8
  Critical path: 1 -> 2 -> 3 -> 7 -> 8
```

### Circular Dependency Resolution

| Detection | Resolution |
|-----------|-----------|
| A depends on B, B depends on A | Break into smaller tasks that remove the cycle |
| A depends on B's interface, B depends on A's interface | Define interfaces first as a separate task |
| Tight coupling between components | Introduce an abstraction layer task |

**STOP — Do NOT proceed to Phase 4 until:**
- [ ] All dependencies are mapped
- [ ] No circular dependencies exist
- [ ] Critical path is identified
- [ ] External dependencies are flagged

---

## Phase 4: Parallelization Planning

**Goal:** Identify independent task clusters that can run concurrently.

1. Identify independent task clusters (no dependencies between them)
2. Group tasks by resource type (read, write, build, test)
3. Determine maximum parallelism based on resource constraints
4. Sequence tasks within each parallel track
5. Plan synchronization points (merge gates)

### Resource-Based Parallelism Limits

| Resource Type | Max Parallel | Rationale |
|--------------|-------------|-----------|
| Code reading / analysis | Unlimited | No side effects |
| File creation / editing | 3-5 | Avoid merge conflicts |
| Build / compile | 1 | Resource contention |
| Test execution | 1-2 | Shared state, ports |
| Database migrations | 1 | Sequential by nature |
| Documentation | Unlimited | Independent files |

### Parallelization Pattern Decision Table

| Pattern | When to Use | Example |
|---------|-----------|---------|
| Independent Clusters | Work streams with no shared state | Backend, Frontend, Infra |
| By Layer | Layers touch different files | API, Service, Data |
| By Feature Area | Independent vertical slices | Auth, Profile, Billing |
| By Task Type | Code, tests, docs touch different files | Implement, Test, Document |

### Synchronization Points

```
  +------+     +------+     +------+
  |Task A|     |Task B|     |Task C|
  +--+---+     +--+---+     +--+---+
     |            |            |
     v            v            v
  ======================================
     SYNC GATE: All Complete
     Verify: no conflicts, tests pass
  ======================================
                 |
                 v
          +----------+
          |Next Phase|
          +----------+
```

**STOP — Do NOT proceed to Phase 5 until:**
- [ ] Independent clusters are identified
- [ ] Resource constraints are considered
- [ ] Synchronization points are defined
- [ ] Maximum parallelism is determined

---

## Phase 5: Estimation and Prioritization

**Goal:** Estimate effort for each task and create an execution timeline.

### T-Shirt Sizing to Hours

| Size | Hours | Confidence | Example |
|------|-------|-----------|---------|
| XS | 0.5-1h | High | Rename a variable, fix a typo |
| S | 1-2h | High | Add a simple endpoint, write a test |
| M | 2-4h | Medium | Implement a feature with known pattern |
| L | 4-8h | Low | New feature with research needed |
| XL | 8h+ | Very Low | **Must be decomposed further** |

### Estimation Heuristics

| Scenario | Multiplier | Rationale |
|----------|-----------|-----------|
| Known pattern | 1.2x base estimate | 20% buffer for unknowns |
| Unknown pattern | 2x base estimate | Add research spike task first |
| Integration work | 1.5x sum of components | Integration is harder than parts |
| First-time technology | 3x "if I knew how" estimate | Learning curve |
| Bug fixes | Time-box 2h investigation | Then re-estimate |

### Three-Point Estimation

```
Expected = (Optimistic + 4 * Most Likely + Pessimistic) / 6

Example:
  Optimistic:  2 hours (everything goes smoothly)
  Most Likely: 4 hours (normal development pace)
  Pessimistic: 10 hours (major unexpected issues)
  Expected:    (2 + 16 + 10) / 6 = 4.7 hours
```

### Prioritization Decision Table

| Factor | Weight | How to Evaluate |
|--------|--------|----------------|
| On critical path | Highest | Delays here delay everything |
| Blocks other tasks | High | Unblocking multiplies throughput |
| Business value | High | User-facing impact |
| Risk reduction | Medium | De-risks unknowns early |
| Quick win | Medium | Low effort, high morale |
| Nice to have | Low | Only after core work is done |

---

## Work Breakdown Structure Template

```markdown
# WBS: [Project Name]

## 1. [Work Stream A]
### 1.1 [Feature]
- [ ] 1.1.1 [Task] — Est: 2h — Deps: none — Priority: P0
- [ ] 1.1.2 [Task] — Est: 1h — Deps: 1.1.1 — Priority: P0
- [ ] 1.1.3 [Task] — Est: 3h — Deps: 1.1.1 — Priority: P1

### 1.2 [Feature]
- [ ] 1.2.1 [Task] — Est: 1h — Deps: none — Priority: P0
- [ ] 1.2.2 [Task] — Est: 2h — Deps: 1.2.1, 1.1.2 — Priority: P1

## 2. [Work Stream B]
### 2.1 [Feature]
- [ ] 2.1.1 [Task] — Est: 1h — Deps: none — Priority: P0
- [ ] 2.1.2 [Task] — Est: 4h — Deps: 2.1.1 — Priority: P0

## Summary
- Total tasks: N
- Estimated total effort: Xh
- Critical path duration: Yh
- Max parallelism: Z tracks
- External dependencies: [list]
```

---

## Critical Path Analysis

### How to Find the Critical Path

1. List all tasks with durations and dependencies
2. Forward pass: calculate earliest start (ES) and earliest finish (EF)
3. Backward pass: calculate latest start (LS) and latest finish (LF)
4. Float = LS - ES (tasks with zero float are on the critical path)
5. The critical path is the longest chain through the dependency graph

### Optimization Strategies

| Strategy | When | Effect | Risk |
|----------|------|--------|------|
| Parallelize | Independent tasks on critical path | Reduces calendar time | Low |
| Fast-track | Overlap sequential tasks | Reduces duration | Medium — may cause rework |
| Crash | Add resources to critical tasks | Reduces duration | Medium — coordination cost |
| Scope reduction | Remove non-essential tasks | Reduces total work | Low — if non-essential is correct |
| Spike first | Unknown tasks blocking the path | De-risks estimates | Low |

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Tasks too large to estimate | "Build the backend" is not a task | Decompose until estimable (< 2h) |
| Missing dependencies | Surface during implementation, cause rework | Map ALL dependencies upfront |
| Circular dependencies | Indicate unclear architecture | Break the cycle with interface tasks |
| All tasks sequential | No parallelism possible | Identify independent clusters |
| Estimation without decomposition | Guessing at L0 level, always wrong | Estimate at leaf level, sum up |
| Ignoring external dependencies | Block progress unexpectedly | Flag and plan for them |
| Over-decomposition | Noise, not signal (50 subtasks for a form) | Stop at meaningful, testable units |
| Ignoring critical path | Priorities work on non-critical tasks | Always prioritize critical path |
| Not re-estimating | Estimates drift as you learn | Re-estimate after each phase |
| Tasks without acceptance criteria | Cannot verify completion | Every task has definition of done |

---

## Anti-Rationalization Guards

<HARD-GATE>
Do NOT skip dependency mapping. Do NOT leave tasks larger than 2 hours. Do NOT estimate without decomposing first. Every task must have dependencies, estimates, and acceptance criteria.
</HARD-GATE>

If you catch yourself thinking:
- "I can estimate the whole thing without breaking it down..." — No. Decompose first.
- "Dependencies are obvious, I don't need to map them..." — Map them. Hidden dependencies cause failures.
- "This task is fine at 8 hours..." — Decompose it. XL tasks must be broken down.
- "The critical path doesn't matter for small projects..." — It does. It tells you what to prioritize.

---

## Integration Points

| Skill | Relationship | When |
|-------|-------------|------|
| `planning` | Upstream — provides the plan to decompose | Complex plans need WBS |
| `task-management` | Downstream — receives decomposed tasks | For execution tracking |
| `dispatching-parallel-agents` | Downstream — receives parallelizable clusters | For concurrent execution |
| `autonomous-loop` | Downstream — task selection from WBS | Ralph task selection |
| `executing-plans` | Downstream — batch creation from WBS | Plan execution |
| `subagent-driven-development` | Downstream — independent tasks for subagents | Delegated implementation |
| `spec-writing` | Complementary — specs inform decomposition | Understanding requirements |

---

## Concrete Examples

### Example: Decomposition of "Add User Authentication"

```
# WBS: User Authentication

## 1. Core Auth
### 1.1 Token Management
- [ ] 1.1.1 Implement JWT generation — Est: 1h — Deps: none — P0
- [ ] 1.1.2 Implement JWT validation — Est: 1h — Deps: 1.1.1 — P0
- [ ] 1.1.3 Implement refresh token rotation — Est: 2h — Deps: 1.1.2 — P1

### 1.2 Auth Middleware
- [ ] 1.2.1 Create auth middleware — Est: 1h — Deps: 1.1.2 — P0
- [ ] 1.2.2 Add role-based access control — Est: 2h — Deps: 1.2.1 — P1

## 2. Auth Endpoints
### 2.1 Registration
- [ ] 2.1.1 POST /auth/register endpoint — Est: 1h — Deps: 1.1.1 — P0
- [ ] 2.1.2 Email validation — Est: 30m — Deps: none — P0

### 2.2 Login
- [ ] 2.2.1 POST /auth/login endpoint — Est: 1h — Deps: 1.1.1, 1.2.1 — P0
- [ ] 2.2.2 POST /auth/refresh endpoint — Est: 1h — Deps: 1.1.3 — P1

## Summary
- Total tasks: 8
- Estimated total effort: 10.5h
- Critical path: 1.1.1 -> 1.1.2 -> 1.2.1 -> 2.2.1 (4h)
- Max parallelism: 3 tracks (Token, Middleware, Endpoints)
- External dependencies: none
```

---

## Skill Type

**RIGID** — Follow the decomposition phases in order. Every task must meet the INVEST criteria and have explicit dependencies, estimates, and acceptance criteria. The dependency graph and critical path analysis are mandatory for multi-day work.
