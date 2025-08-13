import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MdNavigateBefore, MdNavigateNext, MdWarning } from "react-icons/md";
import {
  FiCheck,
  FiRefreshCw,
  FiFile,
  FiArrowLeft,
  FiEye,
  FiAlertTriangle,
} from "react-icons/fi";

const ResolveDuplicates = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { duplicates = [] } = location.state || {};

  const [conflicts, setConflicts] = useState(duplicates);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemsPerPage = 2;

  const totalPages = Math.max(1, Math.ceil(conflicts.length / itemsPerPage));
  const currentConflicts = conflicts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    document.title = "Resolve Duplicates - HR QR System";

    if (!duplicates.length && !conflicts.length) {
      const stored = localStorage.getItem("conflicts");
      if (stored) {
        setConflicts(JSON.parse(stored));
      }
    } else if (duplicates.length) {
      localStorage.setItem("conflicts", JSON.stringify(duplicates));
    }
  }, []);

  useEffect(() => {
    if (conflicts.length === 0 && localStorage.getItem("conflicts")) {
      localStorage.removeItem("conflicts");
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [conflicts]);

  const handleReplace = async (conflict) => {
    setIsProcessing(true);
    const toastId = toast.loading(
      <div className="flex items-center">
        <FiRefreshCw className="animate-spin mr-2" />
        Replacing file...
      </div>
    );

    try {
      const formData = new FormData();
     formData.append("qrId", conflict.qrId);
     formData.append("oldHash", conflict.hash);
     formData.append("newFileUrl", conflict.newFile);

      const res = await fetch("http://localhost:5000/replace-uploaded-file", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          <div className="flex items-center">
            <FiCheck className="mr-2" />
            File replaced successfully
          </div>,
          { id: toastId }
        );

        const remaining = conflicts.filter(
          (c) => c.qrId !== conflict.qrId || c.hash !== conflict.hash
        );
        setConflicts(remaining);

        if (remaining.length === 0) {
          toast.success(
            <div className="flex items-center">
              <FiCheck className="mr-2" />
              All files resolved. Redirecting...
            </div>
          );
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        }
      } else {
        toast.error(
          <div className="flex items-center">
            <MdWarning className="mr-2" />
            {data.message || "Failed to replace file"}
          </div>,
          { id: toastId }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        <div className="flex items-center">
          <MdWarning className="mr-2" />
          An error occurred while replacing
        </div>,
        { id: toastId }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeep = (index) => {
    toast.success(
      <div className="flex items-center">
        <FiCheck className="mr-2" />
        Kept existing file
      </div>
    );
    const newList = [...conflicts];
    newList.splice((currentPage - 1) * itemsPerPage + index, 1);
    setConflicts(newList);
  };

  const PaginationControls = () => (
    <div className="flex justify-between items-center py-6 px-8 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
      <div className="flex items-center gap-2 text-gray-600">
        <FiEye className="w-4 h-4" />
        <span className="text-sm font-medium">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, conflicts.length)}-
          {Math.min(currentPage * itemsPerPage, conflicts.length)} of{" "}
          {conflicts.length} duplicates
        </span>
      </div>
      <div className="flex gap-3">
        <button
          disabled={currentPage === 1 || isProcessing}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 font-medium text-gray-700 hover:text-blue-600 shadow-sm hover:shadow-md"
        >
          <MdNavigateBefore className="text-lg" />
          Previous
        </button>
        <button
          disabled={currentPage === totalPages || isProcessing}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 font-medium text-gray-700 hover:text-blue-600 shadow-sm hover:shadow-md"
        >
          Next
          <MdNavigateNext className="text-lg" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-br from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-br from-orange-200/10 to-red-200/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
            color: "#fff",
            borderRadius: "16px",
            padding: "16px 24px",
            fontWeight: "600",
            fontSize: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-start gap-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl shadow-2xl transform transition-all duration-300 hover:rotate-6 hover:scale-110">
              <FiAlertTriangle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Resolve Duplicates
              </h1>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-gray-700">
                    {conflicts.length} duplicate{conflicts.length !== 1 && "s"}{" "}
                    detected
                  </span>
                </div>
              </div>
              <p className="text-gray-600 max-w-2xl">
                Review each duplicate file and choose the best version to keep.
                This ensures your document library stays clean and organized.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-md font-medium backdrop-blur-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Warning Banner */}
          <div className="bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 border-b border-orange-200/50 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/50 to-orange-50/50"></div>
            
         
          </div>

          <PaginationControls />

          {/* Conflicts Grid */}
          <div className="p-8 space-y-8">
            {currentConflicts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <FiCheck className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  All Done! 🎉
                </h3>
                <p className="text-lg text-gray-600">
                  No duplicates to display
                </p>
              </div>
            ) : (
              currentConflicts.map((conflict, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.01] animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Conflict Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FiFile className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Duplicate File Detected
                      </h3>
                      <p className="text-lg text-blue-600 font-semibold bg-blue-50 px-4 py-2 rounded-xl inline-block">
                        📄 {conflict.file}
                      </p>
                    </div>
                  </div>

                  {/* File Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Existing File */}
                    <div className="group">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-2xl p-4 shadow-lg">
                        <div className="flex items-center gap-3 text-white">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          </div>
                          <h4 className="text-lg font-bold">
                            📋 Existing File
                          </h4>
                        </div>
                      </div>
                      <div className="bg-white border-2 border-green-200 rounded-b-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <iframe
                          src={`${conflict.existingFile}#toolbar=0`}
                          className="h-[400px] w-full transition-all duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* New File */}
                    <div className="group">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl p-4 shadow-lg">
                        <div className="flex items-center gap-3 text-white">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          </div>
                          <h4 className="text-lg font-bold">
                            📤 New Uploaded File
                          </h4>
                        </div>
                      </div>
                      <div className="bg-white border-2 border-blue-200 rounded-b-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <iframe
                          src={`${conflict.newFile}#toolbar=0`}
                          className="h-[400px] w-full transition-all duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end mt-8 gap-4">
                    <button
                      onClick={() => handleKeep(index)}
                      disabled={isProcessing}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] font-bold text-lg shadow-lg"
                    >
                      <FiCheck className="w-5 h-5" />
                      Keep Existing
                      <span className="text-sm opacity-80">✅</span>
                    </button>
                    <button
                      onClick={() => handleReplace(conflict)}
                      disabled={isProcessing}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] font-bold text-lg shadow-lg"
                    >
                      {isProcessing ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <FiRefreshCw className="w-5 h-5" />
                      )}
                      Replace with New
                      <span className="text-sm opacity-80">🔄</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <PaginationControls />
        </div>
      </div>

      {/* Floating progress indicator */}
      {conflicts.length > 0 && (
        <div className="fixed bottom-8 left-8 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">{conflicts.length}</span>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">
                  Duplicates Remaining
                </div>
                <div className="text-xs text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolveDuplicates;
