import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Step1CandidateInput = ({
  formData,
  setFormData,
  onNext,
  setGeneratedFiles,
}) => {
  const [loading, setLoading] = useState(false);

  // Set default form values on mount
  useEffect(() => {
    setFormData((prev) => ({
      count: prev?.count ?? 1,
      templateType: prev?.templateType ?? "template",
    }));
  }, [setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "count" ? parseInt(value) : value,
    }));
  };

  const handleGenerate = async () => {
    if (!formData.count || formData.count < 1) {
      toast.error("Please enter a valid number of candidates");
      return;
    }

    if (!formData.templateType) {
      toast.error("Please select a template type");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Generating QR documents...");

    try {
      const response = await fetch(
        "https://hr-qr-production.up.railway.app/qrDocument",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate documents");
      }

      const data = await response.json();
      setGeneratedFiles(data.files);
      setFormData((prev) => ({ ...prev, files: data.files })); // ⬅️ Track for "Continue" enable
      toast.success(`${data.files.length} documents generated successfully!`, {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate QR documents.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Document Generation
      </h2>
      <p className="text-gray-600 mb-6">
        Enter the details below to generate QR documents
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Candidates
          </label>
          <input
            type="number"
            name="count"
            value={formData.count}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Template Type
          </label>
          <select
            name="templateType"
            value={formData.templateType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="template">Default Template</option>
            <option value="qr-only">QR Only Template</option>
          </select>
        </div>
      </div>

      {/* 🔘 Button Row */}
      <div className="flex justify-between items-center space-x-4 pt-4">
        {/* Generate QR Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Generate QR Documents"
          )}
        </button>

        {/* Continue Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={
            !formData?.files ||
            !Array.isArray(formData.files) ||
            formData.files.length === 0
          }
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
            formData?.files?.length > 0
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Preview
        </button>
      </div>
    </form>
  );
};

export default Step1CandidateInput;
