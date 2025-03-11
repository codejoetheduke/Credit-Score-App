"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import axios from "axios"; // Add axios for making HTTP requests
import Link from "next/link";

const PredictionPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      ID: "",
      disbursement_date: "",
      due_date: "",
      country_id: "",
      Total_Amount: 0,
      Total_Amount_to_Repay: 0,
      Amount_Funded_By_Lender: 0,
      Lender_portion_to_be_repaid: 0,
      Lender_portion_Funded: 0,
      duration: 0,
      loan_type: "",
      New_versus_Repeat: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      setPrediction(null);
      setConfidence(null);

      try {
        // Convert numeric fields to numbers and prepare payload
        const cleanedValues = {
          ...values,
          Total_Amount: Number(values.Total_Amount),
          Total_Amount_to_Repay: Number(values.Total_Amount_to_Repay),
          Amount_Funded_By_Lender: Number(values.Amount_Funded_By_Lender),
          Lender_portion_to_be_repaid: Number(
            values.Lender_portion_to_be_repaid
          ),
          Lender_portion_Funded: Number(values.Lender_portion_Funded),
          duration: Number(values.duration),
        };

        const payload = {
          data: [cleanedValues],
          columns: Object.keys(cleanedValues),
        };

        console.log("Payload being sent:", payload);

        const response = await axios.post(
          "http://127.0.0.1:8000/predict",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const predictions = response.data.predictions;
        console.log("Predictions received:", predictions);

        setPrediction(predictions[0]);
        setConfidence(92); // Example confidence (replace with backend response if applicable)
      } catch (error) {
        console.error(
          "Error predicting loan status:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
        setIsModalOpen(true); // Show prediction result modal
      }
    },
  });

  return (
    <div
      className="flex flex-col justify-between"
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        backgroundImage: "url(images/money2.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black bg-opacity-50 flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          {/* Home Button */}
          <Link href="/">
            <div className="flex justify-start mb-6">
              <button className="py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                Home
              </button>
            </div>
          </Link>
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">
              Loan Prediction
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              Fill in the details below to predict the loan approval decision
              and confidence level.
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Object.keys(formik.values).map((key) => (
                  <div key={key} className="flex flex-col">
                    <label
                      htmlFor={key}
                      className="text-sm font-semibold text-gray-700 mb-2"
                    >
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={formik.values[key]}
                      onChange={formik.handleChange}
                      className="text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 mt-4"
              >
                Predict Loan Approval
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Loading Animation */}
      {isLoading && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          style={{ minHeight: "100vh", overflow: "hidden" }}
        >
          <motion.div
            className="w-24 h-24 border-8 border-t-8 border-white rounded-full border-r-indigo-600 border-b-indigo-600"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
        </div>
      )}

      {/* Modal Popup for Prediction Result */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          style={{ maxHeight: "100vh", overflow: "hidden" }}
        >
          <div className="bg-white p-6 rounded-lg w-96 max-h-full overflow-y-auto">
            <h3 className="text-2xl font-semibold text-gray-800">
              Prediction Result
            </h3>
            <p className="text-xl text-indigo-600">
              Loan Status:{" "}
              <strong>{prediction == 0 ? "Approved" : "Disapproved"}</strong>
            </p>
            {confidence !== null && (
              <div className="mt-4">
                <p className="text-lg">Confidence Level: {confidence}%</p>
                <div className="bg-indigo-200 rounded-full h-2 my-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
                <p className="text-gray-700">
                  {prediction == 0
                    ? "Explanation: Based on the provided data, the model has high confidence in that the person will pay off the loan."
                    : "Explanation: Based on the provided data, the model has high confidence in that the person will pay not off the loan and is advisable not to give the loan out."}
                </p>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
