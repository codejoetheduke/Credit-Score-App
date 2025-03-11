from fastapi import FastAPI, HTTPException
from train_pipeline import feature_extraction, ThresholdWrapper
from sklearn.pipeline import make_pipeline
from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi.middleware.cors import CORSMiddleware



# Load the pipeline
pipeline = joblib.load("Models/train_pipeline.pkl")

# Create the app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["http://127.0.0.1:3000"] for specific origins in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)
# Define request schema
class LoanRequest(BaseModel):
    data: list  # List of dictionaries containing input data
    columns: list  # Column names for the data

@app.post("/predict")
async def predict(request: LoanRequest):
    try:
        # Convert request data to DataFrame
        input_df = pd.DataFrame(request.data, columns=request.columns)
        print(input_df)
        # Make predictions
        predictions = pipeline.predict(input_df)

        # Return predictions
        return {"predictions": predictions.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
