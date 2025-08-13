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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            borderRadius: "16px",
            padding: "16px 24px",
            fontWeight: "600",
            fontSize: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
      />

      <div className="max-w-md mx-auto transform transition-all duration-700 hover:scale-[1.02] relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
          {/* Glassmorphism effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm"></div>

          <div className="relative z-10 p-8">
          
            {/* 🔢 Stepper Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl transform transition-all duration-300 hover:scale-110">
                  <span className="text-2xl font-bold">1</span>
                </div>

                {/* Animated ring around the step */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping opacity-20"></div>
                <div className="absolute inset-2 rounded-full border-2 border-blue-400 animate-pulse"></div>
              </div>
            </div>

           

            {/* 👣 Step 1 Content */}
            <div className="transform transition-all duration-500 animate-fade-in">
              <Step1CandidateInput
                formData={formData}
                setFormData={setFormData}
                setGeneratedFiles={setGeneratedFiles}
              />
            </div>
          </div>

          {/* Decorative gradient borders */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
        </div>
      </div>

      {/* Floating elements */}
      <div
        className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="absolute top-40 right-16 w-3 h-3 bg-indigo-400/30 rounded-full animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-32 left-20 w-5 h-5 bg-purple-400/30 rounded-full animate-bounce"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 right-12 w-2 h-2 bg-pink-400/30 rounded-full animate-bounce"
        style={{ animationDelay: "3s" }}
      ></div>
    </div>
  );
};

export default StepperForm;
