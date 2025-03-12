import numpy as np
import pandas as pd
import os
import joblib
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import FunctionTransformer, TargetEncoder
from sklearn.compose import make_column_transformer, make_column_selector
from xgboost import XGBClassifier
from sklearn.base import BaseEstimator, TransformerMixin

# Load data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get script directory
dataset_path = os.path.join(BASE_DIR, "Datasets", "Train.csv")
indicator_path = os.path.join(BASE_DIR, "Datasets", "economic_indicators.csv")

train = pd.read_csv(dataset_path)
# test = pd.read_csv("Datasets\Test.csv")
indicator = pd.read_csv(indicator_path)

X, y = train.drop(columns='target'), train['target']

# Feature extraction
def feature_extraction(df, indicator):
    df = df.copy()

    # Discrete features
    df[['disbursement_year', 'disbursement_month', 'disbursement_day']] = df['disbursement_date'].str.split('-', expand=True).astype(np.int64)
    df[['due_year', 'due_month', 'due_day']] = df['due_date'].str.split('-', expand=True).astype(np.int64)
    df['loan_term'] = df['duration'].apply(
        lambda x:
            0 if x <= 14 else
            1 if x <= 30 else
            2 if x <= 365 else
            3
    )
    df['loan_type'] = df['loan_type'].apply(lambda x: x[5:]).astype(np.int64)
    df['New_versus_Repeat'] = df['New_versus_Repeat'].apply(lambda x: 1 if x == "New" else 0)

    # Continuous features
    df["Repay_Rate"] = (df["Total_Amount_to_Repay"] + 1) / (df["Total_Amount"] + 1)
    df["Lender_Repay_Rate"] = (df["Lender_portion_to_be_repaid"] + 1) / (df["Amount_Funded_By_Lender"] + 1)
    df["duration"] = df["duration"].astype(np.float64)

    # Economic indicators
    ind_dict = indicator.set_index(["Country", "Indicator"]).T.to_dict()
    ind_list = ["Inflation, consumer prices (annual %)", "Unemployment rate", "Official exchange rate (LCU per US$, period average)", "Deposit interest rate (%)"]

    for ind in ind_list:
        df[ind] = df.apply(lambda row: ind_dict[(row['country_id'], ind)][f"YR{row['disbursement_year'] - 1}"], axis=1)

    df.rename(columns={
        "Inflation, consumer prices (annual %)": "Inflation",
        "Unemployment rate": "Unemployment",
        "Official exchange rate (LCU per US$, period average)": "Exchange_Rate",
        "Deposit interest rate (%)": "Deposit_interest_rate"
    }, inplace=True)

    # Drop columns
    df = df.drop(columns=[
        'disbursement_date', 'due_date', 'country_id', "ID",
    ])

    return df

extraction = FunctionTransformer(feature_extraction, kw_args={"indicator": indicator})

# Feature selection
def feature_selection(df):
    continuous_columns = [
        'Total_Amount_to_Repay',
        'Lender_portion_Funded',
        'Lender_portion_to_be_repaid',
        'Repay_Rate',
        'Inflation',
        'duration',
    ]

    discrete_columns = [
        'disbursement_month',
    ]

    return df[continuous_columns + discrete_columns]

selection = FunctionTransformer(feature_selection)

# Preprocessing pipeline
preprocess = make_pipeline(
    extraction,
    selection,
    make_column_transformer(
        (TargetEncoder(), make_column_selector(dtype_include='int')),
        remainder='passthrough'
    )
)

# Fit preprocessing
preprocess.fit(X, y)

# Model parameters and training
opt_params = {
    'max_depth': 10,
    'max_leaves': 0,
    'n_estimators': 2000,
    'learning_rate': 0.10,
    'random_state': 42,
    'verbose': -1,
    'n_jobs': -1,
    'early_stopping_rounds': 10,
    'eval_metric': 'logloss',
}

fit_params = {
    'eval_set': [(preprocess.transform(X), y), (preprocess.transform(X), y)],
    'verbose': False
}

model = XGBClassifier(**opt_params)
model.fit(preprocess.transform(X), y, **fit_params)

# Custom prediction threshold
threshold = 0.45
model.predict = lambda X: (model.predict_proba(X)[:, 1] > threshold).astype(int)

class ThresholdWrapper(BaseEstimator, TransformerMixin):
    def __init__(self, model, threshold=0.45):
        self.model = model
        self.threshold = threshold

    def fit(self, X, y, **fit_params):
        self.model.fit(X, y, **fit_params)
        return self

    def predict(self, X):
        proba = self.model.predict_proba(X)[:, 1]
        return (proba > self.threshold).astype(int)

    def predict_proba(self, X):
        return self.model.predict_proba(X)
      
model = ThresholdWrapper(XGBClassifier(**opt_params), threshold=0.45)
model.fit(preprocess.transform(X), y, **fit_params)

# Save pipeline
pipeline = make_pipeline(preprocess, model)
os.makedirs("Models", exist_ok=True)
joblib.dump(pipeline, os.path.join("Models", "train_pipeline.pkl"))
print("Pipeline saved as train_pipeline.pkl")
