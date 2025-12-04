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

export default function AuditLog() {
  /* ============================================================
     FILTER OPTIONS
  ============================================================ */
  const actions = [
    "All Actions",
    "Manual Match",
    "One-Click Match",
    "Bulk Match",
    "Unmatch",
    "Status Override",
    "Delete",
  ];

  const users = [
    "All Users",
    "Adebayo Okonkwo",
    "Chinwe Adeyemi",
    "Olumide Johnson",
  ];

  const statuses = ["All Status", "Success", "Failed", "Pending"];

  /* ============================================================
     FULL DATASET EXACTLY AS PROVIDED
  ============================================================ */
  const fullData = [
    {
      action: "Manual Match",
      status: "Success",
      id: "TXN-2025-1147",
      description:
        "Manually matched GTBank deposit ₦50,000 with Invoice INV-2025-0324",
      justification:
        "Customer paid via different account than usual",
      user: "Adebayo Okonkwo",
      timestamp: "11/27/2025, 2:35:22 PM",
      score: "95.5%",
      metadata: {
        bankAmount: "₦50,000",
        systemAmount: "₦50,000",
      },
    },
    {
      action: "One-Click Match",
      status: "Success",
      id: "TXN-2025-1146",
      description:
        "Auto-matched M-Pesa payment ₦125,000 with Invoice INV-2025-0323",
      justification: null,
      user: "Adebayo Okonkwo",
      timestamp: "11/27/2025, 1:20:15 PM",
      score: "98.2%",
      metadata: {
        bankAmount: "₦125,000",
        systemAmount: "₦125,000",
      },
    },
    {
      action: "Status Override",
      status: "Success",
      id: "TXN-2025-1145",
      description:
        "Overrode reconciliation status from Pending to Reconciled",
      justification:
        "Bank confirmed transaction was processed but delayed in system",
      user: "Chinwe Adeyemi",
      timestamp: "11/27/2025, 11:45:30 AM",
      score: null,
      metadata: {
        previous: "Pending",
        newStatus: "Reconciled",
      },
    },
    {
      action: "Unmatch",
      status: "Success",
      id: "TXN-2025-1144",
      description:
        "Unmatched incorrect association between bank transfer and invoice",
      justification:
        "Wrong customer identified - amounts matched but different client",
      user: "Adebayo Okonkwo",
      timestamp: "11/27/2025, 10:15:42 AM",
      score: "88.0%",
      metadata: {
        bankAmount: "₦75,000",
        systemAmount: "₦75,000",
      },
    },
    {
      action: "Bulk Match",
      status: "Success",
      id: "BULK-2025-025",
      description:
        "Processed bulk matching for 23 transactions from Access Bank",
      justification: null,
      user: "Olumide Johnson",
      timestamp: "11/27/2025, 9:30:18 AM",
      score: "92.3%",
      metadata: {},
    },
    {
      action: "Manual Match",
      status: "Success",
      id: "TXN-2025-1143",
      description:
        "Manually matched Zenith Bank credit ₦200,000 with Sales Order SO-2025-089",
      justification:
        "Partial payment - customer paid 50% upfront",
      user: "Chinwe Adeyemi",
      timestamp: "11/26/2025, 4:55:12 PM",
      score: "85.0%",
      metadata: {
        bankAmount: "₦200,000",
        systemAmount: "₦400,000",
      },
    },
    {
      action: "Delete",
      status: "Success",
      id: "TXN-2025-1142",
      description:
        "Deleted duplicate transaction entry",
      justification:
        "Same transaction imported twice from different statements",
      user: "Adebayo Okonkwo",
      timestamp: "11/26/2025, 3:20:45 PM",
      score: null,
      metadata: {},
    },
    {
      action: "Manual Match",
      status: "Failed",
      id: "TXN-2025-1141",
      description:
        "Failed to match transaction - insufficient data",
      justification: null,
      user: "Olumide Johnson",
      timestamp: "11/26/2025, 2:10:33 PM",
      score: "45.0%",
      metadata: {
        bankAmount: "₦35,000",
      },
    },
  ];

  /* ============================================================
     FILTER STATE
  ============================================================ */
  const [searchValue, setSearchValue] = useState("");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [userFilter, setUserFilter] = useState("All Users");
  const [statusFilter, setStatusFilter] = useState("All Status");

  /* ============================================================
     FILTERING LOGIC
  ============================================================ */
  const filteredData = useMemo(() => {
    return fullData.filter((row) => {
      const matchesSearch =
        row.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.id.toLowerCase().includes(searchValue.toLowerCase());

      const matchesAction =
        actionFilter === "All Actions" || row.action === actionFilter;

      const matchesUser =
        userFilter === "All Users" || row.user === userFilter;

      const matchesStatus =
        statusFilter === "All Status" || row.status === statusFilter;

      return matchesSearch && matchesAction && matchesUser && matchesStatus;
    });
  }, [searchValue, actionFilter, userFilter, statusFilter]);

  /* ============================================================
     EXPORT CSV
  ============================================================ */
  const exportCSV = () => {
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

  /* ============================================================
     ICON MAP (Matches Screenshot Exactly)
  ============================================================ */
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

  /* ============================================================
     MAIN RENDER
  ============================================================ */
  return (
    <div className="p-6 space-y-6">
      {/* TOP SUMMARY BOXES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryBox title="Total Actions" value={fullData.length} />
        <SummaryBox title="Success Rate" value="87.5%" green />
        <SummaryBox title="Active Users" value="3" />
      </div>

      {/* FILTERS */}
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

      {/* ACTIVITY LIST */}
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

/* ============================================================
   SUB-COMPONENTS
============================================================ */

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
          {actionIcons[row.action]} {row.action}
        </div>

        <div className="flex items-center gap-1 bg-black text-white text-xs px-2 py-1 rounded-md">
          {statusIcons[row.status]} {row.status}
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
