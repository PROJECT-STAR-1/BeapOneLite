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
  Sigma,
  DollarSign,
  Target,
} from "lucide-react";

export default function Dashboard() {
  // MOCK DATA
  const kpis = [
    {
      title: "Auto-Match Success Rate",
      value: "75.0%",
      target: "Target: >80% | 3/4 auto-matched",
      icon: TrendingUp,
      bg: "bg-yellow-50",
      border: "border-yellow-300",
      textColor: "text-yellow-700",
    },
    {
      title: "Reconciliation Lag",
      value: "7.7",
      unit: "days",
      target: "Target: ≤3 days | Avg time to finalize",
      icon: Clock,
      bg: "bg-red-50",
      border: "border-red-300",
      textColor: "text-red-700",
    },
    {
      title: "One-Click Recording Rate",
      value: "20.0%",
      target: "Target: ≤15% | 2 lines recorded",
      icon: Zap,
      bg: "bg-yellow-50",
      border: "border-yellow-300",
      textColor: "text-yellow-700",
    },
  ];

  const operationalMetrics = [
    {
      title: "Queue Size (RQS)",
      value: 4,
      target: "Target: <500 lines",
      icon: Activity,
      color: "bg-indigo-900",
    },
    {
      title: "Unreconciled Value",
      value: "₦263,650.00",
      target: "Target: <$2,000",
      icon: DollarSign,
      color: "bg-indigo-900",
    },
    {
      title: "Import Latency",
      value: "12s",
      target: "Target: <30s per 1K lines",
      icon: Zap,
      color: "bg-indigo-900",
    },
    {
      title: "Total Lines Imported",
      value: 10,
      target: "All statement lines",
      icon: Activity,
      color: "bg-gray-500",
    },
  ];

  const statusBreakdown = [
    { label: "Unmatched", value: 4, icon: AlertCircle, color: "bg-yellow-100 text-yellow-600" },
    { label: "Auto-Matched", value: 3, icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Manual-Matched", value: 1, icon: Hand, color: "bg-blue-100 text-blue-600" },
    { label: "One-Click Recorded", value: 2, icon: Bolt, color: "bg-purple-100 text-purple-600" },
    { label: "Total Matched", value: 4, icon: Activity, color: "bg-gray-100 text-gray-600" },
  ];

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
            const Icon = k.icon;
            return (
              <div
                key={index}
                className={`p-5 rounded-xl border ${k.border} ${k.bg}`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-gray-700 font-medium">{k.title}</p>
                  <Icon className={`text-xl ${k.textColor}`} />
                </div>

                <h3 className={`text-3xl font-bold mt-3 ${k.textColor}`}>
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
            const Icon = m.icon;
            return (
              <div key={index} className="p-5 bg-white shadow-sm rounded-xl border">
                <div className="flex gap-3">
                  <div className={`p-3 rounded-lg h-fit ${m.color}`}>
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
            const Icon = s.icon;
            return (
              <div
                key={index}
                className="p-5 rounded-xl border bg-white shadow-sm text-center"
              >
                <div
                  className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${s.color}`}
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
          <div className="p-6 border bg-white rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-800">Heuristic Matches (High Confidence)</h3>
            <h2 className="text-3xl font-bold mt-2">1 <span className="text-gray-500 text-xl">(25.0%)</span></h2>
            <p className="text-gray-500 text-sm mt-1">
              Rules 1 & 2: Exact/Amount Match (&gt;95% confidence)
            </p>
          </div>

          <div className="p-6 border bg-white rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-800">Learning Engine Matches</h3>
            <h2 className="text-3xl font-bold mt-2">2 <span className="text-gray-500 text-xl">(50.0%)</span></h2>
            <p className="text-gray-500 text-sm mt-1">
              Rule 3: Fuzzy/Learned Match (90–95% confidence)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
