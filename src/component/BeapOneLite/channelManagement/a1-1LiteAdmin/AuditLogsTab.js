"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  Search
} from "lucide-react";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All actions");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/beapOnelite/a1-1LiteAdmin");
      const json = await res.json();
      setLogs(json.auditLog);
      setLoading(false);
    }
    load();
  }, []);

  // ---------------- FILTERING ----------------
  const filteredLogs = useMemo(() => {
    return logs.filter((entry) => {
      const matchesSearch =
        search.trim() === "" ||
        JSON.stringify(entry)
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchesAction =
        actionFilter === "All actions" ||
        entry.action === actionFilter;

      const matchesStatus =
        statusFilter === "All statuses" ||
        entry.status === statusFilter;

      return matchesSearch && matchesAction && matchesStatus;
    });
  }, [logs, search, actionFilter, statusFilter]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600">
        Loading...
      </div>
    );
  }

  // Action Filter Options
  const uniqueActions = ["All actions", ...new Set(logs.map(l => l.action))];

  // Status Filter Options + Add PENDING as requested
  const uniqueStatuses = [
    "All statuses",
    ...new Set(logs.map(l => l.status)),
    "PENDING"
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold mb-1">
        Immutable Audit Log Journal (Layer 2)
      </h1>

      <p className="text-gray-600">
        Complete, searchable record of all administrative actions with mandatory note framework
      </p>

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="flex flex-wrap items-center gap-4 mt-4">

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by appId"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded-lg w-72 text-sm focus:ring-blue-300 focus:border-blue-500"
          />
        </div>

        {/* Action Filter */}
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {uniqueActions.map((a, i) => (
            <option key={i}>{a}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {uniqueStatuses.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>
      </div>

      {/* ---------------- AUDIT LOG LIST ---------------- */}
      <div className="space-y-6 mt-6">
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 text-sm">No results found.</div>
        ) : (
          filteredLogs.map((item, i) => <AuditCard key={i} item={item} />)
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* ------------------------------ AUDIT CARD ------------------------------- */
/* ------------------------------------------------------------------------- */

function AuditCard({ item }) {
  const SuccessIcon = (
    <CheckCircle2 className="text-green-500 inline-block w-5 h-5" />
  );

  const FailedIcon = (
    <XCircle className="text-red-500 inline-block w-5 h-5" />
  );

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {item.status === "SUCCESS" ? SuccessIcon : FailedIcon}

          <span className="font-semibold text-lg">{item.action}</span>

          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              item.status === "SUCCESS"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {item.status}
          </span>
        </div>

        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {item.timestamp}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div className="text-sm text-gray-700">
          <strong>appId:</strong> {item.appId}
        </div>

        <div className="text-sm">
          <strong>Staff:</strong>{" "}
          <span className="text-gray-800">{item.staff}</span>
        </div>

        <div className="text-sm text-gray-600">
          <strong>Execution Time:</strong> {item.executionTime}
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-900 flex gap-2">
          <FileText className="w-4 h-4 mt-0.5" />
          <span>{item.note}</span>
        </div>

        {/* Error Block */}
        {item.errorDetails && (
          <div className="bg-red-50 border border-red-300 p-3 rounded text-sm text-red-700 flex gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <span>{item.errorDetails}</span>
          </div>
        )}

        {/* ---------------- SIDE-BY-SIDE OLD & NEW VALUE ---------------- */}
        {(item.oldValue || item.newValue) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Old Value */}
            {item.oldValue && (
              <div>
                <div className="font-semibold text-sm text-gray-700 mb-1">
                  Old Value
                </div>
                <pre className="bg-gray-50 p-3 rounded border text-xs text-gray-800 overflow-auto">
{JSON.stringify(item.oldValue, null, 2)}
                </pre>
              </div>
            )}

            {/* New Value */}
            {item.newValue && (
              <div>
                <div className="font-semibold text-sm text-gray-700 mb-1">
                  New Value
                </div>
                <pre className="bg-gray-50 p-3 rounded border text-xs text-gray-800 overflow-auto">
{JSON.stringify(item.newValue, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2">
          Transaction: {item.transaction}
        </div>
      </div>
    </div>
  );
}
