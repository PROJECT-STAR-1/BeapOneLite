"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
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

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const COLOR_STYLE_MAP = {
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
  default: {
    border: "border-gray-500",
    text: "text-gray-900",
    icon: "text-gray-500",
  },
};

const TOP_ICON_MAP = {
  "context-success": CheckCircle,
  "integration-error": AlertTriangle,
  "service-adoption": Layers,
  "avg-revenue": DollarSign,
};

const HEALTH_ICON_MAP = {
  "ctx-transfer": Zap,
  "billing-latency": Clock,
  "revenue-per-service": DollarSign,
  "error-rate": AlertTriangle,
  default: Activity,
};

const COMPLIANCE_ICON_MAP = {
  "mandatory-note": Clock,
  "audit-time": Info,
};

const CHART_COLOR_MAP = {
  growth: "#312E81", // Indigo-900
  compliance: "#8B5CF6", // Violet-500
  operations: "#3B82F6", // Blue-500
  market: "#FCD34D", // Amber-300
  financial: "#10B981", // Emerald-500
  default: "#8884d8",
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

/**
 * Top Metric Card Component
 */
const MetricCard = ({
  title,
  id,
  styleCategory,
  value,
  target,
  trend,
  status,
}) => {
  const styles = COLOR_STYLE_MAP[styleCategory] || COLOR_STYLE_MAP.default;
  const Icon = TOP_ICON_MAP[id] || Activity;
  const trendColor =
    status === "Success" ? "text-green-600" : "text-purple-600";

  return (
    <div
      className={`bg-white p-5 rounded-xl shadow-md border border-gray-100 transition hover:shadow-lg border-l-4 ${styles.border}`}>
      <div className="flex items-center mb-3">
        <Icon size={18} className={`mr-2 ${styles.icon}`} />
        <h3 className={`text-sm font-medium text-gray-700`}>{title}</h3>
      </div>
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

// Tooltips
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-md shadow-lg text-sm">
        <p className="font-bold text-gray-700">{label}</p>
        <p className="text-green-500">Value: {payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const CustomSLOTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-300 rounded-md shadow-lg text-sm">
        <p className="font-bold text-gray-800 mb-1">{label.split("(")[0]}</p>
        <p className="text-gray-600">
          Actual:{" "}
          <span className="font-semibold text-indigo-800">
            {payload.find((p) => p.name === "Actual")?.value}
          </span>
        </p>
        <p className="text-gray-600">
          Target:{" "}
          <span className="font-semibold text-gray-400">
            {payload.find((p) => p.name === "Target")?.value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

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
 * Health Summary Card
 */
const HealthSummaryCard = ({ label, value, id }) => {
  const Icon = HEALTH_ICON_MAP[id] || HEALTH_ICON_MAP.default;

  return (
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
};

// --- CHART COMPONENTS ---

const ContextSuccessTrend = ({ data }) => (
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
          data={data}
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

const ErrorRateTrend = () => {
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

const BpcAdoptionTrend = ({ data }) => (
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
          data={data}
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

const CategoryDistribution = ({ data, totalEngagements }) => {
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
            <Tooltip content={<CustomPieTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              labelLine={false}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    CHART_COLOR_MAP[entry.categoryId] || CHART_COLOR_MAP.default
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm mt-4">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center">
              <span
                className="w-2 h-2 rounded-full mr-1"
                style={{
                  backgroundColor:
                    CHART_COLOR_MAP[entry.categoryId] ||
                    CHART_COLOR_MAP.default,
                }}></span>
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
          <span className="font-bold text-gray-800">{totalEngagements}</span>
        </p>
      </div>
    </div>
  );
};

const PerformanceSLOs = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 min-h-[400px]">
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      Performance SLOs
    </h3>
    <p className="text-sm text-gray-500 mb-3">
      Target vs. Actual latency and sync metrics
    </p>

    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
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
            style={{ fontSize: "11px", fontWeight: "bold" }}
            tickLine={false}
            axisLine={false}
            angle={0}
            textAnchor="middle"
            height={30}
            interval={0}
          />
          <YAxis
            type="number"
            stroke="#6B7280"
            style={{ fontSize: "10px" }}
            domain={[0, 500]}
          />
          <Tooltip content={<CustomSLOTooltip />} />
          <Bar dataKey="target" fill="#E5E7EB" name="Target" barSize={40} />
          <Bar dataKey="actual" fill="#0D3E7F" name="Actual" barSize={40} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-around items-end pt-1 mt-3 border-t border-gray-100">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-1/3 px-1 text-center">
            <p className="text-base font-semibold text-indigo-900 leading-tight">
              {item.actual}
              {item.unit}
            </p>
            <p className="text-xs text-gray-500 mb-0.5 leading-tight">
              Target: {item.target}
              {item.unit}
            </p>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                item.status === "Excellent"
                  ? "bg-green-100 text-green-700"
                  : "bg-green-100 text-green-700"
              }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ComplianceMetrics = ({ metrics }) => {
  const ComplianceCard = ({
    title,
    id,
    styleCategory,
    value,
    description,
    target,
    statusText,
    tagColor,
  }) => {
    const iconClasses = COLOR_STYLE_MAP[styleCategory]?.icon || "text-gray-500";
    const Icon = COMPLIANCE_ICON_MAP[id] || Clock;

    return (
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 transition hover:shadow-lg">
        <div className="flex items-center mb-3">
          <Icon size={18} className={`${iconClasses} mr-2`} />
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>

        <p className="text-3xl font-bold text-orange-600 mb-2">{value}</p>
        <p className="text-xs text-gray-500 mb-4">{description}</p>

        <div className="flex justify-between items-center text-xs font-medium border-t pt-2 mt-2">
          <p className="text-gray-600">Target:</p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-bold">{target}</span>
            <span
              className={`px-2 py-0.5 rounded-full ${
                tagColor === "green"
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
      {metrics.map((metric, index) => (
        <ComplianceCard key={index} {...metric} />
      ))}
    </div>
  );
};

const IntegrationHealthSummary = ({ metrics }) => (
  <div className="mt-12">
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      Integration Health Summary
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      Comprehensive view of BPC Portal integration across all systems
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <HealthSummaryCard key={index} {...metric} />
      ))}
    </div>
  </div>
);

/* ============================================================
    MAIN EXPORT
============================================================ */

export default function BpcMetricsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/bpc");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch BPC metrics data");
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
        <p className="text-gray-600 font-medium">Loading Metrics...</p>
      </div>
    );
  }

  // Safe Data Access
  const topMetrics = data?.topMetrics ?? [];
  const adoptionTrendData = data?.adoptionTrendData ?? [];
  const categoryDistributionData = data?.categoryDistributionData ?? [];
  const performanceSloData = data?.performanceSloData ?? [];
  const complianceMetrics = data?.complianceMetrics ?? [];
  const healthSummaryMetrics = data?.healthSummaryMetrics ?? [];
  const totalActiveEngagements = data?.meta?.totalActiveEngagements ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {topMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Integration Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ContextSuccessTrend data={adoptionTrendData} />
          <ErrorRateTrend />
        </div>

        {/* Adoption and Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <BpcAdoptionTrend data={adoptionTrendData} />
          <CategoryDistribution
            data={categoryDistributionData}
            totalEngagements={totalActiveEngagements}
          />
        </div>

        {/* Performance SLOs */}
        <div className="mt-6">
          <PerformanceSLOs data={performanceSloData} />
        </div>

        {/* Compliance and Health */}
        <ComplianceMetrics metrics={complianceMetrics} />
        <IntegrationHealthSummary metrics={healthSummaryMetrics} />

        {/* Standard Footer/Spacer for UI consistency */}
        <div className="h-10"></div>
      </div>
    </div>
  );
}
