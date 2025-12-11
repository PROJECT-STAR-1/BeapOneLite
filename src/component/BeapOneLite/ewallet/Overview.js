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
  LineChart, // Lucide Icon (used for headings)
  PieChart, // Lucide Icon (used for headings)
  Scale,
  FileText,
  Download,
  Upload,
} from "lucide-react";

/* ============================================================
    CONSTANTS & MOCK DATA
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


const TransactionItem = ({ type, description, date, amount, status }) => {
  const isCredit = type === "Credit";
  // ArrowUpRight for money going *out* (Debit), ArrowDownLeft for money coming *in* (Credit)
  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

  // Determine color based on transaction type
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


const LinkedBankAccount = ({ bank, account, balance, isPrimary, currency }) => {
  const formatCustomCurrency = (amount, cur) => {
    if (cur === "₦") return formatNaira(amount);
    // Fallback for other currencies like KSh
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


// Formatter for Y-Axis and Tooltip (in Millions, M)
const currencyFormatter = (value) => `${value}M`;

// Line Chart (Transaction Flow)
const TransactionFlowChart = () => (
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
