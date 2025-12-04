'use client'
import React, { useState } from "react";
import { LayoutDashboard, ListChecks, Upload, History } from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";
import Dashboard from "@/component/BeapOneLite/BankReconciliation/Dashboard";
import Queue from "@/component/BeapOneLite/BankReconciliation/Queue";
import ImportBankStatement from "@/component/BeapOneLite/BankReconciliation/Import";
import AuditLog from "@/component/BeapOneLite/BankReconciliation/AuditLog";

export default function ReconciliationPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // All tabs mapped with icons
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "queue", label: "Queue", icon: ListChecks },
    { id: "import", label: "Import", icon: Upload },
    { id: "audit-log", label: "Audit Log", icon: History }
  ];

  // Render via switch case
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard/>;
      case "queue":
        return <Queue/>;
      case "import":
        return <ImportBankStatement/>;
      case "audit-log":
        return <AuditLog/>;
      default:
        return null;
    }
  };

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
            Auto-matching engine with 4-tier heuristic algorithm for Lagos Main Branch
          </p>
        </div>

        {/* M4 MODULE BADGE */}
        <div className="bg-indigo-900  text-xs px-4 py-1 rounded-full font-medium text-yellow-300">
          M4 MODULE - STANDARD TIER
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
