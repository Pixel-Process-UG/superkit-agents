---
name: senior-prompt-engineer
description: "Use when the user needs prompt design, optimization, few-shot examples, chain-of-thought patterns, structured output, evaluation metrics, or prompt versioning. Triggers: new prompt creation, prompt optimization, few-shot example design, structured output specification, A/B testing prompts, evaluation framework setup."
---

# Senior Prompt Engineer

## Overview

Design, test, and optimize prompts for large language models. This skill covers systematic prompt engineering including few-shot example design, chain-of-thought reasoning, system prompt architecture, structured output specification, parameter tuning, evaluation methodology, A/B testing, and prompt version management.

**Announce at start:** "I'm using the senior-prompt-engineer skill for prompt design and optimization."

---

## Phase 1: Requirements

**Goal:** Define the task objective, quality criteria, and constraints before writing any prompt.

### Actions

1. Define the task objective clearly
2. Identify input/output format requirements
3. Determine quality criteria (accuracy, tone, format)
4. Assess edge cases and failure modes
5. Choose model and parameter constraints

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Task objective is stated in one sentence
- [ ] Input format and output format are defined
- [ ] Quality criteria are measurable
- [ ] Edge cases are listed
- [ ] Model selection is justified

---

## Phase 2: Prompt Design

**Goal:** Draft the prompt with proper architecture, examples, and constraints.

### Actions

1. Draft system prompt with role, constraints, and format
2. Design few-shot examples (3-5 representative cases)
3. Add chain-of-thought scaffolding if reasoning is needed
4. Specify output structure (JSON, markdown, etc.)
5. Add error handling instructions

### Prompt Architecture Layers

| Layer | Purpose | Example |
|-------|---------|---------|
| 1. Identity | Who the model is | "You are a sentiment classifier..." |
| 2. Context | What it knows/has access to | "You have access to product reviews..." |
| 3. Task | What to do | "Classify each review as positive/negative/neutral" |
| 4. Constraints | What NOT to do | "Never include PII in output" |
| 5. Format | How to structure output | "Respond in JSON: {classification, confidence}" |
| 6. Examples | Demonstrations | 3-5 representative input/output pairs |
| 7. Metacognition | Handling uncertainty | "If uncertain, classify as neutral and explain" |

### System Prompt Template

```
[Role] You are a [specific role] that [specific capability].

[Context] You have access to [tools/knowledge]. The user will provide [input type].

[Instructions]
1. First, [step 1]
2. Then, [step 2]
3. Finally, [step 3]

[Constraints]
- Always [requirement]
- Never [prohibition]
- If uncertain, [fallback behavior]

[Output Format]
Respond in the following format:
[format specification]

[Examples]
<example>
Input: [sample input]
Output: [sample output]
</example>
```

### STOP — Do NOT proceed to Phase 3 until:
- [ ] All 7 layers are addressed (or intentionally omitted with rationale)
- [ ] Examples are representative and diverse
- [ ] Output format is unambiguous
- [ ] Constraints are specific (not vague)

---

## Phase 3: Evaluation and Iteration

**Goal:** Measure prompt quality and iterate toward targets.

### Actions

1. Create evaluation dataset (50+ examples minimum)
2. Define scoring rubric (automated + human metrics)
3. Run baseline evaluation
4. Iterate on prompt with targeted improvements
5. A/B test promising variants
6. Version and document the final prompt

### STOP — Evaluation complete when:
- [ ] Evaluation dataset covers all input categories
- [ ] Metrics meet defined quality thresholds
- [ ] A/B test shows statistical significance (p < 0.05)
- [ ] Final prompt is versioned with metrics

---

## Few-Shot Example Design

### Selection Criteria Decision Table

| Criterion | Explanation | Example |
|-----------|------------|---------|
| Representative | Cover most common input types | Include typical emails, not just edge cases |
| Diverse | Include edge cases and boundaries | Short + long, positive + negative |
| Ordered | Simple to complex progression | Obvious case first, ambiguous last |
| Balanced | Equal representation of categories | Not 4 positive and 1 negative |

### Example Count Guidelines

| Task Complexity | Examples Needed |
|----------------|----------------|
| Simple classification | 2-3 |
| Moderate generation | 3-5 |
| Complex reasoning | 5-8 |
| Format-sensitive | 3-5 (focus on format consistency) |

### Example Format

```
<example>
<input>
[Representative input]
</input>
<reasoning>
[Optional: show the thinking process]
</reasoning>
<output>
[Expected output in exact target format]
</output>
</example>
```

---

## Chain-of-Thought Patterns

### CoT Pattern Decision Table

| Pattern | Use When | Example |
|---------|----------|---------|
| Standard CoT | Multi-step reasoning | "Think step by step: 1. Identify... 2. Analyze..." |
| Structured CoT | Need parseable reasoning | XML tags: `<analysis>...</analysis>` then `<answer>...</answer>` |
| Self-Consistency | High-stakes decisions | Generate 3 solutions, pick most common |
| No CoT | Simple factual lookups, format conversion | Skip reasoning overhead |

### When to Use CoT

| Task Type | Use CoT? | Rationale |
|-----------|----------|-----------|
| Mathematical reasoning | Yes | Step-by-step prevents errors |
| Multi-step logic | Yes | Makes reasoning transparent |
| Classification with justification | Yes | Improves accuracy and explainability |
| Simple factual lookup | No | Adds latency without accuracy gain |
| Direct format conversion | No | No reasoning needed |
| Very short responses | No | CoT overhead exceeds benefit |

---

## Structured Output

### Output Format Decision Table

| Format | Use When | Parsing |
|--------|----------|---------|
| JSON | Machine-consumed output | `JSON.parse()` |
| Markdown | Human-readable structured text | Regex or markdown parser |
| XML tags | Sections need clear boundaries | XML parser or regex |
| YAML | Configuration-like output | YAML parser |
| Plain text | Simple, unstructured response | No parsing needed |

### JSON Output Example

```
Respond with a JSON object matching this schema:
{
  "classification": "positive" | "negative" | "neutral",
  "confidence": number between 0 and 1,
  "reasoning": "brief explanation",
  "key_phrases": ["array", "of", "phrases"]
}

Do not include any text outside the JSON object.
```

---

## Temperature and Top-P Tuning

| Use Case | Temperature | Top-P | Rationale |
|----------|------------|-------|-----------|
| Code generation | 0.0-0.2 | 0.9 | Deterministic, correct |
| Classification | 0.0 | 1.0 | Consistent results |
| Creative writing | 0.7-1.0 | 0.95 | Diverse, interesting |
| Summarization | 0.2-0.4 | 0.9 | Faithful but fluent |
| Brainstorming | 0.8-1.2 | 0.95 | Maximum diversity |
| Data extraction | 0.0 | 0.9 | Precise, reliable |

### Rules

- Temperature 0 for tasks requiring consistency and correctness
- Higher temperature for creative tasks
- Top-P rarely needs tuning (keep at 0.9-1.0)
- Do not use both high temperature AND low top-p (contradictory)

---

## Evaluation Metrics

### Automated Metrics

| Metric | Measures | Use For |
|--------|---------|---------|
| Exact Match | Output equals expected | Classification, extraction |
| F1 Score | Precision + recall balance | Multi-label tasks |
| BLEU/ROUGE | N-gram overlap | Summarization, translation |
| JSON validity | Parseable structured output | Structured generation |
| Regex match | Output matches pattern | Format compliance |

### Human Evaluation Dimensions

| Dimension | Scale | Description |
|-----------|-------|------------|
| Accuracy | 1-5 | Factual correctness |
| Relevance | 1-5 | Addresses the actual question |
| Coherence | 1-5 | Logical flow and structure |
| Completeness | 1-5 | Covers all required aspects |
| Tone | 1-5 | Matches desired voice |
| Conciseness | 1-5 | No unnecessary content |

### Evaluation Dataset Requirements

- Minimum 50 examples for statistical significance
- Cover all input categories proportionally
- Include edge cases (10-20% of dataset)
- Gold labels reviewed by 2+ evaluators
- Version-controlled alongside prompts

---

## A/B Testing Process

1. Define hypothesis: "Prompt B will improve [metric] by [amount]"
2. Hold all variables constant except the prompt change
3. Run both variants on the same evaluation set
4. Calculate metric differences with confidence intervals
5. Require statistical significance (p < 0.05) before adopting

### What to A/B Test

| Variable | Expected Impact |
|----------|----------------|
| Instruction phrasing (imperative vs descriptive) | Moderate |
| Number of few-shot examples | Moderate |
| Example ordering | Low-moderate |
| CoT presence/absence | High for reasoning tasks |
| Output format specification | High for structured output |
| Constraint placement (beginning vs end) | Low |

---

## Prompt Versioning

### Version File Format

```yaml
id: classify-sentiment
version: 2.1
model: claude-sonnet-4-20250514
temperature: 0.0
created: 2025-03-01
author: team
changelog: "Added edge case examples for sarcasm detection"
metrics:
  accuracy: 0.94
  f1: 0.92
  eval_dataset: sentiment-eval-v3
system_prompt: |
  You are a sentiment classifier...
examples:
  - input: "..."
    output: "..."
```

### Versioning Rules

- Semantic versioning: major.minor (major = behavior change, minor = refinement)
- Every version includes evaluation metrics
- Link to evaluation dataset version
- Document what changed and why
- Keep previous versions for rollback

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Vague instructions ("be helpful") | Unreliable, inconsistent output | Specific instructions with examples |
| Contradictory constraints | Model cannot satisfy both | Review for consistency |
| Examples that do not match task | Confuses the model | Examples must reflect real use |
| Over-engineering simple tasks | Wasted tokens, slower | Match prompt complexity to task complexity |
| No evaluation framework | Guessing at quality | Define metrics before iterating |
| Optimizing for single example | Overfitting to one case | Optimize for the distribution |
| Assuming cross-model portability | Different models need different prompts | Test on target model |
| Skipping version control | Cannot rollback or compare | Version every prompt with metrics |

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `llm-as-judge` | LLM-as-judge evaluates prompt output quality |
| `acceptance-testing` | Prompt evaluation datasets serve as acceptance tests |
| `testing-strategy` | Prompt testing follows the evaluation methodology |
| `senior-data-scientist` | Statistical testing validates A/B results |
| `code-review` | Prompt changes reviewed like code changes |
| `clean-code` | Prompt readability follows clean code naming principles |

---

## Skill Type

**FLEXIBLE** — Adapt prompting techniques to the specific model, task, and quality requirements. The evaluation and versioning practices are strongly recommended but can be scaled to project size. Always version production prompts.
