"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  CreditCard,
  FileText,
  TrendingUp,
  Download,
  ClipboardList,
} from "lucide-react";

export default function WithholdingTaxDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch data from API ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/beapOnelite/tax-wht-reports");
        const json = await res.json();
        setData(json.withholdingtax);
      } catch (err) {
        console.error("Failed to fetch WHT data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading WHT data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">No WHT data available.</p>
      </div>
    );
  }

  // --- Helper function to format currency ---
  const formatCurrency = (amount) =>
    `₦${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  // Hardcoded summary cards icons and colors
  const summaryCardConfig = [
    {
      icon: CreditCard,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: FileText,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: TrendingUp,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Withholding Tax Overview</h1>
        <p className="text-gray-500">
          Manage and track your WHT credits and deductions.
        </p>
      </header>

      {/* Top Summary Cards */}
      <div className="flex flex-wrap gap-4">
        {data.summaryCards.map((card, index) => {
          const Icon = summaryCardConfig[index]?.icon || FileText;
          const bgClass = summaryCardConfig[index]?.bg || "bg-gray-100";
          const iconColor = summaryCardConfig[index]?.iconColor || "text-gray-500";

          return (
            <div
              key={index}
              className="flex-1 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="text-sm font-semibold text-gray-600">{card.title}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${bgClass}`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* WHT Info Alert */}
      <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg flex items-start space-x-3 mt-6">
        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-orange-800">
            Withholding Tax (WHT) Information
          </h3>
          <p className="mt-1 text-sm text-orange-700">
            WHT is deducted by clients and remitted directly to the tax authority
            on your behalf. This amount counts toward your final invoice
            settlement and can be claimed as a credit during annual tax reconciliation.
          </p>
        </div>
      </div>

      {/* WHT by Customer */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">WHT by Customer</h2>
            <p className="text-sm text-gray-500">
              {data.customerWHT.length
                ? `Top ${data.customerWHT.length} clients with WHT deductions`
                : "Client breakdown for WHT"}
            </p>
          </div>
          {data.customerWHT.length > 0 && (
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 shadow-sm">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>

        {data.customerWHT.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {data.customerWHT.map((customer, index) => (
              <div
                key={customer.id}
                className={`flex items-center justify-between py-3 ${
                  index !== data.customerWHT.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full ${
                      index < 3 ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.invoices} invoice(s)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(customer.amount)}
                  </p>
                  <p className="text-xs text-orange-500 font-medium">WHT withheld</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mt-4">
            <ClipboardList className="w-12 h-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              No WHT Deductions Found
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              It looks like no customers have withheld tax on your behalf yet.
              WHT deductions will appear here once they are recorded.
            </p>
          </div>
        )}
      </div>

      {/* WHT Summary Details */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <h2 className="text-lg font-bold text-gray-800">WHT Summary Details</h2>
        <p className="text-sm text-gray-500 mb-6">
          Comprehensive breakdown for tax filing
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {data.summaryDetails.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className={`text-xl font-semibold mt-0.5 ${item.color || "text-gray-900"}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
