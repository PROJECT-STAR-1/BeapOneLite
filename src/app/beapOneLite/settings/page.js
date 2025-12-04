"use client";
import Layout from "@/component/BeapOneLite/Layout";
import { useState } from "react";
import Profile from "@/component/BeapOneLite/Settings/Profile";
import Business from "@/component/BeapOneLite/Settings/Buisness";
import Locations from "@/component/BeapOneLite/Settings/Locations";
import RolesPermissions from "@/component/BeapOneLite/Settings/RolesPermissions";
import Billing from "@/component/BeapOneLite/Settings/Billing";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  

  const tabs = [
    { name: "Profile", component: <Profile /> },
    { name: "Business", component: <Business /> },
    { name: "Locations", component: <Locations /> },
    { name: "RolesPermissions", component: <RolesPermissions /> },
    { name: "Billing", component: <Billing /> },
  ];


  return (
     <Layout>
    <div>
      {/* Top Header */}
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <h1 className="text-base font-semibold leading-tight">
              Settings
            </h1>
            <p className="text-gray-500 text-xs ">
              Manage your account, business settings, and preferences
            </p>
          </div>
        </div>

    
      {/* Navigation Tabs */}
      <div className="flex border border-gray-200 rounded-full bg-white p-1 my-6 w-full overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`cursor-pointer flex-1 text-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.name
                ? "bg-blue-100 text-blue-600 rounded-full"
                : "text-gray-700"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="">
        {tabs.find((t) => t.name === activeTab)?.component}
      </div>
    </div>
    </Layout>
  );
}
