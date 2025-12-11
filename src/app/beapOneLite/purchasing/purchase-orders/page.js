'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  RefreshCcw,
  Clock,
  Plus,
  Eye,
  FileText as FileTextIcon,
  CircleCheckBig,
  AlertTriangle,
  Search
} from 'lucide-react';
import Layout from "@/component/BeapOneLite/Layout";
import NewPurchaseOrderModal from '@/component/BeapOneLite/purchasing/purchaseorder/NewPurchaseOrderModal';

// --- Utility: Format Currency ---
const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);

// --- Components ---
const MetricCard = ({ title, value, subtitle, secondaryText, color, icon: Icon, complianceStatus }) => {
  const textColor = `text-${color}-700`;
  const borderColor = `border-${color}-200`;

  return (
    <div className={`p-4 rounded-xl shadow-sm border ${borderColor} bg-white`}>
      <div className={`flex items-center space-x-2 mb-2 ${textColor}`}>
        <Icon className="w-5 h-5" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mb-2">{subtitle}</p>

      {complianceStatus && (
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded ${
            complianceStatus === 'Non-Compliant'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {complianceStatus}
        </span>
      )}

      {secondaryText && (
        <div
          className={`text-xs mt-2 ${
            color === 'red' ? 'text-red-600' : 'text-orange-600'
          }`}
        >
          {secondaryText}
        </div>
      )}
    </div>
  );
};

const StatusOverviewCard = ({ status }) => (
  <div className="flex-1 p-3 rounded-xl border border-gray-200 bg-white text-center shadow-sm">
    <p className="text-2xl font-extrabold text-indigo-700">{status.count}</p>
    <p className="text-xs font-medium text-gray-600">{status.name}</p>
  </div>
);

const StatusTag = ({ status }) => {
  const colors = {
    Draft: "bg-indigo-100 text-indigo-700",
    Issued: "bg-blue-100 text-blue-700",
    Approved: "bg-green-100 text-green-700",
    Received: "bg-purple-100 text-purple-700",
    Cancelled: "bg-red-100 text-red-700",
    Reviewed: "bg-gray-200 text-gray-800",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors[status] || ''}`}>
      {status}
    </span>
  );
};

// -------------------------------
// MAIN COMPONENT
// -------------------------------
export default function ProcurementDashboard() {
  const [data, setData] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);


  // Fetch API Data
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/beapOnelite/purchaseorders');
      const json = await res.json();
      if (json.success) setData(json.data);
    }
    fetchData();
  }, []);

  // SAFE: Hooks always run regardless of data
  const purchaseOrders = data?.purchaseOrders ?? [];
  const statuses = data?.statuses ?? [];
  const metrics = data?.metrics ?? {};

  const totalPOCount = purchaseOrders.length;

  const filteredPOs = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return purchaseOrders.filter((po) => {
      const matchStatus = statusFilter === "All Statuses" || po.status === statusFilter;
      const matchDept = departmentFilter === "All Departments" || po.department === departmentFilter;
      const matchSearch =
        !searchTerm ||
        po.poNumber.toLowerCase().includes(lower) ||
        po.vendor.toLowerCase().includes(lower) ||
        po.department.toLowerCase().includes(lower);

      return matchStatus && matchDept && matchSearch;
    });
  }, [purchaseOrders, statusFilter, departmentFilter, searchTerm]);

  const filteredPOValue = useMemo(
    () => filteredPOs.reduce((sum, po) => sum + po.totalAmount, 0),
    [filteredPOs]
  );

  const renderActions = (po) => {
    const items = [
      <Eye key="view" className="w-4 h-4 text-gray-500 hover:text-indigo-600 cursor-pointer" />
    ];

    if (po.status === "Issued" || po.status === "Approved") {
      items.push(
        <FileTextIcon key="bill" className="w-4 h-4 ml-2 text-gray-500 hover:text-indigo-600 cursor-pointer" />
      );
    } else if (po.status === "Draft") {
      items.push(
        <CircleCheckBig key="submit" className="w-4 h-4 ml-2 text-gray-500 hover:text-indigo-600 cursor-pointer" />
      );
    }
    return <div className="flex">{items}</div>;
  };

  // Loading screen (after hooks)
  if (!data) {
    return (
      <Layout>
        <div className="p-6">Loading Purchase Orders...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-1 min-h-screen bg-gray-50 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procurement Management</h1>
            <p className="text-gray-500">
              Purchase Order creation, approval, and tracking with integrated vendor bill conversion
            </p>
          </div>
          <button
  className="flex items-center space-x-2 px-4 py-2 bg-indigo-900 text-white rounded-lg"
  onClick={() => setOpenModal(true)}
>

            <Plus className="w-5 h-5" />
            <span className="ml-2 font-semibold">New Purchase Order</span>
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Purchase Orders"
            value={metrics.totalPOs}
            subtitle={formatCurrency(metrics.totalPOValue) + " total value"}
            icon={FileText}
            color="blue"
          />

          <MetricCard
            title="Sign-Off Compliance"
            value={metrics.signOffCompliance + "%"}
            subtitle={`${metrics.signedPOs} issued POs signed`}
            icon={CheckCircle2}
            color="green"
            complianceStatus={metrics.signOffCompliance < 80 ? 'Non-Compliant' : 'Compliant'}
          />

          <MetricCard
            title="PO-to-Bill Match Rate"
            value={metrics.poToBillMatchRate + "%"}
            subtitle="Vendor fulfillment accuracy"
            icon={FileText}
            color="purple"
          />

          <MetricCard
            title="Avg. Approval Time"
            value={metrics.avgApprovalTimeHours + "h"}
            subtitle="Time from Draft to Issued"
            icon={Clock}
            color="orange"
            secondaryText={
              metrics.avgApprovalTimeHours > metrics.avgApprovalTimeTarget
                ? `Above ${metrics.avgApprovalTimeTarget}h Target`
                : null
            }
          />
        </div>

        {/* Status Overview */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">PO Status Overview</h2>
          <div className="flex space-x-4">
            {statuses.map((s) => (
              <StatusOverviewCard key={s.name} status={s} />
            ))}
          </div>
        </div>

        {/* Purchase Orders Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Purchase Order Register</h2>
            <span className="text-sm text-gray-700">{filteredPOs.length} of {totalPOCount} POs</span>
          </div>

          {/* Filters */}
          <div className="flex space-x-3 items-center mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search PO number, vendor, department..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status */}
            <select
              className="p-2 border rounded-lg text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {["All Statuses", ...statuses.map(s => s.name)].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* Department */}
            <select
              className="p-2 border rounded-lg text-sm"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {["All Departments", "IT", "Admin", "Operations", "Procurement"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="w-full overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'PO Number', 'Vendor', 'Status', 'Department', 'Items',
                    'Total Amount', 'Created Date', 'Actions'
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPOs.map((po) => (
                  <tr key={po.poNumber} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {po.alert && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <span>{po.poNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{po.vendor}</td>
                    <td className="px-4 py-4"><StatusTag status={po.status} /></td>
                    <td className="px-4 py-4 text-sm text-gray-600">{po.department}</td>
                    <td className="px-4 py-4 text-center">{po.items}</td>
                    <td className="px-4 py-4 font-medium">{formatCurrency(po.totalAmount)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{po.createdDate}</td>
                    <td className="px-4 py-4">{renderActions(po)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between text-sm text-gray-700">
            <span>Showing {filteredPOs.length} purchase orders</span>
            <span>Total Value: <strong>{formatCurrency(filteredPOValue)}</strong></span>
          </div>
        </div>
      </div>

      <NewPurchaseOrderModal
  open={openModal}
  onClose={() => setOpenModal(false)}
/>

    </Layout>

    
  );

  
}
