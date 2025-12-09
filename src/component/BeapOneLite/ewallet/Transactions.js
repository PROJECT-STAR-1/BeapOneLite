"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

/* ============================================================
    CONSTANTS & UI MAPPINGS
============================================================ */

const BRAND_COLOR = "text-indigo-700";
const ICON_SIZE = 16;

const formatNaira = (amount) => {
  return `₦ ${new Intl.NumberFormat("en-NG").format(Math.abs(amount))}`;
};

const STATUS_STYLE_MAP = {
  COMPLETED: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  PENDING: {
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  FAILED: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  default: {
    icon: AlertTriangle,
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

const TransactionBadge = ({ label, isPrimary = false }) => {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase truncate max-w-[120px] ${
        isPrimary
          ? "bg-indigo-100 text-indigo-700"
          : "bg-gray-200 text-gray-700"
      }`}>
      {label}
    </span>
  );
};

const TransactionRow = ({ transaction }) => {
  const isCredit = transaction.type === "Credit";
  const amountSign = isCredit ? "+" : "–";
  const amountColor = isCredit ? "text-green-600" : "text-red-600";

  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;
  const iconColor = isCredit ? "text-green-600" : "text-red-600";
  const iconBg = isCredit ? "bg-green-50" : "bg-red-50";

  const statusStyle =
    STATUS_STYLE_MAP[transaction.status] || STATUS_STYLE_MAP.default;
  const StatusIcon = statusStyle.icon;

  let secondaryDetail = "";
  if (transaction.user) secondaryDetail = `USER: ${transaction.user}`;
  else if (transaction.client)
    secondaryDetail = `CLIENT: ${transaction.client}`;
  else if (transaction.system)
    secondaryDetail = `SYSTEM: ${transaction.system}`;
  else if (transaction.vendor)
    secondaryDetail = `VENDOR: ${transaction.vendor}`;

  return (
    <div className="flex items-start py-5 px-4 sm:px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Left Section: Icon */}
      <div
        className="flex-shrink-0 w-8 h-8 mr-4 mt-1 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: iconBg.replace("bg-", "") }} // Removing Tailwind class prefix if hex was used, keeping simple here
      >
        <div
          className={`flex items-center justify-center w-full h-full rounded-lg ${iconBg}`}>
          <Icon size={ICON_SIZE} className={iconColor} />
        </div>
      </div>

      {/* Middle Section: Details */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center space-x-3 mb-1">
          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
            {transaction.title}
          </p>
          <TransactionBadge
            label={transaction.category}
            isPrimary={
              transaction.category === "INVOICE PAYMENT" ||
              transaction.category === "VENDOR PAYMENT" ||
              transaction.category === "WALLET TRANSFER"
            }
          />
        </div>

        <p className="text-xs text-gray-600 mb-1">{secondaryDetail}</p>

        <div className="flex flex-wrap items-center text-xs text-gray-500 space-x-3 sm:space-x-4">
          <span className="truncate max-w-[150px]">Ref: {transaction.ref}</span>
          <span>{transaction.date}</span>
          {transaction.processor && (
            <TransactionBadge label={transaction.processor} />
          )}
        </div>

        {transaction.fee && (
          <p className="text-xs text-gray-500 mt-1">
            Fee: {formatNaira(transaction.fee)}
          </p>
        )}
      </div>

      {/* Right Section: Amount & Status */}
      <div className="flex flex-col items-end flex-shrink-0 ml-4 space-y-1">
        <p className={`text-base font-bold ${amountColor} whitespace-nowrap`}>
          {amountSign} {formatNaira(transaction.amount)}
        </p>

        <div
          className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusStyle.bg} ${statusStyle.color}`}>
          <StatusIcon size={10} className="mr-1" />
          {transaction.status}
        </div>

        <p className="text-xs text-gray-500 whitespace-nowrap pt-1">
          Balance: {formatNaira(transaction.balance)}
        </p>
      </div>
    </div>
  );
};

/* ============================================================
    MAIN COMPONENT
============================================================ */

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/ewallet");
        if (response.ok) {
          const result = await response.json();
          // Assuming the API returns an object with allTransactions
          // If the API structure is flatter for this specific component, adjust accordingly.
          // Based on your prompt, we use the specific path.
          setData(result.allTransactions || []);
        } else {
          console.error("Failed to fetch transaction data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-700 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Transactions...</p>
      </div>
    );
  }

  const allTransactions = data || [];

  // Extract unique categories
  const categories = [
    "All Categories",
    ...new Set(allTransactions.map((t) => t.category)),
  ];

  // Filtering Logic
  const filteredTransactions = allTransactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All Categories" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen p-4 lg:p-6 font-sans">
      <div className="w-full mx-auto">
        {/* Header and Controls */}
        <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h1>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search
                size={ICON_SIZE}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none w-full py-2 pl-4 pr-8 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm text-sm text-gray-900">
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={ICON_SIZE}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No transactions found matching your criteria.
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredTransactions.length === allTransactions.length &&
          allTransactions.length > 10 && (
            <div className="mt-6 text-center">
              <button
                className={`text-sm font-medium ${BRAND_COLOR} hover:underline`}>
                Load More Transactions
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
