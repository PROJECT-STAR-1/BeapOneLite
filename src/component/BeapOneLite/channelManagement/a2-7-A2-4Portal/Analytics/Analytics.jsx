"use client";

import { useEffect, useState } from "react";
import AnalyticsTwo from "@/component/BeapOneLite/channelManagement/a2-7-A2-4Portal/Analytics/AnalyticsTwo"
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { TrendingUp, BarChart3, Users } from "lucide-react";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function PortalPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/a2-7-A2-4Portal")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-10 text-center">Loading...</div>;

  const { dates, cmrrRevenueTrend, newLiteUserProvisioning, activeUsersTrend } = data;

  return (
    <div className="p-4 space-y-12">

      {/* ---------------- Revenue Trend ---------------- */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-blue-600 w-6 h-6" />
          <h2 className="text-xl font-semibold">Channel Revenue Trend (CMRR)</h2>
        </div>

        <p className="text-gray-500 text-sm mt-1 mb-4">
          Your monthly recurring revenue over the last 30 days
        </p>

        <Line
          data={{
            labels: dates,
            datasets: [
              {
                label: "Revenue ($)",
                data: cmrrRevenueTrend.map((x) => x.value),
                borderColor: "#1e3a8a",
                backgroundColor: "#1e3a8a",
                tension: 0.3
              }
            ]
          }}
        />
      </div>

      {/* ---------------- Provisioning Activity ---------------- */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-green-600 w-6 h-6" />
          <h2 className="text-xl font-semibold">Daily Provisioning Activity (NLUP)</h2>
        </div>

        <p className="text-gray-500 text-sm mt-1 mb-4">
          New Lite users provisioned per day
        </p>

        <Bar
          data={{
            labels: dates,
            datasets: [
              {
                label: "New Users",
                data: newLiteUserProvisioning,
                backgroundColor: "#10b981"
              }
            ]
          }}
        />
      </div>

      {/* ---------------- Active Users Trend ---------------- */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Users className="text-blue-500 w-6 h-6" />
          <h2 className="text-xl font-semibold">Active Users Trend</h2>
        </div>

        <p className="text-gray-500 text-sm mt-1 mb-4">
          Total active users across all your Lite instances
        </p>

        <Line
          data={{
            labels: dates,
            datasets: [
              {
                label: "Active Users",
                data: activeUsersTrend,
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f6",
                tension: 0.3
              }
            ]
          }}
        />
      </div>
      <AnalyticsTwo />
    </div>
  );
}
