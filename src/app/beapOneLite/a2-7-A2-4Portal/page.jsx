"use client";

import { useEffect, useState } from "react";
import { Shield, DollarSign, Users, Timer, CheckCircle } from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";
import Overview from "@/component/BeapOneLite/channelManagement/a2-7-A2-4Portal/Overview/Overview";
import Provisioning from "@/component/BeapOneLite/channelManagement/a2-7-A2-4Portal/Provisioning";
import UsageTracking from "@/component/BeapOneLite/channelManagement/a2-7-A2-4Portal/UsageTracking";
import Analytics from "@/component/BeapOneLite/channelManagement/a2-7-A2-4Portal/Analytics/Analytics";

export default function ChannelManagement() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    fetch("/api/beapOnelite/a2-7-A2-4Portal")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <Layout>
      <div className=" space-y-6">
        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.title}</h1>
            <p className="text-gray-600">{data.subtitle}</p>
          </div>

          {/* Dropdown (mock, no function needed) */}
          <div className="border rounded-lg px-3 py-2 text-sm shadow-sm cursor-pointer bg-white">
            All Channel Partners ▼
          </div>
        </div>

        {/* Integration Architecture Banner */}
        <div className="bg-[#1A0F91] text-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Shield size={22} /> {data.integrationArchitecture.title}
          </div>

          <p className="text-indigo-200 mt-1 max-w-3xl">
            {data.integrationArchitecture.description}
          </p>

          <div className="flex gap-16 mt-6">
            <div>
              <div className="text-4xl font-bold">
                {data.integrationArchitecture.channelPartners}
              </div>
              <div className="text-indigo-300 text-sm mt-1">
                Channel Partners
              </div>
            </div>

            <div>
              <div className="text-4xl font-bold">
                {data.integrationArchitecture.activeLiteInstances}
              </div>
              <div className="text-indigo-300 text-sm mt-1">
                Active Lite Instances
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign size={18} />
              {data.metrics.channelMRR.label}
            </div>
            <div className="text-4xl font-bold mt-3">
              ${data.metrics.channelMRR.value}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {data.metrics.channelMRR.description}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users size={18} />
              {data.metrics.newLiteUsers.label}
            </div>
            <div className="text-4xl font-bold mt-3">
              {data.metrics.newLiteUsers.value}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {data.metrics.newLiteUsers.description}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <CheckCircle size={18} />
              {data.metrics.provisioningSuccess.label}
            </div>
            <div className="text-4xl font-bold mt-3 text-blue-600">
              {data.metrics.provisioningSuccess.value}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Target: {data.metrics.provisioningSuccess.target}
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Timer size={18} />
              {data.metrics.avgProvisioningTime.label}
            </div>
            <div className="text-4xl font-bold mt-3 text-blue-600">
              {data.metrics.avgProvisioningTime.value}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Target: {data.metrics.avgProvisioningTime.target}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border border-gray-200 rounded-full bg-white p-1 my-6 w-full overflow-x-auto">
          {data.tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer flex-1 text-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-blue-100 text-blue-600 rounded-full"
                  : "text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="pt-4">
          {activeTab === "Overview" && <Overview />}
          {activeTab === "Provisioning" && <Provisioning />}
          {activeTab === "Usage Tracking" && <UsageTracking />}
          {activeTab === "Analytics" && <Analytics />}
        </div>
      </div>
    </Layout>
  );
}
