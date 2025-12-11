"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Settings2,
  Download,
  Eye,
  Paperclip,
  Menu,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";

// The NGN symbol
const CURRENCY = "₦";

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const STATUS_STYLE_MAP = {
  Approved: { color: "text-green-800", bg: "bg-green-100" },
  "Pending Review": { color: "text-amber-800", bg: "bg-amber-100" },
  Rejected: { color: "text-red-800", bg: "bg-red-100" },
  Submitted: { color: "text-blue-800", bg: "bg-blue-100" },
  default: { color: "text-gray-900", bg: "bg-gray-200" },
};

/* ============================================================
    HELPER FUNCTIONS
============================================================ */

const calculateSummary = (expenses) => {
  let finalSummary = {
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalCount: 0,
  };

  expenses.forEach((expense) => {
    // Assuming amount comes as string with commas
    const amount = parseFloat(expense.amount.replace(/,/g, ""));
    finalSummary.total += amount;
    finalSummary.totalCount += 1;

    if (expense.status === "Approved") {
      finalSummary.approved += amount;
    } else if (expense.status === "Rejected") {
      finalSummary.rejected += amount;
    } else {
      finalSummary.pending += amount;
    }
  });

  const formatter = (num) =>
    num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return {
    total: formatter(finalSummary.total),
    approved: formatter(finalSummary.approved),
    pending: formatter(finalSummary.pending),
    rejected: formatter(finalSummary.rejected),
    totalCount: finalSummary.totalCount,
  };
};

/* ============================================================
    REUSABLE COMPONENTS
============================================================ */

/**
 * Custom Dropdown Component
 */
const CustomDropdown = ({ title, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const label = selected || title;
  const Chevron = isOpen ? ChevronUp : ChevronDown;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
        <span>{label}</span>
        <Chevron size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          <div
            className={`px-4 py-2 text-sm cursor-pointer text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition
                  ${
                    selected === null
                      ? "bg-indigo-100 font-semibold text-indigo-700"
                      : ""
                  }`}
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}>
            {title}
            {selected === null && (
              <CheckCircle size={14} className="inline ml-2 align-middle" />
            )}
          </div>
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-2 text-sm cursor-pointer text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition
                  ${
                    selected === option
                      ? "bg-indigo-100 font-semibold text-indigo-700"
                      : ""
                  }`}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}>
              {option}
              {selected === option && (
                <CheckCircle size={14} className="inline ml-2 align-middle" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Export Dropdown Component
 */
const ExportDropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center space-x-1 px-3 py-2.5 text-sm font-medium rounded-lg shadow-sm transition bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        title="Export Data">
        <Download size={18} />
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-32 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 text-sm cursor-pointer text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition"
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLE_MAP[status] || STATUS_STYLE_MAP.default;

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${style.bg} ${style.color}`}>
      {status}
    </span>
  );
};

const TagBadge = ({ tag }) => (
  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-200 text-green-800">
    {tag}
  </span>
);

const StatusMetricCard = ({
  title,
  value,
  icon: Icon,
  color,
  isTotal,
  totalCount,
}) => (
  <div className="p-4 sm:p-5 rounded-xl bg-white shadow-md border border-gray-100 flex flex-col justify-between h-full">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-gray-500 leading-tight">{title}</p>
      {isTotal ? (
        <DollarSign size={16} className="text-gray-400" />
      ) : (
        <Icon size={16} className={`${color} opacity-75`} />
      )}
    </div>
    <div>
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-none">
        {CURRENCY}
        {value}
      </h3>
      {isTotal && (
        <p className="text-xs text-gray-400 mt-1">{totalCount} expenses</p>
      )}
    </div>
  </div>
);

const ExpenseListItem = ({ expense }) => {
  const isRejected = expense.status === "Rejected";

  return (
    <div
      className={`relative p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-4 transition duration-200 
      hover:bg-gray-50 hover:ring-2 hover:ring-indigo-300
      ${isRejected ? "border-red-300 ring-1 ring-red-100" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3 md:gap-x-6 items-center">
        {/* Left Section */}
        <div className="md:col-span-4 flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-indigo-700">
              {expense.id}
            </span>
            <StatusBadge status={expense.status} />
            {expense.tags.map((tag, i) => (
              <TagBadge key={i} tag={tag} />
            ))}
          </div>
          <p className="text-md font-medium text-gray-800 leading-tight">
            Vendor: {expense.vendor}
          </p>
          <div className="text-xs text-gray-500 flex items-center space-x-4">
            <span>{expense.date}</span>
            <span>Submitted by: {expense.submittedBy}</span>
            {expense.approvedBy && (
              <span className="text-green-600">
                Approved by: {expense.approvedBy}
              </span>
            )}
          </div>
        </div>

        {/* Center Section */}
        <div className="md:col-span-5 flex flex-col space-y-2 text-sm">
          <p className="text-gray-700">
            <span className="font-medium text-gray-600">Purpose</span>:{" "}
            {expense.purpose}
          </p>
          <p className="text-gray-700">
            <span className="font-medium text-gray-600">Category</span>:{" "}
            {expense.category}
          </p>
          <div className="flex items-center space-x-3 text-xs text-indigo-600 font-medium">
            {expense.hasReceipt && (
              <span className="flex items-center">
                <Paperclip size={12} className="mr-1" />
                Receipt attached
              </span>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="md:col-span-3 flex justify-between items-center md:justify-end md:items-start text-right">
          <div className="flex flex-col items-end">
            <p className="text-xl font-semibold text-gray-900 leading-none">
              {CURRENCY}
              {expense.amount}
            </p>
            <span className="mt-1 text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-medium">
              {expense.paymentMethod}
            </span>
          </div>
          <button
            title="View Details"
            className="ml-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition">
            <Eye size={20} />
          </button>
        </div>
      </div>

      {isRejected && expense.rejectionReason && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          <span className="font-semibold mr-2">Rejection Reason:</span>
          {expense.rejectionReason}
        </div>
      )}
    </div>
  );
};

/* ============================================================
    MAIN APPLICATION
============================================================ */

const ExpensesRegister = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    status: null,
    category: null,
    method: null,
    dateFrom: "",
    dateTo: "",
    exportFormat: null,
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/expenseRegister");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch expense register data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredExpenses = useMemo(() => {
    if (!data?.expenseList) return [];

    return data.expenseList.filter((expense) => {
      const tabMatch =
        activeTab === "all" || expense.tags.includes("Petty Cash");
      const statusMatch = !filters.status || expense.status === filters.status;
      const categoryMatch =
        !filters.category || expense.category === filters.category;
      const methodMatch =
        !filters.method || expense.paymentMethod === filters.method;
      const queryLower = searchQuery.toLowerCase();
      const searchMatch =
        !queryLower ||
        expense.vendor.toLowerCase().includes(queryLower) ||
        expense.purpose.toLowerCase().includes(queryLower) ||
        expense.id.toLowerCase().includes(queryLower);

      return (
        tabMatch && statusMatch && categoryMatch && methodMatch && searchMatch
      );
    });
  }, [data, activeTab, filters, searchQuery]);

  const currentSummary = useMemo(
    () => calculateSummary(filteredExpenses),
    [filteredExpenses]
  );

  // Loading State
  if (loading) {
    return (
      <Layout>
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-700 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading Expenses...</p>
        </div>
      </Layout>
    );
  }

  // Safe Data Access
  const options = data?.options ?? {
    categories: [],
    statuses: [],
    paymentMethods: [],
    exportFormats: [],
  };

  return (
    <Layout>
      <div className="w-full font-sans p-2 sm:p-4 lg:px-6 pt-0">
        {/* 1. Header Section */}
        <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <button className="md:hidden p-2 mr-2 text-gray-600 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={24} />
            </button>
            <Menu size={30} className="mr-3 text-indigo-700 hidden md:block" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Expense Register
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Comprehensive expense ledger for Lagos Main Branch
              </p>
            </div>
          </div>
        </header>

        {/* 2. Tabs */}
        <div className="flex items-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition duration-150
            ${
              activeTab === "all"
                ? "bg-indigo-700 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}>
            <FileText size={18} className="mr-2" />
            All Expenses
          </button>
          <button
            onClick={() => setActiveTab("petty_cash")}
            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition duration-150
            ${
              activeTab === "petty_cash"
                ? "bg-indigo-700 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}>
            <DollarSign size={18} className="mr-2" />
            Petty Cash Log
          </button>
        </div>

        {/* 3. Status/Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatusMetricCard
            title="Total Amount"
            value={currentSummary.total}
            icon={DollarSign}
            color="text-gray-900"
            isTotal={true}
            totalCount={currentSummary.totalCount}
          />
          <StatusMetricCard
            title="Approved"
            value={currentSummary.approved}
            icon={CheckCircle}
            color="text-green-600"
          />
          <StatusMetricCard
            title="Pending"
            value={currentSummary.pending}
            icon={Clock}
            color="text-amber-500"
          />
          <StatusMetricCard
            title="Rejected"
            value={currentSummary.rejected}
            icon={XCircle}
            color="text-red-500"
          />
        </div>

        {/* 4. Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 p-4">
            <div className="flex-grow relative w-full sm:w-auto">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by vendor, purpose, or expense ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder:text-gray-500 bg-white text-gray-900"
              />
            </div>

            <div className="flex space-x-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm transition
                  ${
                    isFilterOpen
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-300"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}>
                <Settings2 size={18} className="mr-2" />
                Filters
                {isFilterOpen ? (
                  <ChevronUp size={16} className="ml-2" />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </button>

              <ExportDropdown
                options={options.exportFormats}
                onSelect={(format) =>
                  setFilters((f) => ({ ...f, exportFormat: format }))
                }
              />
            </div>
          </div>

          <div
            className={`px-4 pb-4 transition-all duration-300 ease-in-out
            ${
              isFilterOpen
                ? "max-h-96 opacity-100 border-t border-gray-200 pt-4"
                : "max-h-0 opacity-0 overflow-hidden pt-0"
            }`}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <CustomDropdown
                title="All Statuses"
                options={options.statuses}
                selected={filters.status}
                onSelect={(status) => setFilters((f) => ({ ...f, status }))}
              />
              <CustomDropdown
                title="All Categories"
                options={options.categories}
                selected={filters.category}
                onSelect={(category) => setFilters((f) => ({ ...f, category }))}
              />
              <CustomDropdown
                title="All Methods"
                options={options.paymentMethods}
                selected={filters.method}
                onSelect={(method) => setFilters((f) => ({ ...f, method }))}
              />
              {/* Date Inputs */}
              <div className="relative w-full">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, dateFrom: e.target.value }))
                  }
                  className="w-full pl-16 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none text-xs">
                  From:
                </span>
              </div>
              <div className="relative w-full">
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, dateTo: e.target.value }))
                  }
                  className="w-full pl-16 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none text-xs">
                  To:
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Expense List */}
        <div className="expense-list">
          {filteredExpenses.map((expense) => (
            <ExpenseListItem key={expense.id} expense={expense} />
          ))}
          {filteredExpenses.length === 0 && (
            <div className="text-center p-12 bg-white rounded-xl text-gray-500 border-2 border-dashed border-gray-300">
              No expenses found matching the current criteria.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ExpensesRegister;
