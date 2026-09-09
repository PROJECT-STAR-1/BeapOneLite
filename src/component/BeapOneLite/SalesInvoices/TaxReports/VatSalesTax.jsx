"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Receipt,
  FileCheck,
  CheckCircle2,
  Download,
  MapPin,
} from "lucide-react";

export default function VatSalesTax({ dateRange, startDate, endDate, location }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const query = new URLSearchParams({ dateRange, startDate, endDate, location });
        const res = await fetch(`/api/beapOnelite/tax-wht-reports?${query}`);
        const json = await res.json();
        setData(json.vatsalestax);
      } catch (err) {
        console.error("Failed to fetch VAT data:", err);
      }
    }
    fetchData();
  }, [dateRange, startDate, endDate, location]);

  if (!data) return <p>Loading...</p>;

  // ✅ Filter invoices based on location
  const filteredInvoices = location && location !== "All"
    ? data.invoices.filter(inv => inv.location === location)
    : data.invoices;

  // ✅ Group invoices by location
  const groupedLocations = filteredInvoices.reduce((acc, inv) => {
    const existing = acc.find(l => l.name === inv.location);
    if (existing) {
      existing.invoices += 1;
      existing.vatAmount += inv.vatAmount;
      existing.baseAmount += inv.baseAmount;
    } else {
      acc.push({
        name: inv.location,
        invoices: 1,
        vatAmount: inv.vatAmount,
        baseAmount: inv.baseAmount,
      });
    }
    return acc;
  }, []);

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

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between">
            <p className="text-gray-700 font-medium">Net Taxable Sales</p>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3">₦{data.netTaxableSales.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Subtotal before VAT</p>
        </div>

        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between">
            <p className="text-gray-700 font-medium">Total VAT Collected</p>
            <div className="p-2 bg-green-100 rounded-full">
              <Receipt className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3">₦{data.totalVatCollected.toLocaleString()}</p>
          <p className="text-sm text-green-600">@ {data.vatRate}% rate</p>
        </div>

        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between">
            <p className="text-gray-700 font-medium">Total Invoices</p>
            <div className="p-2 bg-purple-100 rounded-full">
              <FileCheck className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3">{data.totalInvoices}</p>
          <p className="text-sm text-gray-500">In period</p>
        </div>

        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between">
            <p className="text-gray-700 font-medium">Tax Compliance</p>
            <div className="p-2 bg-yellow-100 rounded-full">
              <CheckCircle2 className="text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-3">{data.taxCompliance}</p>
          <p className="text-sm text-green-600 flex items-center">
            <CheckCircle2 size={16} className="mr-1" /> Fully compliant
          </p>
        </div>
      </div>

      {/* VAT BREAKDOWN */}
      <div className="border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold">VAT Breakdown by Tax Rate</h3>
            <p className="text-sm text-gray-500">Tax collected grouped by rate</p>
          </div>
          <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
        </div>

        <div className="space-y-5 mt-4">
          {data.vatBreakdown.map((item, i) => (
            <div key={i} className="border-b pb-4">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getRateColor(item.label)}`} />
                    <p className="font-medium">{item.label}</p>
                  </div>
                  <p className="text-sm text-gray-500">{item.invoices} invoices</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">₦{item.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">on ₦{item.base.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VAT PER LOCATION */}
      <div className="border rounded-xl p-6 shadow-sm mt-6">
        <h3 className="text-lg font-semibold">VAT by Location</h3>
        <p className="text-sm text-gray-500 -mt-1 mb-4">
          Tax collected per business location
        </p>

        <div className="space-y-3">
          {groupedLocations.map((loc, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2">
                <MapPin className="text-gray-500" size={18} />
                <div>
                  <p className="font-medium">{loc.name}</p>
                  <p className="text-sm text-gray-500">{loc.invoices} invoices</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">₦{loc.vatAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">VAT on ₦{loc.baseAmount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
