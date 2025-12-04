import React, { useState } from "react";
import {
  Shield,
  Bell,
  CheckCircle,
  AlertTriangle,
  Lock,
  DollarSign,
  Repeat,
} from "lucide-react";

/* ============================================================
    MOCK DATA & CONSTANTS
============================================================ */

const PRIMARY_COLOR = "text-indigo-600";
// FIX: Define ICON_SIZE_SM which was causing a ReferenceError
const ICON_SIZE_SM = 18;

// Mock state structure for settings
const MOCK_SETTINGS = [
  {
    id: "2fa",
    icon: Lock,
    title: "Two-Factor Authentication",
    description: "Require 2FA for all transactions.",
    // EDITED: Set value to false (off)
    value: false,
    type: "toggle",
  },
  {
    id: "autoSweep",
    icon: Repeat,
    title: "Auto-Sweep to Bank",
    description: "Automatically sweep funds above ₦ 5,000,000.",
    // EDITED: Set value to false (off)
    value: false,
    type: "toggle",
  },
  {
    id: "lowBalanceAlerts",
    icon: Bell,
    title: "Low Balance Alerts",
    description: "Notify when balance falls below ₦ 500,000.",
    // RETAINED: value is already false
    value: false,
    type: "toggle",
  },
  {
    id: "largeTxnAlerts",
    icon: DollarSign,
    title: "Large Transaction Alerts",
    description: "Notify for transactions above ₦ 1,000,000.",
    // EDITED: Set value to false (off)
    value: false,
    type: "toggle",
  },
];

/* ============================================================
    HELPER COMPONENTS
============================================================ */

/**
 * Custom Toggle Switch (mimics native look, styled with Tailwind)
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
  const Icon = item.icon;

  return (
    // EDITED: Changed hover:shadow-md to hover:bg-gray-100 for color change effect
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

export function SettingsComponent() {
  const [settings, setSettings] = useState(MOCK_SETTINGS);

  const handleToggle = (id) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, value: !setting.value } : setting
      )
    );
  };

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

        {/* Additional Settings/Save Button (Placeholder for comprehensive view) */}
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

export default SettingsComponent;
