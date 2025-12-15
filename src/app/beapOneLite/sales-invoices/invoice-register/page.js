'use client'
import { useState, useEffect, useMemo } from 'react';
import {
  Download, Filter, Search, Calendar, DollarSign, User,
  ChevronDown, MapPin, MoreHorizontal, ArrowUpDown, Trash2,
  LucideEdit, Eye, ChevronUp
} from 'lucide-react';
import Layout from "@/component/BeapOneLite/Layout";

const InvoiceRegister = () => {

  // ---------------------------------------
  // RAW DATA FROM API
  // ---------------------------------------
  const [summary, setSummary] = useState(null);
  const [entries, setEntries] = useState([]);

  // ---------------------------------------
  // FILTERS
  // ---------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ---------------------------------------
  // UI STATE
  // ---------------------------------------
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isAdvancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);



  // ---------------------------------------
  // FETCH API DATA
  // ---------------------------------------
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
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
    Cancelled: "bg-red-50 text-red-400",
  };


  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };



  // ---------------------------------------
  // FILTERED + SORTED ENTRIES
  // ---------------------------------------
  const filteredEntries = useMemo(() => {
    let data = [...entries];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        item =>
          item.customer.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      );
    }

    // Type
    if (typeFilter !== "All Types") {
      const isQuote = typeFilter === "Quotes Only";
      data = data.filter(item => (item.type === "Quote") === isQuote);
    }

    // Status
    if (statusFilter !== "All Status") {
      data = data.filter(item => item.status === statusFilter);
    }

    // Location
    if (locationFilter !== "All Locations") {
      data = data.filter(item => item.location === locationFilter);
    }

    // DATE RANGE
    if (dateFrom || dateTo) {
      data = data.filter(item => {
        const d = new Date(item.date);

        if (dateFrom && d < new Date(dateFrom)) return false;
        if (dateTo && d > new Date(dateTo)) return false;

        return true;
      });
    }

    return data;
  }, [entries, searchQuery, typeFilter, statusFilter, locationFilter, dateFrom, dateTo]);



  // ---------------------------------------
  // SORTED ENTRIES
  // ---------------------------------------
  const sortedEntries = useMemo(() => {
    let data = [...filteredEntries];

    if (!sortField) return data;

    return data.sort((a, b) => {
      let A = a[sortField];
      let B = b[sortField];

      if (sortField === "date") {
        A = new Date(a.date);
        B = new Date(b.date);
      }

      if (sortDirection === "asc") return A > B ? 1 : -1;
      return A < B ? 1 : -1;
    });
  }, [filteredEntries, sortField, sortDirection]);



  // ---------------------------------------
  // DYNAMIC METRICS FROM FILTERED DATA
  // ---------------------------------------
  const liveSummary = useMemo(() => {
    let TotalValue = 0;
    let Paid = 0;
    let Pending = 0;
    let Overdue = 0;
    let Draft = 0;

    filteredEntries.forEach(item => {
      const numAmount = parseFloat(item.amount.replace(/[^\d.]/g, "")) || 0;
      TotalValue += numAmount;

      if (item.status === "Paid") Paid += numAmount;
      if (item.status === "Pending") Pending += numAmount;
      if (item.status === "Overdue") Overdue += numAmount;
      if (item.status === "Draft") Draft += numAmount;
    });

    return {
      totalValue: "₦" + TotalValue.toLocaleString(),
      paid: "₦" + Paid.toLocaleString(),
      pending: "₦" + Pending.toLocaleString(),
      overdue: "₦" + Overdue.toLocaleString(),
      draft: "₦" + Draft.toLocaleString(),
    };
  }, [filteredEntries]);



  const toggleMenu = (index) =>
    setOpenMenuIndex(openMenuIndex === index ? null : index);



  if (!summary) return <Layout><div className="p-6">Loading...</div></Layout>;


  // ---------------------------------------------------------------------------
  //   RETURN JSX
  // ---------------------------------------------------------------------------

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Invoice Register</h1>
            <p className="text-gray-500">Complete ledger view of all invoices and quotes</p>
          </div>

          {/* EXPORT */}
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
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Export CSV</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Export Excel</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Export PDF</button>
              </div>
            )}
          </div>
        </div>



        {/* ---------------------------------------
             DYNAMIC SUMMARY CARDS 
        --------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

          <Metric label="Total Value" value={liveSummary.totalValue} color="green" />
          <Metric label="Paid" value={liveSummary.paid} color="green" />
          <Metric label="Pending" value={liveSummary.pending} color="yellow" />
          <Metric label="Overdue" value={liveSummary.overdue} color="red" />
          <Metric label="Draft" value={liveSummary.draft} color="gray" />

        </div>



        {/* ---------------------------------------
                FILTER BAR
        --------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute inset-y-0 left-0 ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer or invoice ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Type */}
          <FilterSelect
            label="All Types"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              "All Types",
              "Invoices Only",
              "Quotes Only"
            ]}
          />

          {/* Status */}
          <FilterSelect
            label="All Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              "All Status",
              "Draft",
              "Pending",
              "Paid",
              "Overdue",
              "Cancelled"
            ]}
          />

          {/* Location */}
          <FilterSelect
            label="All Locations"
            value={locationFilter}
            onChange={setLocationFilter}
            options={[
              "All Locations",
              "Lagos Main Branch",
              "Abuja Office",
              "Port Harcourt"
            ]}
          />

        </div>



        {/* ---------------------------------------
               ADVANCED FILTERS
        --------------------------------------- */}
        <section>

          <div className="mb-4 mt-3 flex items-center space-x-4">
            <button
              onClick={() => setAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
              className="flex items-center border px-4 py-2 rounded-lg text-gray-600 font-semibold"
            >
              <Filter size={18} className="mr-2" />
              {isAdvancedFiltersOpen ? "Hide Advanced Filters" : "Show Advanced Filters"}
              {isAdvancedFiltersOpen ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
            </button>
          </div>

          {isAdvancedFiltersOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

              {/* Date From */}
              <DateInput
                label="Date From"
                value={dateFrom}
                onChange={setDateFrom}
              />

              {/* Date To */}
              <DateInput
                label="Date To"
                value={dateTo}
                onChange={setDateTo}
              />

            </div>
          )}

        </section>



        {/* ---------------------------------------
               REGISTER ENTRIES
        --------------------------------------- */}
        <div className="mt-10">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Register Entries ({filteredEntries.length})
            </h2>

            <div className="flex items-center space-x-6">

              <SortButton
                label="Date"
                icon={<Calendar size={16} />}
                field="date"
                sortField={sortField}
                toggleSort={toggleSort}
              />

              <SortButton
                label="Amount"
                icon={<DollarSign size={16} />}
                field="amount"
                sortField={sortField}
                toggleSort={toggleSort}
              />

              <SortButton
                label="Customer"
                icon={<User size={16} />}
                field="customer"
                sortField={sortField}
                toggleSort={toggleSort}
              />

            </div>
          </div>



          <div className="space-y-4">
            {sortedEntries.length ? (
              sortedEntries.map((item, idx) => (
                <InvoiceCard
                  key={idx}
                  item={item}
                  idx={idx}
                  badgeColors={badgeColors}
                  openMenuIndex={openMenuIndex}
                  toggleMenu={toggleMenu}
                />
              ))
            ) : (
              <div className="text-center py-10 border rounded-lg text-gray-500 bg-gray-50">
                No matching entries found.
              </div>
            )}
          </div>

        </div>

      </div>
    </Layout>
  );
};



/* --------------------------------------------------------------------
   REUSABLE SUB-COMPONENTS
-------------------------------------------------------------------- */

const Metric = ({ label, value, color }) => (
  <div className={`bg-${color}-100 p-4 rounded-lg shadow`}>
    <h3 className={`text-lg font-semibold text-${color}-600`}>{label}</h3>
    <p className="text-xl">{value}</p>
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
    >
      {options.map((option, i) => (
        <option key={i}>{option}</option>
      ))}
    </select>
  </div>
);

const DateInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </div>
);

const SortButton = ({ label, icon, field, sortField, toggleSort }) => (
  <button
    onClick={() => toggleSort(field)}
    className={`flex items-center space-x-1 ${
      sortField === field ? "text-indigo-600 font-semibold" : "text-gray-600"
    }`}
  >
    {icon}
    <span>{label}</span>
    {sortField === field && <ArrowUpDown size={14} />}
  </button>
);

const InvoiceCard = ({ item, idx, badgeColors, openMenuIndex, toggleMenu }) => (
  <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">

    {/* ID + BADGES */}
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-3">
        <span className="font-semibold">{item.id}</span>
        <span className={`px-2 py-1 rounded text-xs ${badgeColors[item.status]}`}>
          {item.status}
        </span>
        {item.type === "Quote" && (
          <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
            Quote
          </span>
        )}
      </div>

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <MoreHorizontal
          className="text-gray-500 cursor-pointer"
          onClick={() => toggleMenu(idx)}
        />

        {openMenuIndex === idx && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50 py-2">
            <MenuItem icon={<Eye size={18} />} label="View Details" />
            <MenuItem icon={<LucideEdit size={18} />} label="Edit" />
            <MenuItem icon={<Download size={18} />} label="Download PDF" />
            <MenuItem
              icon={<Trash2 size={18} />}
              label="Delete"
              danger
            />
          </div>
        )}
      </div>
    </div>

    {/* CUSTOMER */}
    <p className="text-gray-700 mt-1">{item.customer}</p>

    {/* META */}
    <div className="flex flex-wrap mt-2 text-gray-500 text-sm space-x-4">
      <span className="flex items-center space-x-1">
        <Calendar size={14} />
        <span>{item.date}</span>
      </span>

      <span className="flex items-center space-x-1">
        <MapPin size={14} />
        <span>{item.location}</span>
      </span>
    </div>

    {/* AMOUNT */}
    <p className="font-semibold text-right mt-2">{item.amount}</p>

    {item.usd && (
      <p className="text-xs text-right text-gray-500">
        ≈ {item.usd} @ {item.rate}
      </p>
    )}
  </div>
);

const MenuItem = ({ icon, label, danger }) => (
  <button
    className={`flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 ${
      danger ? "text-red-600" : "text-gray-700"
    }`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

export default InvoiceRegister;
