"use client";
import React, { useState } from "react";

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
} from "lucide-react";

/* ============================================================
    DATA: METRICS, RECENT, AND SCHEDULED REPORTS
============================================================ */

const METRICS_DATA = [
  {
    title: "Report Generation Latency",
    value: "1.8",
    unit: "sec",
    target: "< 2 sec",
    deviation: "-0.3s",
    trend: TrendingDown,
    isPositive: true,
    icon: Clock,
  },
  {
    title: "Scheduled Delivery Success Rate",
    value: "99.92",
    unit: "%",
    target: ">= 99.9%",
    deviation: "+0.02%",
    trend: TrendingUp,
    isPositive: true,
    icon: CheckCircle,
  },
  {
    title: "Tax Preview Accuracy",
    value: "3.2",
    unit: "% dev",
    target: "< 5% dev",
    deviation: "-0.8%",
    trend: TrendingDown,
    isPositive: true, // Lower deviation is good
    icon: Target,
  },
  {
    title: "Time to Insight (TTI)",
    value: "0.8",
    unit: "days",
    target: "< 1 day",
    deviation: "-0.2d",
    trend: TrendingDown,
    isPositive: true,
    icon: Zap,
  },
  {
    title: "Adoption Rate (Scheduled Reports)",
    value: "68",
    unit: "%",
    target: ">= 65%",
    deviation: "+3%",
    trend: TrendingUp,
    isPositive: true,
    icon: Users,
  },
  {
    title: "Layman's Terms Click-Through Rate",
    value: "18",
    unit: "%",
    target: ">= 15%",
    deviation: "+2%",
    trend: TrendingUp,
    isPositive: true,
    icon: Eye,
  },
];

const RECENT_REPORTS = [
  {
    name: "P&L",
    date: "Nov 2024",
    deliveredAt: "2024-11-25 09:15",
    status: "Delivered",
  },
  {
    name: "Balance Sheet",
    date: "Nov 2024",
    deliveredAt: "2024-11-25 09:16",
    status: "Delivered",
  },
  {
    name: "Cash Flow",
    date: "Nov 2024",
    deliveredAt: "2024-11-25 09:18",
    status: "Delivered",
  },
  {
    name: "Tax Report (FIRS)",
    date: "Q4 2024",
    deliveredAt: "2024-11-20 14:30",
    status: "Delivered",
  },
  {
    name: "Sales Summary",
    date: "Week 47",
    deliveredAt: "2024-11-24 08:00",
    status: "Delivered",
  },
];

const SCHEDULED_REPORTS = [
  { name: "P&L", frequency: "Monthly", status: "Active", next: "2024-12-01" },
  {
    name: "Balance Sheet",
    frequency: "Monthly",
    status: "Active",
    next: "2024-12-01",
  },
  {
    name: "Cash Flow",
    frequency: "Monthly",
    status: "Active",
    next: "2024-12-01",
  },
  {
    name: "Sales Summary",
    frequency: "Weekly",
    status: "Active",
    next: "2024-11-27",
  },
];

/* ============================================================
    COMPONENT: 1. METRIC CARD (RP1 & RP2)
============================================================ */

const MetricCard = ({ metric }) => {
  const TrendIcon = metric.trend;
  const MetricIcon = metric.icon;

  const BG_COLOR = "bg-[#f0fff4]"; // Very light green/mint from Figma
  const ICON_BG_COLOR = "bg-green-100";
  const TEXT_COLOR = "text-green-700";
  const TREND_COLOR = metric.isPositive ? "text-green-600" : "text-red-600";
  const TREND_BG = metric.isPositive ? "bg-green-100" : "bg-red-100";

  return (
    <div
      className={`p-6 rounded-2xl border border-green-200 ${BG_COLOR} flex flex-col justify-between h-full transition duration-300 hover:shadow-lg hover:shadow-green-200/50`}>
      {/* Top Section: Icon and "On Target" Tag */}
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

/* ============================================================
    COMPONENT: 2. REPORT LIST ITEM (Part of RP3)
============================================================ */
const ReportItem = ({ item, isRecent }) => {
  const Icon = FileText;
  // Use specific dark theme colors
  const statusColor =
    item.status === "Delivered" ? "bg-green-700" : "bg-blue-600";
  const iconBg = "bg-gray-600";
  const iconText = "text-yellow-300";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition duration-150 cursor-pointer">
      {/* Left: Icon and Title */}
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

      {/* Right: Status/Delivery Time */}
      <div className="text-right">
        {isRecent ? (
          <>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${statusColor}`}>
              {item.status}
            </span>
            <p className="text-xs text-gray-400 mt-1">{item.deliveredAt}</p>
          </>
        ) : (
          <>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${statusColor}`}>
              {item.status}
            </span>
            <p className="text-xs text-gray-400 mt-1">Next: {item.next}</p>
          </>
        )}
      </div>
    </div>
  );
};

/* ============================================================
    COMPONENT: 3. REPORT LIST PANEL (RP3)
============================================================ */
const ReportListPanel = ({
  title,
  reports,
  isRecent,
  actionText,
  actionIcon,
}) => {
  const ActionIcon = actionIcon || FileText;
  const PanelIcon = isRecent ? FileText : Calendar;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl h-full">
      {/* Header */}
      <div className="flex justify-between items-center text-white mb-4 border-b border-gray-700 pb-4">
        <div className="flex items-center">
          <PanelIcon size={24} className="mr-3 text-yellow-300" />
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <button className="text-sm font-medium text-gray-300 hover:text-yellow-300 transition duration-150 flex items-center">
          {actionText}
          {actionIcon && <ActionIcon size={16} className="ml-1" />}
        </button>
      </div>

      {/* List Items */}
      <div className="space-y-2">
        {reports.map((item, index) => (
          <ReportItem key={index} item={item} isRecent={isRecent} />
        ))}
      </div>
    </div>
  );
};

/* ============================================================
    COMPONENT: 4. QUICK ACTIONS (RP4)
============================================================ */

const QuickActions = () => {
  const actions = [
    {
      title: "Generate Report",
      subtitle: "P&L, Balance Sheet, Cash Flow",
      icon: FileText,
      color: "text-yellow-300",
    },
    {
      title: "Tax Preview",
      subtitle: "Local tax compliance estimate",
      icon: Target,
      color: "text-green-300",
    },
    {
      title: "Manage Schedules",
      subtitle: "Edit automated reports",
      icon: Settings,
      color: "text-orange-300",
    },
  ];

  return (
    <div className="mb-8 p-6 rounded-2xl border-2 border-violet-400/30 bg-gray-900 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="p-5 rounded-xl bg-gray-800 hover:bg-gray-700 transition duration-200 text-left shadow-xl"
              onClick={() => console.log(`${action.title} clicked`)}>
              <div className="flex items-start">
                <Icon size={20} className={`mr-3 ${action.color}`} />
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
  // Custom container to match the Figma's dark theme aesthetics in the canvas environment
  const containerClasses =
    "w-full font-sans bg-gray-50 min-h-screen p-4 sm:p-6 lg:px-8 lg:pt-8";

  // Content that will be displayed either inside the Layout or the fallback div
  const content = (
    <div className="w-full font-sans p-2 sm:p-4 lg:px-6 pt-0">
      {/* 1. Header with Actions (RP1) */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Financial Reporting Engine
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time financial statements, tax compliance, and automated report
            delivery
          </p>
        </div>

        {/* Action Buttons (RP1 - Top Right) - Ensure buttons break when screen is too small */}
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

      {/* 2. Key Performance Indicators (RP1 & RP2) - Responsive 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {METRICS_DATA.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* 3. Report Lists (RP3) - Responsive 2-column layout - MOVED UP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ReportListPanel
          title="Recent Reports"
          reports={RECENT_REPORTS}
          isRecent={true}
          actionText="View All"
          actionIcon={null}
        />
        <ReportListPanel
          title="Scheduled Reports"
          reports={SCHEDULED_REPORTS}
          isRecent={false}
          actionText="Manage"
          actionIcon={Settings}
        />
      </div>

      {/* 4. Quick Actions (RP4) - Responsive 3-column layout - MOVED DOWN */}
      <QuickActions />
    </div>
  );

  // The user requested to comment out the Layout wrapper for canvas viewing.
  // The structure below uses a fallback div for canvas and the full Layout import for the user's environment.

  return <Layout>{content}</Layout>;
}
