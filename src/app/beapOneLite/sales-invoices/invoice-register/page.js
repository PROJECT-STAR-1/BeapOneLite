'use client'
import { useState, useEffect } from 'react';
import {
  Download, Filter, Search, Calendar, DollarSign, User,
  ChevronDown, MapPin, MoreHorizontal, ArrowUpDown, Trash2,
  LucideEdit, Eye
} from 'lucide-react';
import Layout from "@/component/BeapOneLite/Layout";

const InvoiceRegister = () => {
  const [summary, setSummary] = useState(null);
  const [entries, setEntries] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isAdvancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Fetch data from mocked API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/beapOnelite/invoiceregister');
        const data = await res.json();
        setSummary(data.summary);
        setEntries(data.entries);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const badgeColors = {
    Draft: "bg-gray-200 text-gray-700",
    Paid: "bg-green-100 text-green-700",
    Quote: "bg-blue-100 text-blue-700",
    Overdue: "bg-red-100 text-red-700",
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === "date") {
      valA = new Date(a.date);
      valB = new Date(b.date);
    }
    if (sortDirection === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  const toggleMenu = (index) => setOpenMenuIndex(openMenuIndex === index ? null : index);

  useEffect(() => {
    const close = () => setOpenMenuIndex(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  if (!summary) return <Layout><div className="p-6">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Invoice Register</h1>
            <p className="text-gray-500">Complete ledger view of all invoices and quotes</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Export */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-md shadow-sm hover:bg-gray-100"
              >
                <Download className="mr-2" /> 
                Export
                <ChevronDown size={16} className="ml-2" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Export as CSV</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Export as Excel</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Export as PDF</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-600">Total Value</h3>
            <p className="text-xl">{summary.totalValue}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-600">Paid</h3>
            <p className="text-xl">{summary.paid}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-yellow-600">Pending</h3>
            <p className="text-xl">{summary.pending}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-600">Overdue</h3>
            <p className="text-xl">{summary.overdue}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Draft</h3>
            <p className="text-xl">{summary.draft}</p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" />
            <input type="text" placeholder="Search customer or invoice ID"
              className="pl-10 pr-4 py-1 border border-gray-300 rounded-md h-10 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">All Types</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>All Types</option>
              <option>Invoices Only</option>
              <option>Quotes Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">All Status</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>All Status</option>
              <option>Draft</option>
              <option>Pending</option>
              <option>Paid</option>
              <option>Overdue</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">All Locations</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>All Locations</option>
              <option>Lagos Main Branch</option>
              <option>Abuja Office</option>
              <option>Port Harcourt</option>
            </select>
          </div>
        </div>

        {/* ADVANCED FILTER TOGGLE */}
        <section>
          <div className="mb-4 mt-3">
            <button 
              onClick={() => setAdvancedFiltersOpen(!isAdvancedFiltersOpen)} 
              className="text-gray-600 font-semibold border px-3 py-1.5 rounded-lg flex items-center space-x-2"
            >
              <Filter size={19}/>
              <span>{isAdvancedFiltersOpen ? 'Hide Advanced Filters' : 'Show Advanced Filters'}</span>
            </button>
          </div>

          {isAdvancedFiltersOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Date From</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Date To</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          )}
        </section>

        {/* REGISTER ENTRIES */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Register Entries ({entries.length})</h2>

            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-1 text-gray-600" onClick={() => toggleSort("date")}>
                <Calendar size={16} />
                <span>Date</span>
                {sortField === "date" && <ArrowUpDown size={14}/>}
              </button>

              <button className="flex items-center space-x-1 text-gray-600" onClick={() => toggleSort("amount")}>
                <DollarSign size={16} />
                <span>Amount</span>
                {sortField === "amount" && <ArrowUpDown size={14}/>}
              </button>

              <button className="flex items-center space-x-1 text-gray-600" onClick={() => toggleSort("customer")}>
                <User size={16} />
                <span>Customer</span>
                {sortField === "customer" && <ArrowUpDown size={14}/>}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {sortedEntries.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">
                {/* ID + BADGES */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">{item.id}</span>
                    {item.status && <span className={`px-2 py-1 rounded text-xs ${badgeColors[item.status]}`}>{item.status}</span>}
                    {item.type === "Quote" && <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">Quote</span>}
                  </div>

                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="text-gray-500 cursor-pointer" onClick={() => toggleMenu(idx)} />
                    {openMenuIndex === idx && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50 py-2">
                        <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                          <Eye size={18} className="mr-2"/> View Details
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                          <LucideEdit size={18} className="mr-2"/> Edit
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                          <Download size={18} className="mr-2"/> Download PDF
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 text-sm">
                          <Trash2 size={18} className="mr-2"/> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* CUSTOMER */}
                <p className="text-gray-700 mt-1">{item.customer}</p>

                {/* META */}
                <div className="flex flex-wrap mt-2 text-gray-500 text-sm space-x-4">
                  <span className="flex items-center space-x-1"><Calendar size={14}/><span>{item.date}</span></span>
                  {item.due && <span className="flex items-center space-x-1"><Calendar size={14}/><span>Due: {item.due}</span></span>}
                  <span className="flex items-center space-x-1"><MapPin size={14}/><span>{item.location}</span></span>
                </div>

                {/* AMOUNT */}
                <p className="font-semibold text-right mt-2">{item.amount}</p>

                {/* USD CONVERSION */}
                {item.usd && <p className="text-xs text-right text-gray-500">≈ {item.usd} @ {item.rate}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceRegister;
