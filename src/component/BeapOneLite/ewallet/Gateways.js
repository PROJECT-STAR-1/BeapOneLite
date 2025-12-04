import React from "react";
import {
  CreditCard,
  Zap,
  Settings,
  Shield,
  XOctagon,
  Info,
  CheckCircle,
  BadgeDollarSign,
} from "lucide-react";

/* ============================================================
    CONSTANTS & MOCK DATA
============================================================ */

const PRIMARY_COLOR = "text-indigo-600";
const ICON_SIZE_SM = 18;
const ICON_SIZE_LG = 28;

const MOCK_GATEWAYS = [
  {
    id: 1,
    name: "Paystack Nigeria",
    code: "PAYSTACK",
    status: "ACTIVE",
    fee: "1.5% + ₦ 100",
    currencies: "4 currencies",
    publicKey: "pk_live_xxxxxxxxxxxx...",
    lastUsed: "11/27/2024, 10:15:00 AM",
    isTestMode: false,
  },
  {
    id: 2,
    name: "Flutterwave Africa",
    code: "FLUTTERWAVE",
    status: "ACTIVE",
    fee: "1.4% + ₦ 0",
    currencies: "6 currencies",
    publicKey: "FLWPUBK_TEST-xxxxxxxx...",
    lastUsed: "11/25/2024, 12:20:00 PM",
    isTestMode: true,
  },
  {
    id: 3,
    name: "Stripe International",
    code: "STRIPE",
    status: "INACTIVE",
    fee: "2.9% + ₦ 30",
    currencies: "3 currencies",
    publicKey: "pk_test_xxxxxxxxxxxx...",
    lastUsed: "11/27/2024, 9:00:00 AM",
    isTestMode: true,
  },
];

/* ============================================================
    HELPER COMPONENTS
============================================================ */

/**
 * Renders the status badge (Active/Inactive).
 */
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

/**
 * Renders a specific key-value pair row.
 */
const DetailRow = ({ label, value, icon: Icon }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-2">
      <Icon size={ICON_SIZE_SM - 4} className="text-gray-400" />
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
);

/**
 * Renders the Test Mode warning banner.
 */
const TestModeWarning = () => (
  <div className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg text-yellow-800 mb-4">
    <Info size={ICON_SIZE_SM} className="flex-shrink-0 mr-3" />
    <p className="text-sm font-medium">
      <span className="font-bold">Test Mode Active</span> - Not processing real
      payments
    </p>
  </div>
);

/**
 * Renders a single payment gateway card.
 */
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
        <button
          className="flex items-center space-x-2 text-sm font-semibold text-gray-600 bg-gray-50 py-2 px-4 rounded-xl shadow-sm border border-gray-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors" // Added thin gray border
        >
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

/* ============================================================
    MAIN COMPONENT
============================================================ */

export function GatewayComponent() {
  return (
    <div className="bg-gray-50 min-h-screen p-0 lg:p-0 font-sans">
      <div className="w-full mx-auto">
        {/* Gateway Cards Grid (2 columns for tablet/desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 lg:p-8">
          {MOCK_GATEWAYS.map((gateway) => (
            <GatewayCard key={gateway.id} gateway={gateway} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GatewayComponent;
