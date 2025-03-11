const axios = require("axios");

async function getPredictions(inputData, columns) {
  try {
    const response = await axios.post("http://127.0.0.1:8000/predict", {
      data: inputData,
      columns: columns,
    });

    console.log(response.data.predictions);
    return response.data.predictions;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw error;
  }
}

// Example usage:
const inputData = [
  {
    ID: "1100000ABC",
    disbursement_date: "2022-01-01",
    due_date: "2023-01-01",
    country_id: "Kenya",
    Total_Amount: 100000000,
    Total_Amount_to_Repay: 110000000,
    Amount_Funded_By_Lender: 100000000,
    Lender_portion_to_be_repaid: 10,
    Lender_portion_Funded: 1,
    duration: 365,
    loan_type: "Type_1",
    New_versus_Repeat: "New",
  },
];
const columns = [
  "ID",
  "disbursement_date",
  "due_date",
  "country_id",
  "Total_Amount",
  "Total_Amount_to_Repay",
  "Amount_Funded_By_Lender",
  "Lender_portion_to_be_repaid",
  "Lender_portion_Funded",
  "duration",
  "loan_type",
  "New_versus_Repeat",
];

getPredictions(inputData, columns);
