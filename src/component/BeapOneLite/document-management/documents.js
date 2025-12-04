import React, { useState, useMemo } from "react";
import {
  Download,
  Eye,
  Search,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

// ====================================================================
// 1. MOCK DATA
// ====================================================================

const MOCK_DOCUMENTS = [
  {
    id: "doc-008",
    name: "INV-2025-002.pdf",
    type: "INVOICE",
    owner: "user-001",
    size: "0.52 MB",
    status: "CLEARED",
    created: "Nov 27, 2025, 03:00 PM",
    alert: false, // For the small orange alert dot
  },
  {
    id: "doc-004",
    name: "EST-2025-045.pdf",
    type: "ESTIMATE",
    owner: "user-001",
    size: "0.35 MB",
    status: "CLEARED",
    created: "Nov 27, 2025, 12:45 PM",
    alert: false,
  },
  {
    id: "doc-006",
    name: "Receipt_Payment_Nov_27.pdf",
    type: "RECEIPT",
    owner: "user-004",
    size: "0.15 MB",
    status: "CLEARED",
    created: "Nov 27, 2025, 10:50 AM",
    alert: false,
  },
  {
    id: "doc-001",
    name: "INV-2025-001.pdf",
    type: "INVOICE",
    owner: "user-001",
    size: "0.45 MB",
    status: "CLEARED",
    created: "Nov 27, 2025, 09:15 AM",
    alert: true,
  },
  {
    id: "doc-002",
    name: "Monthly_Report_Nov_2025.pdf",
    type: "REPORT",
    owner: "user-002",
    size: "2.30 MB",
    status: "CLEARED",
    created: "Nov 26, 2025, 03:30 PM",
    alert: false,
  },
  {
    id: "doc-003",
    name: "Service_Contract_TechStart_2...",
    type: "CONTRACT",
    owner: "user-003",
    size: "1.80 MB",
    status: "PENDING",
    created: "Nov 25, 2025, 11:00 AM",
    alert: true,
  },
  {
    id: "doc-005",
    name: "VAT_Return_Q3_2025.pdf",
    type: "TAX_FILING",
    owner: "user-005",
    size: "0.80 MB",
    status: "CLEARED",
    created: "Nov 24, 2025, 05:20 PM",
    alert: false,
  },
  {
    id: "doc-007",
    name: "Compliance_Audit_2025.pdf",
    type: "COMPLIANCE",
    owner: "user-002",
    size: "4.20 MB",
    status: "FAILED",
    created: "Nov 23, 2025, 02:00 PM",
    alert: false,
  },
];

// Configuration for Document Type Pills
const TYPE_CONFIG = {
  INVOICE: { text: "INVOICE" },
  ESTIMATE: { text: "ESTIMATE" },
  RECEIPT: { text: "RECEIPT" },
  REPORT: { text: "REPORT" },
  CONTRACT: { text: "CONTRACT" },
  TAX_FILING: { text: "TAX_FILING" },
  COMPLIANCE: { text: "COMPLIANCE" },
};

// EXPLICIT Tailwind Class Map for maximum contrast and consistency.
// All colors now use: bg-X-50, border-X-500, text-X-900.
const TYPE_CLASS_MAP = {
  INVOICE: "border-indigo-500 bg-indigo-50 text-indigo-900",
  ESTIMATE: "border-purple-500 bg-purple-50 text-purple-900",
  RECEIPT: "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-900",
  REPORT: "border-green-500 bg-green-50 text-green-900",
  CONTRACT: "border-yellow-500 bg-yellow-50 text-yellow-900",
  TAX_FILING: "border-teal-500 bg-teal-50 text-teal-900",
  COMPLIANCE: "border-blue-500 bg-blue-50 text-blue-900",
  DEFAULT: "border-gray-500 bg-gray-50 text-gray-900",
};

// Configuration for Status Pills
const STATUS_CONFIG = {
  CLEARED: {
    color: "green",
    text: "CLEARED",
    icon: CheckCircle,
    iconClass: "text-green-500",
  },
  PENDING: {
    color: "yellow",
    text: "PENDING",
    icon: AlertTriangle,
    iconClass: "text-yellow-500",
  },
  FAILED: {
    color: "red",
    text: "FAILED",
    icon: XCircle,
    iconClass: "text-red-500",
  },
};

// ====================================================================
// 2. REUSABLE COMPONENTS
// ====================================================================

/**
 * Status Pill Component (e.g., CLEARED, PENDING, FAILED)
 * Renders the document processing status with a corresponding icon and color.
 */
const StatusPill = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white border border-${config.color}-300 shadow-sm`}>
      <Icon size={14} className={`mr-1 ${config.iconClass}`} />
      <span className={`text-${config.color}-700`}>{config.text}</span>
    </div>
  );
};

/**
 * Type Pill Component (e.g., INVOICE, CONTRACT)
 * Renders the document type with its specific background/border color.
 */
const TypePill = ({ type, alert }) => {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.DEFAULT;
  // Get the explicit class string from the map
  const classString = TYPE_CLASS_MAP[type] || TYPE_CLASS_MAP.DEFAULT;

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${classString}`}>
      {config.text}
      {alert && (
        <span className="ml-1 flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
      )}
    </div>
  );
};

// ====================================================================
// 3. MAIN COMPONENT
// ====================================================================

export default function DocumentRegister() {
  const [searchTerm, setSearchTerm] = useState("");
  const documents = MOCK_DOCUMENTS; // Use mock data directly

  // --- Filtering Logic ---
  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documents;
    const lowerCaseSearch = searchTerm.toLowerCase();

    // Filter documents based on name, type, or owner
    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(lowerCaseSearch) ||
        doc.type.toLowerCase().includes(lowerCaseSearch) ||
        doc.owner.toLowerCase().includes(lowerCaseSearch)
    );
  }, [documents, searchTerm]);

  // --- Action Handlers (Mocked) ---
  const handleDownload = (doc) => {
    // Replaced alert() with a console log as per instructions
    console.log(`[ACTION] Requesting signed URL for download: ${doc.name}`);
  };

  const handleView = (doc) => {
    // Replaced alert() with a console log as per instructions
    console.log(`[ACTION] Viewing document: ${doc.name}`);
  };

  // --- Render Functions ---
  const renderTableHeader = () => (
    <div className="hidden lg:grid grid-cols-[3fr_1.5fr_1fr_1fr_1.5fr_2fr_1fr] text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 py-3 px-6">
      <div>Document</div>
      <div>Type</div>
      <div>Owner</div>
      <div>Size</div>
      <div>Status</div>
      <div>Created</div>
      <div className="text-right">Actions</div>
    </div>
  );

  const renderTableRow = (doc) => (
    <div
      key={doc.id}
      className="p-4 lg:py-4 lg:px-6 border-b border-gray-100 hover:bg-indigo-50/50 transition duration-150 ease-in-out cursor-pointer">
      {/* Desktop/Tablet Row Layout (lg:grid) */}
      <div className="hidden lg:grid grid-cols-[3fr_1.5fr_1fr_1fr_1.5fr_2fr_1fr] items-center text-sm">
        {/* Document */}
        <div className="flex items-center space-x-3">
          <FileText size={18} className="text-indigo-400" />
          <div>
            <p className="font-medium text-gray-800 truncate" title={doc.name}>
              {doc.name}
            </p>
            <p className="text-xs text-gray-400">{doc.id}</p>
          </div>
        </div>

        {/* Type */}
        <div>
          <TypePill type={doc.type} alert={doc.alert} />
        </div>

        {/* Owner */}
        <div className="text-gray-600">{doc.owner}</div>

        {/* Size */}
        <div className="text-gray-600">{doc.size}</div>

        {/* Status */}
        <div>
          <StatusPill status={doc.status} />
        </div>

        {/* Created */}
        <div className="text-gray-600">{doc.created}</div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleDownload(doc)}
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full transition-colors"
            title="Download Document">
            <Download size={18} />
          </button>
          <button
            onClick={() => handleView(doc)}
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full transition-colors"
            title="View Document">
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Mobile/Small Screen Layout (flex) */}
      <div className="flex flex-col lg:hidden space-y-2">
        <div className="flex justify-between items-start">
          {/* Document Name & Type (Left) */}
          <div className="flex items-start space-x-3">
            <FileText
              size={20}
              className="text-indigo-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-semibold text-gray-800 text-base leading-tight">
                {doc.name}
              </p>
              <p className="text-xs text-gray-400 mb-1">{doc.id}</p>
              <TypePill type={doc.type} alert={doc.alert} />
            </div>
          </div>

          {/* Status (Right) */}
          <StatusPill status={doc.status} />
        </div>

        <div className="flex justify-between text-sm text-gray-600 border-t border-gray-100 pt-2">
          {/* Metadata */}
          <div className="flex flex-col space-y-1">
            <p>
              <span className="font-medium text-gray-500">Owner:</span>{" "}
              {doc.owner}
            </p>
            <p>
              <span className="font-medium text-gray-500">Size:</span>{" "}
              {doc.size}
            </p>
            <p>
              <span className="font-medium text-gray-500">Created:</span>{" "}
              {doc.created.split(",")[0]}
            </p>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-end space-x-3">
            <button
              onClick={() => handleDownload(doc)}
              className="p-2 text-indigo-600 bg-indigo-100 rounded-full shadow-md transition-all hover:bg-indigo-200"
              title="Download Document">
              <Download size={20} />
            </button>
            <button
              onClick={() => handleView(doc)}
              className="p-2 text-gray-600 bg-gray-100 rounded-full shadow-md transition-all hover:bg-gray-200"
              title="View Document">
              <Eye size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Document Repository
            </h1>
            <p className="text-sm text-gray-500">
              Secure access to all documents with time-limited signed URLs
            </p>
          </div>

          <div className="mt-4 sm:mt-0 w-full sm:w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm placeholder-gray-500"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Document Table Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Table Header */}
          {renderTableHeader()}

          {/* Table Body / Document List */}
          <div className="divide-y divide-gray-100">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map(renderTableRow)
            ) : (
              <div className="p-10 text-center text-gray-500">
                No documents found matching "{searchTerm}".
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
            Showing {filteredDocuments.length} document
            {filteredDocuments.length !== 1 ? "s" : ""}{" "}
            {searchTerm && `of ${documents.length} total`}
          </div>
        </div>
      </div>
    </div>
  );
}
