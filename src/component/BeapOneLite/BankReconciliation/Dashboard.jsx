'use client'
import React from "react";
import {
  TrendingUp,
  Clock,
  Zap,
  Activity,
  AlertCircle,
  CheckCircle,
  Hand,
  Bolt,
  DollarSign,
  Target,
} from "lucide-react";

// Map data titles to specific icons and colors (UI elements)
const kpiMap = {
  "Auto-Match Success Rate": { icon: TrendingUp, bg: "bg-yellow-50", border: "border-yellow-300", textColor: "text-yellow-700" },
  "Reconciliation Lag": { icon: Clock, bg: "bg-red-50", border: "border-red-300", textColor: "text-red-700" },
  "One-Click Recording Rate": { icon: Zap, bg: "bg-yellow-50", border: "border-yellow-300", textColor: "text-yellow-700" },
};

const operationalMap = {
  "Queue Size (RQS)": { icon: Activity, color: "bg-indigo-900" },
  "Unreconciled Value": { icon: DollarSign, color: "bg-indigo-900" },
  "Import Latency": { icon: Zap, color: "bg-indigo-900" },
  "Total Lines Imported": { icon: Activity, color: "bg-gray-500" },
};

const statusMap = {
  "Unmatched": { icon: AlertCircle, color: "bg-yellow-100 text-yellow-600" },
  "Auto-Matched": { icon: CheckCircle, color: "bg-green-100 text-green-600" },
  "Manual-Matched": { icon: Hand, color: "bg-blue-100 text-blue-600" },
  "One-Click Recorded": { icon: Bolt, color: "bg-purple-100 text-purple-600" },
  // Total Matched data is usually calculated, but here we use a placeholder icon/color
  "Total Matched": { icon: Activity, color: "bg-gray-100 text-gray-600" }, 
};

// Define the component to accept 'data' as a prop
export default function Dashboard({ data }) {
  // Use default empty arrays if data is still loading or undefined
  const kpis = data?.kpis || [];
  const operationalMetrics = data?.operationalMetrics || [];
  const statusBreakdown = data?.statusBreakdown || [];
  const matchingEnginePerformance = data?.matchingEnginePerformance || [];

  return (
    <div className="p-6 w-full">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Reconciliation Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Real-time metrics and KPI performance for M4 Bank & Mobile Money Reconciliation
        </p>
      </div>

      {/* KPI SECTION */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Target size={18} className="text-indigo-700" />
          Key Performance Indicators
          <span className="text-sm text-gray-500">(Strategic Targets)</span>
        </h2>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {kpis.map((k, index) => {
            const ui = kpiMap[k.title] || {};
            const Icon = ui.icon;
            
            return (
              <div
                key={index}
                className={`p-5 rounded-xl border ${ui.border} ${ui.bg}`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-gray-700 font-medium">{k.title}</p>
                  <Icon className={`text-xl ${ui.textColor}`} />
                </div>

                <h3 className={`text-3xl font-bold mt-3 ${ui.textColor}`}>
                  {k.value}
                  {k.unit && (
                    <span className="text-sm font-medium text-gray-600 ml-1">
                      {k.unit}
                    </span>
                  )}
                </h3>

                <p className="text-xs text-gray-500 mt-2">{k.target}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* OPERATIONAL METRICS */}
      <div className="mt-10">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Activity size={18} className="text-indigo-700" />
          Operational Metrics
          <span className="text-sm text-gray-500">(Real-Time)</span>
        </h2>

        <div className="grid grid-cols-4 gap-4 mt-4">
          {operationalMetrics.map((m, index) => {
            const ui = operationalMap[m.title] || {};
            const Icon = ui.icon;
            
            return (
              <div key={index} className="p-5 bg-white shadow-sm rounded-xl border">
                <div className="flex gap-3">
                  <div className={`p-3 rounded-lg h-fit ${ui.color}`}>
                    <Icon size={18} className="text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{m.value}</h3>
                    <p className="text-xs text-gray-500">{m.target}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-gray-700">{m.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* STATUS BREAKDOWN */}
      <div className="mt-14">
        <h2 className="font-semibold text-lg">Reconciliation Status Breakdown</h2>

        <div className="grid grid-cols-5 gap-4 mt-4">
          {statusBreakdown.map((s, index) => {
            const ui = statusMap[s.label] || {};
            const Icon = ui.icon;
            
            return (
              <div
                key={index}
                className="p-5 rounded-xl border bg-white shadow-sm text-center"
              >
                <div
                  className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${ui.color}`}
                >
                  <Icon size={20} />
                </div>

                <h3 className="text-2xl font-semibold mt-3">{s.value}</h3>
                <p className="text-sm text-gray-600">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MATCHING ENGINE PERFORMANCE */}
      <div className="mt-14">
        <h2 className="font-semibold text-lg">Matching Engine Performance</h2>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {matchingEnginePerformance.map((p, index) => (
            <div key={index} className="p-6 border bg-white rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-800">{p.title}</h3>
              <h2 className="text-3xl font-bold mt-2">
                {p.count}{" "}
                <span className="text-gray-500 text-xl">({p.percentage})</span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}