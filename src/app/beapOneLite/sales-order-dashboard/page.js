"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Package,
  AlertCircle,
  Eye,
  Calendar,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from "lucide-react";

import {
  BarChart,
  Bar,
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

const DASHBOARD_METRICS = {
  conversionCompliance: "100%",
  conversionComplianceText: "All conversions compliant",
  conversionComplianceTargetMet: true,
  avgFulfillmentTime: "120h",
  avgFulfillmentTimeSub: "~5 days",
  averageOrderValue: "9.88M",
  averageOrderValueSub: "Per order",
  fulfillmentRate: "75%",
  fulfillmentRateSub: "Active orders fulfilled",
  conversionLag: "2.1 days",
  conversionLagTargetMet: true, // Assuming target is met since the text is green
  conversionLagSub: "Within 3-day target",
  reservedInventoryValue: "46.4M",
  reservedInventoryValueSub: "Open orders",
  cancellationRate: "12.5%",
  cancellationRateSub: "Of total orders",
  noteCompliance: "100%",
  noteComplianceSub: "All critical actions documented",
  noteComplianceTargetMet: true,
};

// Data for charts based on SOM2.png
const STATUS_COLORS = {
  Draft: "#9CA3AF", // Gray
  Placed: "#3B82F6", // Blue
  InProduction: "#F59E0B", // Orange
  ReadyForDelivery: "#A855F7", // Purple
  Fulfilled: "#10B981", // Green
  Invoiced: "#059669", // Darker Green
  Cancelled: "#EF4444", // Red
};

const ORDER_DATA = [
  { name: "Draft", count: 1, value: 1000000, color: STATUS_COLORS.Draft },
  { name: "Placed", count: 2, value: 5000000, color: STATUS_COLORS.Placed },
  {
    name: "In Production",
    count: 1,
    value: 43540000,
    color: STATUS_COLORS.InProduction,
  },
  {
    name: "Ready for Delivery",
    count: 1,
    value: 20000000,
    color: STATUS_COLORS.ReadyForDelivery,
  },
  {
    name: "Fulfilled",
    count: 1,
    value: 5250000,
    color: STATUS_COLORS.Fulfilled,
  },
  { name: "Invoiced", count: 1, value: 650000, color: STATUS_COLORS.Invoiced },
  {
    name: "Cancelled",
    count: 1,
    value: 2880000,
    color: STATUS_COLORS.Cancelled,
  },
];

const CRITICAL_ALERTS = [
  {
    id: "NGN01-WHS-2511-000008",
    vendor: "Office Supplies Plus",
    description: "Delivery date (Nov 20) has passed. Current status: Placed",
    severity: "HIGH",
    icon: AlertCircle,
  },
  {
    id: "NGN01-WHS-2511-000002",
    vendor: "MegaMart Wholesale",
    description: "Inventory reservation failed. Stock may be insufficient.",
    severity: "HIGH",
    icon: AlertTriangle,
  },
];

const RECENT_SALES_ORDERS = [
  {
    soNumber: "NGN01-RTL-2511-000001",
    customer: "Global Tech Solutions",
    branch: "Lagos Main",
    status: "Fulfilled",
    totalAmount: "5.25M",
    deliveryDate: "11/22/2024",
  },
  {
    soNumber: "NGN01-WHS-2511-000002",
    customer: "MegaMart Wholesale",
    branch: "Lagos Main",
    status: "Placed",
    totalAmount: "2.88M",
    deliveryDate: "11/25/2024",
  },
  {
    soNumber: "AB/02-CORP-2511-000003",
    customer: "Federal Ministry of Education",
    branch: "Abuja Branch",
    status: "In Production",
    totalAmount: "43.54M",
    deliveryDate: "11/30/2024",
  },
  {
    soNumber: "NGN01-RTL-2511-000004",
    customer: "SmartHome Electronics",
    branch: "Lagos Main",
    status: "Draft",
    totalAmount: "2.61M",
    deliveryDate: "11/28/2024",
  },
  {
    soNumber: "NGN01-RTL-2510-000005",
    customer: "QuickBuy Stores",
    branch: "Lagos Main",
    status: "Invoiced",
    totalAmount: "0.65M",
    deliveryDate: "10/18/2024",
  },
];

/* ============================================================
 * REUSABLE COMPONENTS
============================================================ */

/**
 * Reusable component for the 8 status/metric cards
 * Requires the dynamic currency symbol to be passed as a prop.
 */
const SOMMetricCard = ({
  title,
  value,
  unit,
  secondaryText,
  icon: Icon,
  iconColor,
  borderColor,
  targetMet,
  targetMetText,
  currencySymbol, // <-- Dynamic currency prop
}) => (
  // Reduced padding from p-5 to p-4
  <div
    className={`p-4 rounded-2xl bg-white shadow-md border-l-4 ${borderColor} flex flex-col justify-between h-full transition-shadow hover:shadow-lg`}>
    <div className="flex items-start justify-between mb-3">
      <p className="text-sm font-medium text-gray-500 leading-tight">{title}</p>
      <Icon size={20} className={iconColor} />
    </div>

    <div className="flex flex-col">
      {/* Reduced font size from text-3xl to text-2xl */}
      <h3 className="text-2xl font-bold text-gray-900 leading-tight">
        {unit === "currency" ? currencySymbol : unit}
        {value}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{secondaryText}</p>
    </div>

    {/* Target Met/Secondary Status (Green/Orange text at the bottom) */}
    <div className="mt-3">
      {targetMet !== undefined ? (
        <div
          className={`flex items-center ${
            targetMet ? "text-green-600" : "text-amber-500"
          }`}>
          {targetMet ? (
            <CheckCircle size={14} className="mr-1.5" />
          ) : (
            <AlertTriangle size={14} className="mr-1.5" />
          )}
          <span className="text-xs font-semibold">{targetMetText}</span>
        </div>
      ) : (
        <span className="text-xs text-gray-400">{targetMetText}</span>
      )}
    </div>
  </div>
);

/**
 * Component for displaying critical alerts.
 */
const CriticalAlert = ({ alert }) => {
  const Icon = alert.icon;
  return (
    <div
      className={`flex items-start p-4 rounded-xl border-l-4 border-red-500 bg-red-50 shadow-sm mb-3`}>
      <Icon size={20} className="text-red-500 mr-3 mt-0.5" />
      <div className="flex-grow">
        <p className="text-sm font-semibold text-gray-800">
          {alert.id} - {alert.vendor}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">{alert.description}</p>
      </div>
      <span className="ml-4 px-2 py-0.5 text-xs font-bold rounded bg-red-500 text-white">
        {alert.severity}
      </span>
    </div>
  );
};

/* ============================================================
 * CHART COMPONENTS (Using Recharts)
============================================================ */

const OrderStatusPieChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
      <Pie
        data={ORDER_DATA}
        dataKey="count"
        nameKey="name"
        innerRadius={0} // Full pie chart
        outerRadius={100}
        paddingAngle={3}
        labelLine={false}
        label={false} // Removed external text labels
        legendType="circle">
        {ORDER_DATA.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name, props) => [
          `${props.payload.name}: ${value} order(s)`,
          "Count",
        ]}
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
        wrapperStyle={{ paddingTop: "20px" }}
        iconSize={10}
        formatter={(value, entry) => (
          <span className="text-sm text-gray-600">
            {value} ({entry.payload.count})
          </span>
        )}
      />
    </PieChart>
  </ResponsiveContainer>
);

const OrderValueBarChart = (
  { currencySymbol } // <-- Accepts currencySymbol
) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={ORDER_DATA}
      margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
      <YAxis
        stroke="#9CA3AF"
        fontSize={12}
        tickFormatter={(value) =>
          `${currencySymbol}${Math.round(value / 1000000)}M`
        } // <-- Uses currencySymbol
      />
      <Tooltip
        formatter={(value) => [
          `${currencySymbol}${(value / 1000000).toFixed(2)}M`, // <-- Uses currencySymbol
          "Order Value",
        ]}
        labelFormatter={(label) => `Status: ${label}`}
        contentStyle={{
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      />
      <Bar dataKey="value" name="Order Value" radius={[4, 4, 0, 0]}>
        {ORDER_DATA.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

/* ============================================================
 * TABLE COMPONENTS
============================================================ */

const StatusBadge = ({ status }) => {
  let color = "bg-gray-200 text-gray-800";
  if (status === "Fulfilled" || status === "Invoiced")
    color = "bg-green-100 text-green-700";
  if (status === "Placed") color = "bg-blue-100 text-blue-700";
  if (status === "In Production") color = "bg-amber-100 text-amber-700";
  if (status === "Draft") color = "bg-gray-100 text-gray-600";
  if (status === "Cancelled") color = "bg-red-100 text-red-700";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};

// Updated table component to receive and display the active filter
const RecentSalesOrdersTable = (
  { orders, selectedRange, currencySymbol } // <-- Accepts currencySymbol
) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-900">
        Recent Sales Orders ({selectedRange} Filter Active)
      </h2>
      <button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
        View All →
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SO Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Delivery Date
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <div className="text-sm font-semibold text-indigo-600">
                  {order.soNumber}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {order.customer}
                </div>
                <div className="text-xs text-gray-500">{order.branch}</div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                {currencySymbol}
                {order.totalAmount}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {order.deliveryDate}
              </td>
              <td className="px-6 py-4 text-center text-sm font-medium">
                <button
                  title="View Order"
                  className="p-1 text-gray-400 hover:text-indigo-600 rounded-full transition">
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ============================================================
 * MAIN APPLICATION
============================================================ */

/**
 * NOTE: Mock Layout Component structure (commented out for canvas compatibility)
 * This structure simulates the Layout wrapper that would normally handle global
 * navigation and styling.
 */
/*
const Layout = ({ children }) => (
  <div className="layout-container p-4 bg-gray-100 min-h-screen">
    <nav className="h-16 bg-white shadow mb-4 flex items-center px-6">
        <span className="text-xl font-bold text-indigo-600">BeapOne Lite</span>
        <div className="flex-grow"></div>
        <button className="text-sm text-gray-600">User Profile</button>
    </nav>
    <main>{children}</main>
  </div>
);
*/

const SalesOrderManagementDashboard = () => {
  const [selectedRange, setSelectedRange] = useState("Month");

  // Dynamic Currency Definition (Replacing global constant)
  const dynamicCurrencySymbol = "₦";

  // Handler for dropdown change
  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value);
    console.log(
      `Time range set to: ${event.target.value}. Data filtering would happen here.`
    );
  };

  const containerClasses =
    "w-full font-sans bg-gray-50 min-h-screen p-4 sm:p-6 lg:px-8 lg:pt-8";

  const content = (
    <div className="w-full font-sans p-2 sm:p-4 lg:px-4 pt-0">
      {/* 1. Header Section */}
      <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sales Order Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track orders from creation to fulfillment and invoice conversion
          </p>
        </div>

        {/* Time Range Selector (Dropdown) */}
        <div className="relative mt-4 sm:mt-0">
          <select
            value={selectedRange}
            onChange={handleRangeChange}
            className="block w-full sm:w-40 appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 text-sm font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 cursor-pointer"
            aria-label="Select Time Range">
            <option value="Today">Today</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
            <option value="Quarter">Quarter</option>
          </select>
          {/* Custom chevron icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* 2. Metrics Grid (8 Cards) - Data remains static but would be filtered in a real app */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Row 1, Col 1: Conversion Compliance (Green) */}
        <SOMMetricCard
          title="Conversion Compliance"
          value={DASHBOARD_METRICS.conversionCompliance}
          unit=""
          secondaryText="Success rate for converting leads to sales orders"
          icon={CheckCircle}
          iconColor="text-green-600"
          borderColor="border-green-500"
          targetMet={DASHBOARD_METRICS.conversionComplianceTargetMet}
          targetMetText={DASHBOARD_METRICS.conversionComplianceText}
          currencySymbol={dynamicCurrencySymbol} // Pass dynamic currency
        />
        {/* Row 1, Col 2: Avg Fulfillment Time (Blue) */}
        <SOMMetricCard
          title="Avg Fulfillment Time"
          value={DASHBOARD_METRICS.avgFulfillmentTime}
          unit=""
          secondaryText={DASHBOARD_METRICS.avgFulfillmentTimeSub}
          icon={Clock}
          iconColor="text-blue-600"
          borderColor="border-blue-500"
          targetMet={undefined}
          targetMetText="Target: < 90h"
          currencySymbol={dynamicCurrencySymbol} // Pass dynamic currency
        />
        {/* Row 1, Col 3: Average Order Value (Purple) */}
        <SOMMetricCard
          title="Average Order Value"
          value={DASHBOARD_METRICS.averageOrderValue}
          unit="currency" // Use "currency" unit
          secondaryText={DASHBOARD_METRICS.averageOrderValueSub}
          icon={DollarSign}
          iconColor="text-purple-600"
          borderColor="border-purple-500"
          targetMet={undefined}
          targetMetText={`Target: ${dynamicCurrencySymbol}10M`}
          currencySymbol={dynamicCurrencySymbol} // Pass dynamic currency
        />
        {/* Row 1, Col 4: Fulfillment Rate (Orange) */}
        <SOMMetricCard
          title="Fulfillment Rate"
          value={DASHBOARD_METRICS.fulfillmentRate}
          unit=""
          secondaryText={DASHBOARD_METRICS.fulfillmentRateSub}
          icon={Package}
          iconColor="text-orange-600"
          borderColor="border-orange-500"
          targetMet={undefined}
          targetMetText="Benchmark: 80%"
          currencySymbol={dynamicCurrencySymbol} // Pass dynamic currency
        />

        {/* Row 2, Col 1: Conversion Lag (Orange) */}
        <SOMMetricCard
          title="Conversion Lag"
          value={DASHBOARD_METRICS.conversionLag}
          unit=""
          secondaryText="Time taken from order placement to fulfillment"
          icon={TrendingUp}
          iconColor="text-orange-600"
          borderColor="border-orange-500"
          targetMet={DASHBOARD_METRICS.conversionLagTargetMet}
          targetMetText={DASHBOARD_METRICS.conversionLagSub}
          currencySymbol={dynamicCurrencySymbol} // Pass dynamic currency
        />
        {/* Row 2, Col 2: Reserved Inventory Value (Purple) */}
        <SOMMetricCard
          title="Reserved Inventory Value"
          value={DASHBOARD_METRICS.reservedInventoryValue}
          unit="currency" // Use "currency" unit
          secondaryText={DASHBOARD_METRICS.reservedInventoryValueSub}
          icon={ShoppingCart}
          iconColor="text-purple-600"
          borderColor="border-purple-500"
          targetMet={undefined}
          targetMetText="Monitor usage"
          currencySymbol={dynamicCurrencySymbol} // Pass dynamic currency
        />
        {/* Row 2, Col 3: Cancellation Rate (Red) */}
        <SOMMetricCard
          title="Cancellation Rate"
          value={DASHBOARD_METRICS.cancellationRate}
          unit="%"
          secondaryText={DASHBOARD_METRICS.cancellationRateSub}
          icon={AlertCircle}
          iconColor="text-red-500"
          borderColor="border-red-500"
          targetMet={false}
          targetMetText="Target: < 10%"
          currencySymbol={dynamicCurrencySymbol} // Pass dynamic currency
        />
        {/* Row 2, Col 4: Note Compliance (Green) */}
        <SOMMetricCard
          title="Note Compliance"
          value={DASHBOARD_METRICS.noteCompliance}
          unit=""
          secondaryText="Documentation of order changes and issues"
          icon={CheckCircle}
          iconColor="text-green-600"
          borderColor="border-green-500"
          targetMet={DASHBOARD_METRICS.noteComplianceTargetMet}
          targetMetText={DASHBOARD_METRICS.noteComplianceSub}
          currencySymbol={dynamicCurrencySymbol} // Pass dynamic currency
        />
      </div>

      {/* 3. Critical Alerts Section */}
      <div className="mb-8 p-6 rounded-2xl bg-white shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Critical Alerts</h2>
          <span className="px-3 py-1 text-sm font-bold rounded-full bg-red-500 text-white">
            {CRITICAL_ALERTS.length}
          </span>
        </div>
        <div>
          {CRITICAL_ALERTS.map((alert, index) => (
            <CriticalAlert key={index} alert={alert} />
          ))}
        </div>
      </div>

      {/* 4. Visualization Grid (2 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Distribution (Pie Chart) - Data remains static but would be filtered in a real app */}
        <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 leading-none mb-4">
            Order Status Distribution
          </h2>
          <div className="flex-grow min-h-[300px] relative">
            <OrderStatusPieChart />
          </div>
        </div>

        {/* Order Value by Status (Bar Chart) - Data remains static but would be filtered in a real app */}
        <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 leading-none mb-4">
            Order Value by Status
          </h2>
          <div className="flex-grow min-h-[300px] relative">
            <OrderValueBarChart currencySymbol={dynamicCurrencySymbol} />{" "}
            {/* Pass dynamic currency */}
          </div>
        </div>
      </div>

      {/* 5. Recent Sales Orders Table - Now reflects the selected filter in the title */}
      <RecentSalesOrdersTable
        orders={RECENT_SALES_ORDERS}
        selectedRange={selectedRange}
        currencySymbol={dynamicCurrencySymbol} // Pass dynamic currency
      />
    </div>
  );

  // The component's return is wrapped in the layout structure, but commented out.
  return (
    <Layout>
      <div className={containerClasses}>{content}</div>
    </Layout>
  );
};

export default SalesOrderManagementDashboard;
