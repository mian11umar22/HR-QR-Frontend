import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUpload, FiArrowLeft } from "react-icons/fi";

const Step3UploadScannedFiles = ({ onBack, onComplete = () => {} }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPreviews, setUploadedPreviews] = useState([]);

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
      console.log("Response Data:", data);

      if (res.ok) {
        toast.success("Files uploaded successfully", { id: toastId });

        const previews = data.uploaded.map((item) => item.fileUrl);
        setUploadedPreviews(previews);
        onComplete();
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
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>

          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
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

      {/* Preview section */}
      {uploadedPreviews.length > 0 && (
        <div className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Uploaded File Previews
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {uploadedPreviews.map((url, idx) =>
              url.endsWith(".pdf") ? (
                <iframe
                  key={idx}
                  src={url}
                  title={`PDF Preview ${idx}`}
                  width="100%"
                  height="500px"
                  className="border rounded"
                />
              ) : (
                <img
                  key={idx}
                  src={url}
                  alt={`File ${idx}`}
                  className="w-full max-w-md rounded shadow"
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3UploadScannedFiles;
