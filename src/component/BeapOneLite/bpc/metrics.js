import React, { useState } from "react";
import {
  Briefcase,
  TrendingUp,
  RotateCw,
  Zap,
  DollarSign,
  BarChart2,
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
  Layers,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// ====================================================================
// 1. DATA DEFINITIONS & STYLES (FIX: Static color map for Tailwind)
// ====================================================================

/**
 * Static map of full Tailwind classes to ensure correct compilation.
 */
const colorStyleMap = {
  green: {
    border: "border-green-600",
    text: "text-green-600",
    icon: "text-green-500",
  },
  indigo: {
    border: "border-indigo-600",
    text: "text-indigo-600",
    icon: "text-indigo-500",
  },
  purple: {
    border: "border-purple-600",
    text: "text-purple-600",
    icon: "text-purple-500",
  },
  yellow: {
    border: "border-yellow-700",
    text: "text-yellow-700",
    icon: "text-yellow-500",
  },
  orange: {
    border: "border-orange-600",
    text: "text-orange-600",
    icon: "text-orange-500",
  },
  cyan: {
    border: "border-cyan-600",
    text: "text-cyan-600",
    icon: "text-cyan-500",
  },
};

// --- Data for Top Row (BPC MT1.png) ---
const TOP_METRICS = [
  {
    title: "Context Transfer Success Rate",
    icon: CheckCircle,
    color: "green",
    value: "100.0%",
    target: "> 99.5%",
    trend: "+0.5% since 5Y",
    status: "Success",
  },
  {
    title: "Integration Error Rate",
    icon: AlertTriangle,
    color: "indigo",
    value: "0.00%",
    target: "< 0.1%",
    trend: "-0.5% since 5Y",
    status: "Success",
  },
  {
    title: "BPC Service Adoption",
    icon: Layers,
    color: "purple",
    value: "8.9%",
    target: "Of active projects",
    trend: "+1.8% since 5Y",
    status: "Info",
  },
  {
    title: "Avg Revenue Per Service",
    icon: DollarSign,
    color: "yellow",
    value: "$14.0K",
    target: "Per engagement",
    trend: "+$3K since 5Y",
    status: "Info",
  },
];

// --- Data for Adoption Trend (BPC MT2.png - Left) ---
const ADOPTION_TREND_DATA = [
  { name: "5Y", value: 0.75 },
  { name: "3Y", value: 1.5 },
  { name: "1Y", value: 2.25 },
  { name: "Q", value: 2.55 },
  { name: "M", value: 2.65 },
  { name: "W", value: 2.75 },
  { name: "D", value: 2.9 },
  { name: "Today", value: 2.7 },
];

// --- Data for Service Distribution (BPC MT2.png - Right) ---
const CATEGORY_DISTRIBUTION_DATA = [
  { name: "Growth Strategy", value: 33, color: "#312E81" }, // Indigo-900
  { name: "Compliance", value: 17, color: "#8B5CF6" }, // Violet-500
  { name: "Operations", value: 17, color: "#3B82F6" }, // Blue-500
  { name: "Market Expansion", value: 17, color: "#FCD34D" }, // Amber-300
  { name: "Financial Advisory", value: 16, color: "#10B981" }, // Emerald-500
];
const TOTAL_ACTIVE_ENGAGEMENTS = 6;
const RADIAN = Math.PI / 180;

// --- Data for Performance SLOs (BPC MT3.png) ---
const PERFORMANCE_SLO_DATA = [
  {
    name: "Context Transfer (P1)",
    actual: 245,
    target: 500,
    unit: "ms",
    status: "On Target",
    color: "#0D3E7F", // Darker Blue/Indigo
    xAxisLabel: "245ms",
    targetLabel: "500ms",
  },
  {
    name: "Billing Event (P2)",
    actual: 80,
    target: 120,
    unit: "ms",
    status: "On Target",
    color: "#0D3E7F",
    xAxisLabel: "80ms",
    targetLabel: "120ms",
  },
  {
    name: "Catalog Sync (P3)",
    actual: 2.5,
    target: 5,
    unit: "min",
    status: "Excellent",
    color: "#0D3E7F",
    xAxisLabel: "2.5min",
    targetLabel: "5min",
  },
];

// --- Data for Integration Health Summary (BPC MT4.png - Bottom) ---
const HEALTH_SUMMARY_METRICS = [
  { label: "Context Transfer Success", value: "100.0%", icon: Zap, unit: "" },
  { label: "Billing Event Latency", value: "80ms", icon: Clock, unit: "" },
  {
    label: "Avg Revenue Per Service",
    value: "$14.0K",
    icon: DollarSign,
    unit: "",
  },
  {
    label: "Integration Error Rate",
    value: "0.00%",
    icon: AlertTriangle,
    unit: "",
  },
];

// ====================================================================
// 2. REUSABLE COMPONENTS
// ====================================================================

/**
 * Top Metric Card Component (from BPC MT1.png top row)
 */
const MetricCard = ({
  title,
  icon: Icon,
  color,
  value,
  target,
  trend,
  status,
}) => {
  const styles = colorStyleMap[color] || {
    border: "border-gray-500",
    text: "text-gray-900",
    icon: "text-gray-500",
  };
  const trendColor =
    status === "Success" ? "text-green-600" : "text-purple-600";

  return (
    <div
      className={`bg-white p-5 rounded-xl shadow-md border border-gray-100 transition hover:shadow-lg border-l-4 ${styles.border}`}>
      <div className="flex items-center mb-3">
        <Icon size={18} className={`mr-2 ${styles.icon}`} />
        <h3 className={`text-sm font-medium text-gray-700`}>{title}</h3>
      </div>
      {/* Main value uses the theme color from the map */}
      <p className={`text-3xl font-bold mb-2 ${styles.text}`}>{value}</p>
      <div className="text-xs text-gray-500">
        <p className="mb-1">
          Target: <span className="font-semibold">{target}</span>
        </p>
        <p className={`${trendColor} font-medium`}>{trend}</p>
      </div>
    </div>
  );
};

/**
 * Custom Tooltip for Line Chart
 */
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-md shadow-lg text-sm">
        <p className="font-bold text-gray-700">{label}</p>
        <p className="text-green-500">
          Adoption: {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Custom Tooltip for Bar Chart (SLOs)
 */
const CustomSLOTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = PERFORMANCE_SLO_DATA.find((d) => d.name === label);
    return (
      <div className="p-3 bg-white border border-gray-300 rounded-md shadow-lg text-sm">
        <p className="font-bold text-gray-800 mb-1">{label.split("(")[0]}</p>
        <p className="text-gray-600">
          Actual:{" "}
          <span className="font-semibold text-indigo-800">
            {payload.find((p) => p.name === "Actual")?.value}
            {data?.unit}
          </span>
        </p>
        <p className="text-gray-600">
          Target:{" "}
          <span className="font-semibold text-gray-400">
            {payload.find((p) => p.name === "Target")?.value}
            {data?.unit}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Custom Tooltip for Pie Chart
 */
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-md shadow-lg text-sm">
        <p className="font-bold text-gray-700">{data.name}</p>
        <p className="text-gray-600">
          Distribution:{" "}
          <span className="font-semibold text-indigo-800">{data.value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Health Summary Card (BPC MT4.png bottom row)
 */
const HealthSummaryCard = ({ label, value, icon: Icon, unit }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-full">
    <p className="text-3xl font-bold text-gray-900 mb-3 flex items-baseline">
      {value}
    </p>
    <div className="flex items-center text-sm text-gray-500">
      <Icon size={16} className="mr-1 text-purple-500" />
      <span className="truncate">{label}</span>
    </div>
  </div>
);

// ====================================================================
// 3. CHART COMPONENTS
// ====================================================================

/**
 * Chart 1: Context Transfer Success Rate Trend (BPC MT1.png - Bottom Left)
 */
const ContextSuccessTrend = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      Context Transfer Success Rate Trend
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      Reliability of Lite → A2-3 project data push over time
    </p>
    <div className="flex-grow min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={ADOPTION_TREND_DATA}
          margin={{ top: 10, right: 30, left: -20, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: "10px" }} />
          <YAxis
            domain={[0.5, 3]}
            ticks={[0.5, 1, 1.5, 2, 2.5, 3]}
            stroke="#6B7280"
            style={{ fontSize: "10px" }}
          />
          <Tooltip content={<CustomLineTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            name="Success Rate"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="text-center mt-3 text-sm font-medium text-green-600 flex items-center justify-center">
      <CheckCircle size={14} className="mr-1" /> Excellent reliability - 100%
      today
    </div>
  </div>
);

/**
 * Chart 2: Integration Error Rate Trend (BPC MT1.png - Bottom Right)
 */
const ErrorRateTrend = () => {
  // Flipped and scaled version of the adoption data for a downward trend look
  const ERROR_RATE_DATA = [
    { name: "5Y", value: 0.55 },
    { name: "3Y", value: 0.25 },
    { name: "1Y", value: 0.1 },
    { name: "Q", value: 0.05 },
    { name: "M", value: 0.02 },
    { name: "W", value: 0.01 },
    { name: "D", value: 0.005 },
    { name: "Today", value: 0.0 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Integration Error Rate Trend
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        API stability across all integration points (Lite → A2-3 → A2-4)
      </p>
      <div className="flex-grow min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ERROR_RATE_DATA}
            margin={{ top: 10, right: 30, left: -20, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              stroke="#6B7280"
              style={{ fontSize: "10px" }}
            />
            <YAxis
              domain={[0, 0.6]}
              ticks={[0, 0.15, 0.3, 0.45, 0.6]}
              tickFormatter={(val) => `${val.toFixed(2)}`}
              stroke="#6B7280"
              style={{ fontSize: "10px" }}
            />
            <Tooltip content={<CustomLineTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
              name="Error Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-3 text-sm font-medium text-blue-600 flex items-center justify-center">
        <Activity size={14} className="mr-1" /> System stability: 0.00% error
        rate
      </div>
    </div>
  );
};

/**
 * Chart 3: Service Adoption Trend (BPC MT2.png - Left)
 */
const BpcAdoptionTrend = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      BPC Service Adoption Trend
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      Consultation requests initiated from Lite vs. active projects
    </p>
    <div className="flex-grow min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={ADOPTION_TREND_DATA}
          margin={{ top: 10, right: 30, left: -20, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: "10px" }} />
          <YAxis
            domain={[0, 3]}
            ticks={[0, 0.75, 1.5, 2.25, 3]}
            stroke="#6B7280"
            style={{ fontSize: "10px" }}
          />
          <Tooltip content={<CustomLineTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            name="Adoption Rate"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="text-center mt-3 text-sm font-medium text-purple-600 flex items-center justify-center">
      <TrendingUp size={14} className="mr-1" /> Growing adoption - 8.9% of
      projects
    </div>
  </div>
);

/**
 * Chart 4: Service Category Distribution (BPC MT2.png - Right)
 */
const CategoryDistribution = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Service Category Distribution
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Active engagements by consulting category
      </p>

      <div className="flex-grow flex flex-col items-center justify-center min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip content={<CustomPieTooltip />} />{" "}
            {/* Tooltip for hover details */}
            <Pie
              data={CATEGORY_DISTRIBUTION_DATA}
              cx="50%"
              cy="50%"
              innerRadius={0} // Full pie chart
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              labelLine={false}>
              {CATEGORY_DISTRIBUTION_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Custom Legend (kept as requested) */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm mt-4">
          {CATEGORY_DISTRIBUTION_DATA.map((entry, index) => (
            <div key={index} className="flex items-center">
              <span
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: entry.color }}></span>
              <span className="text-gray-600">
                {entry.name}{" "}
                <span className="font-medium text-gray-800">
                  {entry.value}%
                </span>
              </span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Total Active Engagements:{" "}
          <span className="font-bold text-gray-800">
            {TOTAL_ACTIVE_ENGAGEMENTS}
          </span>
        </p>
      </div>
    </div>
  );
};

/**
 * Chart 5: Performance SLOs (BPC MT3.png)
 * MODIFIED:
 * - Reduced description margin (mb-6 -> mb-3)
 * - Reduced chart height (h-[240px] -> h-[200px]) to move chart up and free space below
 * - Reduced font size and boldness of metric values below the chart
 */
const PerformanceSLOs = () => (
  // Increased overall container height to h-[400px] to ensure everything fits fully
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 min-h-[400px]">
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      Performance SLOs
    </h3>
    {/* Reduced margin for tighter spacing */}
    <p className="text-sm text-gray-500 mb-3">
      Target vs. Actual latency and sync metrics
    </p>

    {/* Reduced height from 240px to 200px to move chart up and free space below */}
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={PERFORMANCE_SLO_DATA}
          layout="horizontal" // Vertical bars
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          barCategoryGap="20%"
          barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="name"
            type="category"
            stroke="#6B7280"
            // Straight and Bold labels
            style={{ fontSize: "11px", fontWeight: "bold" }}
            tickLine={false}
            axisLine={false}
            angle={0} // Straight
            textAnchor="middle"
            height={30}
            interval={0} // Force show all labels
          />
          <YAxis
            type="number"
            stroke="#6B7280"
            style={{ fontSize: "10px" }}
            domain={[0, 500]}
          />
          <Tooltip content={<CustomSLOTooltip />} />
          {/* Bar thickness remains at 40 (wider) */}
          <Bar dataKey="target" fill="#E5E7EB" name="Target" barSize={40} />
          <Bar dataKey="actual" fill="#0D3E7F" name="Actual" barSize={40} />
        </BarChart>
      </ResponsiveContainer>

      {/* Metric details adjusted for tighter layout and reduced boldness */}
      <div className="flex justify-around items-end pt-1 mt-3 border-t border-gray-100">
        {PERFORMANCE_SLO_DATA.map((data, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-1/3 px-1 text-center">
            {/* Reduced font size (lg->base) and boldness (bold->semibold) */}
            <p className="text-base font-semibold text-indigo-900 leading-tight">
              {data.actual}
              {data.unit}
            </p>
            <p className="text-xs text-gray-500 mb-0.5 leading-tight">
              Target: {data.target}
              {data.unit}
            </p>
            {/* Reduced horizontal padding */}
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                data.status === "Excellent"
                  ? "bg-green-100 text-green-700"
                  : "bg-green-100 text-green-700"
              }`}>
              {data.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Section for Audit & Compliance Metrics (BPC MT4.png - Top Row)
 */
const ComplianceMetrics = () => {
  // Data specific to BPC MT4.png top row
  const COMPLIANCE_METRICS = [
    {
      title: "Mandatory Note Compliance (M1)",
      icon: Clock,
      color: "orange",
      value: "100.0%",
      description: "Adherence to Module Note Framework for high-risk actions",
      target: "100%",
      statusText: "Compliant",
      statusColor: "green",
    },
    {
      title: "Audit Justification Time (M2)",
      icon: Info,
      color: "cyan",
      value: "1.58 min",
      description: "Average time to locate Module Note for billing events",
      target: "< 2 minutes",
      statusText: "Excellent",
      statusColor: "green",
    },
  ];

  const ComplianceCard = ({
    title,
    icon: Icon,
    color,
    value,
    description,
    target,
    statusText,
    statusColor,
  }) => {
    // Use the static map for the icon color
    const iconClasses = colorStyleMap[color]?.icon || "text-gray-500";

    return (
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 transition hover:shadow-lg">
        <div className="flex items-center mb-3">
          <Icon size={18} className={`${iconClasses} mr-2`} />
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>

        {/* Reduced font size (4xl->3xl) and boldness (extrabold->bold) */}
        <p className="text-3xl font-bold text-orange-600 mb-2">{value}</p>

        <p className="text-xs text-gray-500 mb-4">{description}</p>

        <div className="flex justify-between items-center text-xs font-medium border-t pt-2 mt-2">
          <p className="text-gray-600">Target:</p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-bold">{target}</span>
            {/* Tailwind compiler safe classes for the status tag */}
            <span
              className={`px-2 py-0.5 rounded-full ${
                statusColor === "green"
                  ? "bg-green-100 text-green-700"
                  : "bg-cyan-100 text-cyan-700"
              }`}>
              {statusText}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
      <ComplianceCard {...COMPLIANCE_METRICS[0]} />
      <ComplianceCard {...COMPLIANCE_METRICS[1]} />
    </div>
  );
};

/**
 * Section for Integration Health Summary (BPC MT4.png - Bottom Row)
 */
const IntegrationHealthSummary = () => (
  <div className="mt-12">
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      Integration Health Summary
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      Comprehensive view of BPC Portal integration across all systems
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {HEALTH_SUMMARY_METRICS.map((metric, index) => (
        <HealthSummaryCard key={index} {...metric} />
      ))}
    </div>
  </div>
);

// ====================================================================
// 4. MAIN EXPORT
// ====================================================================

export default function BpcMetricsDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Top Metric Cards (BPC MT1.png - Top Row) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {TOP_METRICS.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Integration Trend Charts (BPC MT1.png - Bottom Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ContextSuccessTrend />
          <ErrorRateTrend />
        </div>

        {/* Adoption and Distribution Charts (BPC MT2.png) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <BpcAdoptionTrend />
          <CategoryDistribution />
        </div>

        {/* Performance SLOs (BPC MT3.png) */}
        <div className="mt-6">
          <PerformanceSLOs />
        </div>

        {/* Compliance and Health (BPC MT4.png) */}
        <ComplianceMetrics />
        <IntegrationHealthSummary />

        {/* Standard Footer/Spacer for UI consistency */}
        <div className="h-10"></div>
      </div>
    </div>
  );
}
