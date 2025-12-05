"use client";
import React, { useState } from "react";

import Layout from "@/component/BeapOneLite/Layout";

import {
  Search,
  Plus,
  Wallet,
  DollarSign,
  Upload,
  CircleDollarSign,
  Redo2,
} from "lucide-react";

/* ============================================================
   DATA MOCKUP
============================================================ */

const METRICS_DATA = [
  {
    title: "Total Expenses",
    value: "₦241,062.50",
    icon: DollarSign,
    color: "text-red-500",
    bgColor: "bg-red-50",
    iconBg: "bg-red-100",
  },
  {
    title: "Expense Count",
    value: "2",
    icon: DollarSign,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    title: "Synced Offline",
    value: "1",
    icon: Upload,
    color: "text-green-500",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100",
  },
];

const EXPENSE_DATA = [
  {
    id: "EXP-001",
    vendor: "AWS Cloud Services",
    date: "11/15/2025",
    description: "Cloud hosting for TechStart mobile app backend",
    amount: "₦125,000.00",
    tag: "Cloud Hosting Services",
    status: "online",
  },
  {
    id: "EXP-002",
    vendor: "Design Assets Store",
    date: "11/5/2025",
    description: "Stock photos and UI kit for Acme website",
    amount: "US$75.00",
    tag: "Design Assets",
    secondaryAmount: "₦116,062.50",
    status: "synced",
  },
];

/* ============================================================
   COMPONENT: 1. STAT CARD
============================================================ */

const StatCard = ({ metric }) => {
  const Icon = metric.icon;
  const UploadIcon = metric.icon === Upload ? Redo2 : Wallet;
  const isSyncCard = metric.icon === Upload;

  return (
    // CHANGE 1: Removed hover:shadow-lg, added hover:bg-gray-100
    <div className="p-6 rounded-xl bg-white shadow-md border border-gray-100 relative overflow-hidden transition duration-300 hover:bg-gray-100">
      <p className="text-sm font-medium text-gray-500 mb-2">{metric.title}</p>

      {/* Main Value and Icon */}
      <div className="flex justify-between items-start">
        {/* CHANGE 2: Reduced size/boldness from text-3xl font-extrabold to text-2xl font-bold */}
        <h3 className="text-2xl font-bold text-gray-900 leading-none">
          {metric.value}
        </h3>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${metric.iconBg} ${metric.color} flex-shrink-0`}>
          <Icon size={16} />
        </div>
      </div>

      {/* Optional Detail for Sync Card */}
      {isSyncCard && (
        <p className="text-xs text-gray-400 mt-2">Ready to sync</p>
      )}

      {/* Large background icon for design aesthetic - REMOVED */}
    </div>
  );
};

/* ============================================================
   COMPONENT: 2. EXPENSE ITEM
============================================================ */

const ExpenseItem = ({ expense }) => {
  return (
    // CHANGE 3: Removed hover:shadow-lg and hover:border-violet-200, added hover:bg-gray-50
    <div className="flex flex-col sm:flex-row justify-between bg-white p-5 rounded-xl shadow-md border border-gray-100 transition duration-150 hover:bg-gray-50 cursor-pointer">
      {/* Left Section: Icon, Details, and Tags */}
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

          {/* Tag */}
          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            {expense.tag}
          </span>
        </div>
      </div>

      {/* Right Section: Amount and Status */}
      <div className="flex flex-col items-start sm:items-end sm:w-1/4 pt-2 sm:pt-0">
        {expense.status === "synced" && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-1">
            Synced
          </span>
        )}

        <p className="text-lg font-bold text-gray-900 whitespace-nowrap">
          {expense.amount}
        </p>

        {expense.secondaryAmount && (
          <p className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
            ₦{expense.secondaryAmount}
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

  const content = (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <div>
          {/* CHANGE 4: Reduced size/boldness from text-3xl font-extrabold to text-2xl font-bold */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Expense Tracking
          </h1>
          {/* CHANGE 5: Reduced size from text-md to text-sm */}
          <p className="text-sm text-gray-600">
            Track expenses for Lagos Main Branch
          </p>
        </div>

        {/* Quick Action Button */}
        {/* CHANGE 6: Removed shadow-lg for a cleaner look */}
        <button className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-700 transition whitespace-nowrap">
          <Plus size={18} className="mr-2" />
          Quick Add Expense
        </button>
      </header>

      {/* 1. Stat Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {METRICS_DATA.map((metric, index) => (
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
        {EXPENSE_DATA.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
        {/* Add a note if the list is empty after filtering */}
        {EXPENSE_DATA.length === 0 && (
          <div className="text-center py-10 text-gray-500 border border-dashed rounded-xl">
            No expenses found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );

  return <Layout>{content}</Layout>;
}
