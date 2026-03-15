---
name: senior-prompt-engineer
description: When the user needs prompt design, optimization, few-shot examples, chain-of-thought patterns, structured output, evaluation metrics, or prompt versioning.
---

# Senior Prompt Engineer

## Overview

Design, test, and optimize prompts for large language models. This skill covers systematic prompt engineering including few-shot example design, chain-of-thought reasoning, system prompt architecture, structured output specification, parameter tuning, evaluation methodology, A/B testing, and prompt version management.

## Process

### Phase 1: Requirements
1. Define the task objective clearly
2. Identify input/output format requirements
3. Determine quality criteria (accuracy, tone, format)
4. Assess edge cases and failure modes
5. Choose model and parameter constraints

### Phase 2: Prompt Design
1. Draft system prompt with role, constraints, and format
2. Design few-shot examples (3-5 representative cases)
3. Add chain-of-thought scaffolding if reasoning is needed
4. Specify output structure (JSON, markdown, etc.)
5. Add error handling instructions

### Phase 3: Evaluation and Iteration
1. Create evaluation dataset (50+ examples minimum)
2. Define scoring rubric (automated + human metrics)
3. Run baseline evaluation
4. Iterate on prompt with targeted improvements
5. A/B test promising variants
6. Version and document the final prompt

## Prompt Architecture

### System Prompt Structure
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

### Prompt Layering
```
Layer 1: Identity (who the model is)
Layer 2: Context (what it knows / has access to)
Layer 3: Task (what to do)
Layer 4: Constraints (what NOT to do)
Layer 5: Format (how to structure output)
Layer 6: Examples (demonstrations)
Layer 7: Metacognition (how to handle uncertainty)
```

## Few-Shot Example Design

### Selection Criteria
- **Representative**: cover the most common input types
- **Diverse**: include edge cases and boundary conditions
- **Ordered**: simple to complex progression
- **Balanced**: equal representation of output categories

### Example Count Guidelines
| Task Complexity | Examples Needed |
|---|---|
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

### Anti-Patterns in Examples
- All examples from same category (no diversity)
- Perfect inputs only (no edge cases)
- Inconsistent output format across examples
- Examples that are too similar to each other
- Too many examples (dilutes attention, wastes tokens)

## Chain-of-Thought Patterns

### Standard CoT
```
Think step by step:
1. First, identify [X]
2. Then, analyze [Y]
3. Based on that, determine [Z]
4. Finally, provide your answer
```

### Structured CoT
```
Before answering, analyze the request:
<analysis>
- What is being asked: [restate the question]
- Key information: [extract relevant facts]
- Approach: [describe your reasoning method]
- Potential issues: [identify edge cases]
</analysis>

Then provide your answer:
<answer>
[Your response]
</answer>
```

### Self-Consistency CoT
```
Generate 3 independent solutions, then select the most common answer:
<attempt_1>[solution]</attempt_1>
<attempt_2>[solution]</attempt_2>
<attempt_3>[solution]</attempt_3>
<final_answer>[most consistent result]</final_answer>
```

### When to Use CoT
- Mathematical reasoning
- Multi-step logical problems
- Tasks requiring evidence gathering
- Classification with justification
- Complex decision-making

### When NOT to Use CoT
- Simple factual lookups
- Direct format conversion
- Tasks where reasoning adds latency without accuracy
- Very short responses

## Structured Output

### JSON Output
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

### Markdown Output
```
Format your response as follows:

## Summary
[1-2 sentence summary]

## Key Findings
- [Finding 1]
- [Finding 2]

## Recommendation
[Action to take]
```

### XML Tags for Parsing
```
Wrap each section in XML tags:
<summary>...</summary>
<analysis>...</analysis>
<recommendation>...</recommendation>
```

## Temperature and Top-P Tuning

| Use Case | Temperature | Top-P | Rationale |
|---|---|---|---|
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

## Evaluation Metrics

### Automated Metrics
| Metric | Measures | Use For |
|---|---|---|
| Exact Match | Output equals expected | Classification, extraction |
| F1 Score | Precision + recall balance | Multi-label tasks |
| BLEU/ROUGE | N-gram overlap | Summarization, translation |
| JSON validity | Parseable structured output | Structured generation |
| Regex match | Output matches pattern | Format compliance |

### Human Evaluation Dimensions
| Dimension | Description | Scale |
|---|---|---|
| Accuracy | Factual correctness | 1-5 |
| Relevance | Addresses the actual question | 1-5 |
| Coherence | Logical flow and structure | 1-5 |
| Completeness | Covers all required aspects | 1-5 |
| Tone | Matches desired voice | 1-5 |
| Conciseness | No unnecessary content | 1-5 |

### Evaluation Dataset Requirements
- Minimum 50 examples for statistical significance
- Cover all input categories proportionally
- Include edge cases (10-20% of dataset)
- Gold labels reviewed by 2+ evaluators
- Version-controlled alongside prompts

## A/B Testing Prompts

### Process
1. Define hypothesis: "Prompt B will improve [metric] by [amount]"
2. Hold all variables constant except the prompt change
3. Run both variants on the same evaluation set
4. Calculate metric differences with confidence intervals
5. Require statistical significance (p < 0.05) before adopting

### What to Test
- Instruction phrasing (imperative vs descriptive)
- Number of few-shot examples
- Example ordering
- CoT presence/absence
- Output format specification
- Constraint placement (beginning vs end)

## Prompt Versioning

### Version File Format
```yaml
# prompts/classify-sentiment/v2.1.yaml
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

## Anti-Patterns

- Vague instructions ("be helpful" without specifics)
- Contradictory constraints
- Examples that don't match the actual task
- Over-engineering simple tasks with complex prompts
- No evaluation framework (guessing at quality)
- Optimizing for a single example instead of the distribution
- Ignoring model-specific capabilities and limitations
- Prompt that works for one model assumed to work for all

## Skill Type

**FLEXIBLE** — Adapt prompting techniques to the specific model, task, and quality requirements. The evaluation and versioning practices are strongly recommended but can be scaled to project size.
