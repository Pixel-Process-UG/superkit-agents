---
name: llm-as-judge
description: Use when validating subjective quality criteria that cannot be deterministically tested — applies LLM-based evaluation with structured rubrics for tone, aesthetics, UX feel, documentation quality, and code readability
---

# LLM-as-Judge

## Overview

Some quality criteria are inherently subjective — tone of voice, visual aesthetics, UX feel, documentation clarity, code readability. These cannot be verified by deterministic tests. The LLM-as-judge pattern provides structured, repeatable evaluation using an LLM reviewer with defined rubrics.

## When to Use LLM-as-Judge vs Deterministic Tests

| Criterion Type | Method | Example |
|---------------|--------|---------|
| **Objective, measurable** | Deterministic test | "Response time < 200ms" |
| **Structural, verifiable** | Deterministic test | "Returns valid JSON" |
| **Subjective, qualitative** | LLM-as-judge | "Error messages are friendly and helpful" |
| **Aesthetic, perceptual** | LLM-as-judge | "UI feels clean and modern" |
| **Linguistic, tonal** | LLM-as-judge | "Documentation is clear for beginners" |
| **Holistic, experiential** | LLM-as-judge | "The onboarding flow feels intuitive" |

**Rule of thumb:** If you can write a boolean assertion, use a deterministic test. If evaluation requires judgment, use LLM-as-judge.

## The Review Pattern

### Review Request Structure

```javascript
{
  criteria: "Description of what to evaluate and the quality standard",
  artifact: "The content to be evaluated (code, text, UI markup, etc.)",
  rubric: [
    { dimension: "Clarity", weight: 0.3, description: "Is the content easy to understand?" },
    { dimension: "Tone", weight: 0.3, description: "Is the tone appropriate for the audience?" },
    { dimension: "Completeness", weight: 0.2, description: "Does it cover all necessary points?" },
    { dimension: "Engagement", weight: 0.2, description: "Does it hold the reader's interest?" }
  ],
  passing_threshold: 7.0,
  intelligence: "opus"  // Model to use for evaluation
}
```

### Review Response Structure

```javascript
{
  scores: [
    { dimension: "Clarity", score: 8, reasoning: "Well-structured with clear headings..." },
    { dimension: "Tone", score: 7, reasoning: "Professional but occasionally too formal..." },
    { dimension: "Completeness", score: 9, reasoning: "Covers all key topics..." },
    { dimension: "Engagement", score: 6, reasoning: "Could use more examples..." }
  ],
  weighted_score: 7.4,
  pass: true,
  summary: "Overall good quality with minor tone and engagement improvements suggested.",
  suggestions: [
    "Add a real-world example in section 3",
    "Use more conversational language in the introduction"
  ]
}
```

## Process

### Step 1: Define Rubric

Create evaluation dimensions with weights:

| Dimension | Weight | Scale | Anchor Points |
|-----------|--------|-------|---------------|
| Clarity | 0-1.0 | 1-10 | 1=incomprehensible, 5=adequate, 10=crystal clear |
| Tone | 0-1.0 | 1-10 | 1=inappropriate, 5=neutral, 10=perfectly suited |
| Completeness | 0-1.0 | 1-10 | 1=missing key info, 5=covers basics, 10=comprehensive |
| [Custom] | 0-1.0 | 1-10 | Define anchor points for your criteria |

**Weights must sum to 1.0.**

### Step 2: Set Passing Threshold

| Quality Level | Threshold | Use For |
|--------------|-----------|---------|
| Minimum viable | 5.0 | Internal docs, draft content |
| Production quality | 7.0 | User-facing content, public APIs |
| Excellence | 8.5 | Marketing, critical UX flows |

### Step 3: Evaluate

Submit the artifact with rubric to an LLM reviewer (subagent). The reviewer:

1. Reads the artifact completely
2. Scores each dimension independently
3. Provides reasoning for each score
4. Calculates weighted total
5. Determines pass/fail against threshold
6. Provides actionable suggestions for improvement

### Step 4: Iterate or Accept

| Result | Action |
|--------|--------|
| **Pass** (score >= threshold) | Accept the artifact, proceed |
| **Marginal fail** (within 1 point of threshold) | Apply suggestions, re-evaluate once |
| **Clear fail** (> 1 point below threshold) | Significant revision needed, apply all suggestions |
| **Repeated fail** (3+ attempts) | Escalate — the rubric or approach may need adjustment |

## Common Rubric Templates

### Documentation Quality
```
Clarity (0.3): Is the content easy to understand for the target audience?
Accuracy (0.3): Is the information technically correct?
Completeness (0.2): Does it cover all necessary topics?
Examples (0.2): Are there sufficient, relevant code examples?
Threshold: 7.0
```

### Error Message Quality
```
Helpfulness (0.4): Does the message help the user fix the problem?
Clarity (0.3): Is the message easy to understand?
Tone (0.2): Is the tone empathetic and non-blaming?
Actionability (0.1): Does it suggest a concrete next step?
Threshold: 7.5
```

### Code Readability
```
Naming (0.3): Are variable/function names descriptive and consistent?
Structure (0.3): Is the code logically organized?
Simplicity (0.2): Is the code as simple as possible (but not simpler)?
Documentation (0.2): Are complex sections adequately commented?
Threshold: 7.0
```

### UX Copy
```
Clarity (0.3): Is the copy easy to understand?
Brevity (0.2): Is it concise without losing meaning?
Tone (0.2): Does it match the brand voice?
Actionability (0.2): Do CTAs clearly communicate what happens next?
Accessibility (0.1): Is the language inclusive and jargon-free?
Threshold: 7.5
```

## Integration with Downstream Steering

The LLM-as-judge pattern is a form of **downstream steering** — a validation gate that creates backpressure:

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  SPECS   │────▶│   CODE   │────▶│  TESTS   │────▶│ LLM-AS-  │
│          │     │          │     │(determin)│     │  JUDGE   │
│          │     │          │     │          │     │(subject) │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                      ▲                                  │
                      │          backpressure             │
                      └──────────────────────────────────┘
```

Deterministic tests validate objective criteria. LLM-as-judge validates subjective criteria. Both must pass.

## Anti-Patterns

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| Using LLM-as-judge for measurable criteria | Use deterministic tests for anything quantifiable |
| Vague rubric dimensions ("is it good?") | Specific, anchored dimensions with examples |
| No passing threshold defined | Always set threshold before evaluation |
| Adjusting rubric to pass failing content | Fix the content, not the rubric |
| Single evaluation without reasoning | Always require per-dimension reasoning |
| Using weaker model for evaluation | Use strongest available model (Opus) for quality judgment |

## Skill Type

**Flexible** — Adapt rubric dimensions and thresholds to context. The pattern structure (rubric → evaluate → score → iterate) is fixed.
