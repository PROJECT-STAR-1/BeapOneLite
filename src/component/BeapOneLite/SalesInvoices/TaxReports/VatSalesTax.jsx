"use client";

import { useEffect, useState } from "react";
import { FileText, Receipt, FileCheck, CheckCircle2, Download, MapPin } from "lucide-react";

export default function VatSalesTax() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/beapOnelite/tax-wht-reports");
        const json = await res.json();
        setData(json.vatsalestax); // get the nested vatsalestax object
      } catch (err) {
        console.error("Failed to fetch VAT data:", err);
      }
    }

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  // Helper function for colors (instead of using JSON)
  const getRateColor = (label) => {
    switch (label) {
      case "VAT 7.5%":
        return "bg-green-500";
      case "Zero-Rated (0%)":
      case "Exempt":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="p-6 space-y-8">

      {/* ===================== TOP CARDS ===================== */}
      <div className="grid grid-cols-4 gap-6">
        {/* Net Taxable Sales */}
        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium">Net Taxable Sales</p>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="text-blue-500" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3">
            ₦{data.netTaxableSales.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Subtotal before VAT</p>
        </div>

        {/* Total VAT Collected */}
        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium">Total VAT Collected</p>
            <div className="p-2 bg-green-100 rounded-full">
              <Receipt className="text-green-600" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3">
            ₦{data.totalVatCollected.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">@ {data.vatRate}% rate</p>
        </div>

        {/* Total Invoices */}
        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium">Total Invoices</p>
            <div className="p-2 bg-purple-100 rounded-full">
              <FileCheck className="text-purple-600" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3">{data.totalInvoices}</p>
          <p className="text-sm text-gray-500 mt-1">In period</p>
        </div>

        {/* Tax Compliance */}
        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium">Tax Compliance</p>
            <div className="p-2 bg-yellow-100 rounded-full">
              <CheckCircle2 className="text-yellow-600" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3">{data.taxCompliance}</p>
          <p className="text-sm text-green-600 mt-1 flex items-center">
            <CheckCircle2 size={16} className="text-green-500 mr-1" />
            All invoices taxed
          </p>
        </div>
      </div>

      {/* ===================== VAT Breakdown ===================== */}
      <div className="border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-lg font-semibold">VAT Breakdown by Tax Rate</h3>
            <p className="text-sm text-gray-500">Tax collected grouped by rate</p>
          </div>
          <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md hover:bg-gray-50">
            <Download size={16} />
            <span className="text-sm">Export</span>
          </button>
        </div>

        <div className="space-y-5 mt-4">
          {data.vatBreakdown.map((item, i) => (
            <div key={i} className="border-b pb-4 last:border-none">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getRateColor(item.label)}`} />
                    <p className="font-medium text-gray-700">{item.label}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.invoices} invoices</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ₦{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">
                    on ₦{item.base.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== VAT BY LOCATION ===================== */}
      <div className="border rounded-xl p-6 shadow-sm mt-6">
        <h3 className="text-lg font-semibold">VAT by Location</h3>
        <p className="text-sm text-gray-500 -mt-1 mb-4">
          Tax collected per business location
        </p>
        <div className="space-y-3">
          {data.locations.map((loc, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-gray-500" size={18} />
                <div>
                  <p className="font-medium text-gray-700">{loc.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{loc.invoices} invoices</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₦{loc.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500">
                  VAT on ₦{loc.baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
