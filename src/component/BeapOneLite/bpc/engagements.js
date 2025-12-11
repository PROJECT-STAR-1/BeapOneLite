"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  FileText,
  TrendingUp,
  Tag,
  DollarSign,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

// ====================================================================
// 1. UI CONFIGURATION & MAPPINGS
// ====================================================================

const STATUS_STYLES = {
  active: {
    text: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-300",
  },
  scoping: {
    text: "text-purple-700",
    bg: "bg-purple-100",
    border: "border-purple-300",
  },
  pending: {
    text: "text-orange-700",
    bg: "bg-orange-100",
    border: "border-orange-300",
  },
  completed: {
    text: "text-gray-700",
    bg: "bg-gray-200",
    border: "border-gray-300",
  },
  default: {
    text: "text-gray-700",
    bg: "bg-gray-100",
    border: "border-gray-200",
  },
};

// Utility function to format currency
const formatCurrency = (amount) => {
  return `$${(amount / 1000).toFixed(0)}K`;
};

// ====================================================================
// 2. REUSABLE COMPONENTS
// ====================================================================

/**
 * Pill component for engagement status.
 */
const StatusPill = ({ status, type }) => {
  const { text, bg, border } = STATUS_STYLES[type] || STATUS_STYLES.default;
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${text} ${bg} border ${border}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
};

/**
 * Card component for mandatory audit trail notes.
 */
const ModuleNoteCard = ({ note }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <FileText size={20} className="text-blue-600 mr-3 flex-shrink-0" />
          <h3 className="text-base font-semibold text-gray-800">
            {note.service}
          </h3>
        </div>
        {note.isMandatory && (
          <span className="ml-4 px-3 py-1 text-xs font-semibold rounded-full text-orange-700 bg-orange-100">
            Mandatory Note
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2 pl-8 border-l-2 border-blue-100">
        {note.description}
      </p>
      <div className="text-xs text-gray-400 pl-8">
        Audit Correlation ID:{" "}
        <span className="font-mono text-gray-500">{note.auditId}</span>
      </div>
    </div>
  );
};

/**
 * Table Row component for responsiveness (used in mobile view)
 */
const EngagementRowCard = ({ engagement, onInvoiceClick }) => {
  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 mb-3 md:hidden">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-base font-semibold text-gray-900">
          {engagement.service}
        </h4>
        <StatusPill status={engagement.status} type={engagement.statusType} />
      </div>
      <p className="text-xs text-gray-500 mb-3">TXN: {engagement.txn}</p>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Client:</span>
          <span className="text-gray-800 text-right">
            {engagement.client} ({engagement.clientCompany})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Project:</span>
          <span className="text-blue-600 text-right">{engagement.project}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Fee:</span>
          <span className="text-gray-800 font-bold">
            {formatCurrency(engagement.fee)} USD
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Invoice:</span>
          {engagement.invoiceId === "Pending" ? (
            <span className="text-gray-500">{engagement.invoiceId}</span>
          ) : (
            <button
              onClick={() => onInvoiceClick(engagement.invoiceId)}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
              {engagement.invoiceId} <ArrowUpRight size={14} className="ml-1" />
            </button>
          )}
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Requested:</span>
          <span className="text-gray-800">{engagement.requestedDate}</span>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 3. MAIN COMPONENT
// ====================================================================

export default function Engagements() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/bpc");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch engagements data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProjectClick = (projectId) => {
    console.log(`Navigating to K4 Project: ${projectId}`);
  };

  const handleInvoiceClick = (id) => {
    console.log(`Navigating to Invoice: ${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-10 h-10 text-indigo-700 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Engagements...</p>
      </div>
    );
  }

  // Safe Data Access
  const engagements = data?.engagements ?? [];
  const auditNotes = data?.auditNotes ?? [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-2">
          <Briefcase size={24} className="text-indigo-600 mr-2" />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Consultation Engagements
          </h1>
        </div>
        <p className="text-md text-gray-600 mb-8">
          Track all BPC consulting engagements initiated from BEAPOne Lite
        </p>

        {/* Engagement Table (Desktop View) */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  K4 Project
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {engagements.map((engagement) => (
                <tr
                  key={engagement.id}
                  className="hover:bg-indigo-50 transition-colors">
                  <td className="px-3 py-2 text-sm align-top">
                    <div className="font-semibold text-gray-900 break-words">
                      {engagement.service}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 break-words">
                      {engagement.txn}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm align-top">
                    <div className="text-gray-900 break-words">
                      {engagement.client}
                    </div>
                    <div className="text-xs text-gray-500 break-words">
                      {engagement.clientCompany}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm align-top">
                    {engagement.projectId ? (
                      <button
                        onClick={() => handleProjectClick(engagement.projectId)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm break-words">
                        {engagement.project}{" "}
                        <ArrowUpRight
                          size={14}
                          className="ml-1 flex-shrink-0"
                        />
                        <span className="text-xs text-gray-500 ml-1 break-words">
                          ({engagement.projectId})
                        </span>
                      </button>
                    ) : (
                      <span className="text-gray-500 italic text-sm break-words">
                        {engagement.project}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center align-top">
                    <StatusPill
                      status={engagement.status}
                      type={engagement.statusType}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right align-top">
                    <div className="font-bold text-gray-900 text-sm">
                      {formatCurrency(engagement.fee)}
                    </div>
                    <div className="text-xs text-gray-500">USD</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right align-top">
                    {engagement.invoiceId === "Pending" ? (
                      <span className="text-gray-500 text-sm">
                        {engagement.invoiceId}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleInvoiceClick(engagement.invoiceId)}
                        className="text-blue-600 hover:text-blue-800 flex justify-end items-center text-sm">
                        {engagement.invoiceId}{" "}
                        <ArrowUpRight size={14} className="ml-1" />
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-500 align-top">
                    {engagement.requestedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Engagement Cards (Mobile View) */}
        <div className="md:hidden">
          {engagements.map((engagement) => (
            <EngagementRowCard
              key={engagement.id}
              engagement={engagement}
              onInvoiceClick={handleInvoiceClick}
            />
          ))}
        </div>

        {/* Module Note Examples Section */}
        <div className="mt-12">
          <div className="flex items-center mb-6">
            <FileText size={24} className="text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Module Note Examples (Audit Trail)
            </h2>
          </div>
          <div className="space-y-6">
            {auditNotes.map((note) => (
              <ModuleNoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      </div>
      <div className="h-12"></div> {/* Bottom spacer */}
    </div>
  );
}
