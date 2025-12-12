"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
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

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const STATUS_COLORS = {
  Draft: "#9CA3AF", // Gray
  Placed: "#3B82F6", // Blue
  InProduction: "#F59E0B", // Orange
  ReadyForDelivery: "#A855F7", // Purple
  Fulfilled: "#10B981", // Green
  Invoiced: "#059669", // Darker Green
  Cancelled: "#EF4444", // Red
  Default: "#8884d8",
};

const ALERT_ICON_MAP = {
  circle: AlertCircle,
  triangle: AlertTriangle,
  default: AlertTriangle,
};

const METRIC_STYLE_MAP = {
  conversionCompliance: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    borderColor: "border-green-500",
  },
  avgFulfillmentTime: {
    icon: Clock,
    iconColor: "text-blue-600",
    borderColor: "border-blue-500",
  },
  averageOrderValue: {
    icon: DollarSign,
    iconColor: "text-purple-600",
    borderColor: "border-purple-500",
  },
  fulfillmentRate: {
    icon: Package,
    iconColor: "text-orange-600",
    borderColor: "border-orange-500",
  },
  conversionLag: {
    icon: TrendingUp,
    iconColor: "text-orange-600",
    borderColor: "border-orange-500",
  },
  reservedInventoryValue: {
    icon: ShoppingCart,
    iconColor: "text-purple-600",
    borderColor: "border-purple-500",
  },
  cancellationRate: {
    icon: AlertCircle,
    iconColor: "text-red-500",
    borderColor: "border-red-500",
  },
  noteCompliance: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    borderColor: "border-green-500",
  },
};

const STATUS_BADGE_STYLES = {
  Fulfilled: "bg-green-100 text-green-700",
  Invoiced: "bg-green-100 text-green-700",
  Placed: "bg-blue-100 text-blue-700",
  "In Production": "bg-amber-100 text-amber-700",
  Draft: "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-700",
  default: "bg-gray-200 text-gray-800",
};

/* ============================================================
    REUSABLE COMPONENTS
============================================================ */

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
  currencySymbol,
}) => (
  <div
    className={`p-4 rounded-2xl bg-white shadow-md border-l-4 ${borderColor} flex flex-col justify-between h-full transition-shadow hover:shadow-lg`}>
    <div className="flex items-start justify-between mb-3">
      <p className="text-sm font-medium text-gray-500 leading-tight">{title}</p>
      <Icon size={20} className={iconColor} />
    </div>

    <div className="flex flex-col">
      <h3 className="text-2xl font-bold text-gray-900 leading-tight">
        {unit === "currency" ? currencySymbol : unit}
        {value}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{secondaryText}</p>
    </div>

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

const CriticalAlert = ({ alert }) => {
  const Icon = ALERT_ICON_MAP[alert.alertType] || ALERT_ICON_MAP.default;
  return (
    <div className="flex items-start p-4 rounded-xl border-l-4 border-red-500 bg-red-50 shadow-sm mb-3">
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

const OrderStatusPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
      <Pie
        data={data}
        dataKey="count"
        nameKey="name"
        innerRadius={0}
        outerRadius={100}
        paddingAngle={3}
        labelLine={false}
        label={false}
        legendType="circle">
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={STATUS_COLORS[entry.statusId] || STATUS_COLORS.Default}
          />
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

const OrderValueBarChart = ({ data, currencySymbol }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
      <YAxis
        stroke="#9CA3AF"
        fontSize={12}
        tickFormatter={(value) =>
          `${currencySymbol}${Math.round(value / 1000000)}M`
        }
      />
      <Tooltip
        formatter={(value) => [
          `${currencySymbol}${(value / 1000000).toFixed(2)}M`,
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
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={STATUS_COLORS[entry.statusId] || STATUS_COLORS.Default}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const StatusBadge = ({ status }) => {
  const colorClass = STATUS_BADGE_STYLES[status] || STATUS_BADGE_STYLES.default;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

const RecentSalesOrdersTable = ({ orders, selectedRange, currencySymbol }) => (
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
    MAIN DASHBOARD COMPONENT
============================================================ */

const SalesOrderManagementDashboard = () => {
  const [selectedRange, setSelectedRange] = useState("Month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Currency
  const dynamicCurrencySymbol = "₦";

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/salesManagement");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch sales management data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value);
    console.log(`Time range set to: ${event.target.value}.`);
  };

  const containerClasses =
    "w-full font-sans bg-gray-50 min-h-screen p-4 sm:p-6 lg:px-8 lg:pt-8";

  if (loading) {
    return (
      <Layout>
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-700 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">
            Loading Sales Order Dashboard...
          </p>
        </div>
      </Layout>
    );
  }

  // Safe Data Access
  const metrics = data?.dashboardMetrics ?? {};
  const orderData = data?.orderData ?? [];
  const criticalAlerts = data?.criticalAlerts ?? [];
  const recentSalesOrders = data?.recentSalesOrders ?? [];

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

        {/* Time Range Selector */}
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

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SOMMetricCard
          title="Conversion Compliance"
          value={metrics.conversionCompliance}
          unit=""
          secondaryText="Success rate for converting leads to sales orders"
          {...METRIC_STYLE_MAP.conversionCompliance}
          targetMet={metrics.conversionComplianceTargetMet}
          targetMetText={metrics.conversionComplianceText}
          currencySymbol={dynamicCurrencySymbol}
        />
        <SOMMetricCard
          title="Avg Fulfillment Time"
          value={metrics.avgFulfillmentTime}
          unit=""
          secondaryText={metrics.avgFulfillmentTimeSub}
          {...METRIC_STYLE_MAP.avgFulfillmentTime}
          targetMet={undefined}
          targetMetText="Target: < 90h"
          currencySymbol={dynamicCurrencySymbol}
        />
        <SOMMetricCard
          title="Average Order Value"
          value={metrics.averageOrderValue}
          unit="currency"
          secondaryText={metrics.averageOrderValueSub}
          {...METRIC_STYLE_MAP.averageOrderValue}
          targetMet={undefined}
          targetMetText={`Target: ${dynamicCurrencySymbol}10M`}
          currencySymbol={dynamicCurrencySymbol}
        />
        <SOMMetricCard
          title="Fulfillment Rate"
          value={metrics.fulfillmentRate}
          unit=""
          secondaryText={metrics.fulfillmentRateSub}
          {...METRIC_STYLE_MAP.fulfillmentRate}
          targetMet={undefined}
          targetMetText="Benchmark: 80%"
          currencySymbol={dynamicCurrencySymbol}
        />
        <SOMMetricCard
          title="Conversion Lag"
          value={metrics.conversionLag}
          unit=""
          secondaryText="Time taken from order placement to fulfillment"
          {...METRIC_STYLE_MAP.conversionLag}
          targetMet={metrics.conversionLagTargetMet}
          targetMetText={metrics.conversionLagSub}
          currencySymbol={dynamicCurrencySymbol}
        />
        <SOMMetricCard
          title="Reserved Inventory Value"
          value={metrics.reservedInventoryValue}
          unit="currency"
          secondaryText={metrics.reservedInventoryValueSub}
          {...METRIC_STYLE_MAP.reservedInventoryValue}
          targetMet={undefined}
          targetMetText="Monitor usage"
          currencySymbol={dynamicCurrencySymbol}
        />
        <SOMMetricCard
          title="Cancellation Rate"
          value={metrics.cancellationRate}
          unit="%"
          secondaryText={metrics.cancellationRateSub}
          {...METRIC_STYLE_MAP.cancellationRate}
          targetMet={false}
          targetMetText="Target: < 10%"
          currencySymbol={dynamicCurrencySymbol}
        />
        <SOMMetricCard
          title="Note Compliance"
          value={metrics.noteCompliance}
          unit=""
          secondaryText="Documentation of order changes and issues"
          {...METRIC_STYLE_MAP.noteCompliance}
          targetMet={metrics.noteComplianceTargetMet}
          targetMetText={metrics.noteComplianceSub}
          currencySymbol={dynamicCurrencySymbol}
        />
      </div>

      {/* 3. Critical Alerts */}
      <div className="mb-8 p-6 rounded-2xl bg-white shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Critical Alerts</h2>
          <span className="px-3 py-1 text-sm font-bold rounded-full bg-red-500 text-white">
            {criticalAlerts.length}
          </span>
        </div>
        <div>
          {criticalAlerts.map((alert, index) => (
            <CriticalAlert key={index} alert={alert} />
          ))}
        </div>
      </div>

      {/* 4. Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 leading-none mb-4">
            Order Status Distribution
          </h2>
          <div className="flex-grow min-h-[300px] relative">
            <OrderStatusPieChart data={orderData} />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white shadow-md border border-gray-100 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 leading-none mb-4">
            Order Value by Status
          </h2>
          <div className="flex-grow min-h-[300px] relative">
            <OrderValueBarChart
              data={orderData}
              currencySymbol={dynamicCurrencySymbol}
            />
          </div>
        </div>
      </div>

      {/* 5. Recent Sales Orders Table */}
      <RecentSalesOrdersTable
        orders={recentSalesOrders}
        selectedRange={selectedRange}
        currencySymbol={dynamicCurrencySymbol}
      />
    </div>
  );

  return (
    <Layout>
      <div className={containerClasses}>{content}</div>
    </Layout>
  );
};

export default SalesOrderManagementDashboard;
