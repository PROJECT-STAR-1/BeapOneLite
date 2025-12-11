"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/component/BeapOneLite/Layout";
import {
  Search,
  Plus,
  Wallet,
  DollarSign,
  Upload,
  CircleDollarSign,
  Redo2,
  Loader2,
} from "lucide-react";

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const METRIC_STYLE_MAP = {
  financial: {
    icon: DollarSign,
    color: "text-red-500",
    bgColor: "bg-red-50",
    iconBg: "bg-red-100",
  },
  count: {
    icon: DollarSign,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  sync: {
    icon: Upload,
    color: "text-green-500",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100",
  },
  default: {
    icon: Wallet,
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    iconBg: "bg-gray-100",
  },
};

const STATUS_STYLE_MAP = {
  synced: {
    text: "Synced",
    styles: "text-green-600 bg-green-50",
  },
  online: {
    text: "Online",
    styles: "text-blue-600 bg-blue-50", // Added style for consistency, though mocked as just text previously
  },
  default: {
    text: "Unknown",
    styles: "text-gray-600 bg-gray-50",
  },
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

const StatCard = ({ metric }) => {
  const style = METRIC_STYLE_MAP[metric.type] || METRIC_STYLE_MAP.default;
  const Icon = style.icon;
  // Specific logic for Upload icon swap based on original code intent
  const DisplayIcon = style.icon === Upload ? Redo2 : Icon;
  const isSyncCard = metric.type === "sync";

  return (
    <div className="p-6 rounded-xl bg-white shadow-md border border-gray-100 relative overflow-hidden transition duration-300 hover:bg-gray-100">
      <p className="text-sm font-medium text-gray-500 mb-2">{metric.title}</p>

      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-bold text-gray-900 leading-none">
          {metric.value}
        </h3>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${style.iconBg} ${style.color} flex-shrink-0`}>
          <DisplayIcon size={16} />
        </div>
      </div>

      {isSyncCard && (
        <p className="text-xs text-gray-400 mt-2">Ready to sync</p>
      )}
    </div>
  );
};

const ExpenseItem = ({ expense }) => {
  const statusConfig =
    STATUS_STYLE_MAP[expense.statusId] || STATUS_STYLE_MAP.default;

  return (
    <div className="flex flex-col sm:flex-row justify-between bg-white p-5 rounded-xl shadow-md border border-gray-100 transition duration-150 hover:bg-gray-50 cursor-pointer">
      {/* Left Section */}
      <div className="flex items-start mb-3 sm:mb-0 w-full sm:w-3/4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-blue-600 flex-shrink-0 mr-4">
          <CircleDollarSign size={20} />
        </div>

        <div className="flex-grow min-w-0">
          <p className="text-lg font-semibold text-gray-900 truncate">
            {expense.vendor}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-mono text-xs text-gray-500">
              {expense.id}
            </span>{" "}
            - {expense.date}
          </p>
          <p className="text-sm text-gray-500 mb-2 truncate">
            {expense.description}
          </p>

          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            {expense.tag}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-start sm:items-end sm:w-1/4 pt-2 sm:pt-0">
        {expense.status === "synced" && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${statusConfig.styles}`}>
            {statusConfig.text}
          </span>
        )}

        <p className="text-lg font-bold text-gray-900 whitespace-nowrap">
          {expense.amount}
        </p>

        {expense.secondaryAmount && (
          <p className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
            {expense.secondaryAmount}
          </p>
        )}
      </div>
    </div>
  );
};

/* ============================================================
    MAIN COMPONENT
============================================================ */

export default function ExpenseTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/expenseLegacy");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch expense legacy data");
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
      <Layout>
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-700 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </Layout>
    );
  }

  // Safe Data Access
  const metrics = data?.metrics ?? [];
  const expenses = data?.expenses ?? [];

  // Filter Logic (Client-side)
  const filteredExpenses = expenses.filter(
    (exp) =>
      exp.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const content = (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Expense Tracking
          </h1>
          <p className="text-sm text-gray-600">
            Track expenses for Lagos Main Branch
          </p>
        </div>

        <button className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-700 transition whitespace-nowrap">
          <Plus size={18} className="mr-2" />
          Quick Add Expense
        </button>
      </header>

      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <StatCard key={index} metric={metric} />
        ))}
      </div>

      {/* 2. Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vendor name or expense ID..."
            className="w-full py-4 pl-12 pr-6 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-150 shadow-sm text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Expense List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
        {filteredExpenses.length === 0 && (
          <div className="text-center py-10 text-gray-500 border border-dashed rounded-xl">
            No expenses found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );

  return <Layout>{content}</Layout>;
}
