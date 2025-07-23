import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function QRScanner() {
  const [file, setFile] = useState(null);
  const [qrResult, setQrResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const scanQr = async () => {
    if (!file) return toast.error("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const loadingToast = toast.loading("Scanning for QR code...");

      const res = await fetch(
        `https://hr-qr-production.up.railway.app/qr/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) throw new Error(data.message || "Server Error");

      setQrResult(data.qrdata);

      if (data.qrdata) {
        toast.success("QR code found!", {
          progressClassName: "toast-progress-bar",
          autoClose: 3000,
        });

        if (isValidUrl(data.qrdata)) {
          // Open URL in new tab
          window.open(data.qrdata, "_blank", "noopener,noreferrer");
        }
      } else {
        toast.info("No QR code found in the file.");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-gray-800">QR Code Scanner</h2>

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,.docx"
        onChange={(e) => {
          setFile(e.target.files[0]);
          setQrResult(null);
        }}
        className="border p-2 rounded w-full mb-4"
      />

      <button
        onClick={scanQr}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        🔍 Scan QR
      </button>

      {qrResult && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
          <span className="font-semibold">QR Data:</span>
          <div className="mt-1 break-words text-blue-600 underline cursor-pointer">
            <button
              onClick={() =>
                window.open(qrResult, "_blank", "noopener,noreferrer")
              }
              className="text-left underline text-blue-600 hover:text-blue-800"
            >
              {qrResult}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center text-gray-500">Scanning...</div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        progressStyle={{ background: "blue" }}
      />
    </div>
  );
}
