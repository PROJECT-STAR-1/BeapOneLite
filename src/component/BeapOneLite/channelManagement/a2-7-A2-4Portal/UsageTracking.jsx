"use client";

import { useEffect, useState } from "react";
import { Users, Repeat, Database, Target } from "lucide-react";

export default function A2Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/a2-7-A2-4Portal")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  const { topStats, clients, usageIngestionHealth } = data;

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* --- CARD COMPONENT STYLE --- */}
        {[
          {
            label: "Total Active Users",
            icon: <Users size={18} />,
            value: topStats.totalActiveUsers,
            sub: "Across all instances",
            valueClass: "text-blue-700",
          },
          {
            label: "Total Transactions",
            icon: <Repeat size={18} />,
            value: topStats.totalTransactions.toLocaleString(),
            sub: "Last 24 hours",
            valueClass: "text-blue-700",
          },
          {
            label: "Storage Density",
            icon: <Database size={18} />,
            value: `${topStats.storageDensityGB} GB`,
            sub: "Total across clients",
            valueClass: "text-green-600",
          },
          {
            label: "O17 Activities",
            icon: <Target size={18} />,
            value: topStats.o17Activities,
            sub: "High-value events",
            valueClass: "text-purple-600",
          },
        ].map((item, i) => (
          <div key={i} className="rounded-xl bg-white shadow-sm p-6">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              {item.icon} {item.label}
            </div>

            <div className={`mt-4 text-4xl font-semibold ${item.valueClass}`}>
              {item.value}
            </div>

            <p className="text-sm text-gray-500">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* CLIENT TABLE */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold">
            Lite Instance Usage Tracking (Flow 2)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time usage metrics from all provisioned instances
          </p>
        </div>

        {/* Table */}
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-[32%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[18%]" />
          </colgroup>

          <thead>
            <tr className="text-gray-600 bg-gray-50">
              <th className="p-4 text-left font-medium">Client</th>
              <th className="p-4 text-left font-medium">Status</th>
              <th className="p-4 text-right font-medium">Active Users</th>
              <th className="p-4 text-right font-medium">Storage (GB)</th>
              <th className="p-4 text-right font-medium">MRR</th>
              <th className="p-4 text-right font-medium">Your Commission</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((c, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-4 text-left">
                  <div className="font-medium">{c.client}</div>
                  <div className="text-xs text-gray-500">{c.email}</div>
                </td>

                <td className="p-4 text-left">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="p-4 text-right font-semibold">
                  {c.activeUsers}
                </td>
                <td className="p-4 text-right">{c.storageGB}</td>
                <td className="p-4 text-right">${c.mrr}</td>

                <td className="p-4 text-right font-semibold text-purple-700">
                  ${c.commission.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USAGE INGESTION HEALTH */}
      <div className="rounded-xl bg-white shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-2">
          Usage Ingestion Health (A2-4)
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Flow 2 performance metrics and data quality
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Raw Records */}
          <div className="p-6 rounded-xl bg-green-50 shadow-sm">
            <div className="text-3xl font-bold text-green-700">
              {usageIngestionHealth.rawUsageIngestion.toLocaleString()}
            </div>
            <div className="mt-1 text-sm">Records/day (target: 10K)</div>
          </div>

          {/* Latency */}
          <div className="p-6 rounded-xl bg-blue-50 shadow-sm">
            <div className="text-3xl font-bold text-blue-700">
              {usageIngestionHealth.ingestionLatencyMs}ms
            </div>
            <div className="mt-1 text-sm">P95 (target: ≤100ms)</div>
          </div>

          {/* Discrepancy */}
          <div className="p-6 rounded-xl bg-purple-50 shadow-sm">
            <div className="text-3xl font-bold text-purple-700">
              {usageIngestionHealth.usageDiscrepancyPercent}%
            </div>
            <div className="mt-1 text-sm">Target: &lt;0.5%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
