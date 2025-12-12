"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  Bell,
  CheckCircle,
  AlertTriangle,
  Lock,
  DollarSign,
  Repeat,
  Loader2,
} from "lucide-react";

/* ============================================================
    CONSTANTS & UI MAPPINGS
============================================================ */

const PRIMARY_COLOR = "text-indigo-600";
const ICON_SIZE_SM = 18;

// Maps setting IDs to specific icons
const SETTING_ICON_MAP = {
  "2fa": Lock,
  autoSweep: Repeat,
  lowBalanceAlerts: Bell,
  largeTxnAlerts: DollarSign,
  default: Shield,
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

/**
 * Custom Toggle Switch
 */
const ToggleSwitch = ({ id, checked, onChange }) => (
  <label
    htmlFor={id}
    className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div
      className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
        checked ? "bg-indigo-600" : "bg-gray-400"
      }`}></div>
  </label>
);

/**
 * Renders a single security/automation item card.
 */
const SettingItem = ({ item, handleToggle }) => {
  const Icon = SETTING_ICON_MAP[item.id] ?? SETTING_ICON_MAP.default;

  return (
    <div className="flex justify-between items-center p-4 md:p-6 bg-white border border-gray-100 rounded-xl transition-colors hover:bg-gray-100">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
          <Icon size={20} className={PRIMARY_COLOR} />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800">{item.title}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
      </div>
      <ToggleSwitch
        id={item.id}
        checked={item.value}
        onChange={() => handleToggle(item.id)}
      />
    </div>
  );
};

/**
 * Renders the approval required alert banner.
 */
const ApprovalRequiredBanner = () => (
  <div className="flex items-start p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg shadow-sm mt-6">
    <AlertTriangle size={20} className="text-yellow-700 mt-0.5 flex-shrink-0" />
    <div className="ml-3">
      <h4 className="text-sm font-semibold text-yellow-800">
        Transaction Approval Required
      </h4>
      <p className="text-sm text-yellow-700">
        All transactions above ₦ 2,000,000 require manual approval by a manager.
      </p>
    </div>
  </div>
);

/* ============================================================
    MAIN COMPONENT
============================================================ */

export default function SettingsComponent() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/ewallet");
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns a 'settings' key containing the array
          setSettings(data.settings ?? []);
        } else {
          console.error("Failed to fetch settings data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (id) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, value: !setting.value } : setting
      )
    );
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-0 lg:p-0 font-sans">
      <div className="w-full max-w-4xl mx-auto p-4 lg:p-8">
        {/* Header Section */}
        <div className="flex items-center space-x-3 mb-6">
          <Shield size={24} className={PRIMARY_COLOR} />
          <h1 className="text-xl font-bold text-gray-900">
            Wallet Security & Automation
          </h1>
        </div>

        {/* Settings Grid/List */}
        <div className="space-y-4">
          {settings.map((setting) => (
            <SettingItem
              key={setting.id}
              item={setting}
              handleToggle={handleToggle}
            />
          ))}
        </div>

        {/* Alert/Configuration Section */}
        <ApprovalRequiredBanner />

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button className="flex items-center space-x-2 bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
            <CheckCircle size={ICON_SIZE_SM} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
