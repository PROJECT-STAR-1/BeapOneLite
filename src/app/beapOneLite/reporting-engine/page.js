"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/component/BeapOneLite/Layout";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Target,
  Zap,
  Users,
  Eye,
  Calendar,
  Plus,
  Shield,
  Settings,
  Loader2,
} from "lucide-react";

/* ============================================================
    UI MAPPINGS & CONFIGURATION
============================================================ */

const METRIC_ICON_MAP = {
  latency: Clock,
  "delivery-success": CheckCircle,
  "tax-accuracy": Target,
  tti: Zap,
  adoption: Users,
  ctr: Eye,
};

const QUICK_ACTION_STYLE_MAP = {
  generate: {
    icon: FileText,
    color: "text-yellow-300",
  },
  "tax-preview": {
    icon: Target,
    color: "text-green-300",
  },
  "manage-schedules": {
    icon: Settings,
    color: "text-orange-300",
  },
  default: {
    icon: FileText,
    color: "text-gray-300",
  },
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

const MetricCard = ({ metric }) => {
  const TrendIcon = metric.trendDirection === "up" ? TrendingUp : TrendingDown;
  const MetricIcon = METRIC_ICON_MAP[metric.id] || FileText;

  const BG_COLOR = "bg-[#f0fff4]";
  const ICON_BG_COLOR = "bg-green-100";
  const TEXT_COLOR = "text-green-700";
  const TREND_COLOR = metric.isPositive ? "text-green-600" : "text-red-600";
  const TREND_BG = metric.isPositive ? "bg-green-100" : "bg-red-100";

  return (
    <div
      className={`p-6 rounded-2xl border border-green-200 ${BG_COLOR} flex flex-col justify-between h-full transition duration-300 hover:shadow-lg hover:shadow-green-200/50`}>
      {/* Top Section */}
      <div className="flex justify-between items-center mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${ICON_BG_COLOR} ${TEXT_COLOR}`}>
          <MetricIcon size={20} />
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${ICON_BG_COLOR} ${TEXT_COLOR}`}>
          On Target
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-700 mb-6 leading-relaxed">
        {metric.title}
      </p>

      {/* Main Value */}
      <div className="flex items-end mb-4">
        <h3 className="text-4xl font-extrabold text-gray-900 leading-none">
          {metric.value}
        </h3>
        <span className="text-xl font-bold text-gray-700 ml-1 mb-0.5">
          {metric.unit}
        </span>
      </div>

      {/* Target and Deviation */}
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-600">
          Target: <span className="font-semibold">{metric.target}</span>
        </p>
        <div
          className={`flex items-center font-bold ${TREND_COLOR} ${TREND_BG} px-2 py-0.5 rounded-full text-xs`}>
          <TrendIcon size={14} className="mr-1" />
          {metric.deviation}
        </div>
      </div>
    </div>
  );
};

const ReportItem = ({ item, isRecent }) => {
  const Icon = FileText;
  const statusColor =
    item.status === "Delivered" ? "bg-green-700" : "bg-blue-600";
  const iconBg = "bg-gray-600";
  const iconText = "text-yellow-300";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition duration-150 cursor-pointer">
      <div className="flex items-center">
        <div className={`p-2 mr-3 rounded-lg ${iconBg} ${iconText}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-white font-semibold">{item.name}</p>
          <p className="text-sm text-gray-300">
            {isRecent ? item.date : item.frequency}
          </p>
        </div>
      </div>

      <div className="text-right">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${statusColor}`}>
          {item.status}
        </span>
        <p className="text-xs text-gray-400 mt-1">
          {isRecent ? item.deliveredAt : `Next: ${item.next}`}
        </p>
      </div>
    </div>
  );
};

const ReportListPanel = ({
  title,
  reports,
  isRecent,
  actionText,
  actionIcon: ActionIcon,
}) => {
  const PanelIcon = isRecent ? FileText : Calendar;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl h-full">
      <div className="flex justify-between items-center text-white mb-4 border-b border-gray-700 pb-4">
        <div className="flex items-center">
          <PanelIcon size={24} className="mr-3 text-yellow-300" />
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <button className="text-sm font-medium text-gray-300 hover:text-yellow-300 transition duration-150 flex items-center">
          {actionText}
          {ActionIcon && <ActionIcon size={16} className="ml-1" />}
        </button>
      </div>

      <div className="space-y-2">
        {reports.map((item, index) => (
          <ReportItem key={index} item={item} isRecent={isRecent} />
        ))}
      </div>
    </div>
  );
};

const QuickActions = ({ actions }) => {
  return (
    <div className="mb-8 p-6 rounded-2xl border-2 border-violet-400/30 bg-gray-900 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const style =
            QUICK_ACTION_STYLE_MAP[action.id] || QUICK_ACTION_STYLE_MAP.default;
          const Icon = style.icon;

          return (
            <button
              key={index}
              className="p-5 rounded-xl bg-gray-800 hover:bg-gray-700 transition duration-200 text-left shadow-xl"
              onClick={() => console.log(`${action.title} clicked`)}>
              <div className="flex items-start">
                <Icon size={20} className={`mr-3 ${style.color}`} />
                <div>
                  <p className="text-lg font-bold text-white mb-0.5">
                    {action.title}
                  </p>
                  <p className="text-sm text-gray-400">{action.subtitle}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
    MAIN DASHBOARD COMPONENT
============================================================ */

export default function ReportEngineDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/reportingEngine");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch reporting engine data");
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
      <Layout>
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-700 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </Layout>
    );
  }

  // Safe Data Access
  const metrics = data?.metrics ?? [];
  const recentReports = data?.recentReports ?? [];
  const scheduledReports = data?.scheduledReports ?? [];
  const quickActions = data?.quickActions ?? [];

  return (
    <Layout>
      <div className="w-full font-sans p-2 sm:p-4 lg:px-6 pt-0">
        {/* 1. Header with Actions */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Financial Reporting Engine
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time financial statements, tax compliance, and automated
              report delivery
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3 mt-4 sm:mt-0">
            <button className="flex items-center px-3 py-1.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition shadow-md whitespace-nowrap">
              <Shield size={18} className="mr-2" />
              Tax Preview
            </button>
            <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-md whitespace-nowrap">
              <Calendar size={18} className="mr-2" />
              Schedule Report
            </button>
            <button className="flex items-center px-3 py-1.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-700 transition shadow-lg whitespace-nowrap">
              <Plus size={18} className="mr-2" />
              Generate Report
            </button>
          </div>
        </header>

        {/* 2. Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* 3. Report Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ReportListPanel
            title="Recent Reports"
            reports={recentReports}
            isRecent={true}
            actionText="View All"
          />
          <ReportListPanel
            title="Scheduled Reports"
            reports={scheduledReports}
            isRecent={false}
            actionText="Manage"
            actionIcon={Settings}
          />
        </div>

        {/* 4. Quick Actions */}
        <QuickActions actions={quickActions} />
      </div>
    </Layout>
  );
}
