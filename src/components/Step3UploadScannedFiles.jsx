import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUpload, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const Step3UploadScannedFiles = ({ onBack, onComplete = () => {} }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading scanned documents...");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("scannedFiles", file));

      const res = await fetch(
        "https://hr-qr-production.up.railway.app/upload-scanned",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Files uploaded successfully", { id: toastId });
        onComplete(); // Move to next step
      } else {
        toast.error(data.message || "Upload failed", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Upload Scanned Documents
        </h2>
        <p className="text-gray-600 mt-2">
          Select the scanned documents to link with their QR IDs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Files
          </label>
          <div className="flex items-center space-x-2">
            <label className="flex-1">
              <div className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <span className="text-sm text-gray-600 truncate">
                  {files.length > 0
                    ? `${files.length} file(s) selected`
                    : "Choose scanned files..."}
                </span>
                <FiUpload className="text-gray-500" />
              </div>
              <input
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>

          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isUploading ? (
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
                Uploading...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" />
                Upload Documents
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3UploadScannedFiles;
