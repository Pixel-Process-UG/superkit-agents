---
name: frontend-ui-design
description: "Use when designing UI components, creating component architectures, implementing responsive layouts, setting up design systems, or selecting state management solutions for frontend applications"
---

# Frontend UI Design

## Overview

Guide the design and implementation of frontend user interfaces with consistent architecture, accessibility, responsive behavior, and performance. This skill covers component patterns, design system integration, state management selection, and WCAG compliance — producing components that are testable, accessible, and performant.

**Announce at start:** "I'm using the frontend-ui-design skill to design the UI."

## Phase 1: Discovery

Ask these questions to understand the UI requirements:

| # | Question | What It Determines |
|---|----------|-------------------|
| 1 | What component or page are we building? | Scope and complexity |
| 2 | What framework/library? (React, Vue, Svelte, etc.) | Code patterns |
| 3 | Is there an existing design system or component library? | Constraints |
| 4 | What devices must be supported? (mobile, tablet, desktop) | Responsive strategy |
| 5 | Accessibility requirements? (WCAG level) | A11y standards |
| 6 | What data does this component need? | State management approach |

STOP after discovery — present a summary of constraints and approach before designing.

## Phase 2: Component Architecture Selection

### Architecture Pattern Decision Table

| Pattern | When to Use | When NOT to Use |
|---------|------------|-----------------|
| **Atomic Design** | Building a component library from scratch | Adding one component to existing system |
| **Compound Components** | Multi-part component needing layout flexibility | Simple single-purpose component |
| **Hooks Pattern** | Same logic reused across different UIs | Logic tied to one specific component |
| **Container/Presenter** | Components need isolated testing or multiple data sources | Simple components with minimal logic |

### Atomic Design Levels

| Level | Description | Examples |
|-------|-------------|----------|
| **Atoms** | Smallest building blocks, single purpose | Button, Input, Label, Icon |
| **Molecules** | Groups of atoms functioning together | SearchBar (Input + Button), FormField (Label + Input + Error) |
| **Organisms** | Complex sections composed of molecules | Header (Logo + Nav + SearchBar), ProductCard |
| **Templates** | Page layouts with placeholder content | DashboardLayout, AuthLayout |
| **Pages** | Templates populated with real data | HomePage, SettingsPage |

### Compound Components Example

```tsx
<Select value={selected} onChange={setSelected}>
  <Select.Trigger />
  <Select.Options>
    <Select.Option value="a">Option A</Select.Option>
    <Select.Option value="b">Option B</Select.Option>
  </Select.Options>
</Select>
```

Use when: a component has multiple sub-parts that must coordinate but consumers need layout flexibility.

### Hooks Pattern Example

```tsx
function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
}
```

Use when: the same logic is needed across multiple components with different UI.

STOP after architecture selection — confirm the pattern choice before proceeding.

## Phase 3: Responsive Design

### Mobile-First Breakpoints

| Breakpoint | Target | Min-Width |
|------------|--------|-----------|
| sm | Mobile landscape | 640px |
| md | Tablet | 768px |
| lg | Desktop | 1024px |
| xl | Large desktop | 1280px |
| 2xl | Wide desktop | 1536px |

### Responsive Strategy Decision Table

| Need | Use | Not |
|------|-----|-----|
| Layout changes based on viewport size | Media queries | Container queries |
| Component adapts to parent container size | Container queries | Media queries |
| Text scales smoothly between breakpoints | `clamp()` fluid typography | Fixed font sizes |
| Images adapt to viewport | `srcset` + `sizes` | Single fixed image |

### Fluid Typography

```css
font-size: clamp(1rem, 0.5rem + 1.5vw, 1.5rem);
```

## Phase 4: Accessibility (WCAG 2.1 AA)

### Semantic HTML Decision Table

| Need | Use | NOT |
|------|-----|-----|
| Navigation | `<nav>` | `<div class="nav">` |
| Button action | `<button>` | `<div onClick>` |
| Page sections | `<main>`, `<section>`, `<aside>` | `<div>` |
| Headings | `<h1>`-`<h6>` in order | `<div class="heading">` |
| List of items | `<ul>`, `<ol>` | Nested `<div>`s |
| Form labels | `<label for="...">` | Placeholder text only |

### ARIA Usage Rules

| Rule | When |
|------|------|
| Use semantic HTML first | Always — ARIA is a fallback |
| `aria-label` | Labels for elements without visible text |
| `aria-describedby` | Associates descriptive text with an element |
| `aria-live` | Announces dynamic content changes |
| `aria-expanded` | Toggleable sections (accordions, menus) |
| `role` | Only when no semantic element exists |

### Keyboard Navigation Requirements

- All interactive elements focusable (naturally or `tabindex="0"`)
- Operable via keyboard (Enter, Space, Escape, Arrow keys)
- Visible focus indicator (never `outline: none` without replacement)
- Logical tab order matching visual order
- Focus traps for modals and dialogs

### Color Contrast Requirements

| Element | Minimum Ratio |
|---------|--------------|
| Normal text | 4.5:1 |
| Large text (18px+ or 14px+ bold) | 3:1 |
| UI components | 3:1 against adjacent colors |
| Information conveyed by color | Must also use icons, patterns, or text |

### Screen Reader Testing

Test with at least one screen reader:
- macOS: VoiceOver (built-in)
- Windows: NVDA (free) or JAWS
- Verify: content announced in logical order, form errors associated with inputs, dynamic updates announced

## Phase 5: State Management & Performance

### State Management Decision Table

| State Type | Solution | When |
|------------|----------|------|
| **Local** | `useState`, `useReducer` | State used by one component or direct children |
| **Shared** | Context, Zustand, Jotai | State shared across multiple unrelated components |
| **Server** | TanStack Query, SWR | Data fetched from API, needs caching/revalidation |
| **Form** | React Hook Form, Formik | Complex forms with validation and submission |
| **URL** | Search params, router state | State that should be bookmarkable/shareable |

### Selection Heuristic

1. Start with `useState` — only escalate when you hit a real limitation
2. If prop drilling exceeds 2 levels, consider Context or state library
3. If caching API responses, use a server state library (not Redux for server state)
4. For forms with >3 fields and validation, use a form library

### Performance Optimization Checklist

| Technique | When to Apply |
|-----------|--------------|
| `React.lazy()` + `Suspense` | Route-level code splitting |
| `loading="lazy"` on images | Below-the-fold images |
| Virtualization | Lists with >50 items |
| `useMemo` | Expensive computations |
| `useCallback` | Callbacks passed to memoized children |
| Dynamic `import()` | Conditionally loaded heavy libraries |
| WebP/AVIF images | All image assets |
| Explicit `width`/`height` on images | Prevent layout shift |

### Design System Integration

**Design Tokens** — define foundational values, not hard-coded:

```ts
const tokens = {
  color: { primary: '#2563eb', secondary: '#64748b', error: '#dc2626' },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
  typography: { fontFamily: { sans: 'Inter, system-ui, sans-serif' } },
};
```

**Component Variants** — consistent variant API:

```tsx
<Button variant="primary" size="md">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

**Theme Support:**
- CSS custom properties for runtime theme switching
- Support light + dark themes at minimum
- Respect `prefers-color-scheme` as default
- Allow user override stored in localStorage

STOP after design — present the full component specification for review.

## Anti-Patterns / Common Mistakes

| Mistake | Why It Is Wrong | What To Do Instead |
|---------|----------------|-------------------|
| `<div onClick>` instead of `<button>` | Not keyboard accessible, no screen reader semantics | Use semantic HTML elements |
| `outline: none` without replacement | Keyboard users cannot see focus | Replace with visible focus style |
| Fixed font sizes (px) | Cannot scale with user preferences | Use `rem` and `clamp()` |
| Prop drilling through 4+ levels | Maintenance nightmare | Use Context or state library |
| Fetching in useEffect + useState | No caching, no dedup, race conditions | Use TanStack Query or SWR |
| Premature memoization | Adds complexity without measured benefit | Profile first, optimize measured bottlenecks |
| Desktop-first responsive design | Mobile experience is an afterthought | Start mobile-first, add complexity up |
| Color as sole information carrier | Inaccessible to colorblind users | Add icons, patterns, or text labels |
| No loading/error states | Users see blank screens or cryptic errors | Design loading, error, and empty states |

## Anti-Rationalization Guards

- **Do NOT** skip accessibility — WCAG 2.1 AA is the minimum, not optional
- **Do NOT** use `<div>` with onClick instead of semantic elements
- **Do NOT** skip keyboard navigation testing
- **Do NOT** choose state management before understanding the actual need
- **Do NOT** skip the discovery phase — understand constraints first
- **Do NOT** optimize performance without measuring first

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `api-design` | Upstream: API response shapes inform component data needs |
| `spec-writing` | Upstream: specs define component behavioral requirements |
| `planning` | Downstream: component designs become implementation tasks |
| `test-driven-development` | Downstream: component spec drives test-first implementation |
| `senior-frontend` | Parallel: specialist knowledge for React/Next.js specifics |
| `ui-ux-pro-max` | Upstream: UX design informs component requirements |
| `ui-design-system` | Parallel: design system tokens feed component styling |
| `performance-optimization` | Downstream: profile and optimize after implementation |

## Verification Gate

Before claiming the UI design is complete:

1. VERIFY component architecture pattern is explicitly chosen with rationale
2. VERIFY responsive behavior is defined for all target breakpoints
3. VERIFY accessibility requirements are specified (WCAG level, keyboard, color contrast)
4. VERIFY state management approach is selected based on actual needs
5. VERIFY loading, error, and empty states are designed
6. VERIFY the user has approved the component specification

## Skill Type

**Flexible** — Adapt component patterns, responsive strategy, and state management to project framework and constraints while preserving accessibility requirements and the discovery-first approach.
