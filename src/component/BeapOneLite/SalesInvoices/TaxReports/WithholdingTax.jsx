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

export default function WithholdingTax({
  dateRange,
  startDate,
  endDate,
  location,
}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const query = new URLSearchParams({
          dateRange,
          startDate,
          endDate,
          location,
        });

        const res = await fetch(`/api/beapOnelite/tax-wht-reports?${query}`);
        const json = await res.json();
        setData(json.withholdingtax);
      } catch (err) {
        console.error("Failed to fetch WHT data:", err);
      }
    }
    fetchData();
  }, [dateRange, startDate, endDate, location]);

  if (!data)
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-500">Loading WHT data...</p>
      </div>
    );

  const formatCurrency = (amount) =>
    `₦${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  const summaryCardConfig = [
    { icon: CreditCard, bg: "bg-orange-100", iconColor: "text-orange-600" },
    { icon: FileText, bg: "bg-blue-100", iconColor: "text-blue-600" },
    { icon: TrendingUp, bg: "bg-purple-100", iconColor: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-white p-6">

      {/* SUMMARY CARDS */}
      <div className="flex flex-wrap gap-4">
        {data.summaryCards.map((card, index) => {
          const Icon = summaryCardConfig[index]?.icon || FileText;
          const bg = summaryCardConfig[index]?.bg || "bg-gray-100";
          const color = summaryCardConfig[index]?.iconColor || "text-gray-600";

          return (
            <div
              key={index}
              className="flex-1 p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <div className="text-sm font-semibold text-gray-600">
                {card.title}
              </div>

              <div className="flex justify-between mt-2">
                <p className="text-3xl font-bold">{card.value}</p>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* ALERT */}
      <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg flex gap-3 mt-6">
        <AlertTriangle className="w-5 text-orange-500" />
        <div>
          <h3 className="text-sm font-semibold text-orange-800">
            Withholding Tax (WHT) Information
          </h3>
          <p className="text-sm text-orange-700 mt-1">
            WHT is deducted by clients and remitted on your behalf...
          </p>
        </div>
      </div>

      {/* CUSTOMER WHT */}
      <div className="p-6 bg-white rounded-xl shadow-sm border mt-6">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">WHT by Customer</h2>
            <p className="text-sm text-gray-500">
              Breakdown of customer WHT activity
            </p>
          </div>
          <button className="flex items-center gap-2 border px-3 py-1.5 rounded-lg hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
        </div>

        {data.customerWHT.length ? (
          <div className="divide-y">
            {data.customerWHT.map((customer, index) => (
              <div key={index} className="flex justify-between py-3">
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-500">
                    {customer.invoices} invoices
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(customer.amount)}</p>
                  <p className="text-xs text-orange-600">WHT withheld</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center p-8 bg-gray-50 border rounded-lg">
            <ClipboardList className="w-10 h-10 text-gray-400 mb-2" />
            <p className="font-semibold text-gray-800">No WHT Found</p>
            <p className="text-sm text-gray-500">No withholding tax records available.</p>
          </div>
        )}
      </div>

      {/* SUMMARY DETAILS */}
      <div className="p-6 bg-white rounded-xl shadow-sm border mt-6">
        <h2 className="text-lg font-bold">WHT Summary Details</h2>
        <p className="text-sm text-gray-500 mb-4">Detailed breakdown</p>

        <div className="grid grid-cols-2 gap-6">
          {data.summaryDetails.map((item, index) => (
            <div key={index}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`text-xl font-semibold ${item.color || "text-black"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
