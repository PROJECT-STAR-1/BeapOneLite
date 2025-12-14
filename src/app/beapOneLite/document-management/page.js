"use client";
import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import OverviewTabContent from "@/component/BeapOneLite/document-management/overview";
import ComplianceTabContent from "@/component/BeapOneLite/document-management/compliance";
import DocumentRegister from "@/component/BeapOneLite/document-management/documents";

/* ============================================================
    UI MAPPINGS & CONFIGURATION
============================================================ */

const METRIC_ICON_MAP = {
  "upload-volume": UploadCloud,
  "signed-urls": Link,
  "compliance-index": Target,
  "upload-latency": Zap,
};

const COLOR_STYLE_MAP = {
  indigo: {
    text: "text-indigo-700",
    bg: "bg-indigo-100",
  },
  green: {
    text: "text-green-500",
    bg: "bg-green-100",
  },
  orange: {
    text: "text-orange-500",
    bg: "bg-orange-100",
  },
  red: {
    text: "text-red-500",
    bg: "bg-red-100",
  },
  default: {
    text: "text-gray-600",
    bg: "bg-gray-100",
  },
};

const TABS = [
  { id: "overview", name: "Overview", icon: Eye },
  { id: "documents", name: "Documents", icon: FileText },
  { id: "compliance", name: "Compliance", icon: Shield },
];

/* ============================================================
    SUB-COMPONENTS
============================================================ */

const MetricCard = ({ metric }) => {
  const Icon = METRIC_ICON_MAP[metric.id] || UploadCloud;
  const styles = COLOR_STYLE_MAP[metric.color] || COLOR_STYLE_MAP.default;

  return (
    <div className="p-5 rounded-2xl bg-white shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:shadow-indigo-100/50 flex flex-col justify-between h-full">
      <div className="flex items-center mb-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${styles.bg} ${styles.text}`}>
          <Icon size={16} />
        </div>
        <p className="text-sm font-medium text-gray-600 leading-relaxed">
          {metric.title}
        </p>
      </div>
      <div className="mb-2">
        <div className="flex items-end">
          <h3 className="text-3xl font-extrabold text-gray-900 leading-none">
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

const HubSpokeSummary = ({ data }) => {
  const cardBg = "bg-indigo-900";

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
            <p className="text-4xl font-extrabold text-white">
              {data?.totalDocuments || 0}
            </p>
            <p className="text-sm text-gray-300 mt-1 whitespace-nowrap">
              Total Documents
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-extrabold text-white">
              {data?.liteInstances || 0}
            </p>
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
    MAIN DASHBOARD COMPONENT
============================================================ */

export default function DocumentManagementDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/document");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch document management data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tab Rendering Logic
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTabContent />;
      case "documents":
        return <DocumentRegister />; // Swapped to match intended logic
      case "compliance":
        return <ComplianceTabContent />; // Swapped to match intended logic
      default:
        return <OverviewTabContent />;
    }
  };

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
  const hubSummary = data?.hubSummary ?? {};
  const companies = data?.companies ?? ["All Companies"];

  return (
    <Layout>
      <div className="w-full font-sans p-2 sm:p-4 lg:px-6 pt-0">
        {/* 1. Header with Title and Actions */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
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

          <div className="flex flex-wrap justify-end items-center gap-3">
            {/* Company Filter */}
            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-700 shadow-sm">
              <Globe size={18} className="mr-2 text-gray-500" />
              <select className="bg-transparent focus:outline-none">
                {companies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Button */}
            <button className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-xl font-semibold hover:bg-indigo-800 transition shadow-lg whitespace-nowrap">
              <Upload size={18} className="mr-2" />
              Upload Document
            </button>
          </div>
        </header>

        {/* 2. Metrics Grid (Added missing metrics section from mock data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* 3. Hub-and-Spoke Summary Card */}
        <HubSpokeSummary data={hubSummary} />

        {/* 4. Tabs Navigation */}
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
    </Layout>
  );
}
