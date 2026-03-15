---
name: senior-data-scientist
description: "Use when the user needs ML pipelines, statistical analysis, data preprocessing, feature engineering, model selection, experiment tracking, or data visualization. Triggers: dataset exploration, model training, feature engineering, hyperparameter tuning, experiment tracking setup, statistical hypothesis testing, visualization creation."
---

# Senior Data Scientist

## Overview

Build end-to-end data science workflows from data exploration through model deployment. This skill covers data preprocessing, feature engineering, model selection, hyperparameter tuning, cross-validation, experiment tracking with MLflow/W&B, statistical testing, visualization with matplotlib/seaborn/plotly, and Jupyter notebook best practices.

**Announce at start:** "I'm using the senior-data-scientist skill for data science workflow."

---

## Phase 1: Data Understanding

**Goal:** Profile the dataset and establish a baseline before any modeling.

### Actions

1. Load and profile the dataset (shape, types, distributions)
2. Identify missing values, outliers, and data quality issues
3. Perform exploratory data analysis (EDA)
4. Define the target variable and success metrics
5. Establish baseline performance

### Baseline Models (Always Start Here)

| Task | Baseline Model | Why |
|------|---------------|-----|
| Classification | Majority class classifier | Lower bound for accuracy |
| Classification | Logistic regression | Simple, interpretable |
| Regression | Mean predictor | Lower bound for RMSE |
| Regression | Linear regression | Simple, interpretable |
| Time series | Naive forecast (previous value) | Lower bound for MAE |
| Time series | Seasonal naive | Captures basic seasonality |

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Dataset is profiled (shape, types, distributions)
- [ ] Missing values and outliers are documented
- [ ] Target variable is defined
- [ ] Success metrics are chosen
- [ ] Baseline performance is established

---

## Phase 2: Feature Engineering

**Goal:** Transform raw data into features that improve model performance.

### Actions

1. Handle missing values (imputation strategy)
2. Encode categorical variables
3. Scale/normalize numerical features
4. Create derived features
5. Feature selection (remove redundant/irrelevant)

### Missing Value Strategy Decision Table

| Strategy | When to Use | Implementation |
|----------|-------------|---------------|
| Drop rows | < 5% missing, MCAR | `df.dropna()` |
| Mean/Median | Numerical, no outliers | `SimpleImputer(strategy='median')` |
| Mode | Categorical | `SimpleImputer(strategy='most_frequent')` |
| KNN Imputer | Structured missing patterns | `KNNImputer(n_neighbors=5)` |
| Iterative | Complex relationships | `IterativeImputer()` |
| Flag + Impute | Missingness is informative | Add `is_missing` column + impute |

### Categorical Encoding Decision Table

| Method | When | Cardinality |
|--------|------|-------------|
| One-Hot | Nominal, low cardinality | < 10 categories |
| Label/Ordinal | Ordinal features | Any |
| Target Encoding | High cardinality nominal | > 10 categories |
| Frequency Encoding | When frequency matters | Any |
| Binary Encoding | Very high cardinality | > 50 categories |

### Scaling Decision Table

| Scaler | When | Robust to Outliers? |
|--------|------|-------------------|
| StandardScaler | Default choice (mean=0, std=1) | No |
| RobustScaler | Outliers present (median/IQR) | Yes |
| MinMaxScaler | Neural networks, distance-based [0,1] | No |

### Feature Types and Engineering

| Feature Type | Techniques |
|-------------|-----------|
| Numerical | Log transform, polynomial, binning, interactions (A*B, A/B) |
| Temporal | Hour, day-of-week, is_weekend, time_since_event, cyclical (sin/cos), lags |
| Text | TF-IDF, word count, sentiment scores, named entities, embeddings |
| Categorical | Encoding (above), interaction with numerical features |

### Feature Selection Decision Table

| Method | Type | Use When |
|--------|------|----------|
| Correlation matrix | Filter | Initial exploration |
| Mutual information | Filter | Non-linear relationships |
| Recursive Feature Elimination | Wrapper | Model-specific selection |
| L1 Regularization | Embedded | Linear models |
| Feature importance | Embedded | Tree-based models |
| Permutation importance | Model-agnostic | Final validation |

### STOP — Do NOT proceed to Phase 3 until:
- [ ] Missing values are handled with justified strategy
- [ ] Categorical variables are encoded appropriately
- [ ] Numerical features are scaled
- [ ] Feature engineering is done BEFORE train/test split on training data only
- [ ] Feature selection has reduced dimensionality if needed

---

## Phase 3: Modeling

**Goal:** Select, train, and evaluate candidate models.

### Actions

1. Select candidate algorithms
2. Set up cross-validation strategy
3. Train and evaluate candidates
4. Hyperparameter tuning
5. Final model selection and evaluation

### Algorithm Decision Table

| Data Characteristics | Try First | Also Consider |
|---------------------|-----------|---------------|
| Tabular, < 10K rows | Random Forest, XGBoost | Logistic/Linear Regression |
| Tabular, > 10K rows | XGBoost, LightGBM | CatBoost, Neural Network |
| High dimensionality | Lasso/Ridge, SVM | Random Forest with selection |
| Time series | Prophet, ARIMA | LSTM, XGBoost with lag features |
| Text classification | Fine-tuned transformer | TF-IDF + Logistic Regression |
| Image classification | Pre-trained CNN (ResNet, EfficientNet) | Vision Transformer |
| Regression | XGBoost, Random Forest | Linear Regression, Neural Network |
| Anomaly detection | Isolation Forest | LOF, Autoencoder |

### Cross-Validation Strategy Decision Table

| Strategy | When | Code |
|----------|------|------|
| K-Fold (k=5) | Default, balanced data | `KFold(n_splits=5)` |
| Stratified K-Fold | Classification, imbalanced | `StratifiedKFold(n_splits=5)` |
| Time Series Split | Temporal data | `TimeSeriesSplit(n_splits=5)` |
| Group K-Fold | Grouped observations | `GroupKFold(n_splits=5)` |
| Leave-One-Out | Very small datasets | `LeaveOneOut()` |

### Evaluation Metrics Decision Table

| Task | Primary Metric | Secondary Metrics |
|------|---------------|-------------------|
| Binary Classification | AUC-ROC | F1, Precision, Recall, AP |
| Multiclass | Macro F1 | Accuracy, Confusion Matrix |
| Regression | RMSE | MAE, R-squared, MAPE |
| Ranking | NDCG | MAP, MRR |
| Anomaly Detection | F1, AP | Precision@K, Recall@K |

### Hyperparameter Tuning Decision Table

| Method | Compute Budget | Search Space | Implementation |
|--------|---------------|-------------|----------------|
| Grid Search | Low (< 100 combos) | Small, known ranges | `GridSearchCV` |
| Random Search | Medium | Large, uncertain | `RandomizedSearchCV` |
| Bayesian (Optuna) | Any | Large, expensive | `optuna.create_study()` |
| Successive Halving | Large | Many candidates | `HalvingRandomSearchCV` |

### Common Hyperparameters (XGBoost/LightGBM)

```python
param_space = {
    'n_estimators': [100, 300, 500, 1000],
    'max_depth': [3, 5, 7, 9],
    'learning_rate': [0.01, 0.05, 0.1],
    'subsample': [0.7, 0.8, 0.9],
    'colsample_bytree': [0.7, 0.8, 0.9],
    'min_child_weight': [1, 3, 5],
}
```

### STOP — Do NOT proceed to Phase 4 until:
- [ ] At least 2 candidate models are evaluated
- [ ] Cross-validation is used (not just train/test split)
- [ ] Results beat the baseline from Phase 1
- [ ] Best model is selected with justification
- [ ] Overfitting is checked (train vs validation gap)

---

## Phase 4: Deployment

**Goal:** Serialize, serve, and monitor the model in production.

### Actions

1. Serialize model and preprocessing pipeline
2. Create prediction API or batch pipeline
3. Set up monitoring for data drift and model degradation
4. Document model card (inputs, outputs, limitations, biases)

### STOP — Deployment complete when:
- [ ] Model is serialized with preprocessing pipeline
- [ ] Prediction API or batch pipeline works end-to-end
- [ ] Monitoring is configured for data drift
- [ ] Model card is documented

---

## Experiment Tracking

### MLflow Pattern

```python
import mlflow

mlflow.set_experiment("customer-churn-prediction")

with mlflow.start_run(run_name="xgboost-v2"):
    mlflow.log_params(params)
    mlflow.log_metrics({"auc": auc_score, "f1": f1_score})
    mlflow.log_artifact("confusion_matrix.png")
    mlflow.sklearn.log_model(pipeline, "model")
    mlflow.set_tag("version", "2.1")
```

### What to Track

| Category | Items |
|----------|-------|
| Parameters | All hyperparameters, random seed |
| Metrics | Train and validation metrics |
| Data | Data version/hash, feature list |
| Artifacts | Plots, reports, model files |
| Metadata | Training duration, model size |

---

## Statistical Tests Decision Table

| Question | Test | Assumption |
|----------|------|-----------|
| Two group means different? | t-test (independent) | Normal distribution |
| Two groups (non-normal)? | Mann-Whitney U | None |
| Paired measurements? | Paired t-test | Normal differences |
| 3+ group means? | ANOVA | Normal, equal variance |
| Categorical association? | Chi-squared | Expected freq > 5 |
| Distribution normal? | Shapiro-Wilk | n < 5000 |
| Two distributions different? | Kolmogorov-Smirnov | Continuous data |

### P-Value Guidelines

- p < 0.05: statistically significant (conventional)
- Always report effect size alongside p-value
- Adjust for multiple comparisons (Bonferroni, FDR)
- Statistical significance is not practical significance

---

## Visualization Decision Table

| Data Type | Plot | Library |
|-----------|------|---------|
| Distribution | Histogram, KDE, Box plot | seaborn |
| Comparison | Bar chart, Grouped bar | matplotlib |
| Correlation | Scatter, Heatmap | seaborn |
| Trend | Line chart | matplotlib/plotly |
| Composition | Stacked bar, Pie (max 5 slices) | matplotlib |
| Interactive | Scatter, Line, Dashboard | plotly |

### Visualization Rules

- Title every plot descriptively
- Label axes with units
- Use colorblind-safe palettes (`seaborn: colorblind`)
- Start y-axis at 0 for bar charts
- Annotate key findings directly on plots

---

## Jupyter Notebook Structure

```
1. ## Setup (imports, configuration)
2. ## Data Loading
3. ## Exploratory Data Analysis
4. ## Data Preprocessing
5. ## Feature Engineering
6. ## Modeling
7. ## Evaluation
8. ## Conclusions
```

### Notebook Best Practices

- Restart and run all before sharing
- Keep cells focused and sequential
- Use markdown cells for explanations
- Extract reusable code to `.py` modules
- Version control with `nbstripout`
- Pin all dependency versions

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Training on test data | Data leakage, inflated metrics | Strict train/test separation |
| Feature engineering before split | Leaks test information into features | Engineer on training data only |
| Reporting training metrics | Not generalizable | Report validation/test metrics |
| Accuracy on imbalanced data | Misleading (majority class wins) | Use F1, AUC-ROC, or AP |
| Tuning on test set | Overfitting to test data | Use validation set for tuning |
| No baseline comparison | Cannot measure improvement | Always establish baseline first |
| Cherry-picking evaluation examples | Selection bias | Report on full evaluation set |
| Deploying without drift monitoring | Silent model degradation | Monitor input distributions |

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `senior-prompt-engineer` | Prompt evaluation uses statistical testing methods |
| `testing-strategy` | ML testing follows the evaluation methodology |
| `performance-optimization` | Model inference optimization follows measurement cycle |
| `acceptance-testing` | Model performance thresholds become acceptance criteria |
| `llm-as-judge` | Subjective output evaluation uses LLM-as-judge |
| `code-review` | Notebook and pipeline code reviewed for quality |

---

## Skill Type

**FLEXIBLE** — Adapt preprocessing, modeling, and evaluation approaches to the specific data characteristics, business requirements, and compute constraints. The four-phase process and experiment tracking are strongly recommended. Always establish a baseline before modeling.
