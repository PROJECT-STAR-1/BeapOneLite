'use client';

import { useState, useCallback } from "react";
import {
  Upload,
  Smartphone,
  FileText,
  CheckCircle,
  Calendar,
  Building,
} from "lucide-react";

// --- ICON/COLOR MAPPING (UI Logic, Stored in Component) ---
const providerIconMap = (type) => {
  switch (type) {
    case "bank":
      return <Building className="w-4 h-4 text-purple-700" />;
    case "mobile":
      return <Smartphone className="w-4 h-4 text-green-600" />;
    case "file":
      return <FileText className="w-4 h-4 text-gray-700" />;
    default:
      return null;
  }
};

const historyIconMap = (type) => {
  if (type === "bank") return <Building size={14} className="text-gray-500" />;
  if (type === "mobile") return <Smartphone size={14} className="text-green-600" />;
  return <FileText size={14} className="text-gray-500" />;
};


// Define the component to accept 'data' as a prop
export default function ImportBankStatement({ data }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Extract data from props
  const providers = data?.supportedProviders || [];
  const history = data?.importHistory || [];
  const importSteps = data?.importProcessSteps || [];

  // Drag/drop logic
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const chooseFile = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  return (
    <div className="w-full  mx-auto p-6">
      {/* ---------- IMPORT SECTION ---------- */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white/95">
      <h2 className="text-xl font-semibold mb-1 flex items-center gap-2"><Upload size={26}/> Import Bank Statement</h2>
      <p className="text-gray-600 mb-6">
        Upload CSV statements from your bank or mobile money provider for automatic reconciliation
      </p>

      {/* Provider dropdown */}
      <label className="block font-semibold mb-1">
        Bank / Mobile Money Provider *
      </label>
      <div className="relative mb-6">
        <select className="w-full border rounded-md px-3 py-2 pr-10 appearance-none focus:ring focus:ring-blue-200 bg-white">
          <option>Select your bank or provider</option>
          {/* Dynamically render providers from fetched data */}
          {providers.map((p, idx) => (
            <option key={idx}>{p.label}</option>
          ))}
        </select>
        <span className="absolute right-3 top-3 pointer-events-none text-gray-500">
          ▼
        </span>
      </div>

      {/* Drag/drop upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition 
        ${dragging ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
      >
        <Upload className="mx-auto mb-3 text-gray-500" size={40} />
        <p className="text-gray-700 mb-2">
          Drag and drop your CSV file here, or click to browse
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Supports .csv files up to 10MB
        </p>

        <label className="cursor-pointer">
          <span className="px-4 py-2 bg-gray-50 border border-gray-300  text-gray-900 font-medium rounded-md shadow hover:bg-gray-100">
            Browse Files
          </span>
          <input type="file" className="hidden" accept=".csv" onChange={chooseFile} />
        </label>

        {file && (
          <p className="text-sm text-green-600 mt-4">
            Selected file: <strong>{file.name}</strong>
          </p>
        )}
      </div>
      </div>

      {/* Template download */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex justify-between">
        <p className="font-medium mb-2 flex flex-col gap-1 text-blue-900">Need a CSV template? <span className="text-blue-700 text-sm"> Download our standard format guide</span></p>

          <button className="px-4 py-2 h-8 bg-white border border-gray-100 rounded-md shadow text-sm font-medium hover:bg-gray-100 flex items-center">
            Download Template
          </button>
        
      </div>

      {/* Supported providers */}
      <div className="mt-10 border border-gray-200 rounded-lg bg-white/95 p-4">
        <h3 className="text-lg font-semibold mb-4">Supported Providers</h3>
        <p className="text-gray-600 mb-4">
          Auto-parsing available for these financial institutions
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Dynamically render supported providers from fetched data */}
          {providers.map((p, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border rounded-md px-4 py-3 bg-white shadow-sm hover:bg-gray-50 cursor-pointer"
            >
              {providerIconMap(p.type)}
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- IMPORT HISTORY ---------- */}
      <div className="w-full mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-1">Import History</h2>
        <p className="text-gray-600 mb-6">
          Recent statement imports and processing status
        </p>

        <div className="space-y-4">
          {/* Dynamically render history from fetched data */}
          {history.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-5 rounded-lg border bg-white shadow-sm hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-600" size={22} />

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium">{item.filename}</p>
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-md">
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm gap-4">
                    <div className="flex items-center gap-1">
                      {historyIconMap(item.type)}
                      {item.provider}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">$</span>
                      {item.account}
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-500" />
                      {item.dateRange}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right flex gap-9">
                <div>
                  <p className="text-gray-700 text-sm">
                    {item.transactions} transactions
                  </p>
                  <p className="text-green-600 text-sm">
                    {item.autoMatched} auto-matched
                  </p>
                </div>

                <button className="text-gray-800  text-sm font-medium hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 mt-1">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* HOW STATEMENT IMPORT WORKS */}
      <div className="mt-8 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          How Statement Import Works
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8 text-sm">
          {/* Static class applied here */}
          {importSteps.map((step, idx) => (
            <div key={idx}>
              <p className={`font-semibold text-yellow-300 mb-1`}>
                {idx + 1}. {step.title}
              </p>
              <p className="text-indigo-100">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}