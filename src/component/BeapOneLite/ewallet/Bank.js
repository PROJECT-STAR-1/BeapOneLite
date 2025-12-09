"use client";
import React, { useState, useEffect } from "react";
import {
  Banknote,
  RotateCw,
  Settings,
  CheckCircle,
  Zap,
  Link,
  LandPlot,
  Loader2,
} from "lucide-react";

/* ============================================================
    CONSTANTS & UI LOGIC
============================================================ */

const BRAND_COLOR = "text-indigo-700";
const ICON_SIZE_SM = 16;
const ICON_SIZE_LG = 24;

const formatCurrency = (amount, currencySymbol = "₦", locale = "en-NG") => {
  const formattedAmount = new Intl.NumberFormat(locale).format(
    Math.abs(amount)
  );
  return `${currencySymbol} ${formattedAmount}`;
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

const ActionButton = ({ icon: Icon, label }) => (
  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-700 transition-colors">
    <Icon size={ICON_SIZE_SM} />
    <span className="font-medium">{label}</span>
  </button>
);

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

const BankCard = ({ account }) => {
  const isPrimary = account.isPrimary;
  const isMobileMoney = account.accountType === "MOBILE_MONEY";

  return (
    <div
      className={`flex flex-col p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 transition-all duration-300 
            hover:border-indigo-500 hover:shadow-xl h-full`}>
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

      {/* Current Balance */}
      <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-green-700">Current Balance</p>
        <p className="text-lg font-extrabold text-green-800">
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
        {account.provider && (
          <p className="text-xs text-gray-400">Provider: {account.provider}</p>
        )}
      </div>
    </div>
  );
};

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

export default function BankAccountsComponent() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/ewallet");
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns the entire ewallet data object,
          // we extract the relevant 'bankAccounts' array.
          // If the endpoint is specific to banks, adjust accordingly.
          setBankAccounts(data.bankAccounts || []);
        } else {
          console.error("Failed to fetch bank accounts");
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
        <Loader2 className="h-10 w-10 text-indigo-700 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Bank Accounts...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-0 lg:p-0 font-sans">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 lg:p-8">
          {bankAccounts.map((account) => (
            <BankCard key={account.id} account={account} />
          ))}
          <LinkNewAccountCard />
        </div>
      </div>
    </div>
  );
}
