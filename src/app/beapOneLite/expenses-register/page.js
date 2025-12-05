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
} from "lucide-react";

// The NGN symbol
const CURRENCY = "₦";

import Layout from "@/component/BeapOneLite/Layout";

/* ============================================================
    MOCK DATA & CONFIGURATION
============================================================ */

const EXPENSE_LIST = [
  {
    id: "EXP-2025028",
    vendor: "Office Depot",
    date: "11/25/2025",
    submittedBy: "Fatima Yusuf",
    purpose: "Printing paper and ink cartridges",
    category: "Small Supplies",
    amount: "6,500.00",
    status: "Submitted",
    tags: ["Petty Cash"],
    paymentMethod: "Cash",
    hasReceipt: false,
  },
  {
    id: "EXP-2025019",
    vendor: "Shoprite",
    date: "11/25/2025",
    submittedBy: "Adebayao Okonkwo",
    purpose: "Office refreshments - Tea, coffee, sugar",
    category: "Small Supplies",
    amount: "8,500.00",
    status: "Pending Review",
    tags: ["Petty Cash"],
    paymentMethod: "Cash",
    hasReceipt: true,
  },
  {
    id: "EXP-2025022",
    vendor: "Market Levy Officer",
    date: "11/25/2025",
    submittedBy: "Fatima Yusuf",
    purpose: "Daily market levy payment",
    category: "Market Levy",
    amount: "3,000.00",
    status: "Pending Review",
    tags: ["Petty Cash"],
    paymentMethod: "Cash",
    hasReceipt: false,
  },
  {
    id: "EXP-2025024",
    vendor: "Social Media Agency",
    date: "11/25/2025",
    submittedBy: "Fatima Yusuf",
    purpose: "Instagram ad campaign - November",
    category: "Marketing & Advertising",
    amount: "22,000.00",
    status: "Pending Review",
    tags: [],
    paymentMethod: "Card",
    hasReceipt: false,
  },
  {
    id: "EXP-2025001",
    vendor: "Mobil Petrol Station",
    date: "11/25/2025",
    submittedBy: "Adebayao Okonkwo",
    approvedBy: "Chioma Nwosu",
    purpose: "Fuel for company vehicle - Logistics delivery",
    category: "Fuel & Transportation",
    amount: "15,000.00",
    status: "Approved",
    tags: ["Petty Cash"],
    paymentMethod: "Cash",
    hasReceipt: true,
  },
  {
    id: "EXP-2025026",
    vendor: "UBA",
    date: "11/24/2025",
    submittedBy: "Fatima Yusuf",
    purpose: "ATM withdrawal charges",
    category: "Bank Charges",
    amount: "1,500.00",
    status: "Pending Review",
    tags: [],
    paymentMethod: "Other",
    hasReceipt: false,
  },
  {
    id: "EXP-2025029",
    vendor: "Luxury Restaurant",
    date: "11/24/2025",
    submittedBy: "Adebayao Okonkwo",
    approvedBy: "Chioma Nwosu",
    purpose: "Team outing lunch",
    category: "Staff Welfare",
    amount: "45,000.00",
    status: "Rejected",
    tags: ["Petty Cash"],
    paymentMethod: "Cash",
    hasReceipt: false,
    rejectionReason:
      "Amount exceeds approved staff welfare budget for casual lunches. Please submit a formal request for team outings exceeding ₦30,000.",
  },
  {
    id: "EXP-2025004",
    vendor: "Computer Village - Ikeja",
    date: "11/24/2025",
    submittedBy: "Fatima Yusuf",
    approvedBy: "Chioma Nwosu",
    purpose: "Office supplies: pens, notebooks, staplers",
    category: "Small Supplies",
    amount: "12,500.00",
    status: "Approved",
    tags: ["Petty Cash"],
    paymentMethod: "Cash",
    hasReceipt: false,
  },
  {
    id: "EXP-2025007",
    vendor: "Legal Associates Ltd",
    date: "11/22/2025",
    submittedBy: "Adebayao Okonkwo",
    approvedBy: "Chioma Nwosu",
    purpose: "Legal consultation - Business registration renewal",
    category: "Professional Fees",
    amount: "50,000.00",
    status: "Approved",
    tags: ["Petty Cash"],
    paymentMethod: "Card",
    hasReceipt: true,
  },
  {
    id: "EXP-2025008",
    vendor: "GTBank",
    date: "11/22/2025",
    submittedBy: "Adebayao Okonkwo",
    approvedBy: "Chioma Nwosu",
    purpose: "Bank transfer charges - Vendor payment",
    category: "Bank Charges",
    amount: "2,500.00",
    status: "Approved",
    tags: [],
    paymentMethod: "Other",
    hasReceipt: false,
  },
];

const CATEGORY_OPTIONS = [
  "Fuel & Transportation",
  "Market Levy",
  "Utilities (Power, Water, Data)",
  "Small Supplies",
  "Staff Welfare",
  "Repairs & Maintenance",
  "Professional Fees",
  "Bank Charges",
  "Marketing & Advertising",
  "Other Operating Expenses",
];
const STATUS_OPTIONS = ["Approved", "Pending Review", "Submitted", "Rejected"];
const METHOD_OPTIONS = ["Cash", "Card", "Other"];
const EXPORT_OPTIONS = ["CSV", "PDF"];

/* ============================================================
    HELPER FUNCTIONS
============================================================ */

const calculateSummary = (expenses, activeTab) => {
  const filtered = expenses.filter(
    (expense) => activeTab === "all" || expense.tags.includes("Petty Cash")
  );

  let finalSummary = {
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalCount: 0,
  };

  filtered.forEach((expense) => {
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
 * Custom Dropdown Component (Select/Filter) with Click-Away closing logic
 */
const CustomDropdown = ({ title, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Logic to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Bind the event listener
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on component unmount or when dropdown closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Determine the label to display
  const label = selected || title;

  // Tailwind classes for the Chevron icon
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
        // Use z-50 and explicit white BG/dark text for high contrast in all environments
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          <div
            key="all"
            // Added text-gray-800 for explicit contrast
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
              // Added text-gray-800 for explicit contrast
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

  // Logic to close the dropdown when clicking outside
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
        // Use z-50 and explicit white BG/dark text for high contrast in all environments
        <div className="absolute right-0 z-50 w-32 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 text-sm cursor-pointer text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition"
              onClick={() => {
                // Placeholder for actual export logic
                console.log(`Exporting ${option}...`);
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
  let style = { color: "text-gray-900", bg: "bg-gray-200" };
  if (status === "Approved")
    style = { color: "text-green-800", bg: "bg-green-100" };
  if (status === "Pending Review")
    style = { color: "text-amber-800", bg: "bg-amber-100" };
  if (status === "Rejected")
    style = { color: "text-red-800", bg: "bg-red-100" };
  if (status === "Submitted")
    style = { color: "text-blue-800", bg: "bg-blue-100" };

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

/**
 * 1. Metric Status Card Component
 */
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

/**
 * 2. Expense List Item Component
 */
const ExpenseListItem = ({ expense }) => {
  const isRejected = expense.status === "Rejected";

  return (
    <div
      // MODIFIED HOVER EFFECT: Removed shadow, added subtle background, and thin ring/outline
      className={`relative p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-4 transition duration-200 
      hover:bg-gray-50 hover:ring-2 hover:ring-indigo-300
      ${isRejected ? "border-red-300 ring-1 ring-red-100" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3 md:gap-x-6 items-center">
        {/* Left Section: ID, Vendor, Status, Date */}
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

        {/* Center Section: Purpose and Category */}
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

        {/* Right Section: Amount and Actions */}
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

      {/* Rejection Reason (Only for Rejected status) */}
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

  // State for Filters
  const [filters, setFilters] = useState({
    status: null,
    category: null,
    method: null,
    dateFrom: "",
    dateTo: "",
    exportFormat: null,
  });

  // ----------------------------------------------------
  // *** NEW: Filter Logic (Fixes the non-functional dropdown issue) ***
  // ----------------------------------------------------
  const filteredExpenses = useMemo(() => {
    return EXPENSE_LIST.filter((expense) => {
      // 1. Tab Filtering (Petty Cash Tag)
      const tabMatch =
        activeTab === "all" || expense.tags.includes("Petty Cash");

      // 2. Status Filter
      const statusMatch = !filters.status || expense.status === filters.status;

      // 3. Category Filter
      const categoryMatch =
        !filters.category || expense.category === filters.category;

      // 4. Method Filter
      const methodMatch =
        !filters.method || expense.paymentMethod === filters.method;

      // 5. Search Query Filter (Vendor or Purpose or ID)
      const queryLower = searchQuery.toLowerCase();
      const searchMatch =
        !queryLower ||
        expense.vendor.toLowerCase().includes(queryLower) ||
        expense.purpose.toLowerCase().includes(queryLower) ||
        expense.id.toLowerCase().includes(queryLower);

      // NOTE: Date filtering logic would be added here if full date functionality was required.

      return (
        tabMatch && statusMatch && categoryMatch && methodMatch && searchMatch
      );
    });
  }, [EXPENSE_LIST, activeTab, filters, searchQuery]);
  // ----------------------------------------------------

  const currentSummary = useMemo(
    () => calculateSummary(filteredExpenses, activeTab),
    [filteredExpenses, activeTab]
  );

  // Custom container for Canvas display
  const containerClasses =
    "w-full font-sans bg-gray-50 min-h-screen p-4 sm:p-6 lg:px-8 lg:pt-8";

  const content = (
    <div className="w-full font-sans p-2 sm:p-4 lg:px-6 pt-0">
      {/* 1. Header Section */}
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <button className="md:hidden p-2 mr-2 text-gray-600 rounded-lg hover:bg-gray-100">
            <ArrowLeft size={24} /> {/* Back button for mobile */}
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

      {/* 4. Search and Filter Bar Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6">
        {/* Search and Action Row */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 p-4">
          <div className="flex-grow relative w-full sm:w-auto">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            {/* === Dark Mode Fix: Added bg-white and text-gray-900 for high contrast === */}
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

            {/* Export Dropdown */}
            <ExportDropdown
              options={EXPORT_OPTIONS}
              onSelect={(format) =>
                setFilters((f) => ({ ...f, exportFormat: format }))
              }
            />
          </div>
        </div>

        {/* Filter Dropdown Panel */}
        <div
          className={`px-4 pb-4 transition-all duration-300 ease-in-out
            ${
              isFilterOpen
                ? "max-h-96 opacity-100 border-t border-gray-200 pt-4" // Open: allow content to overflow visually
                : "max-h-0 opacity-0 overflow-hidden pt-0" // Closed: clip content
            }`}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Status Dropdown (Now Functional) */}
            <CustomDropdown
              title="All Statuses"
              options={STATUS_OPTIONS}
              selected={filters.status}
              onSelect={(status) => setFilters((f) => ({ ...f, status }))}
            />

            {/* Category Dropdown (Now Functional) */}
            <CustomDropdown
              title="All Categories"
              options={CATEGORY_OPTIONS}
              selected={filters.category}
              onSelect={(category) => setFilters((f) => ({ ...f, category }))}
            />

            {/* Method Dropdown (Now Functional) */}
            <CustomDropdown
              title="All Methods"
              options={METHOD_OPTIONS}
              selected={filters.method}
              onSelect={(method) => setFilters((f) => ({ ...f, method }))}
            />

            {/* Date From Picker */}
            <div className="relative w-full">
              <input
                type="date"
                placeholder="mm/dd/yyyy"
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

            {/* Date To Picker */}
            <div className="relative w-full">
              <input
                type="date"
                placeholder="mm/dd/yyyy"
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

      {/* 5. Expense List - Filtered by activeTab and filters state */}
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
  );

  return <Layout>{content}</Layout>;
};

export default ExpensesRegister;
