---
name: webapp-testing
description: "Use when the user needs Playwright-based web application testing — screenshots, browser log analysis, interaction verification, visual regression, accessibility, and network mocking. Triggers: E2E test setup, visual regression testing, accessibility audit, Playwright configuration, page object model creation, CI test pipeline."
---

# Web App Testing

## Overview

Comprehensive web application testing using Playwright as the primary tool. This skill covers end-to-end testing workflows including screenshot capture for visual verification, browser console log analysis, user interaction simulation, visual regression testing, accessibility auditing with axe-core, network request mocking, and mobile viewport testing.

**Announce at start:** "I'm using the webapp-testing skill for Playwright-based web application testing."

---

## Phase 1: Test Planning

**Goal:** Identify what to test and set up the infrastructure.

### Actions

1. Identify critical user flows to test
2. Define test environments and viewports
3. Set up test fixtures and data
4. Configure Playwright project settings
5. Establish visual baseline screenshots

### User Flow Priority Decision Table

| Flow Type | Priority | Test Depth |
|-----------|----------|-----------|
| Authentication (login/logout/register) | Critical | Full happy + error paths |
| Core business workflow (purchase, submit) | Critical | Full happy + error + edge cases |
| Navigation and routing | High | All major routes |
| Search and filtering | High | Common queries + empty state |
| Settings and profile | Medium | Happy path |
| Admin/back-office | Medium | Key operations only |

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Critical user flows are identified and prioritized
- [ ] Test environments and viewports are defined
- [ ] Playwright config is ready
- [ ] Test data strategy is defined

---

## Phase 2: Test Implementation

**Goal:** Write tests using page object models and accessible locators.

### Actions

1. Write page object models for key pages
2. Implement end-to-end test scenarios
3. Add visual regression snapshots
4. Integrate accessibility checks
5. Configure network mocking for isolated tests

### Playwright Configuration

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Page Object Model

```typescript
class LoginPage {
  constructor(private page: Page) {}

  readonly emailInput = this.page.getByLabel('Email');
  readonly passwordInput = this.page.getByLabel('Password');
  readonly submitButton = this.page.getByRole('button', { name: 'Sign in' });
  readonly errorMessage = this.page.getByRole('alert');

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### Locator Selection Decision Table

| Locator Type | Priority | When to Use |
|-------------|----------|-------------|
| `getByRole` | 1st choice | Any element with ARIA role (button, link, heading) |
| `getByLabel` | 2nd choice | Form fields with labels |
| `getByPlaceholder` | 3rd choice | Fields without visible labels |
| `getByText` | 4th choice | Non-interactive visible text |
| `getByTestId` | Last resort | When no accessible locator works |
| CSS selector / XPath | Never | Breaks with styling changes |

### STOP — Do NOT proceed to Phase 3 until:
- [ ] Page object models exist for key pages
- [ ] Tests use accessible locators exclusively
- [ ] Visual baselines are established
- [ ] Accessibility checks are integrated
- [ ] Network mocking is configured for isolated tests

---

## Phase 3: CI Integration

**Goal:** Configure reliable, fast test execution in CI.

### Actions

1. Configure headless browser execution
2. Set up screenshot artifact collection
3. Configure retry and flake detection
4. Add reporting (HTML report, JUnit XML)
5. Set up visual diff review process

### CI Configuration Checklist

- [ ] Tests run headless in CI
- [ ] Retries enabled (2 retries for CI)
- [ ] Screenshot and video artifacts collected on failure
- [ ] JUnit XML output for CI integration
- [ ] HTML report generated for manual review
- [ ] Visual diff snapshots reviewed before merge

### STOP — CI integration complete when:
- [ ] Tests run reliably in CI pipeline
- [ ] Artifacts are collected on failure
- [ ] Flaky tests are identified and fixed (not skipped)

---

## Screenshot Capture Patterns

### Full Page

```typescript
test('homepage renders correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
```

### Element-Level

```typescript
test('navigation bar matches design', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation');
  await expect(nav).toHaveScreenshot('navbar.png');
});
```

### Dynamic Content Masking

```typescript
test('dashboard layout', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.locator('[data-testid="timestamp"]'),
      page.locator('[data-testid="user-avatar"]'),
      page.locator('.chart-container'),
    ],
    animations: 'disabled',
  });
});
```

---

## Browser Log Analysis

```typescript
test('no console errors on page load', async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toEqual([]);
});
```

---

## Accessibility Testing with axe-core

```typescript
import AxeBuilder from '@axe-core/playwright';

test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .exclude('.third-party-widget')
    .analyze();
  expect(results.violations).toEqual([]);
});
```

---

## Network Request Mocking

```typescript
test('displays users from API', async ({ page }) => {
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]),
    });
  });
  await page.goto('/users');
  await expect(page.getByText('Alice')).toBeVisible();
});

test('handles API errors gracefully', async ({ page }) => {
  await page.route('**/api/users', route =>
    route.fulfill({ status: 500, body: 'Internal Server Error' })
  );
  await page.goto('/users');
  await expect(page.getByText('Something went wrong')).toBeVisible();
});
```

---

## Mobile Viewport Testing

```typescript
test.describe('mobile responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('hamburger menu works', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).not.toBeVisible();
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
```

---

## Test Organization

```
tests/
  e2e/
    auth/
      login.spec.ts
      register.spec.ts
    checkout/
      cart.spec.ts
      payment.spec.ts
    fixtures/
      test-data.ts
      auth.setup.ts
    pages/
      login.page.ts
      dashboard.page.ts
    utils/
      helpers.ts
```

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| CSS selectors or XPath | Break with styling changes | Use accessible locators (role, label, text) |
| `page.waitForTimeout()` | Arbitrary delays, flaky | Use `expect().toBeVisible()` or similar |
| Testing third-party components in detail | Not your code to test | Test your integration, not their internals |
| Hardcoded test data | Breaks across environments | Use fixtures and factories |
| Tests depending on execution order | Fragile, hard to debug | Each test must be independent |
| Ignoring flaky tests | Erodes trust in test suite | Fix root cause or quarantine |
| Screenshots without masking dynamic content | Always different, always failing | Mask timestamps, avatars, charts |
| No accessibility checks | Missing critical quality gate | axe-core on every page |

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `senior-frontend` | Frontend components are tested by E2E tests |
| `testing-strategy` | E2E tests are the top of the testing pyramid |
| `acceptance-testing` | User flow tests serve as acceptance tests |
| `performance-optimization` | Performance budgets can be verified in E2E |
| `code-review` | Review checks that tests use accessible locators |
| `security-review` | Security headers and auth flows tested in E2E |

---

## Quality Checklist

- [ ] All critical user flows covered
- [ ] Tests use accessible locators (role, label, text)
- [ ] Network mocking for isolated tests
- [ ] Visual regression baselines reviewed and approved
- [ ] Accessibility scans on all pages
- [ ] Mobile viewport tests for responsive features
- [ ] No `waitForTimeout` (use proper assertions)
- [ ] CI pipeline configured with retries
- [ ] Screenshot artifacts collected on failure
- [ ] Flaky tests identified and fixed (not skipped)

---

## Skill Type

**FLEXIBLE** — Adapt test depth to the project's critical paths. The page object model pattern and accessible locators are strongly recommended. Accessibility checks are mandatory on every page. Visual regression baselines must be reviewed before merge.
