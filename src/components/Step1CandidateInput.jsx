import React, { useState } from "react";
import toast from "react-hot-toast";

export default function GenerateQRForm() {
  const [formData, setFormData] = useState({
    templateType: "",
    count: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // <-- New state for error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "count" ? parseInt(value) || "" : value,
    }));
    setError(""); // Clear error when user types
  };

  const handleGenerate = async () => {
    if (!formData.count || !formData.templateType) {
      setError("Please fill all fields"); // Show error in div
      toast.error("Please fill all fields"); // optional toast
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      const response = await fetch("http://localhost:5000/qrDocument", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName: formData.templateType,
          numberOfPages: formData.count,
        }),
      });

      if (!response.ok) throw new Error(await response.text());

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "generated_qr_batch.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF Generated Successfully ✅", { id: toastId });
      setError(""); // clear any previous errors
    } catch (err) {
      setError(err.message); // show error in div
      toast.error("Error: " + err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100 max-w-xl mx-auto w-full">
      {/* Title */}
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          QR Code Generation
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Generate multiple QR-coded pages for document authentication
        </p>
      </div>

      {/* Number of Pages */}
      <div className="mb-5">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Number of Pages (QR Codes)
        </label>
        <input
          type="number"
          name="count"
          min="1"
          max="100"
          value={formData.count}
          onChange={handleChange}
          placeholder="Enter number of pages (1-100)"
          className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-gray-700 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
          Each page will have a unique QR code for verification
        </p>
      </div>

      {/* Template Selection */}
      <div className="mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Template Selection
        </label>
        <select
          name="templateType"
          value={formData.templateType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-gray-700 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Select a template</option>
          <option value="template1">🎯 Default Template</option>
          <option value="template2">📱 QR Only Template</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 text-sm text-red-600 font-medium">⚠️ {error}</div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition text-sm sm:text-base ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
            Generating...
          </div>
        ) : (
          <>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3M5 12h14"
              />
            </svg>
            Generate QR Codes
          </>
        )}
      </button>
    </div>
  );
}
