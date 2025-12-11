"use client";
import React, { useState, useEffect } from "react";
import {
  Wallet,
  Eye,
  Download,
  Upload,
  Send,
  RotateCw,
  LayoutDashboard,
  FileText,
  Banknote,
  ShieldCheck,
  Smartphone,
  LineChart,
  Settings,
  Loader2,
} from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";
import EWalletOverview from "@/component/BeapOneLite/ewallet/Overview";
import TransactionHistory from "@/component/BeapOneLite/ewallet/Transactions";
import BankAccountsComponent from "@/component/BeapOneLite/ewallet/Bank";
import GatewayComponent from "@/component/BeapOneLite/ewallet/Gateways";
import MobileMoneyComponent from "@/component/BeapOneLite/ewallet/MobileMoney";
import AnalyticsComponent from "@/component/BeapOneLite/ewallet/Analytics";
import SettingsComponent from "@/component/BeapOneLite/ewallet/Settings";

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const BRAND_COLOR = "text-indigo-700";
const BRAND_BG = "bg-indigo-700";

// Maps API action IDs to UI styles and Icons
const ACTION_STYLE_MAP = {
  deposit: {
    icon: Download,
    color: "bg-green-500",
    hover: "hover:bg-green-600",
  },
  withdraw: {
    icon: Upload,
    color: "bg-blue-600",
    hover: "hover:bg-blue-700",
  },
  transfer: {
    icon: Send,
    color: "bg-fuchsia-600",
    hover: "hover:bg-fuchsia-700",
  },
const BrandHeader = () => (
  // 🎯 Tighter Top: `pt-0` ensures it starts right at the top of the content area.
  <header className="flex items-start mb-6 pt-0">
    {/* Logo Icon */}
  default: {
    icon: Send,
    color: "bg-gray-600",
    hover: "hover:bg-gray-700",
  },
};

// Hardcoded Navigation Structure
const NAVIGATION_TABS = [
  { title: "Overview", icon: LayoutDashboard },
  { title: "Transactions", icon: FileText },
  { title: "Banks", icon: Banknote },
  { title: "Gateways", icon: ShieldCheck },
  { title: "Mobile Money", icon: Smartphone },
  { title: "Analytics", icon: LineChart },
  { title: "Settings", icon: Settings },
];

/* ============================================================
    SUB-COMPONENTS

const BrandHeader = () => (
  <header className="flex items-start mb-6 pt-0">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-700/10 ${BRAND_COLOR} mr-4 mt-1`}>
      <LayoutDashboard size={24} className={BRAND_COLOR} />
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        eWallet & Payment Gateway
      </h1>
      <p className="text-sm text-gray-600">
        M0.3 Module - Digital Wallet with Bank Integration
      </p>
    </div>
  </header>
);


const WalletCard = () => (
  <div className="p-8 rounded-2xl border border-gray-200 bg-white shadow-sm mb-6">
    <div className="flex justify-between items-start">
      {/* Left: Wallet Info */}
      <div className="flex items-start">
        {/* Small Wallet Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-700/10 ${BRAND_COLOR} mr-4`}>
          <Wallet size={20} className={BRAND_COLOR} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Business Operations Wallet
          </h2>
          {/* Status Tags */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-green-100 text-green-700">
              ACTIVE
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
              BUSINESS
            </span>
          </div>
        </div>
      </div>

      {/* Right: Available Balance */}
      <div className="text-right">
        <div className="flex items-center justify-end text-sm text-gray-600 mb-1">
          Available Balance
          <Eye size={16} className="ml-2" />
        </div>
        {/* Main Balance */}
        <h3 className="text-3xl font-bold text-gray-900 mb-1 leading-none">
          &#x20A6; 4,600,000
        </h3>
        {/* Pending Amount */}
        <p className="text-sm text-orange-600 font-medium">
          &#x20A6; 250,000 pending
        </p>
      </div>
    </div>
  </div>
);

/* ============================================================
    COMPONENT: 3. ACTION BUTTONS

const ActionButtons = () => (
  <div className="flex space-x-4 mb-8">
    {actionButtons.map((btn, i) => {
      const Icon = btn.icon;
      return (
        <button
          key={i}
          className={`flex-1 flex items-center justify-center px-6 py-3.5 text-white rounded-xl font-semibold transition duration-200 shadow-md ${btn.color} ${btn.hover}`}
          onClick={() => console.log(`${btn.title} clicked`)}>
          <Icon size={18} className="mr-2" />
          {btn.title}
const WalletCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="p-8 rounded-2xl border border-gray-200 bg-white shadow-sm mb-6">
      <div className="flex justify-between items-start">
        {/* Left: Wallet Info */}
        <div className="flex items-start">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-700/10 ${BRAND_COLOR} mr-4`}>
            <Wallet size={20} className={BRAND_COLOR} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {data.name ?? "Wallet"}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-green-100 text-green-700">
                {data.status ?? "ACTIVE"}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                {data.type ?? "BUSINESS"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Available Balance */}
        <div className="text-right">
          <div className="flex items-center justify-end text-sm text-gray-600 mb-1">
            Available Balance
            <Eye size={16} className="ml-2" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1 leading-none">
            {data.currencySymbol ?? "₦"} {data.availableBalance ?? "0.00"}
          </h3>
          <p className="text-sm text-orange-600 font-medium">
            {data.currencySymbol ?? "₦"} {data.pendingBalance ?? "0.00"} pending
          </p>
        </div>
      </div>
    </div>
  );
};

const ActionButtons = ({ actions }) => (
  <div className="flex space-x-4 mb-8">
    {actions?.map((action, i) => {
      const style = ACTION_STYLE_MAP[action.id] ?? ACTION_STYLE_MAP.default;
      const Icon = style.icon;
      return (
        <button
          key={i}
          className={`flex-1 flex items-center justify-center px-6 py-3.5 text-white rounded-xl font-semibold transition duration-200 shadow-md ${style.color} ${style.hover}`}
          onClick={() => console.log(`${action.title} clicked`)}>
          <Icon size={18} className="mr-2" />
          {action.title}
        </button>
      );
    })}

    {/* Sync Banks Button (Static) */}
    <button
      className="flex-1 flex items-center justify-center px-6 py-3.5 border border-gray-300 text-gray-800 bg-white rounded-xl font-semibold hover:bg-gray-50 transition duration-200 shadow-sm"
      onClick={() => console.log("Sync Banks clicked")}>
      <RotateCw size={18} className="mr-2" />
      Sync Banks
    </button>
  </div>
);


const NavigationBar = ({ activeTab, setActiveTab, navigationTabs }) => (
  <div>
    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
      {/* Inner container for the tabs: justify-between for end-to-end spreading */}
      <div className="flex flex-wrap justify-between gap-1">
        {navigationTabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = tab.title === activeTab;

          // Classes for active/inactive tabs
const NavigationBar = ({ activeTab, setActiveTab }) => (
  <div>
    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex flex-wrap justify-between gap-1">
        {NAVIGATION_TABS.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = tab.title === activeTab;

          const classes = isActive
            ? `px-4 py-2 flex items-center ${BRAND_BG} text-white font-semibold rounded-xl shadow-md transition duration-200`
            : `px-4 py-2 flex items-center text-gray-600 hover:text-indigo-700 hover:bg-indigo-50/50 transition duration-200 rounded-xl`;

          return (
            <button
              key={i}
              className={`flex-grow sm:flex-grow-0 sm:min-w-0 ${classes}`}
              onClick={() => setActiveTab(tab.title)}>
              <Icon size={18} className="mr-2" />
              <span className="text-sm font-medium">{tab.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

/* ============================================================
    MAIN PAGE LAYOUT
============================================================ */

export default function EWalletDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/ewallet");
        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData);
        } else {
          console.error("Failed to fetch wallet data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Content Renderer
  const renderTabContent = (tab) => {
    const commonClasses =
      "p-8 bg-white border border-gray-200 rounded-xl text-gray-700";
    switch (tab) {
      case "Overview":
        return <EWalletOverview />;
      case "Transactions":
        return <TransactionHistory />;
      case "Banks":
        return <BankAccountsComponent />;
      case "Gateways":
        return <GatewayComponent />;
      case "Mobile Money":
        return <MobileMoneyComponent />;
      case "Analytics":
        return <AnalyticsComponent />;
      case "Settings":
        return <SettingsComponent />;
      default:
        return (
          <div className={commonClasses}>
            <p className="text-gray-500 italic">
              Select a tab to view content.
            </p>
          </div>
        );
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-700 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading eWallet...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full font-sans p-4 sm:p-6 lg:px-8 lg:pt-4">
        <BrandHeader />

        {/* Dynamic Data Injection */}
        <WalletCard data={data?.walletDetails} />

        <ActionButtons actions={data?.availableActions} />

        <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <div className="pt-6">{renderTabContent(activeTab)}</div>
      </div>
    </Layout>
  );
}
