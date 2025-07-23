import React, { useState } from "react";
import StepperForm from "./StepperForm";
import Step3UploadScannedFiles from "./Step3UploadScannedFiles";

const TabsContainer = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [uploaded, setUploaded] = useState(false); // optional status

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex justify-center space-x-4">
          <button
            className={`px-6 py-2 font-medium rounded-md ${
              activeTab === 1
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600 border border-indigo-600"
            }`}
            onClick={() => setActiveTab(1)}
          >
            📝 Form & Preview
          </button>
          <button
            className={`px-6 py-2 font-medium rounded-md ${
              activeTab === 2
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600 border border-indigo-600"
            }`}
            onClick={() => setActiveTab(2)}
          >
            📤 Upload Documents
          </button>
        </div>

        <div className="bg-white shadow rounded-md p-6">
          {activeTab === 1 ? (
            <StepperForm />
          ) : (
            <Step3UploadScannedFiles onBack={() => setActiveTab(1)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TabsContainer;
