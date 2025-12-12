"use client";

import React, { useState, useEffect } from "react";
import {
  FileBadge,
  Lock,
  NotebookText,
  ShieldOff,
  UploadCloud,
  XCircle,
  Bug,
  Link,
  DownloadCloud,
  AlertTriangle,
  Clock,
  Loader2,
} from "lucide-react";

import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const COMPLIANCE_STYLE_MAP = {
  success: {
    icon: FileBadge,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-400",
  },
  info: {
    icon: Lock,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
  },
  purple: {
    icon: NotebookText,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-400",
  },
  warning: {
    icon: ShieldOff,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-400",
  },
};

const PIE_COLOR_MAP = {
  blue: "#1e3a8a",
  green: "#10b981",
  yellow: "#fcd34d",
  red: "#ef4444",
  purple: "#a78bfa",
  default: "#8884d8",
};

const INTEGRATION_ICON_MAP = {
  "success-uploads": { icon: UploadCloud, color: "text-green-600" },
  "rejected-uploads": { icon: XCircle, color: "text-red-600" },
  "virus-detected": { icon: Bug, color: "text-red-600" },
  "signed-urls": { icon: Link, color: "text-indigo-600" },
  "success-downloads": { icon: DownloadCloud, color: "text-green-600" },
  "unauth-attempts": { icon: AlertTriangle, color: "text-red-600" },
  "avg-upload": { icon: Clock, color: "text-green-600" },
  "avg-url": { icon: Clock, color: "text-green-600" },
  default: { icon: Clock, color: "text-gray-600" },
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

// 1. Scorecard Component
const ComplianceCard = ({ metric }) => {
  const style =
    COMPLIANCE_STYLE_MAP[metric.status] || COMPLIANCE_STYLE_MAP.info;
  const Icon = style.icon;

  return (
    <div
      className={`p-4 rounded-xl border-t-4 border-l-2 ${style.borderColor} bg-white shadow-md transition duration-300 hover:shadow-lg h-full flex flex-col justify-between`}>
      <div>
        <div className="flex items-center mb-1">
          <Icon size={20} className={`${style.color} mr-2`} />
          <h3 className="text-base font-semibold text-gray-800">
            {metric.title}
          </h3>
        </div>
        <p className="text-gray-500 text-xs mb-3">{metric.target}</p>
      </div>

      <div className="flex justify-between items-end">
        <p className="text-3xl font-semibold text-gray-900 leading-none">
          {metric.value}
        </p>
      </div>
    </div>
  );
};

// 2. Line Chart Component
const ComplianceTrendChart = ({
  data,
  dataKey,
  color,
  title,
  trendLabel,
  trendColor,
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white/90 border border-gray-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-gray-700">{label}</p>
          <p className={`${trendColor} font-medium`}>
            {dataKey.toUpperCase()}: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 h-96">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">
        Adherence to mandatory metadata contract over time
      </p>
      <ResponsiveContainer width="100%" height="70%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            stroke="#9ca3af"
            tickLine={false}
            orientation="left"
            width={45}
            padding={{ top: 10, bottom: 0 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-start mt-4">
        <div
          className={`flex items-center text-sm font-semibold ${trendColor} p-2 rounded-full`}>
          <span className="text-2xl mr-1 leading-none">↑</span>
          {trendLabel}
        </div>
      </div>
    </div>
  );
};

// 3. Pie Chart Component
const UploadVolumeChart = ({ data, total }) => {
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold">
        {`${data[index].name.split(" ")[1]}`}
      </text>
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 h-[450px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Lite Upload Volume by Document Type
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of document types (Last 7 days)
      </p>
      <ResponsiveContainer width="100%" height="60%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLOR_MAP[entry.category] || PIE_COLOR_MAP.default}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${Math.round((value / total) * 100)}%`,
              name.split(" ")[0],
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center flex flex-wrap justify-center gap-x-3 gap-y-1">
        {data.map((entry, index) => (
          <div key={index} className="inline-flex items-center text-xs">
            <span
              className="inline-block w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: PIE_COLOR_MAP[entry.category] }}></span>
            <span className="text-gray-700 font-medium">
              {entry.name.split(" ")[0]}
              <span className="text-gray-500 ml-1">
                {entry.name.split(" ")[1]}
              </span>
            </span>
          </div>
        ))}
        <p className="w-full mt-4 text-sm text-gray-600 font-semibold">
          Total Documents: {total}
        </p>
      </div>
    </div>
  );
};

// 4. Bar Chart Component
const SLOChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white/90 border border-gray-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-gray-700">{label}</p>
          <p className="text-gray-600">
            Target: {payload.find((p) => p.dataKey === "target")?.value}ms
          </p>
          <p className="text-indigo-600 font-medium">
            Actual: {payload.find((p) => p.dataKey === "actual")?.value}ms
          </p>
        </div>
      );
    }
    return null;
  };

  const renderValueLabels = (slo) => (
    <div className="flex flex-col items-center">
      <div className="text-base font-bold text-gray-900 mb-0">
        {slo.actualText}
      </div>
      <div
        className={`text-xs font-semibold ${
          slo.targetText === "On Target" ? "text-green-600" : "text-blue-600"
        } p-1 rounded-md`}>
        {slo.targetText}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 h-[450px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Performance SLOs
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Target vs. Actual latency (milliseconds)
      </p>
      <ResponsiveContainer width="100%" height="65%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} />
          <YAxis
            domain={[0, 600]}
            stroke="#9ca3af"
            tickLine={false}
            orientation="left"
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="target"
            fill="#d1d5db"
            radius={[4, 4, 0, 0]}
            name="Target SLO"
          />
          <Bar
            dataKey="actual"
            fill="#1e3a8a"
            radius={[4, 4, 0, 0]}
            name="Actual Latency"
          />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="right"
            wrapperStyle={{ padding: "0 0 10px 0", fontSize: "12px" }}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-around items-start pt-1 mt-1 space-x-2">
        {data.map((slo, index) => (
          <div key={index} className="text-center w-1/2">
            <p className="text-sm font-medium text-gray-700 mb-0">{slo.name}</p>
            {renderValueLabels(slo)}
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Small Metric Card
const IntegrationMetricCard = ({ metric }) => {
  const config =
    INTEGRATION_ICON_MAP[metric.id] || INTEGRATION_ICON_MAP.default;
  const Icon = config.icon;

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
        <Icon size={20} className={config.color} />
      </div>
      <p className="text-xs font-medium text-gray-500 mt-2 leading-tight">
        {metric.label}
      </p>
    </div>
  );
};

/* ============================================================
    MAIN AGGREGATOR COMPONENT
============================================================ */

export default function ComplianceTabContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/document");
        if (response.ok) {
          const result = await response.json();
          // Access specific compliance data if nested, or use root object
          setData(result);
        } else {
          console.error("Failed to fetch compliance data");
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
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-10 h-10 text-indigo-700 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">
          Loading Compliance Metrics...
        </p>
      </div>
    );
  }

  // Safe Data Access
  const complianceMetrics = data?.complianceMetrics ?? [];
  const trendData = data?.trendData ?? [];
  const pieChartData = data?.pieChartData ?? [];
  const sloChartData = data?.sloChartData ?? [];
  const integrationMetrics = data?.integrationMetrics ?? [];

  // Calculate total documents for pie chart
  const totalDocuments = 8; // Or calculate dynamically: pieChartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* SECTION 1: Top Level Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {complianceMetrics.map((metric, index) => (
            <ComplianceCard key={index} metric={metric} />
          ))}
        </div>

        {/* SECTION 2: Compliance Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ComplianceTrendChart
            data={trendData}
            dataKey="dci"
            color="#10b981"
            title="Document Compliance Index (DCI) Trend"
            trendLabel="+7.6% since inception"
            trendColor="text-green-600"
          />
          <ComplianceTrendChart
            data={trendData}
            dataKey="saar"
            color="#3b82f6"
            title="Secure Access Adherence Rate (SAAR) Trend"
            trendLabel="-61.9% since inception"
            trendColor="text-blue-600"
          />
        </div>

        {/* SECTION 3: Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UploadVolumeChart data={pieChartData} total={totalDocuments} />
          <SLOChart data={sloChartData} />
        </div>

        {/* SECTION 4: Integration Metrics Summary */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Integration Metrics Summary
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Comprehensive view of G5-Lite integration health
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {integrationMetrics.map((metric, index) => (
              <IntegrationMetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
