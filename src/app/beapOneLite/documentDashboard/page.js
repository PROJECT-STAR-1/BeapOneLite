"use client";
import Layout from "@/component/BeapOneLite/Layout";

import { useEffect, useState } from "react";
import {
  Shield,
  ClipboardCheck,
  FileCheck,
  Timer,
  Ban,
  FileText,
} from "lucide-react";

import { Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function DocumentDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/beapOnelite/documentDashboard");
      const json = await res.json();
      setData(json);
    };
    loadData();
  }, []);

  if (!data) return <div className="p-10 text-gray-700">Loading Dashboard…</div>;

  const pieData = {
    labels: ["Active", "Pending", "Expired"],
    datasets: [
      {
        data: [
          data.complianceDocumentStatus.active,
          data.complianceDocumentStatus.pending,
          data.complianceDocumentStatus.expired,
        ],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: data.documentTypeDistribution.categories.map((c) => c.name),
    datasets: [
      {
        label: "",
        data: data.documentTypeDistribution.categories.map((c) => c.count),
        backgroundColor: "#1D1B4F",
        borderWidth: 0,
      },
    ],
  };

  return (
    <Layout>
    <div className="space-y-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
          <Shield className="w-7 h-7" />
          Document & Compliance Management
        </div>
        <p className="text-gray-500 text-sm">
          Secure repository with RBAC enforcement and compliance tracking
        </p>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compliance Adherence Score */}
        <div className="rounded-xl shadow-md bg-white p-6">
          <h2 className="font-semibold text-gray-800">Compliance Adherence Score</h2>

          <p className="text-4xl font-bold mt-4">{data.complianceAdherenceScore.score}</p>
          <p className="text-gray-600 mt-1">{data.complianceAdherenceScore.statusText}</p>

          <div className="mt-4 text-sm space-y-1">
            <p>MAR: {data.complianceAdherenceScore.mar}</p>
            <p>Expired Docs: {data.complianceAdherenceScore.expiredDocs}</p>
          </div>
        </div>

        {/* Document Audit Integrity */}
        <div className="rounded-xl shadow-md bg-green-50 p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardCheck /> Document Audit Integrity
          </h2>

          <p className="text-4xl text-green-600 font-bold mt-4">
            {data.documentAuditIntegrity.status}
          </p>

          <p className="text-gray-700 mt-1">{data.documentAuditIntegrity.description}</p>

          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            {data.documentAuditIntegrity.detail}
          </p>
        </div>

        {/* Mandatory Attachment Rate */}
        <div className="rounded-xl shadow-md bg-white p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <FileCheck /> Mandatory Attachment Rate
          </h2>

          <p className="text-4xl font-bold mt-4">{data.mandatoryAttachmentRate.rate}</p>
          <p className="text-gray-600 mt-1">{data.mandatoryAttachmentRate.note}</p>

          <div className="w-full mt-4 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-indigo-900 rounded-full"
              style={{ width: data.mandatoryAttachmentRate.rate }}
            ></div>
          </div>

          <p className="text-sm mt-3 text-gray-600">Target: {data.mandatoryAttachmentRate.target}</p>
        </div>
      </div>

      {/* MID GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avg Renewal Lead Time */}
        <div className="rounded-xl shadow-md bg-white p-6">
          <h2 className="font-semibold flex items-center gap-2 text-gray-800">
            <Timer /> Avg Renewal Lead Time
          </h2>

          <p className="text-4xl font-bold mt-4">{data.avgRenewalLeadTime.days} days</p>

          <p className="text-sm text-gray-600 mt-3">
            {data.avgRenewalLeadTime.targetText}
          </p>
        </div>

        {/* RBAC Denial Ratio */}
        <div className="rounded-xl shadow-md bg-white p-6">
          <h2 className="font-semibold flex items-center gap-2 text-gray-800">
            <Ban /> RBAC Denial Ratio
          </h2>

          <p className="text-4xl font-bold mt-4">{data.rbacDenialRatio.ratio}</p>

          <div className="text-sm mt-3 space-y-1">
            <p>Access Denied: {data.rbacDenialRatio.accessDenied}</p>
            <p>Successful Access: {data.rbacDenialRatio.successfulAccess}</p>
          </div>
        </div>

        {/* Note Entry Rate */}
        <div className="rounded-xl shadow-md bg-white p-6">
          <h2 className="font-semibold flex items-center gap-2 text-gray-800">
            <FileText /> Note Entry Rate
          </h2>

          <p className="text-4xl font-bold mt-4">{data.noteEntryRate.ratePerDay} / day</p>
          <p className="text-sm text-gray-600 mt-3">{data.noteEntryRate.note}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="rounded-xl shadow-md bg-white p-6">
          <h2 className="font-semibold text-gray-800">Compliance Document Status</h2>

          <div className="h-72 mt-4">
            <Pie data={pieData} />
          </div>

          <div className="flex justify-around mt-6 text-gray-700 text-sm">
            <div>Active: {data.complianceDocumentStatus.active}</div>
            <div>Pending: {data.complianceDocumentStatus.pending}</div>
            <div>Expired: {data.complianceDocumentStatus.expired}</div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl shadow-md bg-white p-6">
          <h2 className="font-semibold text-gray-800">
            Document Type Distribution
          </h2>

          <div className="h-72 mt-4">
            <Bar
              data={barData}
              options={{
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* REPOSITORY SUMMARY */}
      <div className="rounded-xl shadow-md bg-white p-6">
        <h2 className="font-semibold text-gray-800">Repository Summary</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 text-center mt-6">
          <div>
            <p className="text-4xl font-bold">{data.repositorySummary.totalDocuments}</p>
            <p className="text-gray-600">Total Documents</p>
          </div>

          <div>
            <p className="text-4xl font-bold">{data.repositorySummary.complianceDocs}</p>
            <p className="text-gray-600">Compliance Docs</p>
          </div>

          <div>
            <p className="text-4xl font-bold">{data.repositorySummary.mandatoryAttachments}</p>
            <p className="text-gray-600">Mandatory Attachments</p>
          </div>

          <div>
            <p className="text-4xl font-bold">{data.repositorySummary.totalStorage}</p>
            <p className="text-gray-600">Total Storage</p>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}
