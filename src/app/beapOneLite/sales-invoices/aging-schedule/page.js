"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  Download,
  BarChart3,
} from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";

export default function AgingSchedule() {
  const [exportOpen, setExportOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Days Past Due");
  const [searchQuery, setSearchQuery] = useState("");

  const [metrics, setMetrics] = useState(null);
  const [agingBreakdown, setAgingBreakdown] = useState([]);
  const [outstandingInvoices, setOutstandingInvoices] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/beapOnelite/ageingschedule");
        const json = await res.json();
        setMetrics(json.metrics);
        setAgingBreakdown(json.agingBreakdown);
        setOutstandingInvoices(json.outstandingInvoices);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }

    loadData();
  }, []);

  function getAgingDetails(dueDate) {
    const today = new Date("12/05/2025"); // mock today
    const due = new Date(dueDate);
    const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    let bucket = "";
    if (diffDays <= 0) bucket = "Current";
    else if (diffDays <= 30) bucket = "1-30 Days";
    else if (diffDays <= 60) bucket = "31-60 Days";
    else bucket = "60+ Days";
    return { diffDays, bucket };
  }

  const filteredInvoices = outstandingInvoices
    .filter(
      (inv) =>
        inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((inv) => ({ ...inv, ...getAgingDetails(inv.due) }));

  // Apply sorting
  filteredInvoices.sort((a, b) => {
    if (selectedSort === "Days Past Due") return b.diffDays - a.diffDays;
    if (selectedSort === "Amount (High to Low)") return b.amountUSD - a.amountUSD;
    if (selectedSort === "Customer Name") return a.customer.localeCompare(b.customer);
  });

  if (!metrics) return <p className="p-6">Loading...</p>;

  return (
    <Layout>
      <div className="p-6">
        {/* PAGE HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Aging Schedule</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track outstanding receivables and overdue invoices
            </p>
          </div>

          {/* EXPORT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="border px-4 py-2 rounded-lg flex items-center gap-2 bg-white shadow-sm"
            >
              <Download size={18} />
              Export
              <ChevronDown size={16} />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg w-40 z-20">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Export as PDF
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Export as Excel
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Export as CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {/* Total Outstanding */}
          <div className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Outstanding</p>
              <p className="text-2xl font-semibold">
                ₦{metrics.totalOutstanding.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">{outstandingInvoices.length} invoices</p>
            </div>
            <span className="bg-purple-100 p-4 rounded-full">
              <DollarSign className="text-purple-600" size={22} />
            </span>
          </div>

          {/* Avg Days Overdue */}
          <div className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Avg Days Overdue</p>
              <p className="text-2xl font-semibold">{metrics.avgOverdue}</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </div>
            <span className="bg-yellow-100 p-4 rounded-full">
              <Clock className="text-yellow-600" size={22} />
            </span>
          </div>

          {/* At Risk */}
          <div className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">At Risk (60+ Days)</p>
              <p className="text-2xl font-semibold">₦{metrics.atRisk.toLocaleString()}</p>
              <p className="text-xs text-red-500 mt-1">0.0% of total</p>
            </div>
            <span className="bg-red-100 p-4 rounded-full">
              <AlertCircle className="text-red-600" size={22} />
            </span>
          </div>

          {/* Current */}
          <div className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Current (Not Due)</p>
              <p className="text-2xl font-semibold">₦{metrics.current.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">0 invoices</p>
            </div>
            <span className="bg-green-100 p-4 rounded-full">
              <TrendingUp className="text-green-600" size={22} />
            </span>
          </div>
        </div>

        {/* AGING BREAKDOWN */}
        <div className="bg-white p-6 rounded-xl border shadow-sm mt-10">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart3 size={26} /> Aging Breakdown
          </h2>

          {agingBreakdown.map((item, idx) => (
            <div key={idx} className="mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                  <p className="text-sm font-medium">{item.label}</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.count} invoices
                  </span>
                </div>
                <p className="text-sm font-medium">₦{item.amount.toLocaleString()}</p>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full mt-3">
                <div
                  className="h-2 bg-blue-400 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.percentage}%</p>
            </div>
          ))}
        </div>

        {/* OUTSTANDING INVOICES */}
        <div className="mt-10 bg-white p-6 rounded-xl border shadow-sm">
          {/* SEARCH + FILTER */}
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by customer name or invoice number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 px-10 py-2 rounded-lg border focus:ring-2 focus:ring-blue-300 outline-none"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-gray-50 text-nowrap"
              >
                {selectedSort} <ChevronDown size={16} />
              </button>

              {sortOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md border rounded-lg w-48 z-20">
                  {["Days Past Due", "Amount (High to Low)", "Customer Name"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option);
                        setSortOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-nowrap"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* OUTSTANDING INVOICE LIST */}
          <div className="mt-6">
            <h2 className="font-semibold text-[17px] mb-3">
              Outstanding Invoices ({filteredInvoices.length})
            </h2>

            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="border rounded-xl p-4 flex justify-between items-center mb-3 hover:shadow-sm transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">{inv.customer}</span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                      {inv.bucket}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {inv.id} • Due: {inv.due} •{" "}
                    <span className="text-orange-600 font-medium">
                      {inv.diffDays > 0 ? `${inv.diffDays} days overdue` : "Current"}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">US${inv.amountUSD.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">≈ ₦{inv.amountNGN.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
