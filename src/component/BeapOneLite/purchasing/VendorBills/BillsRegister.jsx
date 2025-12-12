"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Calendar, Info, DollarSign } from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

// Status Tag Component
const StatusTag = ({ status }) => {
  let colorClass = "";
  switch (status) {
    case "Issued":
    case "Scheduled":
      colorClass = "bg-blue-600/10 text-blue-800 font-semibold";
      break;
    case "Partial":
    case "Partially Paid":
      colorClass = "bg-yellow-600/10 text-yellow-800 font-semibold";
      break;
    case "Overdue":
      colorClass = "bg-red-600/10 text-red-800 font-semibold";
      break;
    case "Paid":
      colorClass = "bg-gray-700 text-white font-semibold";
      break;
    default:
      colorClass = "bg-gray-100 text-gray-700";
  }
  return <span className={`px-2 py-0.5 text-xs rounded ${colorClass}`}>{status}</span>;
};

// Bill Item Component
const BillItem = ({ bill }) => {
  const [isExpanded, setIsExpanded] = useState(bill.alwaysShowDetails || false);

  const outstandingColor = bill.status === "Overdue" ? "text-red-600" : "text-gray-500";
  const isExpandable =
    bill.isInstallment || bill.status === "Overdue" || bill.status === "Partial";
  const showExpandIcon = isExpandable && !bill.alwaysShowDetails;

  return (
    <div
      className={`p-4 border-b last:border-b-0 ${
        isExpanded ? "bg-gray-50" : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-start ${
          showExpandIcon ? "cursor-pointer" : "cursor-default"
        }`}
        onClick={() => showExpandIcon && setIsExpanded(!isExpanded)}
      >
        {/* Left */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center space-x-2 mb-1">
            <span
              className={`text-lg font-semibold ${
                bill.status === "Paid" ? "text-gray-700" : "text-gray-900"
              }`}
            >
              {bill.vendor}
            </span>

            <StatusTag status={bill.status === "Partial" ? "Partially Paid" : bill.status} />

            {bill.isInstallment && <StatusTag status="Installments" />}
          </div>

          <p className="text-sm text-gray-600 truncate">{bill.description}</p>
          <div className="text-xs text-gray-500 mt-1">
            Bill: <b>{bill.billId}</b> | Issued: <b>{bill.issuedDate}</b>
            {bill.dueDate && <> | Due: {bill.dueDate}</>}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-6">
          <div className="text-right whitespace-nowrap">
            <p
              className={`text-xl font-bold ${
                bill.status === "Paid" ? "text-gray-700" : "text-black"
              }`}
            >
              {formatCurrency(bill.totalAmount)}
            </p>

            {bill.outstanding > 0 && (
              <p className={`text-sm ${outstandingColor}`}>
                Outstanding: {formatCurrency(bill.outstanding)}
              </p>
            )}

            {bill.paid > 0 && (
              <p className="text-sm text-green-600">Paid: {formatCurrency(bill.paid)}</p>
            )}
          </div>

          {bill.status !== "Paid" && (
            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
              Pay Now
            </button>
          )}

          {showExpandIcon &&
            (isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ))}
        </div>
      </div>

      {/* Installments */}
      {(isExpanded || bill.alwaysShowDetails) &&
        bill.isInstallment &&
        bill.installments?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-bold mb-3 text-gray-700">Payment Schedule:</h4>

            {bill.installments.map((i, index) => (
              <div key={i.id} className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">Installment #{index + 1}</span>
                  <span className="text-sm text-gray-600">Due: {i.dueDate}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-900">{formatCurrency(i.amount)}</span>

                  {i.status === "Overdue" ? (
                    <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium">
                      Overdue
                    </button>
                  ) : (
                    <StatusTag status={i.status} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

// -------------------
// MAIN COMPONENT
// -------------------
export default function BillsRegister() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    async function loadBills() {
      try {
        const res = await fetch("/api/beapOnelite/vendorbills");
        const data = await res.json();
        setBills(data.bills); // <-- loaded from JSON
      } catch (error) {
        console.error("Failed to fetch bills:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBills();
  }, []);

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const label = bill.status === "Partial" ? "Partially Paid" : bill.status;

      if (filter === "All") return true;
      return label === filter;
    });
  }, [filter, bills]);

  const filters = ["All", "Issued", "Partial", "Overdue", "Paid"];

  if (loading) {
    return <p className="p-4">Loading bills...</p>;
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      {/* Filters */}
      <div className="flex space-x-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === f
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bills List */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {filteredBills.length > 0 ? (
          filteredBills.map((bill) => <BillItem key={bill.id} bill={bill} />)
        ) : (
          <p className="p-4 text-center text-gray-500">
            No bills found for this filter.
          </p>
        )}
      </div>

      {/* About Section */}
      <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg flex space-x-3 items-start">
        <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-blue-800 mb-1">About Vendor Bill Management (M7)</h3>
          <p className="text-sm text-blue-700">
            M7 tracks all accounts payable with installment support and automated aging analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
