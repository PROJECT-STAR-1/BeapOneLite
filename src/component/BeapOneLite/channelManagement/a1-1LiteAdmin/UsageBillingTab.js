"use client";

import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";

import {
  Activity,
  DollarSign,
  AlertTriangle
} from "lucide-react";

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/a1-1LiteAdmin")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  const exposureTrend = {
    labels: data.o17BalanceExposureTrend.data.map((d) => d.date),
    datasets: [
      {
        label: "O17 Exposure ($)",
        data: data.o17BalanceExposureTrend.data.map((d) => d.value),
        borderColor: "#dc2626",
        backgroundColor: "rgba(220,38,38,0.3)",
        tension: 0.3,
      },
    ],
  };

  const provisioningTrend = {
    labels: data.dailyProvisioningActivity.newLiteUsersProvisioned.map(
      (d) => d.date
    ),
    datasets: [
      {
        label: "New Instances",
        data: data.dailyProvisioningActivity.newLiteUsersProvisioned.map(
          (d) => d.value
        ),
        backgroundColor: "#1e3a8a",
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">

      {/* PAGE TITLE + DESCRIPTION */}
      <div>
        <h1 className="text-2xl font-bold">
          Usage & Billing Metrics (G6 + A2-4 Integration)
        </h1>
        <p className="text-gray-600 mt-1">
          Aggregated metrics from Core BEAPOne Services via Secure Gateway (Layer 3)
        </p>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Transaction Volume */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Activity className="text-blue-600" size={32} />
            <div>
              <p className="font-semibold text-gray-700">Transaction Volume</p>
              <p className="text-3xl font-bold">{data.usageBillingMetrics.transactionVolume}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Source: G6 Reporting Service
          </p>
        </div>

        {/* Total MRR */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <DollarSign className="text-green-600" size={32} />
            <div>
              <p className="font-semibold text-gray-700">Total MRR</p>
              <p className="text-3xl font-bold">${data.usageBillingMetrics.totalMRR}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Source: A2-4 Subscription Mgmt
          </p>
        </div>

        {/* O17 Exposure */}
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <AlertTriangle className="text-red-600" size={32} />
            <div>
              <p className="font-semibold text-gray-700">O17 Balance Exposure</p>
              <p className="text-3xl font-bold text-red-700">
                ${data.usageBillingMetrics.o17BalanceExposure}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Source: A2-4 Subscription Mgmt
          </p>
        </div>

      </div>

      {/* TABLE */}
<div className="bg-white p-6 rounded-lg shadow border">
  <h2 className="text-xl font-semibold mb-4">Per-Instance Usage Breakdown</h2>

  <table className="w-full border-collapse text-sm">
    <thead>
      <tr className="border-b">
        <th className="py-2 text-left">appId</th>
        <th className="py-2 text-left">Client</th>
        <th className="py-2 text-left">Active Users</th>
        <th className="py-2 text-left">Transaction Volume</th>
        <th className="py-2 text-left">Storage (GB)</th>
        <th className="py-2 text-left">MRR</th>
        <th className="py-2 text-left">O17 Exposure</th>
      </tr>
    </thead>

    <tbody>
      {data.perInstanceUsage.map((r, i) => (
        <tr key={i} className="border-b hover:bg-gray-50">
          {/* appId pill */}
          <td className="py-2">
            <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded text-xs font-mono">
              {r.appId}
            </span>
          </td>

          <td className="py-2">{r.client}</td>
          <td>{r.activeUsers}</td>
          <td>{r.transactionVolume}</td>
          <td>{r.storage}</td>
          <td className="px-3">${r.mrr}</td>

          <td
            className={
              r.o17Exposure > 500 ? "text-red-600 font-semibold" : ""
            }
          >
            ${r.o17Exposure}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">
            O17 Balance Exposure Trend
          </h2>
          <Line data={exposureTrend} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">
            Daily Provisioning Activity (NLUP)
          </h2>
          <Bar data={provisioningTrend} />
        </div>

      </div>
    </div>
  );
}
