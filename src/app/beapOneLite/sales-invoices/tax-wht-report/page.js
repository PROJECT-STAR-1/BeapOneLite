"use client";

import { useState } from "react";
import { Calendar, CircleDollarSign, MapPin, Percent } from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";
import VatSalesTax from "@/component/BeapOneLite/SalesInvoices/TaxReports/VatSalesTax";
import WithholdingTax from "@/component/BeapOneLite/SalesInvoices/TaxReports/WithholdingTax";

export default function TaxWhtReport() {
  const [dateRange, setDateRange] = useState("This Week");
  const [location, setLocation] = useState("All Locations");
  const [activeTaxTab, setActiveTaxTab] = useState("vat");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dateOptions = [
    "Today",
    "This Week",
    "This Month",
    "This Quarter",
    "This Year",
    "Custom Range",
  ];

  const locationOptions = [
    "All Locations",
    "Lagos Main Branch",
    "Abuja Office",
    "Port Harcourt",
  ];

  const [openDateDropdown, setOpenDateDropdown] = useState(false);
  const [openLocationDropdown, setOpenLocationDropdown] = useState(false);

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-semibold text-gray-900">Tax & WHT Report</h1>
        <p className="text-gray-500 mt-1">
          VAT/Sales Tax and Withholding Tax compliance tracking
        </p>

        {/* FILTER BAR */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-5 flex justify-around items-center gap-4">
          
          {/* Date Range */}
          <div className="relative">
            <button
              onClick={() => setOpenDateDropdown(!openDateDropdown)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
            >
              <Calendar size={18} />
              {dateRange}
            </button>

            {openDateDropdown && (
              <div className="absolute mt-2 w-44 bg-white shadow-xl rounded-lg border z-10">
                {dateOptions.map((opt) => (
                  <p
                    key={opt}
                    onClick={() => {
                      setDateRange(opt);
                      setOpenDateDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    {opt}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* START DATE */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent outline-none text-gray-700 w-32"
            />
          </div>

          {/* END DATE */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent outline-none text-gray-700 w-32"
            />
          </div>

          {/* LOCATION */}
          <div className="relative">
            <button
              onClick={() => setOpenLocationDropdown(!openLocationDropdown)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
            >
              <MapPin size={18} />
              {location}
            </button>

            {openLocationDropdown && (
              <div className="absolute mt-2 w-44 bg-white shadow-xl rounded-lg border z-10">
                {locationOptions.map((opt) => (
                  <p
                    key={opt}
                    onClick={() => {
                      setLocation(opt);
                      setOpenLocationDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    {opt}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="mt-6 w-full bg-gray-100 rounded-xl flex items-center">
          <p
            onClick={() => setActiveTaxTab("vat")}
            className={`flex w-full px-6 py-3 items-center gap-2 font-semibold cursor-pointer rounded-xl justify-center ${
              activeTaxTab === "vat"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <CircleDollarSign size={20} /> VAT / Sales Tax
          </p>

          <p
            onClick={() => setActiveTaxTab("wht")}
            className={`flex w-full px-6 py-3 items-center gap-2 font-semibold cursor-pointer rounded-xl justify-center ${
              activeTaxTab === "wht"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <Percent size={20} /> Withholding Tax (WHT)
          </p>
        </div>

        {/* CONTENT */}
        <div className="mt-4 p-6 bg-white rounded-xl shadow-sm">
          {activeTaxTab === "vat" && (
            <VatSalesTax
              dateRange={dateRange}
              startDate={startDate}
              endDate={endDate}
               location={location === "All Locations" ? "" : location}
            />
          )}

          {activeTaxTab === "wht" && (
            <WithholdingTax
              dateRange={dateRange}
              startDate={startDate}
              endDate={endDate}
              location={location}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
