'use client'
import React, { useState, useEffect } from "react";
import { LayoutDashboard, ListChecks, Upload, History, Loader2, RefreshCcw, AlertCircle } from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";
import Dashboard from "@/component/BeapOneLite/BankReconciliation/Dashboard";
import Queue from "@/component/BeapOneLite/BankReconciliation/Queue";
import ImportBankStatement from "@/component/BeapOneLite/BankReconciliation/Import";
import AuditLog from "@/component/BeapOneLite/BankReconciliation/AuditLog";

// Define a simple structure for the initial state
const initialReconciliationData = {
  moduleInfo: { name: "Loading..." },
  dashboard: {},
  queue: {},
  import: {},
  auditLog: {}
};

// --- CONSTANTS FOR UI/PRESENTATION (NOT IN JSON) ---
const MODULE_BADGE_CLASSES = "bg-indigo-900 text-yellow-300";

// --- NEW LOADING UI COMPONENT ---
function LoadingUI({ moduleName }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-10 bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Domain-specific Icon Spinner */}
            <RefreshCcw 
                size={48} 
                className="text-indigo-600 animate-spin-slow transition-colors duration-500 ease-in-out" 
            />
            <h3 className="mt-6 text-xl font-semibold text-gray-800">
                Loading Reconciliation Engine
            </h3>
            <p className="text-gray-500 mt-2 text-center max-w-sm">
                Fetching the latest financial data and system configurations.
                <span className="block mt-1 text-sm text-indigo-500">
                    Module: {moduleName}
                </span>
            </p>
            {/* Optional: Add a simple progress bar or loader indicator */}
            <div className="w-40 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div className="w-1/2 h-full bg-indigo-500 animate-pulse"></div>
            </div>
        </div>
    );
}

// Custom animation utility (if Tailwind allows) or use a custom CSS class for "animate-spin-slow"

export default function ReconciliationPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reconciliationData, setReconciliationData] = useState(initialReconciliationData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // All tabs mapped with icons (Icons are UI, kept here)
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "queue", label: "Queue", icon: ListChecks },
    { id: "import", label: "Import", icon: Upload },
    { id: "audit-log", label: "Audit Log", icon: History }
  ];

  // --- DATA FETCHING EFFECT ---
  useEffect(() => {
    async function fetchData() {
      // Simulate network delay for the beautiful UI to show
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      setIsLoading(true);
      setError(null);
      try {
        // Fetch data from the API route
        // Assuming '/api/beapOnelite/bankreconciliation' returns the JSON data
        const response = await fetch('/api/beapOnelite/bankreconciliation');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setReconciliationData(data); 
        
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Failed to load reconciliation data. Please check the API route.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []); 

  // Render content passing the relevant fetched data as props
  const renderContent = () => {
    // Pass the relevant data to each child component
    switch (activeTab) {
      case "dashboard":
        return <Dashboard data={reconciliationData.dashboard} />;
      case "queue":
        return <Queue data={reconciliationData.queue}/>;
      case "import":
        return <ImportBankStatement data={reconciliationData.import} />;
      case "audit-log":
        return <AuditLog data={reconciliationData.auditLog} />;
      default:
        return null;
    }
  };

  const { moduleInfo } = reconciliationData;

  // --- RENDERING LOADING/ERROR STATES (USING NEW UI) ---
  if (isLoading) {
    return (
      <Layout>
        <div className="p-10 w-full">
            <LoadingUI moduleName={moduleInfo.name} />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-10 w-full flex items-center justify-center min-h-[400px]">
            <div className="p-8 border border-red-300 bg-red-50 rounded-xl text-center">
                <AlertCircle size={24} className="text-red-600 mx-auto mb-3"/>
                <div className="text-lg font-medium text-red-700">Data Loading Error</div>
                <div className="text-sm text-red-600 mt-1">Error: {error}</div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Try Reloading
                </button>
            </div>
        </div>
      </Layout>
    );
  }
  

  return (
    <Layout>
      <div className="w-full p-6">
        {/* PAGE HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Bank & Mobile Money Reconciliation
            </h2>
            <p className="text-sm text-gray-500">
              Auto-matching engine with 4-tier heuristic
            </p>
          </div>

          {/* M4 MODULE BADGE  */}
          <div className={`${MODULE_BADGE_CLASSES} text-xs px-4 py-1 rounded-full font-medium`}>
            {moduleInfo.name}
          </div>
        </div>

        {/* TABS */}
        <div className="mt-6 flex bg-gray-100 rounded-xl p-1 justify-around w-full">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg text-sm
                transition-all w-full justify-center font-medium
                ${activeTab === id ? "bg-white shadow-sm font-medium" : "text-gray-600"}
              `}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div>{renderContent()}</div>
      </div>
    </Layout>
  );
}