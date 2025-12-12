"use client";
import React, { useState, useEffect } from "react";
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
import { TrendingUp, Loader2 } from "lucide-react";

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
    ANALYTICS CARD COMPONENT
============================================================ */

const TransactionTrendsCard = ({ data }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 h-full min-h-[400px]">
    <div className="flex items-center space-x-2 mb-4 text-gray-800">
      <TrendingUp className="text-indigo-600" size={20} />
      <h2 className="text-lg font-bold">Transaction Trends (7 Days)</h2>
    </div>
    {/* Increased width/height ratio to provide more horizontal space */}
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#374151"
            axisLine={{ stroke: "#374151" }}
            tickLine={false}
            style={{ fontSize: "10px" }}
            minTickGap={-10}
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
            formatter={(value) => (
              <span className="text-sm font-semibold text-gray-700">
                {value.charAt(0).toUpperCase() + value.slice(1)}
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

export default function AnalyticsComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/ewallet");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch analytics data");
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
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Trends...</p>
      </div>
    );
  }

  // Safe Data Access
  const transactionTrendsData = data?.transactionTrendsData ?? [];

  return (
    <div className="bg-gray-50 min-h-screen p-0 lg:p-0 font-sans">
      <div className="w-full mx-auto">
        <div className="p-4 lg:p-8">
          <TransactionTrendsCard data={transactionTrendsData} />
        </div>
      </div>
    </div>
  );
}
