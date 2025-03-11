import Link from "next/link";
import React from "react";

const Home: React.FC = () => {
  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/images/421837.jpg')",
      }}
    >
      <div className="bg-black bg-opacity-50 p-6 sm:p-8 lg:p-10 rounded-xl text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Welcome to the Credit Scoring App
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6">
          Your go-to solution for monitoring and predicting loan approvals.
        </p>
        <Link href="/dashboard">
          <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm sm:text-base lg:text-lg">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
};

export default Home;
