"use client";
import React, { useState } from "react";

import Layout from "@/component/BeapOneLite/Layout";

import {
  Database,
  Upload,
  Globe,
  Shield,
  UploadCloud,
  Link,
  Target,
  Zap,
  Eye,
  FileText,
  CheckCircle,
  Archive,
} from "lucide-react";
import OverviewTabContent from "@/component/BeapOneLite/document-management/overview";
import ComplianceTabContent from "@/component/BeapOneLite/document-management/compliance";
import DocumentRegister from "@/component/BeapOneLite/document-management/documents";

/* ============================================================
    DATA & CONFIGURATION
============================================================ */

const METRICS_DATA = [
  {
    title: "Lite Upload Volume",
    value: "7",
    unit: "",
    subtitle: "Last 7 days",
    icon: UploadCloud,
    // UPDATED: Now using text-indigo-700 for consistent darker blue theme
    color: "text-indigo-700",
  },
  {
    title: "Signed URLs Generated",
    value: "4",
    unit: "",
    subtitle: "Last 7 days",
    icon: Link,
    color: "text-green-500",
  },
  {
    title: "Compliance Index (DCI)",
    value: "88.9",
    unit: "%",
    subtitle: "Target: 100%",
    icon: Target,
    color: "text-orange-500",
  },
  {
    title: "Avg Upload Latency",
    value: "353",
    unit: "ms",
    subtitle: "Target: ≤ 500ms (P95)",
    icon: Zap,
    color: "text-red-500",
  },
];

const TABS = [
  { id: "overview", name: "Overview", icon: Eye },
  { id: "documents", name: "Documents", icon: FileText },
  { id: "compliance", name: "Compliance", icon: Shield },
];

/* ============================================================
    SHARED COMPONENTS (Metrics and Summary)
============================================================ */

/**
 * 1. Metric Card Component
 */
const MetricCard = ({ metric }) => {
  const MetricIcon = metric.icon;
  const ICON_COLOR = metric.color; // e.g., text-indigo-700

  // Robustly extract the base color name and use the 100 shade for the background (e.g., bg-indigo-100)
  const colorMatch = ICON_COLOR.match(/text-(\w+)-\d+/);
  const baseColor = colorMatch ? colorMatch[1] : "indigo";
  const ICON_BG = `bg-${baseColor}-100 dark:bg-gray-100`;

  return (
    // PADDING REDUCED from p-6 to p-5 for a smaller, more rectangular shape
    <div className="p-5 rounded-2xl bg-white shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:shadow-indigo-100/50 flex flex-col justify-between h-full">
      {/* MARGIN REDUCED from mb-6 to mb-4 */}
      <div className="flex items-center mb-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${ICON_BG} ${ICON_COLOR}`}>
          <MetricIcon size={16} />
        </div>
        <p className="text-sm font-medium text-gray-600 leading-relaxed">
          {metric.title}
        </p>
      </div>
      <div className="mb-2">
        <div className="flex items-end">
          {/* FONT SIZE REDUCED from text-4xl to text-3xl */}
          <h3 className="text-3xl font-extrabold text-gray-900 leading-none">
            {metric.value}
          </h3>
          <span className="text-xl font-bold text-gray-700 ml-1 mb-0.5">
            {metric.unit}
          </span>
        </div>
      </div>
      {/* MARGIN REDUCED from mt-2 to mt-1 */}
      <p className="text-sm text-gray-400 mt-1">{metric.subtitle}</p>
    </div>
  );
};

/**
 * 2. Hub-and-Spoke Summary Card
 */
const HubSpokeSummary = () => {
  const cardBg = "bg-indigo-900"; // Darker shade requested

  return (
    <div
      className={`p-6 md:p-8 rounded-2xl ${cardBg} shadow-xl text-white mb-8`}>
      <div className="flex items-center mb-4">
        <Shield size={24} className="mr-3 text-indigo-200" />
        <h2 className="text-xl font-bold">Hub-and-Spoke Architecture</h2>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div className="md:w-3/4 mb-6 md:mb-0">
          <p className="text-gray-300 leading-relaxed text-sm">
            G5 serves as the centralized Hub for all BEAPOne Lite instances
            (Spokes), enforcing mTLS, mandatory metadata, and time-limited
            signed URLs.
          </p>
        </div>
        <div className="flex space-x-8 md:space-x-12 flex-shrink-0">
          <div className="text-right">
            <p className="text-4xl font-extrabold text-white">8</p>
            <p className="text-sm text-gray-300 mt-1 whitespace-nowrap">
              Total Documents
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-extrabold text-white">3</p>
            <p className="text-sm text-gray-300 mt-1 whitespace-nowrap">
              Lite Instances
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
    TAB CONTENT COMPONENTS (Placeholders)
============================================================ */

/**
 * Generic Placeholder for 'Documents' and 'Compliance' Tabs
 */
const PlaceholderTabContent = ({ activeTab }) => {
  // Uses indigo-50/indigo-400 for a darker blue theme
  const bgColor = activeTab === "documents" ? "bg-indigo-50" : "bg-purple-50";
  const borderColor =
    activeTab === "documents" ? "border-indigo-400" : "border-purple-400";

  return (
    <div
      className={`p-8 min-h-[400px] flex items-center justify-center rounded-2xl border-4 border-dashed ${borderColor} ${bgColor}`}>
      <div className="text-center text-gray-600">
        <h3 className="text-2xl font-bold mb-2">
          Tab Content:{" "}
          <span className="uppercase text-gray-800">{activeTab}</span>
        </h3>
        <p className="text-lg">
          Actual component content for the **{activeTab}** tab goes here.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Replace this placeholder with your React components for the tab
          section.
        </p>
      </div>
    </div>
  );
};

/* ============================================================
    MAIN DASHBOARD COMPONENT
============================================================ */

export default function DocumentManagementDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // --- Tab Rendering Logic using switch/case ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTabContent />;
      case "documents":
        return <ComplianceTabContent />;
      case "compliance":
        return <DocumentRegister />;
      default:
        return <OverviewTabContent />; // Fallback to overview
    }
  };

  // Custom container for Canvas display (white background)
  const containerClasses =
    "w-full font-sans bg-gray-50 min-h-screen p-4 sm:p-6 lg:px-8 lg:pt-8";

  const content = (
    <div className="w-full font-sans p-2 sm:p-4 lg:px-6 pt-0">
      {/* 1. Header with Title and Actions */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          {/* Main accent color is text-indigo-700 */}
          <Database size={30} className="mr-3 text-indigo-700" />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              G5 Document Management
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Centralized, secure repository for BEAPOne Lite integration
            </p>
          </div>
        </div>

        {/* Action Buttons & Filter */}
        <div className="flex flex-wrap justify-end items-center gap-3">
          {/* Company Filter (Dropdown Placeholder) */}
          <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-700 shadow-sm">
            <Globe size={18} className="mr-2 text-gray-500" />
            <select className="bg-transparent focus:outline-none">
              <option>All Companies</option>
              {/* UPDATED: Company list */}
              <option>Acme Nigeria Ltd (NG)</option>
              <option>TechStart Ghana (GH)</option>
              <option>AgriPro Kenya (KE)</option>
            </select>
          </div>

          {/* Upload Button: Uses darker blue (bg-indigo-700) */}
          <button className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-xl font-semibold hover:bg-indigo-800 transition shadow-lg whitespace-nowrap">
            <Upload size={18} className="mr-2" />
            Upload Document
          </button>
        </div>
      </header>

      {/* 2. Hub-and-Spoke Summary Card */}
      <HubSpokeSummary />

      {/* 3. Tabs Navigation */}
      <nav className="bg-gray-200 p-2 rounded-2xl mb-8">
        <div className="grid grid-cols-3 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center w-full py-2.5 text-sm font-semibold transition duration-200 rounded-xl
                  ${
                    isActive
                      ? // Tab Headers Section: Uses text-indigo-700 for the active tab text
                        "bg-white text-indigo-700 shadow-lg" // White background for active tab
                      : "text-gray-600 hover:text-indigo-700 hover:bg-white/50" // Neutral text on gray background for inactive tabs
                  }`}>
                <Icon size={18} className="mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Tab Content Area (Rendered via switch/case) */}
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );

  return <Layout>{content}</Layout>;
}
