"use client";

import { useEffect, useState } from "react";
import { User, Phone, Mail, Globe } from "lucide-react";
import SuccessModal from "@/component/BeapOneLite/Settings/Modal/SuccessModal";


export default function ProfilePage() {
  const [data, setData] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Load API data
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/beapOnelite/settings");
      const json = await res.json();

      // Copy notifications into internal state so toggles can work
      setData({
        ...json,
        notificationPreferences: { ...json.notificationPreferences }
      });
    }
    load();
  }, []);

  if (!data) return <div className="p-8 text-center text-gray-600">Loading...</div>;

  const { profile, notificationPreferences } = data;

  // Toggle handler
  function toggleSetting(key) {
    setData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key]
      }
    }));
  }

  return (
    <div className=" max-w-5xl mx-auto space-y-10">
      
      {/* PROFILE INFORMATION */}
      <div className="border rounded-2xl p-8 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-1">Profile Information</h2>
        <p className="text-gray-600 mb-6">Update your personal details</p>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <User className="text-white" size={40} />
          </div>

          <div>
            <p className="text-lg font-semibold">{profile.fullName}</p>
            <p className="text-gray-600">{profile.email}</p>
            <span className="px-3 py-1 text-xs bg-gray-200 rounded-full mt-1 inline-block">
              {profile.role}
            </span>
          </div>
        </div>

        {/* FORM INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              defaultValue={profile.fullName}
              className="mt-1 w-full bg-gray-100 rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="email"
                defaultValue={profile.email}
                className="mt-1 w-full bg-gray-100 rounded-lg pl-10 py-3"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="text"
                defaultValue={profile.phoneNumber}
                className="mt-1 w-full bg-gray-100 rounded-lg pl-10 py-3"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Preferred Language</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 text-gray-500" size={18} />
              <select
                defaultValue={profile.preferredLanguage}
                className="mt-1 w-full bg-gray-100 rounded-lg pl-10 pr-8 py-3"
              >
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
              <span className="absolute right-3 top-3 text-gray-500">▼</span>
            </div>
          </div>

        </div>

        <button className="px-5 py-2 bg-black text-white rounded-lg"
        onClick={() => setShowModal(true)}>
          Save Changes
        </button>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div className="border rounded-2xl p-8 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-1">Notification Preferences</h2>
        <p className="text-gray-600 mb-6">Manage how you receive updates</p>

        <div className="space-y-6">

          <NotificationRow
            title="Invoice Payments"
            subtitle="Get notified when invoices are paid"
            value={notificationPreferences.invoicePayments}
            onToggle={() => toggleSetting("invoicePayments")}
          />

          <NotificationRow
            title="Overdue Reminders"
            subtitle="Receive alerts for overdue invoices"
            value={notificationPreferences.overdueReminders}
            onToggle={() => toggleSetting("overdueReminders")}
          />

          <NotificationRow
            title="WhatsApp Notifications"
            subtitle="Get updates via WhatsApp"
            value={notificationPreferences.whatsAppNotifications}
            onToggle={() => toggleSetting("whatsAppNotifications")}
          />

        </div>
      </div>

      <SuccessModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

/* Individual Notification Row Component */
function NotificationRow({ title, subtitle, value, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
      <Toggle enabled={value} onClick={onToggle} />
    </div>
  );
}

/* Toggle Component WITH CLICK HANDLER */
function Toggle({ enabled, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-6 flex items-center rounded-full transition ${
        enabled ? "bg-black" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
