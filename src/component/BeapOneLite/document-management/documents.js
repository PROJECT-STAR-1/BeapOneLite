"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Download,
  Eye,
  Search,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

// ====================================================================
// 1. UI CONFIGURATION & MAPPINGS
// ====================================================================

const TYPE_CONFIG = {
  INVOICE: { text: "INVOICE" },
  ESTIMATE: { text: "ESTIMATE" },
  RECEIPT: { text: "RECEIPT" },
  REPORT: { text: "REPORT" },
  CONTRACT: { text: "CONTRACT" },
  TAX_FILING: { text: "TAX_FILING" },
  COMPLIANCE: { text: "COMPLIANCE" },
};

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

const TypePill = ({ type, alert }) => {
  const config = TYPE_CONFIG[type] || { text: type };
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
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/document");
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns a 'documents' array
          setDocuments(data.documents || []);
        } else {
          console.error("Failed to fetch documents");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtering Logic
  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documents;
    const lowerCaseSearch = searchTerm.toLowerCase();

    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(lowerCaseSearch) ||
        doc.type.toLowerCase().includes(lowerCaseSearch) ||
        doc.owner.toLowerCase().includes(lowerCaseSearch)
    );
  }, [documents, searchTerm]);

  // Action Handlers
  const handleDownload = (doc) => {
    console.log(`[ACTION] Requesting signed URL for download: ${doc.name}`);
  };

  const handleView = (doc) => {
    console.log(`[ACTION] Viewing document: ${doc.name}`);
  };

  // Render Functions
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
      {/* Desktop/Tablet Row Layout */}
      <div className="hidden lg:grid grid-cols-[3fr_1.5fr_1fr_1fr_1.5fr_2fr_1fr] items-center text-sm">
        <div className="flex items-center space-x-3">
          <FileText size={18} className="text-indigo-400" />
          <div>
            <p className="font-medium text-gray-800 truncate" title={doc.name}>
              {doc.name}
            </p>
            <p className="text-xs text-gray-400">{doc.id}</p>
          </div>
        </div>

        <div>
          <TypePill type={doc.type} alert={doc.alert} />
        </div>

        <div className="text-gray-600">{doc.owner}</div>
        <div className="text-gray-600">{doc.size}</div>

        <div>
          <StatusPill status={doc.status} />
        </div>

        <div className="text-gray-600">{doc.created}</div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(doc);
            }}
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full transition-colors"
            title="Download Document">
            <Download size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(doc);
            }}
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full transition-colors"
            title="View Document">
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Mobile/Small Screen Layout */}
      <div className="flex flex-col lg:hidden space-y-2">
        <div className="flex justify-between items-start">
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
          <StatusPill status={doc.status} />
        </div>

        <div className="flex justify-between text-sm text-gray-600 border-t border-gray-100 pt-2">
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

          <div className="flex items-end space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(doc);
              }}
              className="p-2 text-indigo-600 bg-indigo-100 rounded-full shadow-md transition-all hover:bg-indigo-200"
              title="Download Document">
              <Download size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView(doc);
              }}
              className="p-2 text-gray-600 bg-gray-100 rounded-full shadow-md transition-all hover:bg-gray-200"
              title="View Document">
              <Eye size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-10 h-10 text-indigo-700 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Documents...</p>
      </div>
    );
  }

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
          {renderTableHeader()}

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
