"use client";

import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
   LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Check, CircleCheckBig, Clock, Database, FileText, Globe, Shield, TrendingUp, Zap } from "lucide-react";

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, PointElement
);

export default function FIRSReport() {
  // ======================
  // MOCK DATA (Replace with API later)
  // ======================
  const mockMetrics = {
    totalSubmissions: 5,
    successRate: 60,
    avgLatency: 1.49,
    totalValue: 171_400_000,
  };

  const complianceData = {
    cleared: 3,
    pending: 1,
    failed: 1,
  };

  const currencyBreakdown = {
    USD: 2,
    NGN: 1,
    EUR: 1,
    GBP: 1,
  };

  const latencyData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"],
  datasets: [
    {
      label: "Avg Latency (ms)",
      data: [1400, 1350, 1420, 1380, 1360, 1370, 1450],
      borderColor: "#10B981",
      backgroundColor: "#10B981",
      pointRadius: 5,
      pointBackgroundColor: "white",
      pointBorderColor: "#10B981",
      borderWidth: 2,
    },
    {
      label: "P95 Latency (ms)",
      data: [1700, 1650, 1750, 1690, 1655, 1680, 1800],
      borderColor: "#F59E0B",
      backgroundColor: "#F59E0B",
      pointRadius: 5,
      pointBackgroundColor: "white",
      pointBorderColor: "#F59E0B",
      borderWidth: 2,
    },
  ],
};


  // Pie chart data
  const pieData = {
    labels: ["Cleared", "Pending", "Failed"],
    datasets: [
      {
        data: [
          complianceData.cleared,
          complianceData.pending,
          complianceData.failed,
        ],
        backgroundColor: ["#10B981", "#FBBF24", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  // Bar chart data
  const barData = {
    labels: Object.keys(currencyBreakdown),
    datasets: [
      {
        label: "Transaction Volume",
        data: Object.values(currencyBreakdown),
        backgroundColor: "#1E1B4B",
        borderRadius: 6,
      },
    ],
  };


const complianceMetrics = {
  hubRouting: 100,
  fxReliability: 100,
  dataIntegrity: 100,
  minLatency: 850,
  maxLatency: 2340,
  irnIssued: 3,
};

const oStackStatus = {
  iCemHub: "OPERATIONAL",
  iDemSpokes: { active: 3, planned: 3 },
  treasuryUptime: 100,
};


  return (
    <div className="p-6 space-y-10">

      {/* ======================
          TOP METRICS CARDS
      ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total Submissions */}
        <div className="p-6 border rounded-xl shadow-sm">
          <p className="text-gray-600 font-medium flex gap-2 items-center"> <FileText size={26}/> Total Submissions</p>
          <p className="text-4xl mt-4 font-semibold">{mockMetrics.totalSubmissions}</p>
          <p className="text-sm text-gray-500 mt-1">FIRS e-invoices</p>
        </div>

        {/* Success Rate */}
        <div className="p-6 border rounded-xl shadow-sm bg-green-50">
          <p className="text-gray-600 font-medium flex items-center gap-1">
            <span> <Check size={26}/> </span> Success Rate
          </p>
          <p className="text-4xl mt-4 font-semibold text-green-600">
            {mockMetrics.successRate}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Target: &gt; 99.9%</p>
        </div>

        {/* Avg Latency */}
        <div className="p-6 border rounded-xl shadow-sm bg-blue-50">
          <p className="text-gray-600 font-medium flex items-center gap-1">
            <Zap size={26}/> Avg Latency
          </p>
          <p className="text-4xl mt-4 font-semibold text-blue-600">
            {mockMetrics.avgLatency}s
          </p>
          <p className="text-sm text-gray-500 mt-1">Target: &lt; 2.0s</p>
        </div>

        {/* Total NGN Value */}
        <div className="p-6 border rounded-xl shadow-sm bg-purple-50">
          <p className="text-gray-600 font-medium flex gap-1 items-center"> <TrendingUp size={26}/> Total NGN Value</p>
          <p className="text-4xl mt-4 font-semibold text-purple-700">
            ₦{(mockMetrics.totalValue / 1_000_000).toFixed(1)}M
          </p>
          <p className="text-sm text-gray-500 mt-1">Tax base amount</p>
        </div>
      </div>

      {/* ======================
          CHARTS SECTION
      ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Compliance Pie */}
        <div className="p-6 border rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Compliance Status Distribution</h2>
          <p className="text-sm text-gray-500 mb-4">
            Breakdown by transaction status
          </p>

          <div className="w-64 mx-auto">
            <Pie data={pieData} />
          </div>

          {/* labels */}
          <div className="flex justify-around mt-6">
            <div className="text-center">
              <p className="text-green-600 font-semibold">{complianceData.cleared}</p>
              <p className="text-gray-500 text-sm">Cleared</p>
            </div>

            <div className="text-center">
              <p className="text-yellow-500 font-semibold">{complianceData.pending}</p>
              <p className="text-gray-500 text-sm">Pending</p>
            </div>

            <div className="text-center">
              <p className="text-red-500 font-semibold">{complianceData.failed}</p>
              <p className="text-gray-500 text-sm">Failed</p>
            </div>
          </div>
        </div>

        {/* Currency Breakdown Bar */}
        <div className="p-6 border rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">
            Currency of Transaction (COT) Breakdown
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Transaction volume by currency
          </p>

          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                },
              },
            }}
          />
        </div>

      </div>
      {/* ======================
    END-TO-END LATENCY TREND
====================== */}
<div className="p-6 border rounded-xl shadow-sm">
  <h2 className="text-lg font-semibold mb-1">End-to-End Latency Trend</h2>
  <p className="text-sm text-gray-500 mb-4">
    Average and P95 latency over time (mock data)
  </p>

  <Line
    data={latencyData}
    options={{
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { usePointStyle: true },
        },
      },
      tension: 0.4,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (v) => v + " ms",
          },
        },
      },
    }}
  />
</div>

{/* ======================
    FIRS COMPLIANCE METRICS
====================== */}
<div className="p-6 border rounded-xl shadow-sm mt-10">
  <h2 className="text-xl font-semibold">FIRS Compliance Metrics (Nigeria)</h2>
  <p className="text-sm text-gray-500 mb-6">
    Detailed operational metrics for Nigerian e-invoicing
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center"> <Shield size={18}/> O4 Hub Routing</p>
      <p className="text-3xl font-semibold">{complianceMetrics.hubRouting}%</p>
      <p className="text-sm text-gray-500">Success rate</p>
    </div>

    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center"> <Zap size={18}/> O7 FX Reliability</p>
      <p className="text-3xl font-semibold">{complianceMetrics.fxReliability}%</p>
      <p className="text-sm text-gray-500">Uptime</p>
    </div>

    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center"> <CircleCheckBig size={18}/> O13 Data Integrity</p>
      <p className="text-3xl font-semibold">{complianceMetrics.dataIntegrity}%</p>
      <p className="text-sm text-gray-500">G/L posts with IRN</p>
    </div>

    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center"> <Clock size={18}/> Min Latency</p>
      <p className="text-3xl font-semibold">{complianceMetrics.minLatency}ms</p>
      <p className="text-sm text-gray-500">Fastest submission</p>
    </div>

    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center"><TrendingUp size={18}/> Max Latency</p>
      <p className="text-3xl font-semibold text-orange-600">
        {complianceMetrics.maxLatency}ms
      </p>
      <p className="text-sm text-gray-500">Slowest submission</p>
    </div>

    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center"> <FileText size={18}/> IRN Issued</p>
      <p className="text-3xl font-semibold text-purple-600">
        {complianceMetrics.irnIssued}
      </p>
      <p className="text-sm text-gray-500">Successfully cleared</p>
    </div>

  </div>
</div>


{/* ======================
    O-STACK ARCHITECTURE STATUS
====================== */}
<div className="p-6 border rounded-xl shadow-sm mt-8">
  <h2 className="text-xl font-semibold">O-Stack Architecture Status</h2>
  <p className="text-sm text-gray-500 mb-6">
    Centralized Hub (O4) / Decentralized Spoke (O16) Model
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center"> <Shield size={18}/> O4 I-CEM Hub</p>
      <p className="text-green-600 font-semibold">{oStackStatus.iCemHub}</p>
      <p className="text-sm text-gray-500">Security, Signing & Routing</p>
    </div>

    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center"> <Globe size={18}/> O16 I-DEM Spokes</p>
      <p className="text-green-600 font-semibold">
        {oStackStatus.iDemSpokes.active} LIVE
      </p>
      <p className="text-sm text-gray-500">
        {oStackStatus.iDemSpokes.active} Active / {oStackStatus.iDemSpokes.planned} Planned
      </p>
    </div>

    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center"> <Database size={18}/>O7 Treasury / O13 G/L</p>
      <p className="text-green-600 font-semibold">
        {oStackStatus.treasuryUptime}% UPTIME
      </p>
      <p className="text-sm text-gray-500">FX Conversion & Ledger Posting</p>
    </div>

  </div>
</div>

    </div>
  );
}
