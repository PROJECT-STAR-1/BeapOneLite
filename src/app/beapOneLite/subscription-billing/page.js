"use client";

import { useState } from "react";
import {
  Activity,
  Crown,
  BarChart3,
  Receipt,
  Shield,
  FileText,
} from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";
import Overview from "@/component/BeapOneLite/Subscription/Overview";
import Tier from "@/component/BeapOneLite/Subscription/Tier";
import Usage from "@/component/BeapOneLite/Subscription/Usage";
import Billing from "@/component/BeapOneLite/Subscription/Billing";
import Features from "@/component/BeapOneLite/Subscription/Features";
import Audit from "@/component/BeapOneLite/Subscription/Audit";

export default function SubscriptionTierManagement() {
  const [activeTab, setActiveTab] = useState("overview");

  // -----------------------------
  // TAB CONTENT RENDERER (switch)
  // -----------------------------
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview/>
        );

      case "tiers":
        return (
          <Tier/>
        );

      case "usage":
        return (
          <Usage/>
        );

      case "billing":
        return (
          <Billing/>
        );

      case "features":
        return (
          <Features/>
        );

      case "audit":
        return (
          <Audit/>
        );

      default:
        return null;
    }
  };

  // -----------------------------
  // TAB DEFINITIONS
  // -----------------------------
  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "tiers", label: "Tiers", icon: Crown },
    { id: "usage", label: "Usage", icon: BarChart3 },
    { id: "billing", label: "Billing", icon: Receipt },
    { id: "features", label: "Features", icon: Shield },
    { id: "audit", label: "Audit", icon: FileText },
  ];


  return (
    <Layout>
    <div className="p-2">

      {/* -------------------------
          PAGE HEADER
      -------------------------- */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-white">
          <Receipt size={30} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Subscription & Tier Management</h1>
          <p className="text-gray-500 text-sm">
            S1 Module – Usage Metering, Billing & Feature Entitlement
          </p>
        </div>
      </div>

      {/* -------------------------
          TABS NAVIGATION
      -------------------------- */}
      <div className="flex bg-white p-1 rounded-full border shadow-sm w-full justify-around mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                transition-all w-full justify-center
                ${isActive ? "bg-purple-900 text-white shadow" : "text-gray-600 hover:bg-gray-100"}
              `}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* -------------------------
          TAB CONTENT
      -------------------------- */}
      {renderTabContent()}
    </div>
    </Layout>
  );
}
