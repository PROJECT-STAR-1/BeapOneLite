"use client";
import React, { useState } from "react";

import Layout from "@/component/BeapOneLite/Layout";

import {
  Briefcase,
  Layers,
  BarChart3,
  Wallet,
  CheckCircle,
  Zap,
  Eye,
  FileText,
  Target,
  Users,
  ChevronDown,
} from "lucide-react";
import BpcOverview from "@/component/BeapOneLite/bpc/overview";
import BpcMetricsDashboard from "@/component/BeapOneLite/bpc/metrics";
import ServiceCatalog from "@/component/BeapOneLite/bpc/service-catalog";
import Engagements from "@/component/BeapOneLite/bpc/engagements";

/* ============================================================
    DATA & CONFIGURATION (Content from Figma Image)
============================================================ */

const METRICS_DATA = [
  {
    title: "Service Adoption",
    value: "8.9",
    unit: "%",
    subtitle: "Of active K4 projects",
    icon: BarChart3, // Used to represent growth/adoption
    color: "text-green-600",
  },
  {
    title: "Avg Revenue Per Service",
    value: "$14.0K",
    unit: "",
    subtitle: "Per engagement",
    icon: Wallet,
    color: "text-green-600",
  },
  {
    title: "Context Transfer Success",
    value: "100.0",
    unit: "%",
    subtitle: "Target: > 99.5%",
    icon: CheckCircle, // Used to represent success/completion
    color: "text-blue-500",
  },
  {
    title: "Billing Event Latency",
    value: "80",
    unit: "ms",
    subtitle: "Target: < 100ms",
    icon: Zap, // Used to represent speed/latency
    color: "text-purple-500",
  },
];

const TABS = [
  { id: "overview", name: "Overview", icon: Eye },
  { id: "service-catalog", name: "Service Catalog", icon: FileText },
  { id: "engagements", name: "Engagements", icon: Users },
  { id: "metrics", name: "Metrics", icon: Target },
];

/* ============================================================
    SHARED COMPONENTS (Metrics and Summary)
============================================================ */

/**
 * 1. Metric Card Component
 * Reduced boldness of value font from font-extrabold to font-bold.
 */
const MetricCard = ({ metric }) => {
  const MetricIcon = metric.icon;
  const ICON_COLOR = metric.color;

  // Extract base color for background shade
  const colorMatch = ICON_COLOR.match(/text-(\w+)-\d+/);
  const baseColor = colorMatch ? colorMatch[1] : "indigo";
  const ICON_BG = `bg-${baseColor}-100 dark:bg-gray-100`;

  return (
    <div className="p-5 rounded-2xl bg-white shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:shadow-indigo-100/50 flex flex-col justify-between h-full">
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
          {/* Reduced boldness here: from font-extrabold to font-bold */}
          <h3 className="text-3xl font-bold text-gray-900 leading-none">
            {metric.value}
          </h3>
          <span className="text-xl font-bold text-gray-700 ml-1 mb-0.5">
            {metric.unit}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-1">{metric.subtitle}</p>
    </div>
  );
};

/**
 * 2. Three-Tier Integration Summary Card (Dark Blue Theme)
 */
const IntegrationSummary = () => {
  const cardBg = "bg-indigo-900";

  return (
    <div
      className={`p-6 md:p-8 rounded-2xl ${cardBg} shadow-xl text-white mb-8`}>
      <div className="flex items-center mb-4">
        <Layers size={24} className="mr-3 text-indigo-200" />
        <h2 className="text-xl font-bold">
          Three-Tier Integration Architecture
        </h2>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div className="md:w-3/4 mb-6 md:mb-0">
          <p className="text-gray-300 leading-relaxed text-sm flex items-center flex-wrap space-x-2">
            <span className="font-semibold text-white">
              BEAPOne Lite (Initiator)
            </span>
            <span className="text-indigo-300">→</span>
            <span className="font-semibold text-white">
              BPC Portal A2-3 (Service Hub)
            </span>
            <span className="text-indigo-300">→</span>
            <span className="font-semibold text-white">
              Subscription Mgmt A2-4 (Financial Controller)
            </span>
          </p>
        </div>
        <div className="flex space-x-8 md:space-x-12 flex-shrink-0">
          <div className="text-right">
            <p className="text-4xl font-extrabold text-white">6</p>
            <p className="text-sm text-gray-300 mt-1 whitespace-nowrap">
              Active Services
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-extrabold text-white">4</p>
            <p className="text-sm text-gray-300 mt-1 whitespace-nowrap">
              Total Engagements
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
 * Generic Placeholder for Other Tabs
 */
const PlaceholderTabContent = ({ activeTab }) => {
  const bgColor = "bg-indigo-50";
  const borderColor = "border-indigo-400";

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
          Replace this placeholder with your React components.
        </p>
      </div>
    </div>
  );
};

/* ============================================================
    MAIN DASHBOARD COMPONENT
============================================================ */

export default function BusinessProjectConsultingPortal() {
  const [activeTab, setActiveTab] = useState("overview");

  // --- Tab Rendering Logic ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <BpcOverview />;
      case "service-catalog":
        return <ServiceCatalog />;
      case "engagements":
        return <Engagements />;
      case "metrics":
        return <BpcMetricsDashboard />;
      default:
        return <OverviewTabContent />;
    }
  };

  // Custom container for Canvas display
  const containerClasses =
    "w-full font-sans bg-gray-50 min-h-screen p-4 sm:p-6 lg:px-8 lg:pt-8";

  const content = (
    <div className="w-full font-sans p-2 sm:p-4 lg:px-6 pt-0">
      {/* REMOVED: Top-level A2 Business Portal Header was here */}

      {/* 1. Header with Title and Actions */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          {/* Using Briefcase for BPC Portal */}
          <Briefcase size={30} className="mr-3 text-indigo-700" />
          <div>
            {/* Reduced boldness here: from font-extrabold to font-bold */}
            <h1 className="text-2xl font-bold text-gray-900">
              Business & Project Consulting Portal
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Three-tier integration: BEAPOne Lite (K4) → BPC Portal A2-3 →
              Subscription Mgmt (A2-4)
            </p>
          </div>
        </div>

        {/* Action Buttons & Filter (Placeholder for a dropdown and an action button) */}
        <div className="flex flex-wrap justify-end items-center gap-3">
          {/* REMOVED: Global Filter Placeholder was here */}

          {/* New Project/Engagement Button */}
          <button className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-xl font-semibold hover:bg-indigo-800 transition shadow-lg whitespace-nowrap">
            <Target size={18} className="mr-2" />
            Start New Engagement
          </button>
        </div>
      </header>

      {/* 2. Integration Summary Card */}
      <IntegrationSummary />

      {/* 3. Key Metrics (Moved from OverviewTabContent) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {METRICS_DATA.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* 4. Tabs Navigation */}
      <nav className="bg-gray-200 p-2 rounded-2xl mb-8">
        <div className="grid grid-cols-4 gap-1">
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
                      ? "bg-white text-indigo-700 shadow-lg"
                      : "text-gray-600 hover:text-indigo-700 hover:bg-white/50"
                  }`}>
                <Icon size={18} className="mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 5. Tab Content Area */}
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );

  return <Layout>{content}</Layout>;
}
