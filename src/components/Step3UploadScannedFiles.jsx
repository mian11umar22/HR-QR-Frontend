import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiUpload, FiArrowLeft } from "react-icons/fi";

const Step3UploadScannedFiles = ({ onBack, onComplete = () => {} }) => {
  const [filesData, setFilesData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPreviews, setUploadedPreviews] = useState([]);
  const [conflicts, setConflicts] = useState([]); // updated for multiple duplicates

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFilesData = selectedFiles.map((file) => ({ file }));
    setFilesData(newFilesData);
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
      filesData.forEach(({ file }) => {
        formData.append("scannedFiles", file);
      });

      // const res = await fetch("http://localhost:5000/upload-hr-page", {
      const res = await fetch(
        "https://hr-qr-production.up.railway.app/upload-hr-page",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        const { uploaded = [], duplicates = [] } = data;

        if (uploaded.length > 0) {
          toast.success("Files uploaded successfully", { id: toastId });
          const previews = uploaded.map((file) => file.fileUrl);
          setUploadedPreviews(previews);
        }

        if (duplicates.length > 0) {
          toast.dismiss(toastId);
          toast.error(`${duplicates.length} duplicate(s) detected`);
          setConflicts(duplicates);
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
    const isPDF = url.toLowerCase().endsWith(".pdf");
    return (
      <div className="border rounded p-2 bg-white shadow">
        <p className="text-sm font-medium mb-1">{label}</p>
        {isPDF ? (
          <iframe
            src={url}
            title={label}
            className="w-full h-[400px] rounded"
          />
        ) : (
          <img
            src={url}
            alt={label}
            className="w-full h-[400px] object-contain rounded"
          />
        )}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Upload Scanned Documents
          </h2>
          <p className="text-gray-600 mt-2">
            Select the scanned documents to link them correctly.
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
                    {filesData.length > 0
                      ? `${filesData.length} file(s) selected`
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

            {filesData.map((f, i) => (
              <div
                key={i}
                className="flex items-center mt-3 gap-4 border rounded px-3 py-2"
              >
                <p className="flex-1 truncate text-sm">{f.file.name}</p>
              </div>
            ))}
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
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
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

        {/* Uploaded Previews */}
        {uploadedPreviews.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-md font-semibold text-gray-700">
              Uploaded Previews:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {uploadedPreviews.map((url, idx) =>
                renderPreview(url, `Uploaded File ${idx + 1}`)
              )}
            </div>
          </div>
        )}

        {/* Conflicts Display */}
        {conflicts.length > 0 && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              {conflicts.length} Duplicate(s) Detected
            </h3>
            {conflicts.map((conflict, i) => (
              <div key={i} className="mb-6 border p-4 rounded bg-white shadow">
                <p className="text-sm mb-3 font-medium text-gray-700">
                  File <strong>{conflict.file}</strong> already exists. Compare
                  below:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderPreview(conflict.existingFile, "Existing File")}
                  {renderPreview(conflict.newFile, "New Upload")}
                </div>
                <div className="flex justify-end mt-4 gap-3">
                  <button
                    onClick={() => {
                      toast.success("Kept existing file");
                      setConflicts((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      );
                    }}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Keep Existing
                  </button>
                  <button
                    onClick={async () => {
                      const toastId = toast.loading("Replacing file...");

                      try {
                        const qrId = conflict.qrId;
                      

                        const newFileName = conflict.newFile.split("/").pop();
                        const newFileUrl = conflict.newFile;

                        // Get hash by fetching the file and computing hash on client
                        const fileRes = await fetch(newFileUrl);
                        const fileBlob = await fileRes.blob();
                        const arrayBuffer = await fileBlob.arrayBuffer();
                        const hashBuffer = await crypto.subtle.digest(
                          "SHA-256",
                          arrayBuffer
                        );
                        const hashArray = Array.from(
                          new Uint8Array(hashBuffer)
                        );
                        const newHash = hashArray
                          .map((b) => b.toString(16).padStart(2, "0"))
                          .join("");

                        const res = await fetch(
                          // "http://localhost:5000/replace-uploaded-file",
                          "https://hr-qr-production.up.railway.app/replace-uploaded-file",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              qrId,
                              newFileName,
                              newFileUrl,
                              newHash,
                            }),
                          }
                        );

                        const data = await res.json();

                        if (res.ok) {
                          toast.success("Replaced successfully", {
                            id: toastId,
                          });
                          setConflicts((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          );
                          setUploadedPreviews((prev) => [...prev, newFileUrl]);
                        } else {
                          toast.error(data.message || "Replace failed", {
                            id: toastId,
                          });
                        }
                      } catch (err) {
                        toast.error("Error during replacement", {
                          id: toastId,
                        });
                      }
                    }}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Replace with New
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Step3UploadScannedFiles;
