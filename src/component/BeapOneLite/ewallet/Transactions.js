import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

/* ============================================================
    CONSTANTS & MOCK DATA
============================================================ */

const BRAND_COLOR = "text-indigo-700";
const ICON_SIZE = 16;

// Reusable formatting function for currency (assumes Naira ₦ as default)
const formatNaira = (amount) => {
  // Ensures a positive number is passed for formatting
  return `₦ ${new Intl.NumberFormat("en-NG").format(Math.abs(amount))}`;
};

const ALL_TRANSACTIONS = [
  {
    id: "txn-1",
    type: "Debit",
    title: "Payment to TechSupply Nigeria Ltd",
    category: "VENDOR PAYMENT",
    user: "Adebayo Okonkwo",
    ref: "EW-WALLET-TXN-20241127-002",
    date: "11/27/2024, 11:00:00 AM",
    amount: -800000,
    status: "COMPLETED",
    balance: 4050000,
  },
  {
    id: "txn-2",
    type: "Debit",
    title: "Paystack transaction fee for INV-2024-11-025",
    category: "GATEWAY FEE",
    system: "Fee Deduction",
    ref: "REF: FEE-PAYSTACK-20241127-001",
    date: "11/27/2024, 10:16:00 AM",
    amount: -22500,
    status: "COMPLETED",
    processor: "PAYSTACK",
    balance: 5327500,
  },
  {
    id: "txn-3",
    type: "Credit",
    title: "Payment received for Invoice INV-2024-11-025",
    category: "INVOICE PAYMENT",
    client: "Mega Corp Nigeria",
    ref: "PAYSTACK-TXN-20241127-001",
    date: "11/27/2024, 10:15:00 AM",
    amount: 1500000,
    status: "COMPLETED",
    processor: "PAYSTACK",
    fee: 22500,
    balance: 4850000,
  },
  {
    id: "txn-4",
    type: "Debit",
    title: "Bank sweep to Access Bank ****6789",
    category: "BANK WITHDRAWAL",
    system: "Auto-Sweep",
    ref: "REF: BANK-WITHDRAWAL-20241126-002",
    date: "11/26/2024, 7:00:00 PM",
    amount: -1200000,
    status: "COMPLETED",
    balance: 4850000,
  },
  {
    id: "txn-5",
    type: "Credit",
    title: "Bank transfer from Access Bank ****6789",
    category: "BANK DEPOSIT",
    system: "Auto-Sync",
    ref: "REF: BANK-DEPOSIT-20241126-001",
    date: "11/26/2024, 3:30:00 PM",
    amount: 2000000,
    status: "COMPLETED",
    balance: 6050000,
  },
  {
    id: "txn-6",
    type: "Debit",
    title: "Transfer to Project Escrow Wallet",
    category: "WALLET TRANSFER",
    user: "Adebayo Okonkwo",
    ref: "REF: WALLET-TRANSFER-20241125-004",
    date: "11/25/2024, 4:45:00 PM",
    amount: -500000,
    status: "COMPLETED",
    balance: 5100000,
  },
  {
    id: "txn-7",
    type: "Credit",
    title: "Payment received for Invoice INV-2024-11-023",
    category: "INVOICE PAYMENT",
    client: "StarTech Solutions",
    ref: "FLUTTERWAVE-TXN-20241125-003",
    date: "11/25/2024, 12:20:00 PM",
    amount: 750000,
    status: "COMPLETED",
    processor: "FLUTTERWAVE",
    fee: 11250,
    balance: 5600000,
  },
  {
    id: "txn-8",
    type: "Credit",
    title: "Refund from Office Furniture Pro",
    category: "REFUND",
    vendor: "Office Furniture Pro",
    ref: "REF: REFUND-20241124-001",
    date: "11/24/2024, 2:00:00 PM",
    amount: 250000,
    status: "PENDING",
    balance: 5350000,
  },
  {
    id: "txn-9",
    type: "Debit",
    title: "Subscription Renewal - Cloud Hosting",
    category: "UTILITY BILL",
    system: "Auto-Pay",
    ref: "REF: AUTOPAY-20241123-010",
    date: "11/23/2024, 1:00:00 AM",
    amount: -50000,
    status: "FAILED",
    balance: 5600000,
  },
];

/* ============================================================
    HELPER COMPONENTS
============================================================ */

/**
 * Renders the small badge for transaction category or processor.
 */
const TransactionBadge = ({ label, isPrimary = false }) => {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase truncate max-w-[120px] ${
        isPrimary
          ? "bg-indigo-100 text-indigo-700"
          : "bg-gray-200 text-gray-700"
      }`}>
      {label}
    </span>
  );
};

/**
 * Renders the detailed view for a single transaction row.
 */
const TransactionRow = ({ transaction }) => {
  const isCredit = transaction.type === "Credit";
  const amountSign = isCredit ? "+" : "–";
  const amountColor = isCredit ? "text-green-600" : "text-red-600";

  // Icon and background based on type
  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;
  const iconColor = isCredit ? "text-green-600" : "text-red-600";
  const iconBg = isCredit ? "bg-green-50" : "bg-red-50";

  // Status chip
  let StatusIcon, statusColor, statusBg;
  switch (transaction.status) {
    case "COMPLETED":
      StatusIcon = CheckCircle;
      statusColor = "text-green-600";
      statusBg = "bg-green-100";
      break;
    case "PENDING":
      StatusIcon = Clock;
      statusColor = "text-yellow-600";
      statusBg = "bg-yellow-100";
      break;
    case "FAILED":
      StatusIcon = XCircle;
      statusColor = "text-red-600";
      statusBg = "bg-red-100";
      break;
    default:
      StatusIcon = AlertTriangle;
      statusColor = "text-gray-600";
      statusBg = "bg-gray-100";
  }

  // Determine secondary detail text (User/Client/System)
  let secondaryDetail = "";
  if (transaction.user) secondaryDetail = `USER: ${transaction.user}`;
  else if (transaction.client)
    secondaryDetail = `CLIENT: ${transaction.client}`;
  else if (transaction.system)
    secondaryDetail = `SYSTEM: ${transaction.system}`;
  else if (transaction.vendor)
    secondaryDetail = `VENDOR: ${transaction.vendor}`;

  return (
    <div className="flex items-start py-5 px-4 sm:px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Left Section: Icon, Title, Details */}
      <div
        className="flex-shrink-0 w-8 h-8 mr-4 mt-1 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: iconBg }}>
        <Icon size={ICON_SIZE} className={iconColor} />
      </div>

      <div className="flex-grow min-w-0">
        {/* Row 1: Title and Category Badge */}
        <div className="flex items-center space-x-3 mb-1">
          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
            {transaction.title}
          </p>
          <TransactionBadge
            label={transaction.category}
            isPrimary={
              transaction.category === "INVOICE PAYMENT" ||
              transaction.category === "VENDOR PAYMENT" ||
              transaction.category === "WALLET TRANSFER"
            }
          />
        </div>

        {/* Row 2: Secondary Detail (User/Client/System) */}
        <p className="text-xs text-gray-600 mb-1">{secondaryDetail}</p>

        {/* Row 3: Reference, Date, Processor */}
        <div className="flex flex-wrap items-center text-xs text-gray-500 space-x-3 sm:space-x-4">
          <span className="truncate max-w-[150px]">Ref: {transaction.ref}</span>
          <span>{transaction.date}</span>
          {transaction.processor && (
            <TransactionBadge label={transaction.processor} />
          )}
        </div>

        {/* Row 4: Fee Detail (only for Credits) */}
        {transaction.fee && (
          <p className="text-xs text-gray-500 mt-1">
            Fee: {formatNaira(transaction.fee)}
          </p>
        )}
      </div>

      {/* Right Section: Amount, Status, and Balance (Flex-col for stacking on mobile) */}
      <div className="flex flex-col items-end flex-shrink-0 ml-4 space-y-1">
        {/* Transaction Amount */}
        <p className={`text-base font-bold ${amountColor} whitespace-nowrap`}>
          {amountSign} {formatNaira(transaction.amount)}
        </p>

        {/* Status Chip */}
        <div
          className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusBg} ${statusColor}`}>
          <StatusIcon size={10} className="mr-1" />
          {transaction.status}
        </div>

        {/* Current Balance */}
        <p className="text-xs text-gray-500 whitespace-nowrap pt-1">
          Balance: {formatNaira(transaction.balance)}
        </p>
      </div>
    </div>
  );
};

/* ============================================================
    MAIN COMPONENT
============================================================ */

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");

  // Extract unique categories for the filter dropdown
  const categories = [
    "All Categories",
    ...new Set(ALL_TRANSACTIONS.map((t) => t.category)),
  ];

  // Simple filtering logic (for display only)
  const filteredTransactions = ALL_TRANSACTIONS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All Categories" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen p-4 lg:p-6 font-sans">
      {" "}
      {/* Reduced overall padding */}
      <div className="w-full mx-auto">
        {/* Header and Filter Bar */}
        {/* Removed mb-6 to tighten space, replaced with mb-4 for header */}
        <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h1>

          {/* Search and Filter Inputs */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow">
              {/* Ensured icon has explicit color */}
              <Search
                size={ICON_SIZE}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // Added explicit text and placeholder colors for dark mode visibility
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm text-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                // Added explicit text color for dark mode visibility
                className="appearance-none w-full py-2 pl-4 pr-8 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm text-sm text-gray-900">
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
              {/* Ensured icon has explicit color */}
              <ChevronDown
                size={ICON_SIZE}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Transaction List Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No transactions found matching your criteria.
            </div>
          )}
        </div>

        {/* Optional: Pagination / Load More (Placeholder) */}
        {filteredTransactions.length === ALL_TRANSACTIONS.length &&
          ALL_TRANSACTIONS.length > 10 && (
            <div className="mt-6 text-center">
              <button
                className={`text-sm font-medium ${BRAND_COLOR} hover:underline`}>
                Load More Transactions
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default TransactionHistory;
