import React from "react";
import {
  Smartphone,
  DollarSign,
  MapPin,
  Settings,
  XOctagon,
  CheckCircle,
  Info,
} from "lucide-react";

/* ============================================================
    CONSTANTS & MOCK DATA
============================================================ */

const PRIMARY_COLOR = "text-green-600"; // Using green as the main color for Mobile Money, mirroring the image
const ICON_SIZE_SM = 18;
const ICON_SIZE_LG = 28;

const MOCK_MOBILE_MONEY = [
  {
    id: 1,
    name: "M-Pesa Kenya",
    code: "MPESA",
    status: "ACTIVE",
    fee: "0.5%",
    shortCode: "123456",
    supportedCountries: ["KE", "TZ", "UG"],
  },
  {
    id: 2,
    name: "MTN Mobile Money",
    code: "MTN MOBILE MONEY",
    status: "INACTIVE",
    fee: "0.8%",
    shortCode: "789012",
    supportedCountries: ["UG", "RW", "CM", "CI", "GH"],
  },
  {
    id: 3,
    name: "MoMo Ghana",
    code: "MOMO GHANA",
    status: "ACTIVE",
    fee: "0.65%",
    shortCode: "345678",
    supportedCountries: ["GH"],
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
 * Renders a key-value row for transaction details.
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
 * Renders a single mobile money provider card.
 */
const MobileMoneyCard = ({ provider }) => {
  const isActive = provider.status === "ACTIVE";
  // Active border is green, inactive is gray. Hover is subtle on the card itself.
  const borderColor = isActive ? "border-green-500" : "border-gray-200";
  const iconBgColor = isActive ? "bg-green-100" : "bg-gray-100";
  const iconColor = isActive ? "text-green-600" : "text-gray-500";

  return (
    // Added h-full and min-h-[350px] for consistent card height, matching the visual style
    <div
      className={`flex flex-col p-6 bg-white rounded-xl shadow-lg border-2 ${borderColor} transition-all duration-300 
            hover:shadow-xl h-full min-h-[350px]`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
            <Smartphone size={ICON_SIZE_LG} className={iconColor} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{provider.name}</p>
            <p className="text-xs font-medium text-gray-500 uppercase">
              {provider.code}
            </p>
          </div>
        </div>
        <div className="pt-2">
          {" "}
          {/* Align status badge slightly lower */}
          <StatusBadge status={provider.status} />
        </div>
      </div>

      {/* Core Details */}
      <div className="space-y-1 mb-4">
        <DetailRow
          label="Transaction Fee"
          value={provider.fee}
          icon={DollarSign}
        />
        <DetailRow
          label="Business Short Code"
          value={provider.shortCode}
          icon={Info}
        />
      </div>

      {/* Supported Countries */}
      <div className="mb-6 pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center space-x-1">
          <MapPin size={ICON_SIZE_SM - 4} className="text-gray-400" />
          <span>Supported Countries</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {provider.supportedCountries.map((country) => (
            <span
              key={country}
              className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
              {country}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <button className="flex items-center space-x-2 text-sm font-semibold text-gray-600 bg-gray-50 py-2 px-4 rounded-xl shadow-sm border border-gray-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors w-1/2 mr-2 justify-center">
          <Settings size={ICON_SIZE_SM} />
          <span>Configure</span>
        </button>

        {isActive ? (
          <button className="flex items-center space-x-2 text-sm font-semibold text-white bg-red-600 py-2 px-4 rounded-xl shadow-md hover:bg-red-700 transition-colors w-1/2 ml-2 justify-center">
            <XOctagon size={ICON_SIZE_SM} />
            <span>Deactivate</span>
          </button>
        ) : (
          <button className="flex items-center space-x-2 text-sm font-semibold text-white bg-gray-900 py-2 px-4 rounded-xl shadow-md hover:bg-gray-700 transition-colors w-1/2 ml-2 justify-center">
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

export function MobileMoneyComponent() {
  return (
    <div className="bg-gray-50 min-h-screen p-0 lg:p-0 font-sans">
      <div className="w-full mx-auto">
        {/* Mobile Money Cards Grid (2 columns for tablet/desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 lg:p-8">
          {MOCK_MOBILE_MONEY.map((provider) => (
            <MobileMoneyCard key={provider.id} provider={provider} />
          ))}

          {/* Placeholder for adding a new service (Mirroring the style of the other sub-components) */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 transition-colors hover:border-green-400 h-full min-h-[350px] text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Smartphone size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Integrate New MoMo Service
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Expand your payment options by connecting new mobile money
              providers across Africa.
            </p>
            <button className="flex items-center space-x-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-700 transition-colors">
              <Smartphone size={ICON_SIZE_SM} />
              <span>Add Provider</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMoneyComponent;
