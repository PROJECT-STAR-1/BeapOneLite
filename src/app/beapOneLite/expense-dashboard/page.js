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
  BarChart as BarChartIcon,
  TrendingUp,
  PieChart as PieChartIcon,
  FileText,
  Eye,
  Calendar,
  Layers,
  Loader2,
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
} from "recharts";
import Layout from "@/component/BeapOneLite/Layout";

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const CATEGORY_COLOR_MAP = {
  indigo: "#4F46E5",
  green: "#10B981",
  amber: "#F59E0B",
  blue: "#3B82F6",
  red: "#EF4444",
  default: "#8884D8",
};

const STATUS_COLOR_MAP = {
  approved: "#10B981",
  pending: "#F59E0B",
  submitted: "#3B82F6",
  rejected: "#EF4444",
  default: "#9CA3AF",
};

const STATUS_STYLE_MAP = {
  approved: "text-green-800 bg-green-100",
  pending: "text-amber-800 bg-amber-100",
  submitted: "text-blue-800 bg-blue-100",
  rejected: "text-red-800 bg-red-100",
  default: "text-gray-600 bg-gray-200",
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

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
    <div className="flex-grow min-h-[130px] relative">{children}</div>
  </div>
);

const RecentExpenseItem = ({ expense, currencySymbol }) => {
  const statusClass =
    STATUS_STYLE_MAP[expense.statusId] || STATUS_STYLE_MAP.default;

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

// --- CHARTS ---

const CategoryBarChart = ({ data, currencySymbol }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 10, right: 10, bottom: 10, left: 20 }}>
      <XAxis type="number" stroke="#9CA3AF" />
      <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} />
      <Tooltip
        formatter={(value) => [
          `${currencySymbol}${value.toLocaleString()}`,
          "Amount",
        ]}
        contentStyle={{
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      />
      <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={
              CATEGORY_COLOR_MAP[entry.categoryId] || CATEGORY_COLOR_MAP.default
            }
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const SpendingLineChart = ({ data, currencySymbol }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={data}
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

const StatusPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={0}
        outerRadius={90}
        paddingAngle={5}
        fill="#8884d8"
        labelLine={false}
        label={({ name, percent }) =>
          `${name} (${(percent * 100).toFixed(0)}%)`
        }>
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={STATUS_COLOR_MAP[entry.statusId] || STATUS_COLOR_MAP.default}
          />
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
    MAIN COMPONENT
============================================================ */

const ExpenseTrackingDashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState("Today");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dateDropdownRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/expenseDashboard");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Click outside handler
  useEffect(() => {
    const closeDateDropdown = (event) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setIsDateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDateDropdown);
    return () => document.removeEventListener("mousedown", closeDateDropdown);
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
  const metrics = data?.dashboardMetrics ?? {};
  const categoryData = data?.categoryData ?? [];
  const trendData = data?.trendData ?? [];
  const statusData = data?.statusData ?? [];
  const recentExpenses = data?.recentExpenses ?? [];
  const meta = data?.meta ?? {};
  const dateOptions = meta.dateOptions ?? [];
  const CURRENCY_SYMBOL = meta.currencySymbol ?? "₦";

  const content = (
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
          <div className="relative" ref={dateDropdownRef}>
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition bg-white text-gray-700 border border-gray-300 hover:bg-gray-100">
              {selectedDateRange}
              <Calendar size={16} className="ml-2 text-indigo-500" />
            </button>

            {isDateDropdownOpen && (
              <div className="absolute right-0 z-10 w-40 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto">
                {dateOptions.map((option) => (
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

          <button className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition duration-150 bg-indigo-700 text-white hover:bg-indigo-800">
            <Plus size={18} className="mr-2" />
            Quick Capture
          </button>
        </div>
      </header>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Row 1 - Focus Metrics */}
        <MetricCard
          title="Total Expenses"
          value={metrics.totalAmount}
          unit={CURRENCY_SYMBOL}
          secondaryText={`${metrics.totalCount} expenses logged`}
          icon={Layers}
          iconColor="text-indigo-600"
          borderColor="border-indigo-500"
        />
        <MetricCard
          title="Petty Cash Rate"
          value={metrics.pettyCashRate}
          unit="%"
          secondaryText={`${CURRENCY_SYMBOL}${metrics.pettyCashAmount} cash spent`}
          icon={DollarSign}
          iconColor="text-green-600"
          borderColor="border-green-500"
        />
        <MetricCard
          title="Avg Logging Time"
          value={metrics.avgLoggingTime}
          unit="seconds"
          secondaryText="Target: < 10 seconds (P95)"
          icon={Zap}
          iconColor="text-blue-600"
          borderColor="border-blue-500"
          targetMet={metrics.loggingTargetMet}
          targetMetText="Target Met"
        />
        <MetricCard
          title="Pending Approval"
          value={metrics.pendingApprovalCount}
          unit="items"
          secondaryText={`${CURRENCY_SYMBOL}${metrics.pendingApprovalAmount} awaiting review`}
          icon={Clock}
          iconColor="text-amber-500"
          borderColor="border-amber-500"
        />

        {/* Row 2 - Status Count Metrics */}
        <MiniMetricCard
          title="Approved"
          value={metrics.approvedCount}
          icon={CheckCircle}
          iconColor="text-green-600"
          borderColor="border-green-500"
        />
        <MiniMetricCard
          title="Pending"
          value={metrics.pendingCount}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          borderColor="border-amber-500"
        />
        <MiniMetricCard
          title="Submitted"
          value={metrics.submittedCount}
          icon={Clock}
          iconColor="text-blue-500"
          borderColor="border-blue-500"
        />
        <MiniMetricCard
          title="Rejected"
          value={metrics.rejectedCount}
          icon={XCircle}
          iconColor="text-red-500"
          borderColor="border-red-500"
        />
      </div>

      {/* 3. Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <VisualizationCard
          title="Top 5 Expense Categories"
          subtitle="Largest spending areas (this period)"
          icon={BarChartIcon}
          iconColor="text-blue-600">
          <CategoryBarChart
            data={categoryData}
            currencySymbol={CURRENCY_SYMBOL}
          />
        </VisualizationCard>

        <VisualizationCard
          title="Spending Trend"
          subtitle={`Daily approved expense amounts (${selectedDateRange})`}
          icon={TrendingUp}
          iconColor="text-green-600">
          <SpendingLineChart
            data={trendData}
            currencySymbol={CURRENCY_SYMBOL}
          />
        </VisualizationCard>

        <VisualizationCard
          title="Expense Status Distribution"
          subtitle="Breakdown by approval status (item count)"
          icon={PieChartIcon}
          iconColor="text-indigo-600">
          <StatusPieChart data={statusData} />
        </VisualizationCard>

        <VisualizationCard
          title="Recent Expenses"
          subtitle="Latest 5 expense submissions"
          icon={FileText}
          iconColor="text-amber-600"
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
          {recentExpenses.map((expense) => (
            <RecentExpenseItem
              key={expense.id}
              expense={expense}
              currencySymbol={CURRENCY_SYMBOL}
            />
          ))}
          {recentExpenses.length === 0 && (
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
