---
name: react-best-practices
description: "Use when the user needs React-specific patterns — hooks, component composition, Server Components, error boundaries, rendering optimization, and testing strategies. Triggers: hooks design, component composition, Server vs Client component decision, error boundary placement, context optimization, rendering performance."
---

# React Best Practices

## Overview

Apply modern React patterns to build maintainable, performant, and testable applications. This skill covers React 18/19 features including Server Components, hooks best practices, component composition, error boundaries, Suspense, context optimization, and rendering performance. It complements the senior-frontend skill with React-specific depth.

**Announce at start:** "I'm using the react-best-practices skill for React-specific patterns."

---

## Phase 1: Analyze Component Requirements

**Goal:** Understand the component's responsibility and data requirements before coding.

### Actions

1. Identify the component's single responsibility
2. Determine data requirements (server vs client data)
3. Choose Server Component (default) or Client Component
4. Identify state management needs
5. Plan error and loading states

### Server vs Client Decision Table

| Need | Component Type | Reason |
|------|---------------|--------|
| Direct data fetching (DB, API) | Server (default) | No client JS, faster |
| Event handlers (onClick, onChange) | Client (`'use client'`) | Needs browser interactivity |
| useState / useReducer | Client | State requires client runtime |
| useEffect / useLayoutEffect | Client | Side effects require client |
| Browser APIs (window, localStorage) | Client | Server has no browser |
| Third-party libs using client features | Client | Library requires client |
| No interactivity needed | Server (default) | Smaller bundle, faster |

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Component responsibility is defined (single purpose)
- [ ] Server vs Client decision is made with rationale
- [ ] Data requirements are mapped

---

## Phase 2: Implement with Appropriate Patterns

**Goal:** Apply the correct React patterns for the component's needs.

### Actions

1. Apply appropriate composition pattern
2. Implement hooks correctly
3. Add error boundaries and Suspense
4. Optimize rendering where profiling shows need
5. Write tests that verify behavior

### STOP — Do NOT proceed to Phase 3 until:
- [ ] Patterns match the component's actual needs
- [ ] No unnecessary complexity (no premature optimization)
- [ ] Tests cover user-visible behavior

---

## Phase 3: Test and Verify

**Goal:** Verify component behavior through tests.

### Actions

1. Write tests using accessible queries
2. Test user interactions and outcomes
3. Test error and loading states
4. Verify accessibility

### Query Priority (React Testing Library)

| Priority | Query | Use For |
|----------|-------|---------|
| 1st | `getByRole` | Any element with ARIA role |
| 2nd | `getByLabelText` | Form fields |
| 3rd | `getByPlaceholderText` | Fields without labels |
| 4th | `getByText` | Non-interactive elements |
| Last | `getByTestId` | When nothing else works |

### STOP — Testing complete when:
- [ ] User interactions produce expected outcomes
- [ ] Error states are tested
- [ ] Accessibility checks pass

---

## Hooks Best Practices

### useState

```typescript
// Functional updates for state based on previous state
setCount(prev => prev + 1);

// Lazy initialization for expensive initial values
const [data, setData] = useState(() => computeExpensiveInitialValue());

// Group related state
const [form, setForm] = useState({ name: '', email: '', role: 'user' });
```

### useEffect

#### Dependency Array Rules

- Include ALL values from component scope that change over time
- Functions inside effect should be defined inside effect or wrapped in useCallback
- Never lie about dependencies (ESLint: `react-hooks/exhaustive-deps`)

#### Cleanup Pattern

```typescript
useEffect(() => {
  const controller = new AbortController();
  async function fetchData() {
    try {
      const res = await fetch(url, { signal: controller.signal });
      const data = await res.json();
      setData(data);
    } catch (e) {
      if (e.name !== 'AbortError') setError(e);
    }
  }
  fetchData();
  return () => controller.abort();
}, [url]);
```

#### When NOT to Use useEffect

| Instead of useEffect for... | Use This |
|----------------------------|----------|
| Data fetching | React Query, SWR, or Server Components |
| Transforming data | Compute during render |
| User events | Event handlers |
| Syncing external stores | `useSyncExternalStore` |

### Custom Hooks Rules

- Name starts with `use`
- Encapsulate reusable stateful logic
- One hook per concern
- Return object (not array) for > 2 values

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

---

## Component Composition Patterns

### Compound Components

```typescript
function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div role="tablist">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.Tab = function Tab({ value, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button role="tab" aria-selected={activeTab === value} onClick={() => setActiveTab(value)}>
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ value, children }: PanelProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return <div role="tabpanel">{children}</div>;
};
```

### Composition Decision Table

| Pattern | Use When | Example |
|---------|----------|---------|
| Compound Components | Related components sharing implicit state | Tabs, Accordion, Menu |
| Slots (Children) | Complex content layout | Card with Header/Body/Footer |
| Render Props | Child needs parent data for flexible rendering | DataFetcher with custom render |
| Higher-Order Component | Cross-cutting concerns (legacy) | withAuth, withTheme |
| Custom Hook | Reusable stateful logic without UI | useDebounce, useLocalStorage |

### Slots Pattern

```typescript
// Prefer composition over props for complex content
// Bad
<Card title="Hello" subtitle="World" icon={<Star />} actions={<Button>Edit</Button>} />

// Good
<Card>
  <Card.Header>
    <Card.Icon><Star /></Card.Icon>
    <Card.Title>Hello</Card.Title>
  </Card.Header>
  <Card.Actions>
    <Button>Edit</Button>
  </Card.Actions>
</Card>
```

---

## Error Boundaries

### Placement Strategy Decision Table

| Level | Purpose | Example |
|-------|---------|---------|
| Route level | Catch page-level crashes | `error.tsx` in Next.js |
| Feature level | Isolate feature failures | Wrap each major section |
| Data level | Wrap async data components | Around Suspense boundaries |
| Never leaf level | Too granular, adds noise | Do not wrap individual buttons |

---

## Suspense

```typescript
// Nested Suspense for granular loading
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar />
  </Suspense>
  <Suspense fallback={<ContentSkeleton />}>
    <MainContent />
  </Suspense>
</Suspense>
```

---

## Context Optimization

### Problem: Context causes unnecessary re-renders

### Solution Decision Table

| Technique | Use When | Example |
|-----------|----------|---------|
| Split contexts by frequency | Some values update often, some rarely | ThemeContext (rare) vs UIStateContext (frequent) |
| Memoize context value | Provider re-renders with same data | `useMemo(() => ({ state, dispatch }), [state])` |
| Use selectors (Zustand/Jotai) | Need fine-grained subscriptions | `useStore(state => state.user.name)` |
| Lift state up | Only parent needs to re-render | Pass data as props to memoized children |

---

## Rendering Optimization

### Memoization Decision Table

| Technique | Use When | Do NOT Use When |
|-----------|----------|----------------|
| `React.memo` | Renders often with same props AND re-render is expensive | Props change every render |
| `useMemo` | Expensive computation OR referential equality for deps | Simple calculations |
| `useCallback` | Stable function ref for memoized children | Function not passed as prop |
| None (default) | Always start here | Premature optimization |

**Rule:** Profile BEFORE memoizing. Premature memoization is the most common React anti-pattern.

### Virtualization

For lists > 100 items:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

## Server Component Rules

- Cannot use hooks
- Cannot use browser APIs
- Cannot pass functions as props to Client Components
- CAN import and render Client Components
- CAN pass serializable data to Client Components

```typescript
// Server Component — fetches data directly
async function UserProfile({ userId }: { userId: string }) {
  const user = await db.user.findUnique({ where: { id: userId } });
  return (
    <div>
      <h1>{user.name}</h1>
      <UserActions userId={userId} /> {/* Client Component child */}
    </div>
  );
}

// Client Component — handles interactivity
'use client';
function UserActions({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  return <Button onClick={() => toggleFollow(userId)}>Follow</Button>;
}
```

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| `useEffect` for data fetching | Race conditions, no cache, no dedup | React Query or Server Components |
| Prop drilling > 2 levels | Tight coupling, maintenance pain | Composition, context, or Zustand |
| Storing derived state | State that can be computed is unnecessary state | Compute during render |
| `useEffect` to sync state from props | Unnecessary effect, stale closures | Derive during render or use key prop |
| Monolithic components (> 200 lines) | Hard to read, test, maintain | Extract sub-components |
| Index as key for dynamic lists | Incorrect reconciliation, stale state | Stable unique ID |
| Direct DOM manipulation | Bypasses React reconciliation | Use refs sparingly, prefer state |
| Testing state values directly | Implementation detail, breaks on refactor | Test user-visible outcomes |
| Memoizing everything | Adds complexity, often slower | Profile first, optimize second |

---

## Documentation Lookup (Context7)

Use `mcp__context7__resolve-library-id` then `mcp__context7__query-docs` for up-to-date docs. Returned docs override memorized knowledge.
- `react` — for hooks, context, suspense, server components, or React 19+ changes
- `next.js` — for App Router patterns, data fetching, or server actions

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `senior-frontend` | Frontend skill uses React patterns from this skill |
| `testing-strategy` | React testing follows the strategy pyramid |
| `clean-code` | Component code follows clean code principles |
| `performance-optimization` | React rendering optimization follows measurement methodology |
| `webapp-testing` | E2E tests validate React component behavior |
| `code-review` | Review checks for React anti-patterns |
| `acceptance-testing` | UI acceptance criteria drive component tests |

---

## Skill Type

**FLEXIBLE** — Apply these patterns based on the specific React version, project structure, and team conventions. The principles are consistent, but implementation details may vary. Always profile before optimizing.
