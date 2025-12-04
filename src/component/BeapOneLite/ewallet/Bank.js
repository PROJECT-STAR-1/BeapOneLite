import React from "react";
import {
  Banknote,
  RotateCw,
  Settings,
  CheckCircle,
  Zap,
  Link,
  LandPlot,
  PlusCircle,
  User,
  Tally1,
} from "lucide-react";

/* ============================================================
    CONSTANTS & MOCK DATA
============================================================ */

const BRAND_COLOR = "text-indigo-700";
const ICON_SIZE_SM = 16;
const ICON_SIZE_LG = 24;

// Reusable formatting function for currency (Naira or other)
const formatCurrency = (amount, currencySymbol = "₦", locale = "en-NG") => {
  // Ensures a positive number is passed for formatting
  const formattedAmount = new Intl.NumberFormat(locale).format(
    Math.abs(amount)
  );
  return `${currencySymbol} ${formattedAmount}`;
};

const MOCK_BANK_ACCOUNTS = [
  {
    id: 1,
    bankName: "Access Bank Nigeria",
    accountType: "CURRENT",
    accountNumber: "0123456789",
    entity: "TechVentures SME Ltd",
    balance: 8500000,
    currency: "₦",
    locale: "en-NG",
    isPrimary: true,
    lastSynced: "11/27/2024, 11:30:00 AM",
    syncStatus: "SYNCED",
    swift: "ABNGNGLA",
  },
  {
    id: 2,
    bankName: "GTBank Nigeria",
    accountType: "SAVINGS",
    accountNumber: "9876543210",
    entity: "TechVentures SME Ltd",
    balance: 3200000,
    currency: "₦",
    locale: "en-NG",
    isPrimary: false,
    lastSynced: "11/27/2024, 9:15:00 AM",
    syncStatus: "SYNCED",
    swift: "GTBINGLA",
  },
  {
    id: 3,
    bankName: "M-Pesa Kenya",
    accountType: "MOBILE_MONEY",
    accountNumber: "+254712345678",
    entity: "TechVentures East Africa",
    balance: 450000,
    currency: "KSh",
    locale: "en-KE",
    isPrimary: false,
    lastSynced: "11/27/2024, 10:45:00 AM",
    syncStatus: "SYNCED",
    swift: null,
  },
];

/* ============================================================
    HELPER COMPONENTS
============================================================ */

/**
 * Renders an action button with an icon.
 */
const ActionButton = ({ icon: Icon, label }) => (
  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-700 transition-colors">
    <Icon size={ICON_SIZE_SM} />
    <span className="font-medium">{label}</span>
  </button>
);

/**
 * Renders the sync status badge.
 */
const SyncBadge = ({ status, isAutoSync }) => (
  <div className="flex items-center space-x-4">
    <div className="flex items-center text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
      <CheckCircle size={12} className="mr-1" />
      {status}
    </div>
    {isAutoSync && (
      <div className="flex items-center text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
        <Zap size={12} className="mr-1" />
        Auto-Sync
      </div>
    )}
  </div>
);

/**
 * Renders a single bank account card.
 */
const BankCard = ({ account }) => {
  const isPrimary = account.isPrimary;
  const isMobileMoney = account.accountType === "MOBILE_MONEY";

  return (
    <div
      className={`flex flex-col p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 transition-all duration-300 
            hover:border-indigo-500 hover:shadow-xl h-full`} // Blue border on hover for all cards
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Banknote size={ICON_SIZE_LG} className={BRAND_COLOR} />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">
              {account.bankName}
            </p>
            <p className="text-xs font-medium text-gray-500 uppercase">
              {account.accountType.replace("_", " ")}
            </p>
          </div>
        </div>
        {isPrimary && (
          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full whitespace-nowrap">
            Primary Account
          </span>
        )}
      </div>

      {/* Account Details */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-0.5">Account Number</p>
        <p className="text-lg font-bold text-gray-800 break-words">
          {account.accountNumber}
        </p>
        <p className="text-sm text-gray-600">{account.entity}</p>
      </div>

      {/* Current Balance (Highlighted) */}
      <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-green-700">Current Balance</p>
        <p className="text-lg font-extrabold text-green-800">
          {" "}
          {/* Reduced font size to text-lg */}
          {formatCurrency(account.balance, account.currency, account.locale)}
        </p>
      </div>

      {/* Sync Information */}
      <div className="text-xs text-gray-500 mb-6 flex justify-between items-center">
        <span>Last Synced</span>
        <span className="font-medium text-gray-700">{account.lastSynced}</span>
      </div>

      {/* Status and Actions */}
      <div className="flex flex-col space-y-4 pt-4 border-t border-gray-100 mt-auto">
        <SyncBadge status={account.syncStatus} isAutoSync={true} />

        <div className="flex justify-between items-center mt-3">
          <div className="flex space-x-6">
            <ActionButton icon={RotateCw} label="Sync Now" />
            <ActionButton icon={Settings} label="Configure" />
          </div>
        </div>

        {account.swift && (
          <p className="text-xs text-gray-400">SWIFT: {account.swift}</p>
        )}
        {isMobileMoney && (
          <p className="text-xs text-gray-400">Provider: Safaricom PLC</p>
        )}
      </div>
    </div>
  );
};

/**
 * Renders the placeholder card for linking a new account.
 */
const LinkNewAccountCard = () => (
  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 transition-colors hover:border-indigo-400 h-full text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <LandPlot size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700 mb-3">
      Link New Bank Account
    </h3>
    <p className="text-sm text-gray-500 mb-6 max-w-xs">
      Connect your bank account for automatic synchronization and real-time
      balance tracking.
    </p>
    <button className="flex items-center space-x-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
      <Link size={ICON_SIZE_SM} />
      <span>Add Bank Account</span>
    </button>
  </div>
);

/* ============================================================
    MAIN COMPONENT
============================================================ */

export function BankAccountsComponent() {
  return (
    <div className="bg-gray-50 min-h-screen p-0 lg:p-0 font-sans">
      {" "}
      {/* Reduced external padding */}
      <div className="w-full mx-auto">
        {/* Header removed */}

        {/* Account Cards Grid (Set to max 2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 lg:p-8">
          {" "}
          {/* Applied necessary padding here */}
          {/* Render existing linked bank accounts */}
          {MOCK_BANK_ACCOUNTS.map((account) => (
            <BankCard key={account.id} account={account} />
          ))}
          {/* Render the link new account card */}
          <LinkNewAccountCard />
        </div>
      </div>
    </div>
  );
}

export default BankAccountsComponent;
