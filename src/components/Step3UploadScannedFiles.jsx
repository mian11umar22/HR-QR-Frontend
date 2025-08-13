import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiUpload, FiCheckCircle, FiFile } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Step3UploadScannedFiles({
  onBack,
  onComplete = () => {},
}) {
  const [filesData, setFilesData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPreviews, setUploadedPreviews] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [showResolveButton, setShowResolveButton] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFilesData(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (filesData.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading scanned documents...");

    try {
      const formData = new FormData();
      filesData.forEach((file) => {
        formData.append("scannedFiles", file);
      });

      const res = await fetch("http://localhost:5000/upload-hr-page", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const { uploaded = [], duplicates = [] } = data;

        if (uploaded.length > 0) {
          toast.success("Files uploaded successfully ✅", { id: toastId });
          setUploadedPreviews(uploaded.map((f) => f.fileUrl));
        }

        if (duplicates.length > 0) {
          toast.dismiss(toastId);
          toast.error(`${duplicates.length} duplicate(s) detected`);
          setConflicts(
            duplicates.map((d) => ({
              ...d,
              existingFile: d.existingFileUrl,
              newFile: d.newFileUrl,
            }))
          );
          setShowResolveButton(true);
        }

        if (uploaded.length > 0) onComplete();
      } else {
        toast.error(data.message || "Upload failed", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred while uploading", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = (url, label) => {
    if (!url?.startsWith("http")) {
      return (
        <div className="border-2 border-dashed border-red-300 rounded-xl p-6 bg-red-50 text-red-600 text-center">
          ⚠️ Invalid file URL
        </div>
      );
    }

    const isPDF = url.toLowerCase().includes(".pdf");

    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white text-sm font-semibold flex items-center gap-2">
          <FiFile />
          {label}
        </div>
        {isPDF ? (
          <iframe
            src={`${url}#toolbar=0`}
            title={label}
            className="w-full h-[300px]"
          />
        ) : (
          <img
            src={url}
            alt={label}
            className="w-full h-[300px] object-contain"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Document Upload Card */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiUpload className="text-purple-500" />
            Document Upload
          </h3>
          <p className="text-sm text-gray-500">
            Upload scanned documents or images with QR codes
          </p>
        </div>

        <div className="p-6">
          {/* Drag & Drop */}
          <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition">
            <FiUpload className="mx-auto text-3xl text-purple-500 mb-2" />
            <p className="text-gray-600">
              Drag & drop multiple files here, or{" "}
              <span className="text-purple-600 underline">browse</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Supports: PDF, PNG, JPG, JPEG (Max 10MB each)
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* File list */}
          {filesData.length > 0 && (
            <div className="mt-4 space-y-2">
              {filesData.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className={`px-6 py-3 font-semibold rounded-lg shadow transition text-white ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Uploaded Previews */}
      {uploadedPreviews.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Uploaded Files
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedPreviews.map((url, idx) =>
              renderPreview(url, `File ${idx + 1}`)
            )}
          </div>
        </div>
      )}

      {/* Resolve Duplicates */}
      {showResolveButton && conflicts.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-6 text-center">
          <p className="font-semibold text-yellow-800 mb-2">
            ⚠️ {conflicts.length} duplicate file(s) detected
          </p>
          <button
            onClick={() => {
              localStorage.setItem("conflicts", JSON.stringify(conflicts));
              navigate("/resolve-duplicates");
            }}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition"
          >
            Resolve Duplicates
          </button>
        </div>
      )}
    </div>
  );
}
