"use client";

import { useEffect, useState } from "react";
import {
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import {
  Users,
  DollarSign,
  AlertTriangle,
  ClipboardList,
  ShieldCheck,
  Bolt,
  FileCheck,
  Clock
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/a1-1LiteAdmin")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  const activeUsersTrend = {
    labels: data.activeUsersTrend.map((d) => d.date),
    datasets: [
      {
        label: "Active Users",
        data: data.activeUsersTrend.map((d) => d.value),
        borderColor: "#1E3A8A",
        backgroundColor: "rgba(30, 58, 138, 0.2)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  const transactionsTrend = {
    labels: data.transactionVolume.map((d) => d.date),
    datasets: [
      {
        label: "Transactions",
        data: data.transactionVolume.map((d) => d.value),
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.2)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  return (
    <div className=" space-y-10">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Lite Instances */}
        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-700 font-medium">Total Lite Instances</div>
            <ClipboardList className="w-5 h-5 text-gray-500" />
          </div>

          <div className="text-4xl font-semibold">{data.totalLiteInstances.total}</div>

          <div className="mt-2 text-sm">
            <span className="text-green-600">{data.totalLiteInstances.active} Active</span> •{" "}
            <span className="text-yellow-600">{data.totalLiteInstances.suspended} Suspended</span> •{" "}
            <span className="text-blue-600">{data.totalLiteInstances.provisioning} Provisioning</span>
          </div>
        </div>

        {/* Total Active Users */}
        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-700 font-medium">Total Active Users</div>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <div className="text-4xl font-semibold">{data.totalActiveUsers}</div>
          <div className="mt-1 text-sm text-gray-500">Across all instances</div>
        </div>

        {/* Total MRR */}
        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-700 font-medium">Total MRR</div>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-4xl font-semibold text-green-600">${data.totalMRR}</div>
          <div className="mt-1 text-sm text-gray-500">Monthly Recurring Revenue</div>
        </div>

        {/* Balance Exposure */}
        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-700 font-medium">O17 Balance Exposure</div>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-4xl font-semibold text-red-600">${data.o17BalanceExposure}</div>
          <div className="mt-1 text-sm text-gray-500">Total outstanding balance</div>
        </div>
      </div>

      {/* PORTAL PERFORMANCE KPIs */}
      <div>
        <h2 className="text-xl font-semibold mb-1">A1-1 Portal Performance KPIs</h2>
        <p className="text-gray-600 mb-5">
          Real-time operational performance indicators
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

          {/* AES */}
          <div className="bg-green-100 border border-green-300 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <Bolt className="text-green-700" />
              <div className="text-lg font-semibold">AES</div>
            </div>
            <div className="text-3xl font-bold">{data.portalPerformanceKPIs.AES.value}s</div>
            <div className="text-sm text-gray-600">Target: {data.portalPerformanceKPIs.AES.target}</div>
          </div>

          {/* DACR */}
          <div className="bg-blue-100 border border-blue-300 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <ShieldCheck className="text-blue-700" />
              <div className="text-lg font-semibold">DACR</div>
            </div>
            <div className="text-3xl font-bold">{data.portalPerformanceKPIs.DACR.value}%</div>
            <div className="text-sm text-gray-600">Target: 100%</div>
          </div>

          {/* Audit Log Integrity */}
          <div className="bg-purple-100 border border-purple-300 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <FileCheck className="text-purple-700" />
              <div className="text-lg font-semibold">Audit Log Integrity</div>
            </div>
            <div className="text-3xl font-bold">{data.portalPerformanceKPIs.auditLogIntegrity.value}%</div>
            <div className="text-sm text-gray-600">Target: 100%</div>
          </div>

          {/* Note Compliance */}
          <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <FileCheck className="text-yellow-700" />
              <div className="text-lg font-semibold">Note Compliance</div>
            </div>
            <div className="text-3xl font-bold">{data.portalPerformanceKPIs.noteCompliance.value}%</div>
            <div className="text-sm text-gray-600">Target: 100%</div>
          </div>

          {/* Avg AJT */}
          <div className="bg-orange-100 border border-orange-300 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <Clock className="text-orange-700" />
              <div className="text-lg font-semibold">Avg AJT</div>
            </div>
            <div className="text-3xl font-bold">{data.portalPerformanceKPIs.avgAJT.value}m</div>
            <div className="text-sm text-gray-600">Target: {data.portalPerformanceKPIs.avgAJT.target}</div>
          </div>

        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Active Users Trend */}
        <div className="bg-white shadow rounded-xl p-5">
          <h3 className="text-lg font-semibold">Active Users Trend (30 Days)</h3>
          <p className="text-gray-600 text-sm mb-4">
            Total active users across all Lite instances
          </p>
          <Line data={activeUsersTrend} />
        </div>

        {/* Transaction Volume */}
        <div className="bg-white shadow rounded-xl p-5">
          <h3 className="text-lg font-semibold">Transaction Volume (30 Days)</h3>
          <p className="text-gray-600 text-sm mb-4">
            Aggregated from G6 Reporting Service
          </p>
          <Line data={transactionsTrend} />
        </div>

      </div>
    </div>
  );
}
