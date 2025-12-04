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
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
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

  return (
    <div className="p-6 space-y-10">

      {/* ======================
          TOP METRICS CARDS
      ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total Submissions */}
        <div className="p-6 border rounded-xl shadow-sm">
          <p className="text-gray-600 font-medium">Total Submissions</p>
          <p className="text-4xl mt-4 font-semibold">{mockMetrics.totalSubmissions}</p>
          <p className="text-sm text-gray-500 mt-1">FIRS e-invoices</p>
        </div>

        {/* Success Rate */}
        <div className="p-6 border rounded-xl shadow-sm bg-green-50">
          <p className="text-gray-600 font-medium flex items-center gap-1">
            <span>✔</span> Success Rate
          </p>
          <p className="text-4xl mt-4 font-semibold text-green-600">
            {mockMetrics.successRate}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Target: &gt; 99.9%</p>
        </div>

        {/* Avg Latency */}
        <div className="p-6 border rounded-xl shadow-sm bg-blue-50">
          <p className="text-gray-600 font-medium flex items-center gap-1">
            ⚡ Avg Latency
          </p>
          <p className="text-4xl mt-4 font-semibold text-blue-600">
            {mockMetrics.avgLatency}s
          </p>
          <p className="text-sm text-gray-500 mt-1">Target: &lt; 2.0s</p>
        </div>

        {/* Total NGN Value */}
        <div className="p-6 border rounded-xl shadow-sm bg-purple-50">
          <p className="text-gray-600 font-medium">Total NGN Value</p>
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
    </div>
  );
}
