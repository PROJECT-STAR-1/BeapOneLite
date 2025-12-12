"use client";
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Banknote,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Link,
  LineChart,
  PieChart,
  Loader2,
} from "lucide-react";

/* ============================================================
    CONSTANTS & UI MAPPINGS
============================================================ */

const BRAND_COLOR = "text-indigo-700";
const ICON_SIZE = 20;

// KPI UI Configuration Map
const KPI_CONFIG = {
  credits: {
    icon: TrendingUp,
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    badgeBg: "bg-green-100",
    badgeText: "text-green-600",
  },
  debits: {
    icon: TrendingDown,
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    badgeBg: "bg-red-100",
    badgeText: "text-red-600",
  },
  balance: {
    icon: Banknote,
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-600",
  },
  fees: {
    icon: DollarSign,
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-600",
  },
};

// Spending Chart Colors Map
const SPENDING_COLORS = {
  payment: "#3b82f6", // Blue
  withdrawal: "#f97316", // Orange
  transfer: "#ef4444", // Red
  deposit: "#6b7280", // Gray
  other: "#a855f7", // Purple
};

// Formatter for currency
const formatNaira = (amount) => {
  return `₦ ${new Intl.NumberFormat("en-NG").format(Math.abs(amount))}`;
};

const currencyFormatter = (value) => `${value}M`;

/* ============================================================
    SUB-COMPONENTS
============================================================ */

const KpiCard = ({ data }) => {
  const config = KPI_CONFIG[data.id] || KPI_CONFIG.credits;
  const Icon = config.icon;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.iconBg} ${config.iconText}`}>
          <Icon size={ICON_SIZE} />
        </div>
        {/* Render Change Percentage if exists */}
        {data.changeValue && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg ${config.badgeBg} ${config.badgeText}`}>
            {data.changeValue}
          </span>
        )}
        {/* Render Badge Label (e.g., "3 Banks") if exists */}
        {data.badgeLabel && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg ${config.badgeBg} ${config.badgeText}`}>
            {data.badgeLabel}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-1">{data.title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
        {formatNaira(data.amount)}
      </h3>
      <p className="text-sm text-gray-500">{data.subtext}</p>
    </div>
  );
};

const TransactionItem = ({ data }) => {
  const isCredit = data.type === "Credit";
  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;
  const amountColor = isCredit ? "text-green-600" : "text-red-600";
  const iconColor = isCredit ? "text-green-600" : "text-red-600";
  const iconBg = isCredit ? "bg-green-50" : "bg-red-50";

  return (
    <div className="flex items-start py-4 border-b border-gray-100 last:border-b-0">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor} flex-shrink-0 mr-3`}>
        <Icon size={16} />
      </div>

      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium text-gray-800 line-clamp-1">
          {data.description}
        </p>
        <p className="text-xs text-gray-500">{data.date}</p>
      </div>

      <div className="text-right flex-shrink-0 ml-3">
        <p className={`text-sm font-semibold ${amountColor}`}>
          {isCredit ? "+" : "–"} {formatNaira(Math.abs(data.amount))}
        </p>
        <span className="text-xs font-bold px-1.5 py-0.5 mt-0.5 inline-block rounded text-green-700 bg-green-100 uppercase">
          {data.status}
        </span>
      </div>
    </div>
  );
};

const LinkedBankAccount = ({ data }) => {
  const formatCustomCurrency = (amount, cur) => {
    if (cur === "₦") return formatNaira(amount);
    return `${cur} ${new Intl.NumberFormat("en-US").format(amount)}`;
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center text-sm font-semibold text-gray-800">
            <Banknote size={16} className={`${BRAND_COLOR} mr-2`} />
            {data.bank}
            {data.isPrimary && (
              <span className="text-xs font-bold px-2 py-0.5 ml-3 rounded bg-blue-100 text-blue-700">
                Primary
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">****{data.account}</p>
        </div>
        <h4 className="text-lg font-bold text-gray-900 leading-tight">
          {formatCustomCurrency(data.balance, data.currency)}
        </h4>
      </div>
      <div className="flex space-x-2 mt-2">
        <span className="text-xs font-bold px-1.5 py-0.5 rounded text-green-700 bg-green-100">
          SYNCED
        </span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded text-indigo-700 bg-indigo-100">
          Auto-Sync
        </span>
      </div>
    </div>
  );
};

const TransactionFlowChart = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[350px] flex flex-col">
    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <LineChart size={ICON_SIZE} className={`mr-2 ${BRAND_COLOR}`} />
      Transaction Flow (7 Days)
    </h4>
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "10px" }} />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: "10px" }}
          tickFormatter={currencyFormatter}
          label={{
            value: "Amount (Millions ₦)",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle", fontSize: "12px", fill: "#6b7280" },
          }}
        />
        <Tooltip
          formatter={(value) => [formatNaira(value * 1000000), "Amount"]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "12px",
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
          iconType="square"
        />
        <Line
          type="monotone"
          dataKey="credits"
          stroke="#10b981"
          name="Credits"
          strokeWidth={3}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="debits"
          stroke="#ef4444"
          name="Debits"
          strokeWidth={3}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  </div>
);

const SpendingByCategoryChart = ({ data }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent > 0.05) {
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          style={{ fontSize: "10px", fontWeight: "bold" }}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[350px] flex flex-col">
      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <PieChart size={ICON_SIZE} className={`mr-2 ${BRAND_COLOR}`} />
        Spending by Category
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={100}
            paddingAngle={3}
            labelLine={false}
            label={renderCustomLabel}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={SPENDING_COLORS[entry.category] || "#8884d8"}
                stroke={SPENDING_COLORS[entry.category] || "#8884d8"}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${((value / total) * 100).toFixed(1)}%`,
              name,
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "12px", bottom: 0 }}
            iconType="circle"
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ============================================================
    MAIN OVERVIEW COMPONENT
============================================================ */

export default function EWalletOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/ewallet");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch wallet overview data");
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
        <p className="text-gray-600 font-medium">Loading Overview...</p>
      </div>
    );
  }

  // Safe data access
  const kpiData = data?.kpiData ?? [];
  const flowChartData = data?.flowChartData ?? [];
  const spendingChartData = data?.spendingChartData ?? [];
  const transactionData = data?.transactionData ?? [];
  const bankData = data?.bankData ?? [];

  return (
    <div className="space-y-6">
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.id} data={kpi} />
        ))}
      </div>

      {/* 2. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionFlowChart data={flowChartData} />
        <SpendingByCategoryChart data={spendingChartData} />
      </div>

      {/* 3. Recent Transactions & Linked Banks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Transactions
          </h4>
          <div className="divide-y divide-gray-100">
            {transactionData.map((tx, index) => (
              <TransactionItem key={index} data={tx} />
            ))}
          </div>
        </div>

        {/* Right Panel: Linked Bank Accounts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Link size={ICON_SIZE} className={`mr-2 ${BRAND_COLOR}`} />
            Linked Bank Accounts
          </h4>
          <div className="divide-y divide-gray-100">
            {bankData.map((bank, index) => (
              <LinkedBankAccount key={index} data={bank} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
