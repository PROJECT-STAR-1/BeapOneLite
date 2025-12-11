"use client"
import { useState } from 'react';
import {  Gauge,
  Server,
  CreditCard,
  Eye,
  FileText,
  ShieldCheck, } from 'lucide-react';
import Layout from "@/component/BeapOneLite/Layout";
import OverviewTab from '@/component/BeapOneLite/channelManagement/a1-1LiteAdmin/OverviewTab';
import InstancesTab from '@/component/BeapOneLite/channelManagement/a1-1LiteAdmin/InstancesTab';
import UsageBillingTab from '@/component/BeapOneLite/channelManagement/a1-1LiteAdmin/UsageBillingTab';
import SupportAccessTab from '@/component/BeapOneLite/channelManagement/a1-1LiteAdmin/SupportAccessTab';
import AuditLogsTab from '@/component/BeapOneLite/channelManagement/a1-1LiteAdmin/AuditLogsTab';
export default function Home() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { name: "Overview", icon: Gauge },
    { name: "Instances", icon: Server },
    { name: "Usage & Billing", icon: CreditCard },
    { name: "Support Access", icon: Eye },
    { name: "Audit Logs", icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab />;
      case "Instances":
        return <InstancesTab />;
      case "Usage & Billing":
        return <UsageBillingTab />;
      case "Support Access":
        return <SupportAccessTab />;
      case "Audit Logs":
        return <AuditLogsTab />;
      default:
        return null;
    }
  };

  return (
    <Layout>
    <div className="w-full min-h-screen px- py-6">
      {/* HEADER */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-14 h-14 bg-purple-700 rounded-xl flex items-center justify-center">
          <Server className="text-white" size={32} />
        </div>

        <div>
          <h1 className="text-3xl font-semibold">
            BEAPOne Lite Administrator Portal
          </h1>
          <p className="text-gray-600">
            A1-1 BSS Framework - Centralized Instance Management
          </p>
        </div>
      </div>

      {/* USER BADGE + STATUS BADGE */}
      <div className="flex items-center space-x-4 mb-6">
        {/* User badge */}
        <div className="px-4 py-1 bg-green-50 border border-green-300 rounded-full flex items-center space-x-2">
          <ShieldCheck size={18} className="text-green-600" />
          <span className="font-medium text-green-800">John Okonkwo - Senior Administrator</span>
        </div>

        {/* Status badge */}
        <div className="px-4 py-1 bg-blue-50 border border-blue-300 rounded-full flex items-center space-x-2">
          <Gauge size={18} className="text-blue-600" />
          <span className="text-blue-700 font-medium">All Systems Operational</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex space-x-4 border-b border-gray-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition
                ${isActive ? "bg-purple-700 text-white" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              <Icon size={18} className="mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="mt-6">{renderContent()}</div>
    </div>
    </Layout>
  );
}