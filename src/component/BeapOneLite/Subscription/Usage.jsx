"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";
import { Activity, MapPin, Lock } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  BarElement
);

export default function Usage() {
  // --------------------------
  // Mock for "Usage Trends"
  // --------------------------
  const dates30 = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    return date.toISOString().split("T")[0];
  });

  const usageTrendsData = {
    labels: dates30,
    datasets: [
      {
        label: "Active Users",
        data: dates30.map(() => Math.floor(Math.random() * 3) + 4),
        borderColor: "#0f172a",
        backgroundColor: "#0f172a",
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: "Data Usage (GB)",
        data: dates30.map(() => Math.random() * 2 + 2),
        borderColor: "#8b5cf6",
        backgroundColor: "#8b5cf6",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const usageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
    interaction: {
    mode: "index",      
    intersect: false,   
  },
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true },
      },
    },
  };

  // --------------------------------
  // Mock Data: Invoice Submissions
  // --------------------------------
  const invoiceLabels = ["2025-11-28", "2025-11-29", "2025-11-30", "2025-12-02", "2025-12-04"];
  const invoiceBarData = {
    labels: invoiceLabels,
    datasets: [
      {
        label: "Invoices",
        data: [14, 12, 14, 6, 4],
        backgroundColor: "#10b981",
      },
    ],
  };

  const invoiceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* ----------------------- */}
      {/* Usage Trends (30 days) */}
      {/* ----------------------- */}

      <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Usage Trends (Last 30 Days)</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Real-time monitoring of active users, data storage, and transaction volume
        </p>

        <div className="h-72">
          <Line data={usageTrendsData} options={usageOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ----------------------- */}
        {/* Invoice Submissions */}
        {/* ----------------------- */}

        <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Invoice Submissions (Monthly)</h2>
          <div className="h-64">
            <Bar data={invoiceBarData} options={invoiceOptions} />
          </div>
        </div>

        {/* ----------------------- */}
        {/* Location Activity */}
        {/* ----------------------- */}

        <div className="bg-white rounded-2xl p-6 shadow border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold">Location Activity</h2>

          {/* Primary Location */}
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-green-600" />
                Head Office - Lagos
              </div>
              <p className="text-xs text-gray-500 mt-1">Primary Location</p>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-green-600 text-white">
              Active
            </span>
          </div>

          {/* Secondary Location */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-blue-600" />
                Branch - Abuja
              </div>
              <p className="text-xs text-gray-500 mt-1">Secondary Location</p>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-blue-600 text-white">
              Active
            </span>
          </div>

          {/* Upgrade Notice */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
            <Lock className="w-4 h-4 text-yellow-600 mt-1" />
            <p className="text-sm text-yellow-800">
              You've reached your 2-location limit. Upgrade to PREMIUM for unlimited locations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
