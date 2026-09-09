"use client";
import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Zap,
  Settings,
  Shield,
  XOctagon,
  Info,
  CheckCircle,
  BadgeDollarSign,
  Loader2,
  PlusCircle,
} from "lucide-react";

/* ============================================================
    CONSTANTS & UI LOGIC
============================================================ */

const PRIMARY_COLOR = "text-indigo-600";
const ICON_SIZE_SM = 18;
const ICON_SIZE_LG = 28;

/* ============================================================
    SUB-COMPONENTS
============================================================ */

const StatusBadge = ({ status }) => {
  const isActive = status === "ACTIVE";
  const bgColor = isActive ? "bg-green-100" : "bg-gray-200";
  const textColor = isActive ? "text-green-700" : "text-gray-700";

  return (
    <span
      className={`text-xs font-bold ${textColor} ${bgColor} px-3 py-1 rounded-full whitespace-nowrap`}>
      {status}
    </span>
  );
};

const DetailRow = ({ label, value, icon: Icon }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-2">
      <Icon size={ICON_SIZE_SM - 4} className="text-gray-400" />
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
);

const TestModeWarning = () => (
  <div className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg text-yellow-800 mb-4">
    <Info size={ICON_SIZE_SM} className="flex-shrink-0 mr-3" />
    <p className="text-sm font-medium">
      <span className="font-bold">Test Mode Active</span> - Not processing real
      payments
    </p>
  </div>
);

const GatewayCard = ({ gateway }) => {
  const isActive = gateway.status === "ACTIVE";
  const borderColor = isActive ? "border-green-400" : "border-gray-200";
  const hoverBorderColor = isActive
    ? "hover:border-green-600"
    : "hover:border-indigo-500";

  return (
    <div
      className={`flex flex-col p-6 bg-white rounded-xl shadow-lg border-2 ${borderColor} transition-all duration-300 
            ${hoverBorderColor} hover:shadow-xl h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <CreditCard size={ICON_SIZE_LG} className={PRIMARY_COLOR} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{gateway.name}</p>
            <p className="text-xs font-medium text-gray-500 uppercase">
              {gateway.code}
            </p>
          </div>
        </div>
        <StatusBadge status={gateway.status} />
      </div>

      {/* Core Details */}
      <div className="space-y-1 mb-4">
        <DetailRow
          label="Transaction Fee"
          value={gateway.fee}
          icon={BadgeDollarSign}
        />
        <DetailRow
          label="Supported Currencies"
          value={gateway.currencies}
          icon={Zap}
        />
      </div>

      {/* Test Mode Warning */}
      {gateway.isTestMode && <TestModeWarning />}

      {/* API Configuration */}
      <div className="mb-6 pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2">
          API Configuration
        </p>
        <p className="text-sm font-mono text-gray-700 bg-gray-50 p-2 rounded-lg break-all">
          Public Key: <span className="font-bold">{gateway.publicKey}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Last used: {gateway.lastUsed}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <button className="flex items-center space-x-2 text-sm font-semibold text-gray-600 bg-gray-50 py-2 px-4 rounded-xl shadow-sm border border-gray-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
          <Settings size={ICON_SIZE_SM} />
          <span>Configure</span>
        </button>

        {isActive ? (
          <button className="flex items-center space-x-2 text-sm font-semibold text-white bg-red-600 py-2 px-4 rounded-xl shadow-md hover:bg-red-700 transition-colors">
            <XOctagon size={ICON_SIZE_SM} />
            <span>Deactivate</span>
          </button>
        ) : (
          <button className="flex items-center space-x-2 text-sm font-semibold text-white bg-indigo-600 py-2 px-4 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
            <CheckCircle size={ICON_SIZE_SM} />
            <span>Activate</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Production-ready Empty State Component
const EmptyState = () => (
  <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Shield size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      No Gateways Configured
    </h3>
    <p className="text-sm text-gray-500 mb-6 max-w-sm">
      You haven't set up any payment gateways yet. Connect a provider to start
      accepting payments.
    </p>
    <button className="flex items-center space-x-2 bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
      <PlusCircle size={18} />
      <span>Add New Gateway</span>
    </button>
  </div>
);

/* ============================================================
    MAIN COMPONENT
============================================================ */

export default function GatewayComponent() {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/ewallet");
        if (response.ok) {
          const data = await response.json();
          // Access specific gateways key, defaulting to empty array if missing
          setGateways(data.gateways ?? []);
        } else {
          console.error("Failed to fetch gateway data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Gateways...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-0 lg:p-0 font-sans">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 lg:p-8">
          {gateways.length > 0 ? (
            gateways.map((gateway) => (
              <GatewayCard key={gateway.id} gateway={gateway} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
