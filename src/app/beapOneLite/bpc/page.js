"use client";
import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import BpcOverview from "@/component/BeapOneLite/bpc/overview";
import BpcMetricsDashboard from "@/component/BeapOneLite/bpc/metrics";
import ServiceCatalog from "@/component/BeapOneLite/bpc/service-catalog";
import Engagements from "@/component/BeapOneLite/bpc/engagements";

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const ICON_MAP = {
  BarChart3,
  Wallet,
  CheckCircle,
  Zap,
  Eye,
  FileText,
  Users,
  Target,
  Briefcase,
  Layers,
};

const COLOR_MAP = {
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
  },
  blue: {
    text: "text-blue-500",
    bg: "bg-blue-100",
  },
  purple: {
    text: "text-purple-500",
    bg: "bg-purple-100",
  },
  default: {
    text: "text-indigo-600",
    bg: "bg-indigo-100",
  },
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

/**
 * 1. Metric Card Component
 */
const MetricCard = ({ metric }) => {
  const Icon = ICON_MAP[metric.icon] || BarChart3;
  const styles = COLOR_MAP[metric.color] || COLOR_MAP.default;

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
 * 2. Three-Tier Integration Summary Card
 */
const IntegrationSummary = ({ stats }) => {
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
            <p className="text-4xl font-extrabold text-white">
              {stats?.activeServices || 0}
            </p>
            <p className="text-sm text-gray-300 mt-1 whitespace-nowrap">
              Active Services
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-extrabold text-white">
              {stats?.totalEngagements || 0}
            </p>
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
    MAIN DASHBOARD COMPONENT
============================================================ */

export default function BusinessProjectConsultingPortal() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/bpc");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch BPC data");
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
        return <BpcOverview />;
      case "service-catalog":
        return <ServiceCatalog />;
      case "engagements":
        return <Engagements />;
      case "metrics":
        return <BpcMetricsDashboard />;
      default:
        return <BpcOverview />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-700 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading Portal...</p>
        </div>
      </Layout>
    );
  }

  // Safe Data Access
  const metrics = data?.metrics ?? [];
  const tabs = data?.tabs ?? [];
  const integrationStats = data?.integrationSummary ?? {};

  return (
    <Layout>
      <div className="w-full font-sans p-2 sm:p-4 lg:px-6 pt-0">
        {/* 1. Header with Title and Actions */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <Briefcase size={30} className="mr-3 text-indigo-700" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Business & Project Consulting Portal
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Three-tier integration: BEAPOne Lite (K4) → BPC Portal A2-3 →
                Subscription Mgmt (A2-4)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end items-center gap-3">
            <button className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-xl font-semibold hover:bg-indigo-800 transition shadow-lg whitespace-nowrap">
              <Target size={18} className="mr-2" />
              Start New Engagement
            </button>
          </div>
        </header>

        {/* 2. Integration Summary Card */}
        <IntegrationSummary stats={integrationStats} />

        {/* 3. Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* 4. Tabs Navigation */}
        <nav className="bg-gray-200 p-2 rounded-2xl mb-8">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map((tab) => {
              const Icon = ICON_MAP[tab.icon] || FileText;
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
