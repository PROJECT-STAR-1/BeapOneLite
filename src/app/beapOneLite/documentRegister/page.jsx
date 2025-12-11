"use client";
import Layout from "@/component/BeapOneLite/Layout";

import { useEffect, useState, useMemo } from "react";
import {
  ShieldCheck,
  AlertCircle,
  Search,
  Filter,
  Download,
  Ban,
  ChevronDown,
} from "lucide-react";

export default function DocumentRegisterPage() {
  const [data, setData] = useState(null);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/beapOnelite/documentRegister");
      const json = await res.json();
      setData(json);
    }
    load();
  }, []);

  // ------------------ UNIQUE FILTER VALUES ------------------
  const allTypes = useMemo(() => {
    if (!data) return [];
    const types = [...new Set(data.documents.map((d) => d.type))];
    return ["All Types", ...types];
  }, [data]);

  const allStatuses = useMemo(() => {
    if (!data) return [];
    const statuses = [...new Set(data.documents.map((d) => d.status))];
    return ["All Statuses", ...statuses];
  }, [data]);

  // Modules mirror Types
  const allModules = allTypes.map((type) =>
    type === "All Types" ? "All Modules" : type
  );

  // ------------------ FILTER LOGIC ------------------
  const filteredDocs = useMemo(() => {
    if (!data) return [];

    return data.documents.filter((doc) => {
      const matchSearch =
        doc.filename.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.tags.some((t) =>
          t.toLowerCase().includes(searchText.toLowerCase())
        );

      const matchType =
        selectedType === "All Types" || doc.type === selectedType;

      const matchStatus =
        selectedStatus === "All Statuses" || doc.status === selectedStatus;

      const matchModule =
        selectedModule === "All Modules" || doc.type === selectedModule;

      const docDate = new Date(doc.uploadDate);
      const matchFrom = dateFrom ? docDate >= new Date(dateFrom) : true;
      const matchTo = dateTo ? docDate <= new Date(dateTo) : true;

      return (
        matchSearch &&
        matchType &&
        matchStatus &&
        matchModule &&
        matchFrom &&
        matchTo
      );
    });
  }, [
    data,
    searchText,
    selectedType,
    selectedStatus,
    selectedModule,
    dateFrom,
    dateTo,
  ]);

  // ------------------ CLEAR FILTERS ------------------
  function clearFilters() {
    setSelectedType("All Types");
    setSelectedStatus("All Statuses");
    setSelectedModule("All Modules");
    setDateFrom("");
    setDateTo("");
  }

  // ------------------ EXPORT CSV ------------------
  function exportCSV() {
    if (!filteredDocs.length) return;

    const header = [
      "ID",
      "Filename",
      "Description",
      "Type",
      "Status",
      "Upload Date",
      "Renewal Date",
      "Size",
      "Uploaded By",
      "Tags",
      "Access",
      "Compliance",
      "Mandatory",
    ];

    const rows = filteredDocs.map((doc) => [
      doc.id,
      doc.filename,
      doc.description,
      doc.type,
      doc.status,
      doc.uploadDate,
      doc.renewalDate || "",
      doc.size,
      doc.uploadedBy,
      doc.tags.join(", "),
      doc.access,
      doc.compliance ? "Yes" : "No",
      doc.mandatory ? "Yes" : "No",
    ]);

    const csvContent = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "document_register_export.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <Layout>
    <div className="space-y-6">

      {/* ------------------ PAGE TITLE ------------------ */}
      <div>
        <h1 className="text-2xl font-semibold">Document Register</h1>
        <p className="text-gray-500">
          Comprehensive document repository with RBAC enforcement
        </p>
      </div>

      {/* ------------------ SEARCH + FILTER BUTTON + EXPORT ------------------ */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">

          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
            <input
              placeholder="Search by filename, document ID, or description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white shadow-sm rounded-md"
            />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 bg-white shadow-sm rounded-md flex items-center gap-2 ${
              showFilters ? "text-blue-600" : ""
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Export */}
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-white shadow-sm rounded-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        {/* ------------------ FILTER PANEL ------------------ */}
        {showFilters && (
          <div className="w-full bg-white shadow-md rounded-lg p-4 flex flex-wrap items-center gap-4">

            {/* Type */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mt-1 py-2 px-3 rounded-md shadow-sm bg-white"
              >
                {allTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1 py-2 px-3 rounded-md shadow-sm bg-white"
              >
                {allStatuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Module */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Module</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="mt-1 py-2 px-3 rounded-md shadow-sm bg-white"
              >
                {allModules.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1 py-2 px-3 rounded-md shadow-sm bg-white"
              />
            </div>

            {/* Date To */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1 py-2 px-3 rounded-md shadow-sm bg-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-md bg-gray-100 shadow-sm"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ------------------ SUMMARY CARDS ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-6 shadow-sm bg-white">
          <div className="text-gray-600 font-medium">Total Documents</div>
          <div className="text-4xl font-bold mt-2">
            {data.summary.totalDocuments}
          </div>
        </div>

        <div className="rounded-xl p-6 shadow-sm bg-white">
          <div className="text-gray-600 font-medium">Accessible to You</div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="text-4xl font-bold">
              {data.summary.accessibleToYou}
            </div>
            <ShieldCheck className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="rounded-xl p-6 shadow-sm bg-white">
          <div className="text-gray-600 font-medium">
            Compliance Documents
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="text-4xl font-bold">
              {data.summary.complianceDocuments}
            </div>
            <AlertCircle className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* ------------------ DOCUMENT LIST ------------------ */}
      <div className="space-y-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-xl shadow-md bg-white relative"
          >
            {doc.access === "Denied" && (
              <div className="absolute right-6 top-6 flex items-center text-red-500">
                <Ban className="w-6 h-6 mr-1" />
                <span className="font-medium">Access Denied</span>
              </div>
            )}

            {/* ID + Status */}
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="font-semibold">{doc.id}</span>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : doc.status === "Pending Renewal"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {doc.status}
              </span>

              {doc.compliance && (
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                  Compliance
                </span>
              )}

              {doc.mandatory && (
                <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 font-medium">
                  Mandatory
                </span>
              )}
            </div>

            {/* Filename + Description */}
            <div className="text-lg font-semibold">{doc.filename}</div>
            <div className="text-gray-500 text-sm">{doc.description}</div>

            {/* Meta grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 mt-4 text-sm gap-3">
              <div>
                <div className="font-medium text-gray-700">Type</div>
                <div className="text-gray-600">{doc.type}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Size</div>
                <div className="text-gray-600">{doc.size}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Uploaded By</div>
                <div className="text-gray-600">{doc.uploadedBy}</div>
              </div>
            </div>

            {/* Dates */}
            <div className="text-sm mt-2 text-gray-600">
              Upload Date: {doc.uploadDate}
            </div>

            {doc.renewalDate && (
              <div className="mt-2 text-sm text-gray-700">
                Renewal: {doc.renewalDate}
                {doc.expiredDaysAgo && (
                  <span className="ml-3 text-red-500 font-medium">
                    Expired {doc.expiredDaysAgo} days ago
                  </span>
                )}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
    </Layout>
  );
}
