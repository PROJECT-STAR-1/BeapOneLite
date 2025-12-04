"use client";
import React from "react";
import {
  // Recharts components (added for functional charts)
  ResponsiveContainer,
  LineChart as RechartsLineChart, // Renamed to avoid conflict with Lucide icon
  PieChart as RechartsPieChart, // Renamed to avoid conflict with Lucide icon
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Pie,
  Cell,
} from "recharts"; // Assumed available in the React environment

import {
  TrendingUp,
  TrendingDown,
  Banknote,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Link,
  LineChart, // Lucide Icon (used for headings)
  PieChart, // Lucide Icon (used for headings)
  Scale,
  FileText,
  Download,
  Upload,
} from "lucide-react";

/* ============================================================
    CONSTANTS & MOCK DATA
============================================================ */

const BRAND_COLOR = "text-indigo-700";
const BRAND_BG = "bg-indigo-700";
const ICON_SIZE = 20;

// Reusable formatting function for currency (assumes Naira ₦ as default)
const formatNaira = (amount) => {
  // Using Naira currency symbol (₦)
  // Absolute value used to ensure formatting works correctly for chart amounts
  return `₦ ${new Intl.NumberFormat("en-NG").format(Math.abs(amount))}`;
};

// Data for the Transaction Flow Line Chart
const flowChartData = [
  { name: "27/Nov", credits: 1.5, debits: 0.82 },
  { name: "28/Nov", credits: 2.0, debits: 1.2 },
  { name: "29/Nov", credits: 0.5, debits: 0.05 },
  { name: "30/Nov", credits: 3.5, debits: 1.8 },
  { name: "01/Dec", credits: 1.0, debits: 0.6 },
  { name: "02/Dec", credits: 2.5, debits: 1.5 },
  { name: "03/Dec", credits: 4.0, debits: 2.5 },
];

// Data for the Spending by Category Pie Chart (Values in units of 100k, colors based on mock image)
const spendingChartData = [
  { name: "Vendor Payment", value: 32, color: "#3b82f6" }, // Blue
  { name: "Withdrawal", value: 48, color: "#f97316" }, // Orange
  { name: "Wallet Transfer", value: 2, color: "#ef4444" }, // Red
  { name: "Bank Deposit", value: 0, color: "#6b7280" }, // Gray
  { name: "Other Expenses", value: 18, color: "#a855f7" }, // Purple
];

const kpiData = [
  {
    id: 1,
    title: "Total Credits",
    amount: 4500000,
    subtext: "Last 30 days",
    icon: TrendingUp,
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    tagLabel: "+12.5%",
    tagBg: "bg-green-100",
    tagText: "text-green-600",
  },
  {
    id: 2,
    title: "Total Debits",
    amount: 2522500,
    subtext: "Last 30 days",
    icon: TrendingDown,
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    tagLabel: "-8.3%",
    tagBg: "bg-red-100",
    tagText: "text-red-600",
  },
  {
    id: 3,
    title: "Total Bank Balance",
    amount: 11700000,
    subtext: "Across all accounts",
    icon: Banknote,
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    badge: "3 Banks",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-600",
  },
  {
    id: 4,
    title: "Gateway Fees",
    amount: 0,
    subtext: "Transaction costs",
    icon: DollarSign,
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    badge: "Monthly",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-600",
  },
];

const transactionData = [
  {
    type: "Debit",
    description: "Payment to TechSupply Nigeria Ltd",
    date: "11/27/2024, 11:00:00 AM",
    amount: -800000,
    status: "completed",
  },
  {
    type: "Debit",
    description: "Paystack transaction fee for INV-2024-11-025",
    date: "11/27/2024, 10:16:00 AM",
    amount: -22500,
    status: "completed",
  },
  {
    type: "Credit",
    description: "Payment received for Invoice INV-2024-11-025",
    date: "11/27/2024, 10:15:00 AM",
    amount: 1500000,
    status: "completed",
  },
  {
    type: "Debit",
    description: "Bank sweep to Access Bank ****6789",
    date: "11/26/2024, 7:00:00 PM",
    amount: -1200000,
    status: "completed",
  },
  {
    type: "Credit",
    description: "Bank transfer from Access Bank ****6789",
    date: "11/26/2024, 3:00:00 PM",
    amount: 2000000,
    status: "completed",
  },
];

const bankData = [
  {
    bank: "Access Bank Nigeria",
    account: "****6789",
    balance: 8500000,
    isPrimary: true,
    currency: "₦",
  },
  {
    bank: "GTBank Nigeria",
    account: "****3210",
    balance: 3200000,
    isPrimary: false,
    currency: "₦",
  },
  {
    bank: "M-Pesa Kenya",
    account: "****5678",
    balance: 450000,
    isPrimary: false,
    currency: "KSh",
  },
];

/* ============================================================
    COMPONENT: 1. KPI CARD
============================================================ */

const KpiCard = ({
  title,
  amount,
  subtext,
  icon: Icon,
  iconBg,
  iconText,
  tagLabel,
  tagBg,
  tagText,
  badge,
  badgeBg,
  badgeText,
}) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Top section: Icon and Tags/Badges */}
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg} ${iconText}`}>
          <Icon size={ICON_SIZE} />
        </div>
        {tagLabel && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg ${tagBg} ${tagText}`}>
            {tagLabel}
          </span>
        )}
        {badge && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg ${badgeBg} ${badgeText}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Title and Value */}
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
        {formatNaira(amount)}
      </h3>
      <p className="text-sm text-gray-500">{subtext}</p>
    </div>
  );
};

/* ============================================================
    COMPONENT: 2. TRANSACTION ITEM
============================================================ */

const TransactionItem = ({ type, description, date, amount, status }) => {
  const isCredit = type === "Credit";
  // ArrowUpRight for money going *out* (Debit), ArrowDownLeft for money coming *in* (Credit)
  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

  // Determine color based on transaction type
  const amountColor = isCredit ? "text-green-600" : "text-red-600";
  const iconColor = isCredit ? "text-green-600" : "text-red-600";
  const iconBg = isCredit ? "bg-green-50" : "bg-red-50";

  return (
    <div className="flex items-start py-4 border-b border-gray-100 last:border-b-0">
      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor} flex-shrink-0 mr-3`}>
        <Icon size={16} />
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium text-gray-800 line-clamp-1">
          {description}
        </p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>

      {/* Amount and Status */}
      <div className="text-right flex-shrink-0 ml-3">
        <p className={`text-sm font-semibold ${amountColor}`}>
          {isCredit ? "+" : "–"} {formatNaira(Math.abs(amount))}
        </p>
        <span className="text-xs font-bold px-1.5 py-0.5 mt-0.5 inline-block rounded text-green-700 bg-green-100 uppercase">
          {status}
        </span>
      </div>
    </div>
  );
};

/* ============================================================
    COMPONENT: 3. BANK ACCOUNT ITEM
============================================================ */

const LinkedBankAccount = ({ bank, account, balance, isPrimary, currency }) => {
  const formatCustomCurrency = (amount, cur) => {
    if (cur === "₦") return formatNaira(amount);
    // Fallback for other currencies like KSh
    return `${cur} ${new Intl.NumberFormat("en-US").format(amount)}`;
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        {/* Bank Name and Account */}
        <div>
          <div className="flex items-center text-sm font-semibold text-gray-800">
            <Banknote size={16} className={`${BRAND_COLOR} mr-2`} />
            {bank}
            {isPrimary && (
              <span className="text-xs font-bold px-2 py-0.5 ml-3 rounded bg-blue-100 text-blue-700">
                Primary
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">****{account}</p>
        </div>

        {/* Balance */}
        <h4 className="text-lg font-bold text-gray-900 leading-tight">
          {formatCustomCurrency(balance, currency)}
        </h4>
      </div>

      {/* Actions/Tags */}
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

/* ============================================================
    COMPONENT: 4. FUNCTIONAL CHARTS (RECHARTS)
============================================================ */

// Formatter for Y-Axis and Tooltip (in Millions, M)
const currencyFormatter = (value) => `${value}M`;

// Line Chart (Transaction Flow)
const TransactionFlowChart = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[350px] flex flex-col">
    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <LineChart size={ICON_SIZE} className={`mr-2 ${BRAND_COLOR}`} />
      Transaction Flow (7 Days)
    </h4>
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={flowChartData}
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

// Pie Chart (Spending by Category)
const SpendingByCategoryChart = () => {
  // Calculate total for percentage calculation
  const total = spendingChartData.reduce((sum, entry) => sum + entry.value, 0);

  // Custom label to show percentage
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if the slice is significant
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
          {" "}
          {/* Increased bottom margin for legend */}
          <Pie
            data={spendingChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={0} // Changed to 0 for a full pie chart
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={3}
            labelLine={false}
            label={renderCustomLabel}>
            {spendingChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={entry.color}
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
          {/* Updated Legend properties for horizontal layout at the bottom */}
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

export function EWalletOverview() {
  return (
    // Main wrapper uses flex and gap for consistent spacing across the dashboard sections
    <div className="space-y-6">
      {/* 1. KPI Cards (EW OV1.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* 2. Charts (EW OV2.png) - Now functional using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionFlowChart />
        <SpendingByCategoryChart />
      </div>

      {/* 3. Recent Transactions & Linked Banks (EW OV3.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Transactions
          </h4>
          {/* List Container */}
          <div className="divide-y divide-gray-100">
            {transactionData.map((tx, index) => (
              <TransactionItem key={index} {...tx} />
            ))}
          </div>
        </div>

        {/* Right Panel: Linked Bank Accounts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Link size={ICON_SIZE} className={`mr-2 ${BRAND_COLOR}`} />
            Linked Bank Accounts
          </h4>
          {/* List Container */}
          <div className="divide-y divide-gray-100">
            {bankData.map((bank, index) => (
              <LinkedBankAccount key={index} {...bank} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EWalletOverview;
