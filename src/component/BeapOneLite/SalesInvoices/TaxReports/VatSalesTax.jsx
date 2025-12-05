"use client";

import {
  FileText,
  Receipt,
  FileCheck,
  CheckCircle2,
  Download,
  MapPin,
} from "lucide-react";

export default function VatSalesTax() {
  const data = {
    netTaxableSales: 16720930.23,
    totalVatCollected: 1254069.77,
    vatRate: 7.5,
    totalInvoices: 4,
    taxCompliance: "100%",
    vatBreakdown: [
      {
        label: "VAT 7.5%",
        invoices: 4,
        rateColor: "bg-green-500",
        amount: 1254069.77,
        base: 16720930.23,
      },
      {
        label: "Zero-Rated (0%)",
        invoices: 0,
        rateColor: "bg-gray-400",
        amount: 0.0,
        base: 0.0,
      },
      {
        label: "Exempt",
        invoices: 0,
        rateColor: "bg-gray-400",
        amount: 0.0,
        base: 0.0,
      },
    ],
  };

  const locations = [
  {
    name: "Lagos Main Branch",
    invoices: 3,
    vatAmount: 1079651.16,
    baseAmount: 14395348.84,
  },
  {
    name: "Abuja Office",
    invoices: 1,
    vatAmount: 174418.60,
    baseAmount: 2325581.40,
  },
];


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

          {/* Export Button */}
          <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md hover:bg-gray-50">
            <Download size={16} />
            <span className="text-sm">Export</span>
          </button>
        </div>

        {/* Breakdown List */}
        <div className="space-y-5 mt-4">
          {data.vatBreakdown.map((item, i) => (
            <div key={i} className="border-b pb-4 last:border-none">

              <div className="flex items-center justify-between">
                {/* Left: dot + label + invoices */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.rateColor}`} />
                    <p className="font-medium text-gray-700">{item.label}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.invoices} invoices
                  </p>
                </div>

                {/* Right: ₦amount on ₦base */}
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
    {locations.map((loc, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
      >
        {/* Left Side: location + invoices */}
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="text-gray-500" size={18} />
            <p className="font-medium text-gray-700">{loc.name}</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {loc.invoices} invoices
          </p>
        </div>

        {/* Right Side: VAT amount */}
        <div className="text-right">
          <p className="font-semibold">
            ₦{loc.vatAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-500">
            VAT on ₦{loc.baseAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


    </div>
  );
}
