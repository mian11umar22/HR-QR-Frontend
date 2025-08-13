import React, { useState } from "react";
import StatsHeader from "./StatsHeader";
import Step1CandidateInput from "./Step1CandidateInput";
import InfoCards from "./InfoCards";
import Step3UploadScannedFiles from "./Step3UploadScannedFiles";
import { QrCode, Upload } from "lucide-react"; // ✅ Removed ShieldCheck

export default function TabsContainer() {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { id: 1, label: "Generate QR Codes", icon: <QrCode size={18} /> },
    { id: 2, label: "Upload Documents", icon: <Upload size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      {/* Static Stats */}
      <StatsHeader />

      {/* Tabs Navigation */}
      <div className="flex justify-center gap-8 mb-6">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border rounded-lg transition-all ${
                active
                  ? "bg-white text-gray-900 border-gray-300 shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Generate Tab */}
        {activeTab === 1 && (
          <>
            <div className="grid grid-cols-1 gap-6">
              <Step1CandidateInput />
            </div>
            <InfoCards />
          </>
        )}

        {/* Upload Tab */}
        {activeTab === 2 && (
          <Step3UploadScannedFiles onBack={() => setActiveTab(1)} />
        )}
      </div>
    </div>
  );
}
