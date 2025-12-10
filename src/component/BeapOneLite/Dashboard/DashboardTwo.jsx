"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  FileText,
  Calendar,
  DollarSign,
  Plus,
  BarChart2,
  Users
} from "lucide-react";

import { Line, Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function DashboardTwo() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 space-y-10">

      {/* ============================== */}
      {/*   ROW 1: REVENUE + INVOICE     */}
      {/* ============================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Revenue Trend (Last 30 Days)</h2>
          </div>
          <p className="text-sm mb-4">Invoice and quote value over time</p>

          <Line
            data={{
              labels: data.revenueTrend.dates,
              datasets: [
                {
                  label: "Invoices",
                  data: data.revenueTrend.invoices,
                  borderColor: "#2C2C71",
                  backgroundColor: "rgba(44,44,113,0.3)",
                  fill: true
                },
                {
                  label: "Quotes",
                  data: data.revenueTrend.quotes,
                  borderColor: "#F5A623",
                  backgroundColor: "rgba(245,166,35,0.3)",
                  fill: true
                }
              ]
            }}
          />
        </div>

        {/* Invoice Status Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Invoice Status Distribution</h2>
          </div>
          <p className="text-sm mb-4">Breakdown of all invoices by status</p>

          <Pie
            data={{
              labels: ["Paid", "Overdue"],
              datasets: [
                {
                  data: [
                    data.invoiceStatusDistribution.paidPercent,
                    data.invoiceStatusDistribution.overduePercent
                  ],
                  backgroundColor: ["#14C38E", "#E53E3E"]
                }
              ]
            }}
          />
        </div>

      </div>

      {/* ============================== */}
      {/*   ROW 2: AGING + COLLECTION    */}
      {/* ============================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Aging Breakdown */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Aging Breakdown</h2>
          </div>
          <p className="text-sm mb-4">Outstanding balances by age category</p>

          <Bar
            data={{
              labels: data.agingBreakdown.categories,
              datasets: [
                {
                  label: "Amount",
                  data: data.agingBreakdown.values,
                  backgroundColor: "#F5A623"
                }
              ]
            }}
          />
        </div>

        {/* Collection Efficiency */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Collection Efficiency</h2>
          </div>
          <p className="text-sm mb-4">Paid vs Outstanding Revenue</p>

          <Bar
            data={{
              labels: ["Paid", "Outstanding"],
              datasets: [
                {
                  data: [
                    data.collectionEfficiency.paid,
                    data.collectionEfficiency.outstanding
                  ],
                  backgroundColor: ["#14C38E", "#F5A623"]
                }
              ]
            }}
            options={{ indexAxis: "y" }}
          />

          <div className="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg inline-block">
            Collection Rate: {data.collectionEfficiency.collectionRatePercent}%
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-[#281B66] text-white p-6 rounded-xl flex flex-wrap gap-4 justify-between">
        <button className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg">
          <Plus /> New Invoice
        </button>
        <button className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg">
          <Plus /> New Quote
        </button>
        <button className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg">
          <BarChart2 /> Reports
        </button>
        <button className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg">
          <Users /> Clients
        </button>
      </div>
    </div>
  );
}
