"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  DollarSign,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  BarChart as BarChartIcon, // Renamed to avoid conflict with Recharts component
  TrendingUp,
  PieChart as PieChartIcon, // Renamed to avoid conflict with Recharts component
  FileText,
  Eye,
  Calendar,
  Layers,
} from "lucide-react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Assuming Recharts is available in the environment

import Layout from "@/component/BeapOneLite/Layout";

/* ============================================================
    MOCK DATA & CONFIGURATION
============================================================ */

const DASHBOARD_METRICS = {
  totalAmount: "153,000.00",
  totalCount: 14,
  pettyCashRate: "12.5", // %
  pettyCashAmount: "19,125.00",
  avgLoggingTime: "7.8", // seconds
  loggingTargetMet: true, // Target Met is shown below 7.8 seconds in the Figma image
  pendingApprovalAmount: "41,500.00",
  pendingApprovalCount: 4,
  approvedCount: 7,
  pendingCount: 4,
  submittedCount: 3,
  rejectedCount: 3,
};

// Data for charts
const CATEGORY_DATA = [
  { name: "Small Supplies", value: 30000, color: "#4F46E5" }, // Indigo
  { name: "Fuel & Trans", value: 15000, color: "#10B981" }, // Green
  { name: "Staff Welfare", value: 45000, color: "#F59E0B" }, // Amber
  { name: "Professional Fees", value: 50000, color: "#3B82F6" }, // Blue
  { name: "Marketing", value: 22000, color: "#EF4444" }, // Red
];

const TREND_DATA = [
  { name: "11/27", approved: 0 },
  { name: "11/28", approved: 0 },
  { name: "11/29", approved: 5000 },
  { name: "11/30", approved: 15000 },
  { name: "12/1", approved: 22000 },
  { name: "12/2", approved: 10000 },
  { name: "12/3", approved: 5000 },
];

const STATUS_DATA = [
  {
    name: "Approved",
    value: DASHBOARD_METRICS.approvedCount,
    color: "#10B981",
  }, // green-500
  { name: "Pending", value: DASHBOARD_METRICS.pendingCount, color: "#F59E0B" }, // amber-500
  {
    name: "Submitted",
    value: DASHBOARD_METRICS.submittedCount,
    color: "#3B82F6",
  }, // blue-500
  {
    name: "Rejected",
    value: DASHBOARD_METRICS.rejectedCount,
    color: "#EF4444",
  }, // red-500
];

const RECENT_EXPENSES = [
  {
    id: "EXP-2025030",
    vendor: "The Local Market",
    amount: "5,000.00",
    status: "Submitted",
  },
  {
    id: "EXP-2025029",
    vendor: "Luxury Restaurant",
    amount: "45,000.00",
    status: "Rejected",
  },
  {
    id: "EXP-2025028",
    vendor: "Office Depot",
    amount: "6,500.00",
    status: "Submitted",
  },
  {
    id: "EXP-2025027",
    vendor: "UBA",
    amount: "1,500.00",
    status: "Pending Review",
  },
  {
    id: "EXP-2025026",
    vendor: "Mobil Petrol",
    amount: "10,000.00",
    status: "Approved",
  },
];

/* ============================================================
    REUSABLE COMPONENTS
============================================================ */

/**
 * Reusable component for the 8 status/metric cards (LARGE)
 * Reduced vertical padding (p-4) and figure font size (text-2xl)
 */
const MetricCard = ({
  title,
  value,
  unit,
  secondaryText,
  icon: Icon,
  iconColor,
  borderColor,
  secondaryIcon: SecondaryIcon,
  targetMet,
  targetMetText,
}) => (
  <div
    className={`p-4 rounded-2xl bg-white shadow-md border-t-4 ${borderColor} flex flex-col justify-between h-full`}>
    <div className="flex items-start justify-between mb-2">
      <p className="text-sm font-medium text-gray-500 leading-tight">{title}</p>
      <Icon size={24} className={iconColor} />
    </div>

    <div className="flex flex-col">
      <h3 className="text-2xl font-bold text-gray-900 leading-tight">
        {value}
        <span className="text-base font-semibold text-gray-700 ml-1">
          {unit}
        </span>
      </h3>
      <p className="text-xs text-gray-400 mt-1">{secondaryText}</p>
    </div>

    {/* Target Met/Secondary Status (mimics Figma) */}
    {targetMet !== undefined && (
      <div
        className={`mt-2 flex items-center ${
          targetMet ? "text-green-600" : "text-red-500"
        }`}>
        {targetMet ? (
          <CheckCircle size={14} className="mr-1.5" />
        ) : (
          <AlertTriangle size={14} className="mr-1.5" />
        )}
        <span className="text-xs font-semibold">{targetMetText}</span>
      </div>
    )}
    {SecondaryIcon && (
      <div className="mt-2 flex items-center text-gray-500">
        <SecondaryIcon size={14} className="mr-1.5 text-gray-400" />
        <span className="text-xs font-medium">{secondaryText}</span>
      </div>
    )}
  </div>
);

/**
 * Reusable component for the 4 smaller metric cards (MINI)
 */
const MiniMetricCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  borderColor,
}) => (
  <div
    className={`p-3 rounded-xl bg-white shadow-sm border-t-2 ${borderColor} flex items-center justify-between h-full transition-shadow hover:shadow-lg`}>
    <div className="flex flex-col">
      <p className="text-xs font-medium text-gray-500 leading-tight truncate">
        {title}
      </p>
      <h3 className="text-xl font-bold text-gray-900 leading-tight mt-0.5">
        {value}
      </h3>
    </div>
    <Icon size={20} className={iconColor} />
  </div>
);

/**
 * Reusable component for the 4 visualization/activity cards
 * Now accepts iconColor prop
 */
const VisualizationCard = ({
  title,
  subtitle,
  icon: Icon,
  children,
  actionButton,
  iconColor = "text-gray-600",
}) => (
  <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100 h-full flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
        {/* Applied dynamic iconColor here */}
        <Icon size={20} className={`${iconColor} mr-2`} />
        <div>
          <h2 className="text-lg font-semibold text-gray-900 leading-none">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
      {actionButton}
    </div>
    {/* Adjusted min-height to reduce chart vertical spacing */}
    <div className="flex-grow min-h-[130px] relative">{children}</div>
  </div>
);

/**
 * Renders an item in the Recent Expenses list
 */
const RecentExpenseItem = ({ expense, currencySymbol }) => {
  let statusClass = "text-gray-600 bg-gray-200";
  if (expense.status === "Approved")
    statusClass = "text-green-800 bg-green-100";
  if (expense.status === "Rejected") statusClass = "text-red-800 bg-red-100";
  if (expense.status === "Pending Review")
    statusClass = "text-amber-800 bg-amber-100";
  if (expense.status === "Submitted") statusClass = "text-blue-800 bg-blue-100";

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 transition hover:bg-indigo-50 px-2 -mx-2 rounded-lg">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">
          {expense.vendor}
        </span>
        <span className="text-xs text-indigo-600 font-semibold">
          {expense.id}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded ${statusClass}`}>
          {expense.status.split(" ")[0]}
        </span>
        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
          {currencySymbol}
          {expense.amount}
        </span>
        <button
          title="View"
          className="p-1 text-gray-400 hover:text-indigo-600 rounded-full transition">
          <Eye size={16} />
        </button>
      </div>
    </div>
  );
};

/* ============================================================
    CHART COMPONENTS (Using Recharts)
============================================================ */

const CategoryBarChart = ({ currencySymbol }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={CATEGORY_DATA}
      layout="vertical"
      // Adjusted left margin from 50 to 20 to align closer to the left edge/icon
      margin={{ top: 10, right: 10, bottom: 10, left: 20 }}>
      <XAxis type="number" stroke="#9CA3AF" />
      <YAxis
        dataKey="name"
        type="category"
        stroke="#9CA3AF"
        fontSize={12}
        // Removed aggressive tick formatter to allow more name visibility
      />
      <Tooltip
        formatter={(value) => [
          `${currencySymbol}${value.toLocaleString()}`,
          "Amount",
        ]}
        labelFormatter={(label) => label}
        contentStyle={{
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      />
      <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
        {CATEGORY_DATA.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const SpendingLineChart = ({ selectedDateRange, currencySymbol }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={TREND_DATA}
      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
      <YAxis
        stroke="#9CA3AF"
        fontSize={12}
        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
      />
      <Tooltip
        formatter={(value) => [
          `${currencySymbol}${value.toLocaleString()}`,
          "Approved Amount",
        ]}
        labelFormatter={(label) => `Date: ${label}`}
        contentStyle={{
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      />
      <Line
        type="monotone"
        dataKey="approved"
        stroke="#10B981"
        strokeWidth={3}
        dot={{ r: 4 }}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

const StatusPieChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <Pie
        data={STATUS_DATA}
        dataKey="value"
        nameKey="name"
        // innerRadius set to 0 for a full pie chart (was 60)
        innerRadius={0}
        outerRadius={90}
        paddingAngle={5}
        fill="#8884d8"
        labelLine={false}
        label={({ name, percent }) =>
          `${name} (${(percent * 100).toFixed(0)}%)`
        }>
        {STATUS_DATA.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name) => [value, name]}
        contentStyle={{
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      />
      <Legend
        layout="horizontal"
        align="center"
        verticalAlign="bottom"
        wrapperStyle={{ paddingTop: "10px" }}
      />
    </PieChart>
  </ResponsiveContainer>
);

/* ============================================================
    MAIN APPLICATION
============================================================ */

const ExpenseTrackingDashboard = () => {
  // Configuration for dynamic currency symbol (easily changed here)
  const CURRENCY_SYMBOL = "₦";

  // State for mock date selector (mimicking the "Today" dropdown)
  const [selectedDateRange, setSelectedDateRange] = useState("Today");
  const dateRangeOptions = [
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Quarter",
  ];
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  // Click outside handler for date dropdown
  const closeDateDropdown = (event) => {
    if (
      dateDropdownRef.current &&
      !dateDropdownRef.current.contains(event.target)
    ) {
      setIsDateDropdownOpen(false);
    }
  };

  // Add effect for click-outside
  useEffect(() => {
    document.addEventListener("mousedown", closeDateDropdown);
    return () => document.removeEventListener("mousedown", closeDateDropdown);
  }, []);

  // Custom container for Canvas display - Reduced overall padding for wider appearance
  const containerClasses =
    "w-full font-sans bg-gray-50 min-h-screen p-4 sm:p-4 lg:px-4 lg:pt-4";

  const content = (
    // Reduced inner padding for wider appearance
    <div className="w-full font-sans p-2 sm:p-2 lg:px-2 pt-0">
      {/* 1. Header Section */}
      <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Expense Tracking Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time expense monitoring and petty cash management for Lagos
            Main Branch
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {/* Date Selector Dropdown (Mimics Figma style) */}
          <div className="relative" ref={dateDropdownRef}>
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition bg-white text-gray-700 border border-gray-300 hover:bg-gray-100">
              {selectedDateRange}
              <Calendar size={16} className="ml-2 text-indigo-500" />
            </button>

            {isDateDropdownOpen && (
              <div className="absolute right-0 z-10 w-40 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto">
                {dateRangeOptions.map((option) => (
                  <div
                    key={option}
                    className={`px-4 py-2 text-sm cursor-pointer text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition
                                            ${
                                              selectedDateRange === option
                                                ? "bg-indigo-100 font-semibold text-indigo-700"
                                                : ""
                                            }`}
                    onClick={() => {
                      setSelectedDateRange(option);
                      setIsDateDropdownOpen(false);
                    }}>
                    {option}
                    {selectedDateRange === option && (
                      <CheckCircle
                        size={14}
                        className="inline ml-2 align-middle"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Capture Button (Primary Action) */}
          <button className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition duration-150 bg-indigo-700 text-white hover:bg-indigo-800">
            <Plus size={18} className="mr-2" />
            Quick Capture
          </button>
        </div>
      </header>

      {/* 2. Metrics Grid (8 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Row 1 - Focus Metrics (Standard Size) */}
        <MetricCard
          title="Total Expenses"
          value={DASHBOARD_METRICS.totalAmount}
          unit={CURRENCY_SYMBOL}
          secondaryText={`${DASHBOARD_METRICS.totalCount} expenses logged`}
          icon={Layers}
          iconColor="text-indigo-600"
          borderColor="border-indigo-500"
        />
        <MetricCard
          title="Petty Cash Rate"
          value={DASHBOARD_METRICS.pettyCashRate}
          unit="%"
          secondaryText={`${CURRENCY_SYMBOL}${DASHBOARD_METRICS.pettyCashAmount} cash spent`}
          icon={DollarSign}
          iconColor="text-green-600"
          borderColor="border-green-500"
        />
        <MetricCard
          title="Avg Logging Time"
          value={DASHBOARD_METRICS.avgLoggingTime}
          unit="seconds"
          secondaryText="Target: < 10 seconds (P95)"
          icon={Zap}
          iconColor="text-blue-600"
          borderColor="border-blue-500"
          targetMet={DASHBOARD_METRICS.loggingTargetMet}
          targetMetText="Target Met"
        />
        <MetricCard
          title="Pending Approval"
          value={DASHBOARD_METRICS.pendingApprovalCount}
          unit="items"
          secondaryText={`${CURRENCY_SYMBOL}${DASHBOARD_METRICS.pendingApprovalAmount} awaiting review`}
          icon={Clock}
          iconColor="text-amber-500"
          borderColor="border-amber-500"
        />

        {/* Row 2 - Status Count Metrics (Mini Size) */}
        <MiniMetricCard
          title="Approved"
          value={DASHBOARD_METRICS.approvedCount}
          icon={CheckCircle}
          iconColor="text-green-600"
          borderColor="border-green-500"
        />
        <MiniMetricCard
          title="Pending"
          value={DASHBOARD_METRICS.pendingCount}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          borderColor="border-amber-500"
        />
        <MiniMetricCard
          title="Submitted"
          value={DASHBOARD_METRICS.submittedCount}
          icon={Clock}
          iconColor="text-blue-500"
          borderColor="border-blue-500"
        />
        <MiniMetricCard
          title="Rejected"
          value={DASHBOARD_METRICS.rejectedCount}
          icon={XCircle}
          iconColor="text-red-500"
          borderColor="border-red-500"
        />
      </div>

      {/* 3. Visualization Grid (4 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top 5 Expense Categories (Bar Chart) - Blue Icon */}
        <VisualizationCard
          title="Top 5 Expense Categories"
          subtitle="Largest spending areas (this period)"
          icon={BarChartIcon}
          iconColor="text-blue-600">
          <CategoryBarChart currencySymbol={CURRENCY_SYMBOL} />
        </VisualizationCard>

        {/* Spending Trend (Line Chart) - Green Icon */}
        <VisualizationCard
          title="Spending Trend"
          subtitle={`Daily approved expense amounts (${selectedDateRange})`}
          icon={TrendingUp}
          iconColor="text-green-600">
          <SpendingLineChart
            selectedDateRange={selectedDateRange}
            currencySymbol={CURRENCY_SYMBOL}
          />
        </VisualizationCard>

        {/* Expense Status Distribution (Pie Chart) - Indigo Icon */}
        <VisualizationCard
          title="Expense Status Distribution"
          subtitle="Breakdown by approval status (item count)"
          icon={PieChartIcon}
          iconColor="text-indigo-600">
          <StatusPieChart />
        </VisualizationCard>

        {/* Recent Expenses (List) - Amber Icon */}
        <VisualizationCard
          title="Recent Expenses"
          subtitle="Latest 5 expense submissions"
          icon={FileText}
          iconColor="text-amber-600"
          // Updated action buttons: "New" for logging, "View All" for navigation
          actionButton={
            <div className="flex space-x-2">
              <button
                title="Log New Expense"
                className="flex items-center px-3 py-1 text-xs font-semibold rounded-lg transition duration-150 bg-indigo-700 text-white hover:bg-indigo-800 shadow-md">
                <Plus size={14} className="mr-1" />
                New
              </button>
              <button
                title="View All Expenses"
                className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition">
                <Eye size={16} className="mr-1" />
                View All
              </button>
            </div>
          }>
          {RECENT_EXPENSES.map((expense) => (
            <RecentExpenseItem
              key={expense.id}
              expense={expense}
              currencySymbol={CURRENCY_SYMBOL}
            />
          ))}
          {RECENT_EXPENSES.length === 0 && (
            <div className="flex flex-col items-center justify-center text-gray-400 h-full">
              <DollarSign size={32} />
              <p className="mt-2 text-sm">No expenses yet</p>
              <button className="mt-4 flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition duration-150 bg-indigo-700 text-white hover:bg-indigo-800">
                <Plus size={16} className="mr-2" />
                Log First Expense
              </button>
            </div>
          )}
        </VisualizationCard>
      </div>
    </div>
  );

  return <Layout>{content}</Layout>;
};

export default ExpenseTrackingDashboard;
