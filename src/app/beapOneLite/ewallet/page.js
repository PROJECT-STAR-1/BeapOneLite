"use client";
import React, { useState } from "react";
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
  ChevronRight,
  LogOut,
  UserCircle,
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
    DATA: STYLING AND CONTENT
============================================================ */

const BRAND_COLOR = "text-indigo-700";
const BRAND_BG = "bg-indigo-700";

const actionButtons = [
  {
    title: "Deposit",
    icon: Download,
    color: "bg-green-500",
    hover: "hover:bg-green-600",
  },
  {
    title: "Withdraw",
    icon: Upload,
    color: "bg-blue-600",
    hover: "hover:bg-blue-700",
  },
  {
    title: "Transfer",
    icon: Send,
    color: "bg-fuchsia-600",
    hover: "hover:bg-fuchsia-700",
  },
];

/* ============================================================
    COMPONENT: 1. BRAND HEADER
============================================================ */
const BrandHeader = () => (
  // 🎯 Tighter Top: `pt-0` ensures it starts right at the top of the content area.
  <header className="flex items-start mb-6 pt-0">
    {/* Logo Icon */}
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-700/10 ${BRAND_COLOR} mr-4 mt-1`}>
      <LayoutDashboard size={24} className={BRAND_COLOR} />
    </div>
    <div>
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        eWallet & Payment Gateway
      </h1>
      {/* Subtitle / Module Tag */}
      <p className="text-sm text-gray-600">
        M0.3 Module - Digital Wallet with Bank Integration
      </p>
    </div>
  </header>
);

/* ============================================================
    COMPONENT: 2. MAIN WALLET CARD
============================================================ */

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
============================================================ */

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
        </button>
      );
    })}

    {/* Sync Banks Button */}
    <button
      className="flex-1 flex items-center justify-center px-6 py-3.5 border border-gray-300 text-gray-800 bg-white rounded-xl font-semibold hover:bg-gray-50 transition duration-200 shadow-sm"
      onClick={() => console.log("Sync Banks clicked")}>
      <RotateCw size={18} className="mr-2" />
      Sync Banks
    </button>
  </div>
);

/* ============================================================
    COMPONENT: 4. NAVIGATION BAR
============================================================ */

const NavigationBar = ({ activeTab, setActiveTab, navigationTabs }) => (
  <div>
    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
      {/* Inner container for the tabs: justify-between for end-to-end spreading */}
      <div className="flex flex-wrap justify-between gap-1">
        {navigationTabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = tab.title === activeTab;

          // Classes for active/inactive tabs
          const classes = isActive
            ? `px-4 py-2 flex items-center ${BRAND_BG} text-white font-semibold rounded-xl shadow-md transition duration-200`
            : `px-4 py-2 flex items-center text-gray-600 hover:text-indigo-700 hover:bg-indigo-50/50 transition duration-200 rounded-xl`;

          return (
            <button
              key={i}
              // flex-grow is key for desktop justification, but allows wrapping on small screens
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

  // DATA: TAB NAVIGATION CONTENT
  const navigationTabs = [
    { title: "Overview", icon: LayoutDashboard },
    { title: "Transactions", icon: FileText },
    { title: "Banks", icon: Banknote },
    { title: "Gateways", icon: ShieldCheck },
    { title: "Mobile Money", icon: Smartphone },
    { title: "Analytics", icon: LineChart },
    { title: "Settings", icon: Settings },
  ];

  // Implementation of the switch case for tab content
  const renderTabContent = (tab) => {
    // 🎯 Ensures imported components have max horizontal space
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

  return (
    <Layout>
      {/* 🎯 WIDER & CLEANER: Removed mx-auto (let's use the full width provided by Layout), bg-gray-50, and min-h-[90vh] (Layout should handle this).
          🎯 TIGHTER: Adjusted vertical padding for tighter fit.
      */}
      <div className="w-full font-sans p-4 sm:p-6 lg:px-8 lg:pt-4">
        <BrandHeader />
        <WalletCard />
        <ActionButtons />

        <NavigationBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigationTabs={navigationTabs}
        />

        {/* Content Area */}
        {/* Tighter: Reduced vertical padding at the top of the content area from pt-8 to pt-6 */}
        <div className="pt-6">{renderTabContent(activeTab)}</div>
      </div>
    </Layout>
  );
}
