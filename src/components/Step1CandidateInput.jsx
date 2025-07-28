import React, { useState } from "react";
import toast from "react-hot-toast";

export default function GenerateQRForm() {
  const [formData, setFormData] = useState({
    templateType: "template1",
    count: 1,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "count" ? parseInt(value) : value,
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    const toastId = toast.loading("Generating PDF...");
    try {
      // const response = await fetch("http://localhost:5000/qrDocument", {
      const response = await fetch(
        "hr-qr-production.up.railway.app/qrDocument",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            templateName: formData.templateType,
            numberOfPages: formData.count,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

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
    } catch (err) {
      console.error("❌ Error generating PDF:", err.message);
      toast.error("Error: " + err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Generate QR Code Batch</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Select Template</label>
        <select
          name="templateType"
          value={formData.templateType}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="template1">Default Template</option>
          <option value="template2">QR Only Template</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Number of Pages</label>
        <input
          type="number"
          name="count"
          value={formData.count}
          onChange={handleChange}
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
      >
        {loading ? "Generating..." : "Generate PDF with QR"}
      </button>
    </div>
  );
}
