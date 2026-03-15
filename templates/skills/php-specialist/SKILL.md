---
name: php-specialist
description: >
  Use when writing modern PHP 8.x code — enums, fibers, readonly properties, PSR standards,
  Composer, static analysis, SOLID patterns.
  Trigger conditions: PHP code authoring, enum design, readonly DTO creation, PSR-4
  autoloading setup, PHPStan or Psalm configuration, PHP CS Fixer or Pint setup,
  Composer dependency management, SOLID principle application, type safety improvements,
  custom exception hierarchies, interface-driven design.
---

# PHP Specialist

## Overview

Write modern, type-safe, and maintainable PHP 8.x code adhering to PSR standards and SOLID principles. This skill covers the full modern PHP toolchain: language features introduced in PHP 8.0 through 8.4, PSR interoperability standards, Composer dependency management, static analysis with PHPStan and Psalm, coding style enforcement with PHP CS Fixer and Pint, and architectural patterns that leverage the type system for correctness at compile time rather than runtime.

Apply this skill whenever PHP code is being written, reviewed, or refactored in any framework or standalone context.

## Multi-Phase Process

### Phase 1: Environment Assessment

1. Identify PHP version from `composer.json` -> `require.php`
2. Review `composer.json` for autoloading strategy (PSR-4 namespaces)
3. Check for static analysis configuration (`phpstan.neon`, `psalm.xml`)
4. Identify coding standard tool (`pint.json`, `.php-cs-fixer.php`)
5. Catalog existing patterns: enums, DTOs, value objects, interfaces

> **STOP — Do NOT write code without knowing the PHP version and autoloading strategy.**

### Phase 2: Design

1. Define interfaces and contracts before implementations
2. Design value objects and DTOs with readonly properties
3. Map domain concepts to backed enums where applicable
4. Plan exception hierarchy for the domain
5. Identify seams for dependency injection

> **STOP — Do NOT implement without interfaces defined for key boundaries.**

### Phase 3: Implementation

1. Write interfaces first — contracts before concrete classes
2. Implement with constructor promotion, readonly properties, union/intersection types
3. Use match expressions over switch; named arguments for clarity
4. Leverage first-class callable syntax for functional composition
5. Apply SOLID principles at every class boundary

> **STOP — Do NOT skip strict_types declaration in any PHP file.**

### Phase 4: Quality Assurance

1. Run PHPStan at maximum achievable level (target level 9)
2. Enforce coding style with PHP CS Fixer or Laravel Pint
3. Verify type coverage — no `mixed` without justification
4. Review for SOLID violations and code smells
5. Confirm Composer autoload is optimized (`--classmap-authoritative`)

## PHP Version Feature Decision Table

| Feature | Minimum Version | Use When |
|---|---|---|
| Constructor promotion | 8.0 | Any class with constructor parameters |
| Named arguments | 8.0 | Functions with 3+ params or boolean flags |
| Match expressions | 8.0 | Any switch statement (strict, returns value) |
| Union types | 8.0 | Parameter accepts multiple types |
| Backed enums | 8.1 | Any set of named constants with values |
| Readonly properties | 8.1 | Immutable DTOs, value objects |
| Fibers | 8.1 | Async frameworks (rarely used directly) |
| First-class callables | 8.1 | Functional composition, array_map/filter |
| Readonly classes | 8.2 | All-readonly DTOs (shorthand) |
| DNF types | 8.2 | Complex union + intersection combinations |
| Override attribute | 8.3 | Overriding parent methods (safety check) |
| Property hooks | 8.4 | Computed properties without separate methods |

## Modern PHP 8.x Features

### Enums (PHP 8.1+)

```php
// Backed enum with methods — replaces class constants and magic strings
enum OrderStatus: string
{
    case Draft     = 'draft';
    case Pending   = 'pending';
    case Confirmed = 'confirmed';
    case Shipped   = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Draft     => 'Draft',
            self::Pending   => 'Pending Review',
            self::Confirmed => 'Confirmed',
            self::Shipped   => 'Shipped',
            self::Delivered => 'Delivered',
            self::Cancelled => 'Cancelled',
        };
    }

    public function isFinal(): bool
    {
        return in_array($this, [self::Delivered, self::Cancelled], true);
    }

    /** @return list<self> */
    public static function active(): array
    {
        return array_filter(self::cases(), fn (self $s) => ! $s->isFinal());
    }
}
```

### Readonly Properties and Classes (PHP 8.1 / 8.2)

```php
// Readonly class — all properties are implicitly readonly
readonly class Money
{
    public function __construct(
        public int    $amount,
        public string $currency,
    ) {}

    public function add(self $other): self
    {
        if ($this->currency !== $other->currency) {
            throw new CurrencyMismatchException($this->currency, $other->currency);
        }

        return new self($this->amount + $other->amount, $this->currency);
    }

    public function isPositive(): bool
    {
        return $this->amount > 0;
    }
}
```

### Constructor Promotion

```php
class CreateUserAction
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly Hasher         $hasher,
        private readonly EventDispatcher $events,
    ) {}

    public function execute(CreateUserData $data): User
    {
        $user = $this->users->create([
            'name'     => $data->name,
            'email'    => $data->email,
            'password' => $this->hasher->make($data->password),
        ]);

        $this->events->dispatch(new UserCreated($user));

        return $user;
    }
}
```

### Named Arguments

```php
// Improves readability for functions with many parameters or boolean flags
$user = User::create(
    name: $request->name,
    email: $request->email,
    isAdmin: false,
    sendWelcomeEmail: true,
);

// Particularly valuable with optional parameters
$response = Http::timeout(seconds: 30)
    ->retry(times: 3, sleepMilliseconds: 500, throw: true)
    ->get($url);
```

### Match Expressions

```php
// match is strict (===), exhaustive, and returns a value
$discount = match (true) {
    $total >= 10000 => 0.15,
    $total >= 5000  => 0.10,
    $total >= 1000  => 0.05,
    default         => 0.00,
};

// Replaces switch with no fall-through risk
$handler = match ($event::class) {
    OrderPlaced::class   => new HandleOrderPlaced(),
    PaymentFailed::class => new HandlePaymentFailed(),
    default              => throw new UnhandledEventException($event),
};
```

### Union and Intersection Types

```php
// Union type — accepts either type
function findUser(int|string $identifier): User
{
    return is_int($identifier)
        ? User::findOrFail($identifier)
        : User::where('email', $identifier)->firstOrFail();
}

// Intersection type — must satisfy all interfaces
function processLoggableEntity(Loggable&Serializable $entity): void
{
    $entity->log();
    $data = $entity->serialize();
}

// DNF types (PHP 8.2) — combine union and intersection
function handle((Renderable&Countable)|string $content): string
{
    if (is_string($content)) {
        return $content;
    }

    return $content->render();
}
```

### First-Class Callable Syntax (PHP 8.1+)

```php
// Create closures from named functions
$slugify = Str::slug(...);
$titles  = array_map($slugify, $names);

// Method references
$validator = Validator::make(...);

// Useful for pipeline / collection patterns
$activeUsers = collect($users)
    ->filter(UserPolicy::isActive(...))
    ->map(UserTransformer::toArray(...))
    ->values();
```

### Fibers (PHP 8.1+)

```php
// Fibers enable cooperative multitasking — foundation for async frameworks
$fiber = new Fiber(function (): void {
    $value = Fiber::suspend('paused');
    echo "Resumed with: {$value}";
});

$result = $fiber->start();        // Returns 'paused'
$fiber->resume('hello world');    // Prints: "Resumed with: hello world"

// Practical use: async HTTP client internals, event loops (Revolt, ReactPHP)
// Application developers rarely use Fiber directly — frameworks abstract it
```

## PSR Standards

| PSR | Name | Relevance |
|---|---|---|
| PSR-1 | Basic Coding Standard | Baseline: `<?php` tag, UTF-8, namespace/class conventions |
| PSR-4 | Autoloading | Map namespaces to directories in `composer.json` — mandatory |
| PSR-7 | HTTP Message Interfaces | Immutable request/response objects for middleware pipelines |
| PSR-11 | Container Interface | Dependency injection container interoperability |
| PSR-12 | Extended Coding Style | Supersedes PSR-2: formatting, spacing, declarations |
| PSR-15 | HTTP Server Middleware | `MiddlewareInterface` and `RequestHandlerInterface` |
| PSR-17 | HTTP Factories | Create PSR-7 objects (RequestFactory, ResponseFactory) |
| PSR-18 | HTTP Client | `ClientInterface` for interoperable HTTP clients |

### PSR-4 Autoloading

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Domain\\": "src/Domain/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        }
    }
}
```

Rule: namespace segment maps 1:1 to directory. `App\Http\Controllers\UserController` lives at `app/Http/Controllers/UserController.php`.

## Composer Dependency Management

### Essential Commands

| Command | Purpose |
|---|---|
| `composer require package/name` | Add production dependency |
| `composer require package/name --dev` | Add development dependency |
| `composer update --dry-run` | Preview what would change |
| `composer why package/name` | Show why a package is installed |
| `composer audit` | Check for known security vulnerabilities |
| `composer bump` | Update version constraints to installed versions |
| `composer validate --strict` | Validate `composer.json` and `composer.lock` |

### Best Practices
- Always commit `composer.lock` — reproducible installs across environments
- Use `^` (caret) constraints: `"laravel/framework": "^12.0"` allows minor/patch updates
- Separate dev dependencies: testing, static analysis, and debug tools go in `require-dev`
- Run `composer audit` in CI to catch known vulnerabilities
- Use `composer dump-autoload --classmap-authoritative` in production for speed

## Static Analysis

### PHPStan Levels

| Level | What It Checks |
|---|---|
| 0 | Basic: undefined variables, unknown classes, wrong function calls |
| 1 | + possibly undefined variables, unknown methods on `$this` |
| 2 | + unknown methods on all expressions (not just `$this`) |
| 3 | + return types verified |
| 4 | + dead code, always-true/false conditions |
| 5 | + argument types of function calls |
| 6 | + missing typehints reported |
| 7 | + union types checked exhaustively |
| 8 | + nullable types checked strictly |
| 9 | + `mixed` type is forbidden without explicit handling |

### PHPStan Configuration

```neon
# phpstan.neon
parameters:
    level: 9
    paths:
        - app
        - src
    excludePaths:
        - app/Console/Kernel.php
    ignoreErrors: []
    checkMissingIterableValueType: true
    checkGenericClassInNonGenericObjectType: true

includes:
    - vendor/larastan/larastan/extension.neon  # Laravel-specific rules
```

### PHP CS Fixer / Pint

```php
// .php-cs-fixer.php — for non-Laravel projects
return (new PhpCsFixer\Config())
    ->setRules([
        '@PER-CS'            => true,
        'strict_types'       => true,
        'declare_strict_types' => true,
        'ordered_imports'    => ['sort_algorithm' => 'alpha'],
        'no_unused_imports'  => true,
        'trailing_comma_in_multiline' => true,
    ])
    ->setFinder(
        PhpCsFixer\Finder::create()->in([__DIR__ . '/src', __DIR__ . '/tests'])
    );
```

For Laravel projects, use Pint with a `pint.json` preset — it wraps PHP CS Fixer with Laravel-specific defaults.

## SOLID Principles in PHP

| Principle | Guideline | PHP Mechanism |
|---|---|---|
| **S** — Single Responsibility | One reason to change per class | Action classes, small services |
| **O** — Open/Closed | Extend behavior without modifying source | Interfaces, strategy pattern, enums |
| **L** — Liskov Substitution | Subtypes must be substitutable for base types | Covariant returns, contravariant params |
| **I** — Interface Segregation | Clients depend only on methods they use | Small, focused interfaces |
| **D** — Dependency Inversion | Depend on abstractions, not concretions | Constructor injection, interface bindings |

### Dependency Inversion Example

```php
// Contract (abstraction)
interface PaymentGateway
{
    public function charge(Money $amount, PaymentMethod $method): PaymentResult;
}

// Implementation (concretion) — can be swapped without changing consumers
final class StripeGateway implements PaymentGateway
{
    public function __construct(private readonly StripeClient $client) {}

    public function charge(Money $amount, PaymentMethod $method): PaymentResult
    {
        // Stripe-specific logic
    }
}

// Consumer depends on abstraction only
final class ProcessPaymentAction
{
    public function __construct(private readonly PaymentGateway $gateway) {}

    public function execute(Order $order): PaymentResult
    {
        return $this->gateway->charge($order->total, $order->paymentMethod);
    }
}
```

## Error Handling Patterns

### Custom Exception Hierarchy

```php
// Base domain exception
abstract class DomainException extends \RuntimeException {}

// Specific exceptions with factory methods
final class InsufficientFundsException extends DomainException
{
    public static function forAccount(Account $account, Money $required): self
    {
        return new self(sprintf(
            'Account %s has %d %s but %d %s is required.',
            $account->id,
            $account->balance->amount,
            $account->balance->currency,
            $required->amount,
            $required->currency,
        ));
    }
}
```

### Result Pattern (Error as Value)

```php
/** @template T */
readonly class Result
{
    /** @param T|null $value */
    private function __construct(
        public bool    $ok,
        public mixed   $value = null,
        public ?string $error = null,
    ) {}

    /** @param T $value */
    public static function success(mixed $value): self
    {
        return new self(ok: true, value: $value);
    }

    public static function failure(string $error): self
    {
        return new self(ok: false, error: $error);
    }
}

// Usage — caller must handle both paths
$result = $action->execute($data);
if (! $result->ok) {
    return response()->json(['error' => $result->error], 422);
}
```

## Type Safety Patterns

### Branded / Opaque Types via Readonly Classes

```php
// Prevent accidental mixing of IDs from different entities
readonly class UserId
{
    public function __construct(public int $value) {}

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }
}

readonly class OrderId
{
    public function __construct(public int $value) {}
}

// Compiler prevents: processOrder(new UserId(1)) when OrderId is expected
function processOrder(OrderId $orderId): void { /* ... */ }
```

### Generic Collections via PHPStan Annotations

```php
/**
 * @template T
 * @implements \IteratorAggregate<int, T>
 */
final class TypedCollection implements \IteratorAggregate, \Countable
{
    /** @param list<T> $items */
    public function __construct(private array $items = []) {}

    /** @param T $item */
    public function add(mixed $item): void
    {
        $this->items[] = $item;
    }

    /** @return \ArrayIterator<int, T> */
    public function getIterator(): \ArrayIterator
    {
        return new \ArrayIterator($this->items);
    }

    public function count(): int
    {
        return count($this->items);
    }
}
```

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | What To Do Instead |
|---|---|---|
| Using `mixed` as escape hatch | Holes in type safety net | Narrow with union types or generics |
| Stringly-typed code | Runtime errors from typos | Use backed enums for named constants |
| God classes (many responsibilities) | Untestable, high coupling | Split into Action classes |
| Suppressing static analysis | Hides real bugs | Fix the issue, add `@phpstan-ignore` only with explanation |
| Missing `declare(strict_types=1)` | Silent type coercion bugs | Add to every PHP file |
| Array-shaped domain data | No IDE support, no type safety | Use readonly DTOs or value objects |
| Service locator (`app()` in logic) | Hidden dependencies, untestable | Constructor injection |
| Catching `\Exception` broadly | Swallows unexpected errors | Catch specific exception types |
| Mutable value objects | Shared state bugs | Use `readonly` classes, return new instances |
| Ignoring `composer audit` | Known vulnerabilities in production | Run in CI, treat as build failure |
| Deep inheritance (3+ levels) | Fragile base class problem | Prefer composition and interfaces |
| Classes not marked `final` | Unintended extension | Default to `final`, open only when designed for it |

## Anti-Rationalization Guards

- Do NOT skip `declare(strict_types=1)` because "it's just a small script" -- add it everywhere.
- Do NOT use `mixed` without a comment justifying why a narrower type is impossible.
- Do NOT suppress PHPStan errors without a written explanation of why the code is correct.
- Do NOT use the service locator pattern (`app()`) in business logic, even in Laravel.
- Do NOT skip interfaces for key boundaries because "there's only one implementation" -- there will be two.

## Integration Points

| Skill | How It Connects |
|---|---|
| `laravel-specialist` | PHP 8.x features power Eloquent casts, enums, readonly DTOs, and typed collections |
| `senior-backend` | SOLID architecture, interface-driven design, error handling patterns |
| `test-driven-development` | PHPUnit/Pest testing with strong type assertions |
| `clean-code` | SOLID, DRY, code smell detection at the PHP level |
| `security-review` | Input validation, type coercion risks, dependency vulnerabilities |
| `laravel-boost` | AI-generated PHP code quality via guidelines and MCP tools |

## Skill Type

**FLEXIBLE** — Adapt the process phases to the scope of work. A single function may need only Phase 3 and 4. A new module or package should follow all four phases. Non-negotiable regardless of scope: `declare(strict_types=1)`, PHPStan compliance at the project's configured level, and PSR-4 autoloading.
