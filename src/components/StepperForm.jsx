import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

// 🔄 Import your step components here (make sure the paths are correct)
import Step1CandidateInput from "./Step1CandidateInput";
import Step2GeneratePreview from "./Step2GeneratePreview";
  

const StepperForm = () => {
  const [step, setStep] = useState(1);

  // 🧠 Added missing state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // Add more fields as required by Step 1
  });

  const [generatedFiles, setGeneratedFiles] = useState([]); // For Step 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          {/* 🔢 Stepper indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                {stepNumber > 1 && (
                  <div className="flex-1 h-1 mx-4 bg-gray-200">
                    <div
                      className={`h-1 ${
                        step >= stepNumber ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                )}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= stepNumber
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* 👣 Step screens */}
          {/* 👣 Step screens */}
          {step === 1 && (
            <Step1CandidateInput
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(2)}
              setGeneratedFiles={setGeneratedFiles}
            />
          )}

          {step === 2 && (
            <Step2GeneratePreview
              files={generatedFiles}
              onBack={() => setStep(1)}
              // 🧼 Remove: onNext={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StepperForm;
