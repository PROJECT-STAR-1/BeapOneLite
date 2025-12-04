import React from "react";
import {
  FileBadge,
  Lock,
  NotebookText,
  ShieldOff,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  XCircle,
  Bug,
  Link,
  DownloadCloud,
  Clock,
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
  Label,
} from "recharts";

/* ============================================================
 * 1. MOCK DATA
 * ============================================================ */

// 1. Compliance Scorecards (DM DC1 - Top Row)
const COMPLIANCE_METRICS = [
  {
    title: "Document Compliance Index",
    subtitle: "DCI",
    value: "88.9%",
    target: "Target: 100% (Metadata completeness)",
    icon: FileBadge,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-400",
  },
  {
    title: "Secure Access Adherence Rate",
    subtitle: "SAAR",
    value: "33.3%",
    target: "Target: 100% (Signed URL usage)",
    icon: Lock,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
  },
  {
    title: "Note Compliance Rate",
    subtitle: "NCR",
    value: "100.0%",
    target: "Target: 100% (Mandatory notes)",
    icon: NotebookText,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-400",
  },
  {
    title: "Signed URL Failure Rate",
    subtitle: "SUFR",
    value: "22.2%",
    target: "Target: < 5% (Access control)",
    icon: ShieldOff,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-400",
  },
];

// 2. Trend Chart Data (DM DC1 - Bottom Row)
const TREND_DATA = [
  { name: "5Y", dci: 85, saar: 100 },
  { name: "3Y", dci: 88, saar: 100 },
  { name: "1Y", dci: 90, saar: 100 },
  { name: "Q", dci: 92, saar: 100 },
  { name: "M", dci: 93, saar: 100 },
  { name: "W", dci: 94, saar: 100 },
  { name: "D", dci: 99, saar: 33.3 }, // Point 'D' with specific value
  { name: "Today", dci: 82, saar: 20 },
];

// 3. Upload Volume Pie Chart Data (DM DC2 - Left)
const TOTAL_DOCUMENTS = 8;
const PIE_CHART_DATA = [
  // Value is proportional, Name includes percentage as label
  { name: "INVOICE 43%", value: 3.5, color: "#1e3a8a" }, // Dark Blue
  { name: "REPORT 14%", value: 1, color: "#10b981" }, // Green
  { name: "CONTRACT 14%", value: 1, color: "#fcd34d" }, // Yellow
  { name: "TAX_FILING 14%", value: 1, color: "#ef4444" }, // Red
  { name: "RECEIPT 14%", value: 1.5, color: "#a78bfa" }, // Purple
];

// 4. Performance SLOs Bar Chart Data (DM DC2 - Right)
const SLO_CHART_DATA = [
  {
    name: "Upload (P95)",
    target: 500, // Target SLO (Target line in Figma is ~480)
    actual: 353,
    unit: "ms",
    targetText: "On Target",
    actualText: "353ms",
    targetColor: "#d1d5db",
    actualColor: "#1e3a8a",
  },
  {
    name: "URL Gen (Avg)",
    target: 10, // Target SLO
    actual: 0.75,
    unit: "ms",
    targetText: "Sub-ms",
    actualText: "0.75ms",
    targetColor: "#d1d5db",
    actualColor: "#1e3a8a",
  },
];

// 5. Integration Metrics Summary (DM DC3)
const INTEGRATION_METRICS = [
  {
    value: "7",
    label: "Successful Uploads",
    icon: UploadCloud,
    color: "text-green-600",
    description: "Successful Uploads",
  },
  {
    value: "1",
    label: "Rejected Uploads",
    icon: XCircle,
    color: "text-red-600",
    description: "Rejected Uploads",
  },
  {
    value: "1",
    label: "Virus Detected",
    icon: Bug,
    color: "text-red-600",
    description: "Virus Detected",
  },
  {
    value: "4",
    label: "Signed URLs Generated",
    icon: Link,
    color: "text-indigo-600",
    description: "Signed URLs Generated",
  },
  {
    value: "3",
    label: "Successful Downloads",
    icon: DownloadCloud,
    color: "text-green-600",
    description: "Successful Downloads",
  },
  {
    value: "2",
    label: "Unauthorized Attempts",
    icon: AlertTriangle,
    color: "text-red-600",
    description: "Unauthorized Attempts",
  },
  {
    value: "353ms",
    label: "Avg Upload Latency",
    icon: Clock,
    color: "text-green-600",
    description: "Avg Upload Latency",
  },
  {
    value: "0.75ms",
    label: "Avg URL Gen Latency",
    icon: Clock,
    color: "text-green-600",
    description: "Avg URL Gen Latency",
  },
];

/* ============================================================
 * 2. HELPER COMPONENTS
 * ============================================================ */

// 2.1. Scorecard Component (DM DC1)
const ComplianceCard = ({ metric }) => {
  const Icon = metric.icon;

  return (
    <div
      className={`p-4 rounded-xl border-t-4 border-l-2 ${metric.borderColor} bg-white shadow-md transition duration-300 hover:shadow-lg h-full flex flex-col justify-between`}>
      <div>
        <div className="flex items-center mb-1">
          <Icon size={20} className={`${metric.color} mr-2`} />
          <h3 className="text-base font-semibold text-gray-800">
            {metric.title}
          </h3>
        </div>
        <p className="text-gray-500 text-xs mb-3">{metric.target}</p>
      </div>

      <div className="flex justify-between items-end">
        {/* Figures in percentage are smaller and less bolder */}
        <p className="text-3xl font-semibold text-gray-900 leading-none">
          {metric.value}
        </p>
      </div>
    </div>
  );
};

// 2.2. Line Chart Component (DM DC1)
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

  // Custom dot to highlight the 'D' point as per Figma
  const CustomDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
    if (payload.name === "D") {
      return (
        <svg x={cx - 10} y={cy - 20} width={20} height={20} fill="#fff">
          <rect
            x="0"
            y="0"
            width="20"
            height="18"
            rx="4"
            fill={stroke}
            opacity="0.9"
          />
          <text
            x="10"
            y="13"
            textAnchor="middle"
            fontSize="10"
            fill="#fff"
            fontWeight="bold">
            D
          </text>
        </svg>
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
          {/* Y-Axis scale is mocked from 0 to 100% */}
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            stroke="#9ca3af"
            tickLine={false}
            orientation="left"
            width={45} // Ensures percentage figures are fully visible
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

// 2.3. Pie Chart Component (DM DC2 - Left)
const UploadVolumeChart = () => {
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
        {`${PIE_CHART_DATA[index].name.split(" ")[1]}`}
      </text>
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 h-[450px]">
      {" "}
      {/* Increased height */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Lite Upload Volume by Document Type
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of document types (Last 7 days)
      </p>
      {/* Chart height adjusted for more space below */}
      <ResponsiveContainer width="100%" height="60%">
        <PieChart>
          <Pie
            data={PIE_CHART_DATA}
            cx="50%"
            cy="50%"
            innerRadius={0} // Full pie chart
            outerRadius={90} // Slightly larger radius
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}>
            {PIE_CHART_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${Math.round((value / TOTAL_DOCUMENTS) * 100)}%`,
              name.split(" ")[0],
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend is below the chart, centered and wraps tightly */}
      <div className="mt-2 text-center flex flex-wrap justify-center gap-x-3 gap-y-1">
        {PIE_CHART_DATA.map((entry, index) => (
          <div key={index} className="inline-flex items-center text-xs">
            <span
              className="inline-block w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: entry.color }}></span>
            <span className="text-gray-700 font-medium">
              {entry.name.split(" ")[0]}
              <span className="text-gray-500 ml-1">
                {entry.name.split(" ")[1]}
              </span>
            </span>
          </div>
        ))}
        <p className="w-full mt-4 text-sm text-gray-600 font-semibold">
          Total Documents: {TOTAL_DOCUMENTS}
        </p>
      </div>
    </div>
  );
};

// 2.4. Bar Chart Component (DM DC2 - Right)
const SLOChart = () => {
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

  // Function to render the value below the bar chart with smaller text
  const renderValueLabels = (slo) => (
    // Decreased font size for the actual value to text-base and decreased the margin-bottom
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
      {" "}
      {/* Increased height */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Performance SLOs
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Target vs. Actual latency (milliseconds)
      </p>
      {/* Chart height adjusted for more space below */}
      <ResponsiveContainer width="100%" height="65%">
        <BarChart
          data={SLO_CHART_DATA}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} />
          {/* Max Y value is set to 600 to match the scale in the Figma image */}
          <YAxis
            domain={[0, 600]}
            stroke="#9ca3af"
            tickLine={false}
            orientation="left"
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Target Bar (Lighter Color) */}
          <Bar
            dataKey="target"
            fill="#d1d5db"
            radius={[4, 4, 0, 0]}
            name="Target SLO"
          />
          {/* Actual Bar (Darker Color) */}
          <Bar
            dataKey="actual"
            fill="#1e3a8a"
            radius={[4, 4, 0, 0]}
            name="Actual Latency"
          />
          {/* Legend is inside the chart container and positioned at the top right */}
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="right"
            wrapperStyle={{ padding: "0 0 10px 0", fontSize: "12px" }}
          />
        </BarChart>
      </ResponsiveContainer>
      {/* Custom Labels below the chart - Reduced pt and mt to pt-1 mt-1 for tighter vertical spacing, used space-x-2 for tighter horizontal spacing between the two metric containers */}
      <div className="flex justify-around items-start pt-1 mt-1 space-x-2">
        {SLO_CHART_DATA.map((slo, index) => (
          <div key={index} className="text-center w-1/2">
            {/* Reduced font size for metric label to text-sm and reduced margin-bottom */}
            <p className="text-sm font-medium text-gray-700 mb-0">{slo.name}</p>
            {renderValueLabels(slo)}
          </div>
        ))}
      </div>
    </div>
  );
};

// 2.5. Small Metric Card (DM DC3)
const MetricCard = ({ metric }) => {
  const Icon = metric.icon;

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
        <Icon size={20} className={metric.color} />
      </div>
      <p className="text-xs font-medium text-gray-500 mt-2 leading-tight">
        {metric.label}
      </p>
    </div>
  );
};

// 3. Main Aggregator Component
export default function ComplianceTabContent() {
  return (
    // Root container now has no padding, allowing the gray background to span edge-to-edge.
    <div className="bg-gray-50 min-h-screen w-full">
      {/* All content is wrapped in this internal div to apply the desired responsive horizontal and vertical padding. */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* SECTION 1: Top Level Scorecards (DM DC1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {COMPLIANCE_METRICS.map((metric, index) => (
            <ComplianceCard key={index} metric={metric} />
          ))}
        </div>

        {/* SECTION 2: Compliance Trend Charts (DM DC1 - Bottom Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ComplianceTrendChart
            data={TREND_DATA}
            dataKey="dci"
            color="#10b981"
            title="Document Compliance Index (DCI) Trend"
            trendLabel="+7.6% since inception"
            trendColor="text-green-600"
          />
          <ComplianceTrendChart
            data={TREND_DATA}
            dataKey="saar"
            color="#3b82f6"
            title="Secure Access Adherence Rate (SAAR) Trend"
            trendLabel="-61.9% since inception"
            trendColor="text-blue-600"
          />
        </div>

        {/* SECTION 3: Detailed Charts (DM DC2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UploadVolumeChart />
          <SLOChart />
        </div>

        {/* SECTION 4: Integration Metrics Summary (DM DC3) - Removed mb-8 since the wrapper handles bottom padding */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Integration Metrics Summary
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Comprehensive view of G5-Lite integration health
          </p>

          {/* Layout adjusted to 4 up, 4 down on large screens */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {INTEGRATION_METRICS.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
