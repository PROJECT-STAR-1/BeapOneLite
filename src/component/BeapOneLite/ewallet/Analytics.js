import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

/* ============================================================
    MOCK DATA
============================================================ */

// Mock data for the Transaction Trends Line Chart (7 days)
const TRANSACTION_TRENDS_DATA = [
  { date: "2025-11-27", credits: 1, debits: 2 },
  { date: "2025-11-28", credits: 3, debits: 1 },
  { date: "2025-11-29", credits: 2, debits: 4 },
  { date: "2025-11-30", credits: 5, debits: 3 },
  { date: "2025-12-01", credits: 4, debits: 2 },
  { date: "2025-12-02", credits: 6, debits: 5 },
  { date: "2025-12-03", credits: 7, debits: 3 },
];

/* ============================================================
    CUSTOM TOOLTIP COMPONENT
============================================================ */

/**
 * Custom Tooltip for the Line Chart (Transaction Trends)
 */
const CustomTrendsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-xl text-sm">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        {payload.map((item, index) => (
          <p
            key={index}
            style={{ color: item.color }}
            className="font-semibold">
            {item.dataKey === "credits" ? "Credits" : "Debits"} : {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ============================================================
    ANALYTICS CARD
============================================================ */

/**
 * Renders the Transaction Trends Line Chart Card.
 */
const TransactionTrendsCard = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 h-full min-h-[400px]">
    <div className="flex items-center space-x-2 mb-4 text-gray-800">
      <TrendingUp className="text-indigo-600" size={20} />
      <h2 className="text-lg font-bold">Transaction Trends (7 Days)</h2>
    </div>
    {/* Increased width/height ratio to provide more horizontal space */}
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={TRANSACTION_TRENDS_DATA}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          {/* Reduced font size for better fit using style prop on XAxis */}
          <XAxis
            dataKey="date"
            stroke="#374151"
            axisLine={{ stroke: "#374151" }}
            tickLine={false}
            style={{ fontSize: "10px" }} // Reduced font size
            minTickGap={-10} // Adjusted tick gap
          />
          <YAxis
            stroke="#374151"
            axisLine={{ stroke: "#374151" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTrendsTooltip />} />
          <Legend
            iconType="circle"
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value, entry) => (
              <span className="text-sm font-semibold text-gray-700">
                {value}
              </span>
            )}
          />
          {/* Credits Line (Green) */}
          <Line
            type="monotone"
            dataKey="credits"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Credits"
          />
          {/* Debits Line (Red) */}
          <Line
            type="monotone"
            dataKey="debits"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Debits"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/* ============================================================
    MAIN COMPONENT
============================================================ */

export function AnalyticsComponent() {
  return (
    <div className="bg-gray-50 min-h-screen p-0 lg:p-0 font-sans">
      <div className="w-full mx-auto">
        {/* Ensure the card takes full width on all screens */}
        <div className="p-4 lg:p-8">
          <TransactionTrendsCard />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsComponent;
