import React, { useEffect, useState } from "react";

export default function StatsHeader() {
  const [stats, setStats] = useState({
    generatedQR: 0,
    uploadedDocs: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/stats");
        const data = await res.json();

        setStats({
          generatedQR: data.generatedQR || 0,
          uploadedDocs: data.uploadedDocs || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Generated QR Codes */}
      <div className="bg-blue-500 text-white p-4 sm:p-6 rounded-lg shadow-md text-center">
        <div className="text-2xl sm:text-3xl font-bold">
          {stats.generatedQR}
        </div>
        <div className="mt-1 text-xs sm:text-sm">Generated QR Codes</div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-purple-500 text-white p-4 sm:p-6 rounded-lg shadow-md text-center">
        <div className="text-2xl sm:text-3xl font-bold">
          {stats.uploadedDocs}
        </div>
        <div className="mt-1 text-xs sm:text-sm">Uploaded Documents</div>
      </div>
    </div>
  );
}
