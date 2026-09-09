"use client";

import { useMemo, useState } from "react";
import {
  Search,
  CheckCircle,
  AlertCircle,
  Trash2,
  Zap,
  RefreshCcw,
  Layers,
  User,
  Clock,
  Target,
  FileText,
  Download,
} from "lucide-react";

// --- SUB-COMPONENTS (Kept local) ---

function SummaryBox({ title, value, green }) {
  return (
    <div className="p-5 border bg-white rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-2xl font-semibold ${green ? "text-green-600" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function SelectDropdown({ options, value, onChange }) {
  return (
    <select
      className="border px-4 py-2 rounded-lg bg-white text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function ActivityCard({ row, actionIcons, statusIcons }) {
  return (
    <div className="border bg-white p-5 rounded-xl shadow-sm space-y-3">
      {/* Action + Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
          {actionIcons[row.action] || <AlertCircle size={18} className="text-gray-500" />} {row.action}
        </div>

        <div className="flex items-center gap-1 bg-black text-white text-xs px-2 py-1 rounded-md">
          {statusIcons[row.status] || <Clock size={14} className="text-gray-400" />} {row.status}
        </div>

        <span className="text-sm text-gray-500">{row.id}</span>
      </div>

      {/* Description */}
      <p className="font-medium">{row.description}</p>

      {/* Justification */}
      {row.justification && (
        <p className="border bg-yellow-50 border-yellow-200 p-2 rounded text-sm">
          <strong>Justification:</strong> {row.justification}
        </p>
      )}
      <div className="flex justify-between"></div>
      {/* User, Time, Score */}
      <div className="text-sm text-gray-600 space-y-1">
        <p className="flex items-center gap-2">
          <User size={16} /> {row.user}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} /> {row.timestamp}
        </p>
        {row.score && (
          <p className="flex items-center gap-2">
            <Target size={16} /> Match Score: {row.score}
          </p>
        )}

        {/* Metadata */}
      {row.metadata && Object.keys(row.metadata).length > 0 && (
        <div className="border bg-gray-50 py-3 rounded-lg text-sm w-fit px-7">
          <p className="flex items-center gap-2 font-semibold mb-1">
            <FileText size={16} /> Metadata:
          </p>

          {Object.entries(row.metadata).map(([key, value], i) => (
            <p key={i} className="capitalize">
              {key.replace(/([A-Z])/g, " $1")} : {value}
            </p>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function AuditLog({ data }) {
  // --- Data Extraction with Fallbacks ---
  const summary = data?.summary || {};
  const filterOptions = data?.filterOptions || {};
  const fullData = data?.logEntries || [];

  const actions = filterOptions.actions || ["All Actions"];
  const users = filterOptions.users || ["All Users"];
  const statuses = filterOptions.statuses || ["All Status"];

  // --- State ---
  const [searchValue, setSearchValue] = useState("");
  const [actionFilter, setActionFilter] = useState(actions[0]);
  const [userFilter, setUserFilter] = useState(users[0]);
  const [statusFilter, setStatusFilter] = useState(statuses[0]);

  // --- Filtering Logic (now uses external data) ---
  const filteredData = useMemo(() => {
    return fullData.filter((row) => {
      const matchesSearch =
        row.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.id.toLowerCase().includes(searchValue.toLowerCase());

      const matchesAction =
        actionFilter === "All Actions" || row.action === actionFilter;

      const matchesUser = userFilter === "All Users" || row.user === userFilter;

      const matchesStatus =
        statusFilter === "All Status" || row.status === statusFilter;

      return matchesSearch && matchesAction && matchesUser && matchesStatus;
    });
  }, [searchValue, actionFilter, userFilter, statusFilter, fullData]);

  // --- Export CSV Logic (uses external data) ---
  const exportCSV = () => {
    if (fullData.length === 0) return;

    const headers = Object.keys(fullData[0]).join(",");
    const rows = fullData
      .map((item) =>
        Object.values(item)
          .map((v) => `"${typeof v === "object" ? JSON.stringify(v) : v ?? ""}"`)
          .join(",")
      )
      .join("\n");

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "audit_log.csv";
    link.click();
  };

  // --- ICON MAP (Remains local for UI presentation) ---
  const actionIcons = {
    "Manual Match": <CheckCircle size={18} className="text-green-600" />,
    "One-Click Match": <Zap size={18} className="text-green-600" />,
    "Bulk Match": <Layers size={18} className="text-blue-600" />,
    Unmatch: <AlertCircle size={18} className="text-yellow-600" />,
    "Status Override": <RefreshCcw size={18} className="text-purple-600" />,
    Delete: <Trash2 size={18} className="text-red-600" />,
  };

  const statusIcons = {
    Success: <CheckCircle size={14} className="text-green-600" />,
    Failed: <AlertCircle size={14} className="text-red-600" />,
    Pending: <Clock size={14} className="text-yellow-600" />,
  };

  // --- MAIN RENDER ---
  return (
    <div className="p-6 space-y-6">
      {/* TOP SUMMARY BOXES (Uses data from JSON) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryBox title="Total Actions" value={summary.totalActions} />
        <SummaryBox title="Success Rate" value={summary.successRate} green />
        <SummaryBox title="Active Users" value={summary.activeUsers} />
      </div>

      {/* FILTERS (Uses data from JSON) */}
      <div className="bg-white border p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Filter Audit Log</h2>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Search transactions..."
            />
          </div>

          <SelectDropdown options={actions} value={actionFilter} onChange={setActionFilter} />
          <SelectDropdown options={users} value={userFilter} onChange={setUserFilter} />
          <SelectDropdown
            options={statuses}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <button
            onClick={exportCSV}
            className="ml-auto flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
          >
            <Download size={16} /> Export to CSV
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredData.length} of {fullData.length} entries
        </p>
      </div>

      {/* ACTIVITY LIST (Uses filteredData) */}
      <div>
        <h2 className="text-xl font-semibold mb-1">Reconciliation Activity</h2>
        <p className="text-gray-600 mb-4">
          Complete audit trail of all reconciliation actions with MNF integration
        </p>

        <div className="space-y-4">
          {filteredData.map((row, index) => (
            <ActivityCard
              key={index}
              row={row}
              actionIcons={actionIcons}
              statusIcons={statusIcons}
            />
          ))}
        </div>
      </div>
      
      {/* MNF Integration Box */}
      <div className="bg-[#1E0F6B] text-white p-6 rounded-xl flex items-start gap-4 shadow-md">
        <div className="bg-yellow-300/20 p-3 rounded-lg">
          <FileText className="text-yellow-300" size={28} />
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            Module Note Framework (MNF) Integration
          </h3>
          <p className="text-sm opacity-90 mt-1 leading-relaxed">
            All reconciliation actions are logged with full context and justification
            through the MNF system. This ensures complete audit compliance and
            traceability for financial reporting and regulatory requirements.
          </p>
        </div>
      </div>
    </div>
  );
}