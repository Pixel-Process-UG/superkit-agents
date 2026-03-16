---
name: senior-frontend
description: "Use when the user needs production-grade React/Next.js/TypeScript development with rigorous component architecture, state management, performance optimization, and >85% test coverage. Triggers: React component development, Next.js page creation, state management design, frontend performance audit, component library setup."
---

# Senior Frontend Engineer

## Overview

Deliver production-grade frontend code following a structured three-phase workflow: context discovery, development, and handoff. This skill enforces strict quality standards including atomic design component architecture, comprehensive state management patterns, SSR/SSG/ISR optimization, and mandatory >85% test coverage with Vitest, React Testing Library, and Playwright.

**Announce at start:** "I'm using the senior-frontend skill for production-grade React/TypeScript development."

---

## Phase 1: Context Discovery

**Goal:** Understand the existing codebase before writing any code.

### Actions

1. Analyze existing codebase structure and conventions
2. Identify the tech stack version (React 18/19, Next.js 14/15, TypeScript version)
3. Review existing component library and design system
4. Check state management approach already in use
5. Understand build tooling and CI pipeline
6. Map existing test infrastructure and coverage

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Tech stack versions are identified
- [ ] Existing patterns and conventions are documented
- [ ] Test infrastructure is mapped
- [ ] State management approach is identified

---

## Phase 2: Development

**Goal:** Implement with strict TypeScript, atomic design, and TDD.

### Actions

1. Design component architecture following atomic design
2. Implement with TypeScript strict mode
3. Write tests alongside implementation (TDD when appropriate)
4. Optimize for performance (bundle size, rendering, loading)
5. Ensure accessibility compliance

### Component Architecture Decision Table (Atomic Design)

| Level | Description | Business Logic | Example |
|-------|------------|---------------|---------|
| **Atoms** | Smallest building blocks | None | Button, Input, Icon, Badge |
| **Molecules** | Composed of atoms | Minimal | FormField, SearchBar, Card |
| **Organisms** | Complex with business logic | Yes | DataTable, NavigationBar, CommentThread |
| **Templates** | Page structure without data | Layout only | DashboardLayout, AuthLayout |
| **Pages** | Templates connected to data | Data fetching | UsersPage, SettingsPage |

### Atom Example

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', isLoading, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }))} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Spinner size={size} /> : children}
    </button>
  );
}
```

### State Management Decision Table

| State Type | Solution | When to Use |
|------------|----------|-------------|
| Server state | React Query / TanStack Query | API data, caching, sync |
| Form state | React Hook Form + Zod | Form validation, submission |
| Global UI state | Zustand | Theme, sidebar open, modals |
| Local UI state | useState / useReducer | Component-specific state |
| URL state | nuqs / useSearchParams | Filters, pagination, tabs |
| Complex local | useReducer | Multiple related state transitions |
| Shared context | React Context | Theme, locale, auth (infrequent updates) |

### SSR / SSG / ISR Decision Table (Next.js App Router)

| Pattern | Use When | Cache Strategy |
|---------|----------|---------------|
| Static (SSG) | Content rarely changes | Build time |
| ISR | Content changes periodically | Revalidate interval |
| SSR | Content changes per request | No cache |
| Client | User-specific, interactive | Browser |

### Server vs Client Component Decision

| Need | Component Type |
|------|---------------|
| Direct data fetching | Server (default) |
| Event handlers (onClick, onChange) | Client (`'use client'`) |
| useState / useReducer | Client |
| useEffect / useLayoutEffect | Client |
| Browser APIs (window, localStorage) | Client |
| Third-party libs using client features | Client |
| No interactivity needed | Server (default) |

### STOP — Do NOT proceed to Phase 3 until:
- [ ] Components follow atomic design hierarchy
- [ ] TypeScript strict mode is enabled, no `any` types
- [ ] Tests are written for all components
- [ ] Accessibility is verified (axe-core)

---

## Phase 3: Handoff

**Goal:** Verify quality gates and prepare for review.

### Actions

1. Verify test coverage meets >85% threshold
2. Run full lint and type check
3. Document complex components with JSDoc/TSDoc
4. Create Storybook stories for UI components
5. Performance audit (Lighthouse, bundle analysis)

### Performance Checklist

- [ ] Bundle size < 200KB gzipped (initial load)
- [ ] Largest Contentful Paint < 2.5s
- [ ] First Input Delay < 100ms
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images: next/image with proper sizing and formats
- [ ] Fonts: next/font with display swap
- [ ] No layout thrashing (batch DOM reads/writes)
- [ ] Virtualization for lists > 100 items

### Coverage Thresholds

```json
{
  "coverageThreshold": {
    "global": {
      "branches": 85,
      "functions": 85,
      "lines": 85,
      "statements": 85
    }
  }
}
```

### STOP — Handoff complete when:
- [ ] Test coverage >85% verified
- [ ] Lint and type check pass with zero errors
- [ ] Performance audit completed
- [ ] Complex components documented

---

## Testing Requirements

### Unit Tests (Vitest + React Testing Library)

```typescript
describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### Integration Tests

- Component compositions (form submission flow)
- Data fetching with MSW (Mock Service Worker)
- Routing and navigation
- Error boundaries and fallbacks

### E2E Tests (Playwright)

```typescript
test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await expect(page.getByText('1 item')).toBeVisible();
  await page.getByRole('button', { name: 'Checkout' }).click();
});
```

---

## React Query Patterns

```typescript
function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previous = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old) =>
        old.map(u => u.id === newUser.id ? { ...u, ...newUser } : u)
      );
      return { previous };
    },
    onError: (err, newUser, context) => {
      queryClient.setQueryData(['users'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

---

## Memoization Decision Table

| Technique | Use When | Do NOT Use When |
|-----------|----------|----------------|
| `useMemo` | Expensive computation, referential equality for deps | Simple calculations, primitive values |
| `useCallback` | Functions passed to memoized children | Functions not passed as props |
| `React.memo` | Component re-renders often with same props | Props change on every render |
| None | Default — do not memoize | Always profile first |

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| `useEffect` for data fetching | Race conditions, no caching, no dedup | React Query or Server Components |
| Prop drilling more than 2 levels | Tight coupling, maintenance burden | Composition, context, or Zustand |
| Business logic in components | Untestable, unreusable | Extract to hooks or utility functions |
| Barrel exports | Breaks tree-shaking, slower builds | Direct imports |
| Testing implementation details | Brittle tests that break on refactor | Test behavior: user actions and outcomes |
| `any` type anywhere | Defeats TypeScript's purpose | `unknown` + type guards |
| Inline styles for non-dynamic values | Inconsistent, hard to maintain | CSS modules, Tailwind, or styled-components |
| Memoizing everything | Adds complexity, often slower | Profile first, memoize second |

---

## Documentation Lookup (Context7)

Use `mcp__context7__resolve-library-id` then `mcp__context7__query-docs` for up-to-date docs. Returned docs override memorized knowledge.
- `react` — when uncertain about hooks API, component lifecycle, or React 19+ features
- `next.js` — for App Router, Server Components, or Next.js-specific APIs
- `typescript` — for advanced type patterns or compiler options
- `tailwindcss` — for utility classes, configuration, or plugin API
- `vitest` — for test runner API, matchers, or mock utilities

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `testing-strategy` | Strategy defines frontend test frameworks |
| `test-driven-development` | Components are built with TDD cycle |
| `react-best-practices` | Detailed React patterns complement this skill |
| `performance-optimization` | Frontend performance follows optimization methodology |
| `code-review` | Review verifies component architecture and test coverage |
| `clean-code` | Code quality principles apply to component code |
| `webapp-testing` | Playwright E2E tests use this skill's page structure |
| `acceptance-testing` | UI acceptance criteria drive component tests |

---

## Key Principles

- TypeScript strict mode, no `any` (use `unknown` + type guards)
- Prefer composition over inheritance
- Colocate tests, styles, and stories with components
- Server Components by default; Client Components only when required
- Error boundaries at route and feature boundaries
- Accessibility is not optional (test with axe-core)

---

## Skill Type

**FLEXIBLE** — Adapt component architecture and state management to the existing project conventions. The three-phase workflow is strongly recommended. Test coverage must target >85%. TypeScript strict mode is non-negotiable.
