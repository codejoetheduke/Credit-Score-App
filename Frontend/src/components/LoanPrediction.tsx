"use client";
import React from "react";
import CountUp from "react-countup";
import Link from "next/link";

const Dashboard: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url(images/money1.jpg)",
      }}
    >
      <div className="bg-black bg-opacity-50 min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-full sm:w-64 bg-indigo-600 text-white flex flex-col p-4 sm:block hidden">
          <h2 className="text-2xl font-bold mb-6">Credit Scoring Dashboard</h2>
          <nav className="space-y-4">
            <a
              href="#overview"
              className="block py-2 px-4 rounded hover:bg-indigo-500"
            >
              Overview
            </a>
            <a
              href="#creditscore"
              className="block py-2 px-4 rounded hover:bg-indigo-500"
            >
              Credit Score Prediction
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100">
              Welcome to Your Credit Scoring Dashboard
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">
              Monitor and predict loan approvals based on credit scoring.
            </p>
          </header>

          {/* Content Sections */}
          <section id="overview" className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-200 mb-4">
              Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-80 rounded-lg shadow p-4">
                <h3 className="text-xl font-bold text-indigo-600">
                  Total Applications
                </h3>
                <p className="text-3xl font-bold">
                  <CountUp start={0} end={1245} duration={2} />
                </p>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg shadow p-4">
                <h3 className="text-xl font-bold text-indigo-600">
                  Approval Rate
                </h3>
                <p className="text-3xl font-bold">
                  <CountUp start={0} end={89} duration={2} suffix="%" />
                </p>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg shadow p-4">
                <h3 className="text-xl font-bold text-indigo-600">
                  Pending Reviews
                </h3>
                <p className="text-3xl font-bold">
                  <CountUp start={0} end={87} duration={2} />
                </p>
              </div>
            </div>
          </section>

          <section id="creditscore" className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-200 mb-4">
              Credit Score Prediction
            </h2>
            <div className="bg-white bg-opacity-80 rounded-lg shadow p-6">
              <p className="text-gray-700 text-base sm:text-lg">
                Enter the necessary details to predict the credit score of a
                loan applicant.
              </p>
              {/* Add form elements or interactive components here */}
              <Link href="/predictions">
                <button className="mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                  Predict Credit Score
                </button>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
