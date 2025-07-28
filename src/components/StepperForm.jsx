import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Step1CandidateInput from "./Step1CandidateInput";

const StepperForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // Add more fields if needed
  });

  const [generatedFiles, setGeneratedFiles] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          {/* 🔢 Stepper Indicator (only 1 step now) */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white">
              1
            </div>
          </div>

          {/* 👣 Step 1 Only */}
          <Step1CandidateInput
            formData={formData}
            setFormData={setFormData}
            setGeneratedFiles={setGeneratedFiles}
          />
        </div>
      </div>
    </div>
  );
};

export default StepperForm;
