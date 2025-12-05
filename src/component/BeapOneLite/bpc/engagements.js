import React from "react";
import {
  Briefcase,
  FileText,
  TrendingUp,
  Tag,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";

// --- Mock Data ---

const STATUS_STYLES = {
  ACTIVE: {
    text: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-300",
  },
  SCOPING: {
    text: "text-purple-700",
    bg: "bg-purple-100",
    border: "border-purple-300",
  },
  AGREEMENT_PENDING: {
    text: "text-orange-700",
    bg: "bg-orange-100",
    border: "border-orange-300",
  },
  COMPLETED: {
    text: "text-gray-700",
    bg: "bg-gray-200",
    border: "border-gray-300",
  },
};

const ENGAGEMENT_DATA = [
  {
    id: 1,
    service: "Growth Strategy Consulting",
    txn: "txn-bpc-2025-001",
    client: "Adebayo Okonkwo",
    clientCompany: "Acme Nigeria Ltd",
    project: "Q1 2025 Expansion Initiative",
    projectId: "proj-k4-001",
    status: "ACTIVE",
    fee: 15500,
    invoiceId: "INV-A24-2025-112",
    requestedDate: "Nov 15, 2025",
  },
  {
    id: 2,
    service: "Market Entry Strategy (New Geography)",
    txn: "txn-bpc-2025-002",
    client: "Kwame Mensah",
    clientCompany: "TechStart Ghana",
    project: "West Africa Expansion Project",
    projectId: "proj-k4-005",
    status: "SCOPING",
    fee: 18500,
    invoiceId: "Pending",
    requestedDate: "Nov 22, 2025",
  },
  {
    id: 3,
    service: "Financial Restructuring Advisory",
    txn: "txn-bpc-2025-003",
    client: "John Kamau",
    clientCompany: "AgriPro Kenya",
    project: "No project context",
    projectId: null,
    status: "AGREEMENT_PENDING",
    fee: 22000,
    invoiceDate: null,
    invoiceId: "Pending",
    requestedDate: "Nov 24, 2025",
  },
  {
    id: 4,
    service: "Operations Excellence Program",
    txn: "txn-bpc-2025-004",
    client: "Chioma Nwankwo",
    clientCompany: "Acme Nigeria Ltd",
    project: "Manufacturing Efficiency Project",
    projectId: "proj-k4-002",
    status: "COMPLETED",
    fee: 12500,
    invoiceId: "INV-A24-2025-089",
    requestedDate: "Oct 5, 2025",
  },
];

const NOTE_DATA = [
  {
    id: 1,
    service: "Growth Strategy Consulting",
    description:
      "Client requires comprehensive growth strategy to support planned expansion into Ghana and Kenya markets. Project budget approved at Board level.",
    auditId: "audit-corr-001",
    isMandatory: true,
  },
  {
    id: 2,
    service: "Market Entry Strategy (New Geography)",
    description:
      "Market entry consulting for expansion into Nigeria, Senegal, and Côte d'Ivoire. Focus on fintech regulatory compliance.",
    auditId: "audit-corr-002",
    isMandatory: true,
  },
];

// Utility function to format currency
const formatCurrency = (amount) => {
  return `$${(amount / 1000).toFixed(0)}K`;
};

// --- Sub-Components ---

/**
 * Pill component for engagement status.
 */
const StatusPill = ({ status }) => {
  const { text, bg, border } = STATUS_STYLES[status] || STATUS_STYLES.COMPLETED;
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
 * NOTE: This is the "breakable" element for small screens.
 */
const EngagementRowCard = ({ engagement }) => {
  const handleInvoiceClick = (id) => {
    // In a production app, this would navigate to the invoice page
    console.log(`Navigating to Invoice: ${id}`);
  };

  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 mb-3 md:hidden">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-base font-semibold text-gray-900">
          {engagement.service}
        </h4>
        <StatusPill status={engagement.status} />
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
              onClick={() => handleInvoiceClick(engagement.invoiceId)}
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

// --- Main Component ---

export default function Engagements() {
  const handleProjectClick = (projectId) => {
    // In a production app, this would navigate to the K4 Project details
    console.log(`Navigating to K4 Project: ${projectId}`);
  };

  const handleInvoiceClick = (id) => {
    // In a production app, this would navigate to the invoice page
    console.log(`Navigating to Invoice: ${id}`);
  };

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

        {/* Engagement Table (Desktop View - Fluid and Compacted) */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Reduced px-4 to px-3 */}
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                {/* Reduced px-4 to px-3 */}
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                {/* Reduced px-4 to px-3 */}
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  K4 Project
                </th>
                {/* Reduced px-4 to px-3 */}
                <th
                  scope="col"
                  className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {/* Reduced px-4 to px-3 */}
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                {/* Reduced px-4 to px-3 */}
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                {/* Reduced px-4 to px-3 */}
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ENGAGEMENT_DATA.map((engagement) => (
                <tr
                  key={engagement.id}
                  className="hover:bg-indigo-50 transition-colors">
                  {/* Reduced px-4 py-3 to px-3 py-2 */}
                  <td className="px-3 py-2 text-sm align-top">
                    <div className="font-semibold text-gray-900 break-words">
                      {engagement.service}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 break-words">
                      {engagement.txn}
                    </div>
                  </td>
                  {/* Reduced px-4 py-3 to px-3 py-2 */}
                  <td className="px-3 py-2 text-sm align-top">
                    <div className="text-gray-900 break-words">
                      {engagement.client}
                    </div>
                    <div className="text-xs text-gray-500 break-words">
                      {engagement.clientCompany}
                    </div>
                  </td>
                  {/* Reduced px-4 py-3 to px-3 py-2 */}
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
                  {/* Reduced px-4 py-3 to px-3 py-2 */}
                  <td className="px-3 py-2 whitespace-nowrap text-center align-top">
                    <StatusPill status={engagement.status} />
                  </td>
                  {/* Reduced px-4 py-3 to px-3 py-2 */}
                  <td className="px-3 py-2 whitespace-nowrap text-right align-top">
                    <div className="font-bold text-gray-900 text-sm">
                      {formatCurrency(engagement.fee)}
                    </div>
                    <div className="text-xs text-gray-500">USD</div>
                  </td>
                  {/* Reduced px-4 py-3 to px-3 py-2 */}
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
                  {/* Reduced px-4 py-3 to px-3 py-2 */}
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-500 align-top">
                    {engagement.requestedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Engagement Cards (Mobile View - Breakable/Compacted) */}
        <div className="md:hidden">
          {ENGAGEMENT_DATA.map((engagement) => (
            <EngagementRowCard key={engagement.id} engagement={engagement} />
          ))}
        </div>

        {/* Module Note Examples Section (Compacted) */}
        <div className="mt-12">
          <div className="flex items-center mb-6">
            <FileText size={24} className="text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Module Note Examples (Audit Trail)
            </h2>
          </div>
          <div className="space-y-6">
            {NOTE_DATA.map((note) => (
              <ModuleNoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      </div>
      <div className="h-12"></div> {/* Bottom spacer */}
    </div>
  );
}
