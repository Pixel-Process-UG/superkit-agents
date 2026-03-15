---
name: senior-data-scientist
description: When the user needs ML pipelines, statistical analysis, data preprocessing, feature engineering, model selection, experiment tracking, or data visualization.
---

# Senior Data Scientist

## Overview

Build end-to-end data science workflows from data exploration through model deployment. This skill covers data preprocessing, feature engineering, model selection, hyperparameter tuning, cross-validation, experiment tracking with MLflow/W&B, statistical testing, visualization with matplotlib/seaborn/plotly, and Jupyter notebook best practices.

## Process

### Phase 1: Data Understanding
1. Load and profile the dataset (shape, types, distributions)
2. Identify missing values, outliers, and data quality issues
3. Perform exploratory data analysis (EDA)
4. Define the target variable and success metrics
5. Establish baseline performance

### Phase 2: Feature Engineering
1. Handle missing values (imputation strategy)
2. Encode categorical variables
3. Scale/normalize numerical features
4. Create derived features
5. Feature selection (remove redundant/irrelevant features)

### Phase 3: Modeling
1. Select candidate algorithms
2. Set up cross-validation strategy
3. Train and evaluate candidates
4. Hyperparameter tuning
5. Final model selection and evaluation

### Phase 4: Deployment
1. Serialize model and preprocessing pipeline
2. Create prediction API or batch pipeline
3. Set up monitoring for data drift and model degradation
4. Document model card (inputs, outputs, limitations, biases)

## Data Preprocessing

### Missing Value Strategies
| Strategy | When to Use | Implementation |
|---|---|---|
| Drop rows | < 5% missing, MCAR | `df.dropna()` |
| Mean/Median | Numerical, no outliers | `SimpleImputer(strategy='median')` |
| Mode | Categorical | `SimpleImputer(strategy='most_frequent')` |
| KNN Imputer | Structured missing patterns | `KNNImputer(n_neighbors=5)` |
| Iterative | Complex relationships | `IterativeImputer()` |
| Flag + Impute | Missingness is informative | Add `is_missing` column + impute |

### Encoding Categorical Variables
| Method | When | Cardinality |
|---|---|---|
| One-Hot | Nominal, low cardinality | < 10 categories |
| Label/Ordinal | Ordinal features | Any |
| Target Encoding | High cardinality nominal | > 10 categories |
| Frequency Encoding | When frequency matters | Any |
| Binary Encoding | Very high cardinality | > 50 categories |

### Scaling
```python
from sklearn.preprocessing import StandardScaler, RobustScaler, MinMaxScaler

# StandardScaler: mean=0, std=1 (default choice)
# RobustScaler: uses median/IQR (robust to outliers)
# MinMaxScaler: scales to [0,1] (neural networks, distance-based)
```

## Feature Engineering

### Numerical Features
- Log transform for skewed distributions
- Polynomial features for non-linear relationships
- Binning for continuous-to-categorical conversion
- Interaction features (A * B, A / B)
- Rolling statistics for time series (mean, std, min, max)

### Temporal Features
- Hour, day of week, month, quarter, year
- Is weekend, is holiday
- Time since event (days since last purchase)
- Cyclical encoding (sin/cos for hour, day of week)
- Lag features for time series

### Text Features
- TF-IDF vectors
- Word count, character count
- Sentiment scores
- Named entity counts
- Embedding vectors (sentence-transformers)

### Feature Selection Methods
| Method | Type | Use When |
|---|---|---|
| Correlation matrix | Filter | Initial exploration |
| Mutual information | Filter | Non-linear relationships |
| Recursive Feature Elimination | Wrapper | Model-specific selection |
| L1 Regularization | Embedded | Linear models |
| Feature importance | Embedded | Tree-based models |
| Permutation importance | Model-agnostic | Any model, final validation |

## Model Selection

### Algorithm Decision Guide
| Data Characteristics | Try First | Also Consider |
|---|---|---|
| Tabular, < 10K rows | Random Forest, XGBoost | Logistic/Linear Regression |
| Tabular, > 10K rows | XGBoost, LightGBM | CatBoost, Neural Network |
| High dimensionality | Lasso/Ridge, SVM | Random Forest with selection |
| Time series | Prophet, ARIMA | LSTM, XGBoost with lag features |
| Text classification | Fine-tuned transformer | TF-IDF + Logistic Regression |
| Image classification | Pre-trained CNN (ResNet, EfficientNet) | Vision Transformer |
| Regression | XGBoost, Random Forest | Linear Regression, Neural Network |
| Anomaly detection | Isolation Forest | LOF, Autoencoder |

### Baseline Models (Always Start Here)
- Classification: majority class classifier, logistic regression
- Regression: mean predictor, linear regression
- Time series: naive forecast (previous value), seasonal naive

## Hyperparameter Tuning

### Strategy Selection
| Method | Compute Budget | Search Space |
|---|---|---|
| Grid Search | Low (< 100 combos) | Small, known ranges |
| Random Search | Medium | Large, uncertain ranges |
| Bayesian (Optuna) | Any | Large, expensive evaluations |
| Successive Halving | Large | Many candidates |

### Common Hyperparameters
```python
# XGBoost / LightGBM
param_space = {
    'n_estimators': [100, 300, 500, 1000],
    'max_depth': [3, 5, 7, 9],
    'learning_rate': [0.01, 0.05, 0.1],
    'subsample': [0.7, 0.8, 0.9],
    'colsample_bytree': [0.7, 0.8, 0.9],
    'min_child_weight': [1, 3, 5],
}
```

## Cross-Validation

### Strategy Selection
| Strategy | When | Code |
|---|---|---|
| K-Fold (k=5) | Default, balanced data | `KFold(n_splits=5)` |
| Stratified K-Fold | Classification, imbalanced | `StratifiedKFold(n_splits=5)` |
| Time Series Split | Temporal data | `TimeSeriesSplit(n_splits=5)` |
| Group K-Fold | Grouped observations | `GroupKFold(n_splits=5)` |
| Leave-One-Out | Very small datasets | `LeaveOneOut()` |

### Evaluation Metrics
| Task | Primary Metric | Secondary Metrics |
|---|---|---|
| Binary Classification | AUC-ROC | F1, Precision, Recall, AP |
| Multiclass | Macro F1 | Accuracy, Confusion Matrix |
| Regression | RMSE | MAE, R-squared, MAPE |
| Ranking | NDCG | MAP, MRR |
| Anomaly Detection | F1, AP | Precision@K, Recall@K |

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
- All hyperparameters
- Evaluation metrics (train and validation)
- Data version / hash
- Feature list
- Random seed
- Training duration
- Model size
- Artifacts (plots, reports, model files)

## Statistical Tests

| Question | Test | Assumption |
|---|---|---|
| Are two group means different? | t-test (independent) | Normal distribution |
| Are two group means different (non-normal)? | Mann-Whitney U | None |
| Are paired measurements different? | Paired t-test | Normal differences |
| Are 3+ group means different? | ANOVA | Normal, equal variance |
| Is there an association between categoricals? | Chi-squared | Expected freq > 5 |
| Is the distribution normal? | Shapiro-Wilk | n < 5000 |
| Are two distributions different? | Kolmogorov-Smirnov | Continuous data |

### P-Value Guidelines
- p < 0.05: statistically significant (conventional threshold)
- Always report effect size alongside p-value
- Adjust for multiple comparisons (Bonferroni, FDR)
- Statistical significance is not practical significance

## Visualization

### Plot Selection
| Data Type | Plot | Library |
|---|---|---|
| Distribution | Histogram, KDE, Box plot | seaborn |
| Comparison | Bar chart, Grouped bar | matplotlib |
| Correlation | Scatter, Heatmap | seaborn |
| Trend | Line chart | matplotlib/plotly |
| Composition | Stacked bar, Pie (max 5) | matplotlib |
| Interactive | Scatter, Line, Dashboard | plotly |

### Visualization Best Practices
- Title every plot descriptively
- Label axes with units
- Use colorblind-safe palettes (`seaborn: colorblind`)
- Start y-axis at 0 for bar charts
- Annotate key findings directly on plots
- Consistent style across the project

## Jupyter Workflow

### Notebook Structure
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

### Best Practices
- Restart and run all before sharing
- Keep cells focused and sequential
- Use markdown cells for explanations
- Extract reusable code to `.py` modules
- Version control notebooks with clear diffs (nbstripout)
- Pin all dependency versions

## Anti-Patterns

- Training on test data (data leakage)
- Feature engineering before train/test split
- Reporting training metrics as model performance
- Using accuracy on imbalanced datasets
- Tuning on test set (use validation set)
- No baseline comparison
- Cherry-picking evaluation examples
- Deploying without monitoring for data drift

## Skill Type

**FLEXIBLE** — Adapt preprocessing, modeling, and evaluation approaches to the specific data characteristics, business requirements, and compute constraints. The process phases and experiment tracking practices are strongly recommended.
