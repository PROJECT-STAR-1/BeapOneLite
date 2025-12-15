"use client";

import React, { useEffect, useState } from "react";
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
import {
  Check,
  CircleCheckBig,
  Clock,
  Database,
  FileText,
  Globe,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

export default function FIRSReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/beapOnelite/einvoice")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!data) return <p className="text-red-500">Failed to load data.</p>;

  // Assuming your JSON looks like this:
  // {
  //   "metrics": { totalSubmissions, successRate, avgLatency, totalValue },
  //   "compliance": { cleared, pending, failed },
  //   "currencyBreakdown": { USD, NGN, EUR, GBP },
  //   "latency": { labels: [], avg: [], p95: [] },
  //   "complianceMetrics": { hubRouting, fxReliability, dataIntegrity, minLatency, maxLatency, irnIssued },
  //   "oStackStatus": { iCemHub, iDemSpokes, treasuryUptime }
  // }

  const {
    metrics,
    compliance,
    currencyBreakdown,
    latency,
    complianceMetrics,
    oStackStatuses,
  } = data;

  // Pie chart data
  const pieData = {
    labels: ["Cleared", "Pending", "Failed"],
    datasets: [
      {
        data: [compliance.cleared, compliance.pending, compliance.failed],
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

  // Line chart data
  const latencyData = {
    labels: latency.labels,
    datasets: [
      {
        label: "Avg Latency (ms)",
        data: latency.avg,
        borderColor: "#10B981",
        backgroundColor: "#10B981",
        pointRadius: 5,
        pointBackgroundColor: "white",
        pointBorderColor: "#10B981",
        borderWidth: 2,
      },
      {
        label: "P95 Latency (ms)",
        data: latency.p95,
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        pointRadius: 5,
        pointBackgroundColor: "white",
        pointBorderColor: "#F59E0B",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 space-y-10">
      {/* ====================== TOP METRICS CARDS ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 border rounded-xl shadow-sm">
          <p className="text-gray-600 font-medium flex gap-2 items-center">
            <FileText size={26} /> Total Submissions
          </p>
          <p className="text-4xl mt-4 font-semibold">{metrics.totalSubmissions}</p>
          <p className="text-sm text-gray-500 mt-1">FIRS e-invoices</p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm bg-green-50">
          <p className="text-gray-600 font-medium flex items-center gap-1">
            <Check size={26} /> Success Rate
          </p>
          <p className="text-4xl mt-4 font-semibold text-green-600">{metrics.successRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Target: &gt; 99.9%</p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm bg-blue-50">
          <p className="text-gray-600 font-medium flex items-center gap-1">
            <Zap size={26} /> Avg Latency
          </p>
          <p className="text-4xl mt-4 font-semibold text-blue-600">{metrics.avgLatency}s</p>
          <p className="text-sm text-gray-500 mt-1">Target: &lt; 2.0s</p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm bg-purple-50">
          <p className="text-gray-600 font-medium flex gap-1 items-center">
            <TrendingUp size={26} /> Total NGN Value
          </p>
          <p className="text-4xl mt-4 font-semibold text-purple-700">
            ₦{(metrics.totalValue / 1_000_000).toFixed(1)}M
          </p>
          <p className="text-sm text-gray-500 mt-1">Tax base amount</p>
        </div>
      </div>

      {/* ====================== Charts ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Compliance Pie */}
        <div className="p-6 border rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Compliance Status Distribution</h2>
          <p className="text-sm text-gray-500 mb-4">Breakdown by transaction status</p>

          <div className="w-64 mx-auto">
            <Pie data={pieData} />
          </div>

          <div className="flex justify-around mt-6">
            <div className="text-center">
              <p className="text-green-600 font-semibold">{compliance.cleared}</p>
              <p className="text-gray-500 text-sm">Cleared</p>
            </div>

            <div className="text-center">
              <p className="text-yellow-500 font-semibold">{compliance.pending}</p>
              <p className="text-gray-500 text-sm">Pending</p>
            </div>

            <div className="text-center">
              <p className="text-red-500 font-semibold">{compliance.failed}</p>
              <p className="text-gray-500 text-sm">Failed</p>
            </div>
          </div>
        </div>

        {/* Currency Bar */}
        <div className="p-6 border rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Currency of Transaction Breakdown</h2>
          <p className="text-sm text-gray-500 mb-4">Transaction volume by currency</p>

          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
              },
            }}
          />
        </div>
      </div>

      {/* Latency Trend */}
      <div className="p-6 border rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-1">End-to-End Latency Trend</h2>
        <p className="text-sm text-gray-500 mb-4">Average and P95 latency over time</p>

        <Line
          data={latencyData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom", labels: { usePointStyle: true } },
            },
            tension: 0.4,
            scales: {
              y: {
                beginAtZero: false,
                ticks: { callback: (v) => v + " ms" },
              },
            },
          }}
        />
      </div>

      {/* Compliance Metrics */}
      <div className="p-6 border rounded-xl shadow-sm mt-10">
        <h2 className="text-xl font-semibold">FIRS Compliance Metrics (Nigeria)</h2>
        <p className="text-sm text-gray-500 mb-6">
          Detailed operational metrics for Nigerian e-invoicing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard icon={<Shield size={18} />} label="O4 Hub Routing" value={complianceMetrics.hubRouting + "%"} desc="Success rate" />
          <MetricCard icon={<Zap size={18} />} label="O7 FX Reliability" value={complianceMetrics.fxReliability + "%"} desc="Uptime" />
          <MetricCard icon={<CircleCheckBig size={18} />} label="O13 Data Integrity" value={complianceMetrics.dataIntegrity + "%"} desc="G/L posts with IRN" />
          <MetricCard icon={<Clock size={18} />} label="Min Latency" value={complianceMetrics.minLatency + "ms"} desc="Fastest submission" />
          <MetricCard icon={<TrendingUp size={18} />} label="Max Latency" value={complianceMetrics.maxLatency + "ms"} desc="Slowest submission" />
          <MetricCard icon={<FileText size={18} />} label="IRN Issued" value={complianceMetrics.irnIssued} desc="Successfully cleared" />
        </div>
      </div>

      {/* O-Stack Status */}
      <div className="p-6 border rounded-xl shadow-sm mt-8">
        <h2 className="text-xl font-semibold">O-Stack Architecture Status</h2>
        <p className="text-sm text-gray-500 mb-6">Centralized Hub (O4) / Decentralized Spoke (O16) Model</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard icon={<Shield size={18} />} label="O4 I-CEM Hub" value={oStackStatuses.iCemHub} desc="Security, Signing & Routing" />
          <MetricCard icon={<Globe size={18} />} label="O16 I-DEM Spokes" value={`${oStackStatuses.iDemSpokes.active} LIVE`} desc={`${oStackStatuses.iDemSpokes.active} Active / ${oStackStatuses.iDemSpokes.planned} Planned`} />
          <MetricCard icon={<Database size={18} />} label="O7 Treasury / O13 G/L" value={`${oStackStatuses.treasuryUptime}% UPTIME`} desc="FX Conversion & Ledger Posting" />
        </div>
      </div>
    </div>
  );
}

// Reusable metric card
function MetricCard({ icon, label, value, desc }) {
  return (
    <div className="p-5 border rounded-xl">
      <p className="text-gray-600 font-medium flex gap-1 items-center">{icon} {label}</p>
      <p className="text-sm text-gray-500">{desc}</p>
      <p className="text-lg font-medium ">{value}</p>

    </div>
  );
}
