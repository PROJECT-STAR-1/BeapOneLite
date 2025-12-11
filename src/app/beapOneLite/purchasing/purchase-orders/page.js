// page.js
'use client';

import { useState, useMemo } from 'react';
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


// --- MOCK DATA ---
const MOCK_METRICS = {
  totalPOs: 5,
  totalPOValue: 7980000, 
  signOffCompliance: 75.0,
  signedPOs: 4,
  issuedPOs: 4, 
  poToBillMatchRate: 0.0,
  avgApprovalTimeHours: 51.9,
  avgApprovalTimeTarget: 4,
};

const M_STATUSES = [
  { name: 'Draft', count: 1, color: 'text-indigo-700 bg-indigo-50', icon: 'FileText' },
  { name: 'Issued', count: 1, color: 'text-blue-700 bg-blue-50', icon: 'FileText' },
  { name: 'Reviewed', count: 0, color: 'text-gray-700 bg-gray-50', icon: 'CheckCircle2' },
  { name: 'Approved', count: 1, color: 'text-green-700 bg-green-50', icon: 'CheckCircle2' },
  { name: 'Received', count: 1, color: 'text-purple-700 bg-purple-50', icon: 'RefreshCcw' },
  { name: 'Cancelled', count: 1, color: 'text-red-700 bg-red-50', icon: 'RefreshCcw' },
];

const PO_REGISTER_DATA = [
  { poNumber: 'NGN01-2025-000123', vendor: 'TechSupply Nigeria Ltd', status: 'Issued', department: 'IT', items: 2, totalAmount: 2580000, createdDate: '19 Nov 2025', alert: false },
  { poNumber: 'NGN01-2025-000124', vendor: 'Office Mart', status: 'Approved', department: 'Admin', items: 1, totalAmount: 450000, createdDate: '20 Nov 2025', alert: false },
  { poNumber: 'NGN01-2025-000125', vendor: 'BuildMart Ltd', status: 'Draft', department: 'Operations', items: 1, totalAmount: 1200000, createdDate: '22 Nov 2025', alert: false },
  { poNumber: 'NGN01-2025-000126', vendor: 'Enterprise Solutions', status: 'Received', department: 'IT', items: 1, totalAmount: 3750000, createdDate: '10 Nov 2025', alert: true }, 
  { poNumber: 'NGN01-2025-000127', vendor: 'ABC Trading Co.', status: 'Cancelled', department: 'Procurement', items: 1, totalAmount: 890000, createdDate: '18 Nov 2025', alert: false },
];

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

// --- REUSABLE COMPONENTS ---

/**
 * MetricCard Component (Same as before)
 */
const MetricCard = ({ title, value, subtitle, secondaryText, color, icon: Icon, complianceStatus = null }) => {
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
            complianceStatus === 'Non-Compliant' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {complianceStatus}
        </span>
      )}
      
      {secondaryText && (
        <div className={`text-xs mt-2 ${color === 'red' ? 'text-red-600' : 'text-orange-600'}`}>
          {secondaryText}
        </div>
      )}
    </div>
  );
};

/**
 * PO Status Overview Card (Same as before)
 */
const StatusOverviewCard = ({ status }) => {
  return (
    <div className="flex-1 p-3 rounded-xl border border-gray-200 bg-white text-center shadow-sm">
      <p className="text-2xl font-extrabold text-indigo-700">{status.count}</p>
      <p className={`text-xs font-medium ${status.color.split(' ')[0]}`}>{status.name}</p>
    </div>
  );
};


/**
 * Status Tag Component (Same as before)
 */
const StatusTag = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-700';
  switch (status) {
    case 'Draft': colorClass = 'bg-indigo-100 text-indigo-700'; break;
    case 'Issued': colorClass = 'bg-blue-100 text-blue-700'; break;
    case 'Approved': colorClass = 'bg-green-100 text-green-700'; break;
    case 'Received': colorClass = 'bg-purple-100 text-purple-700'; break;
    case 'Cancelled': colorClass = 'bg-red-100 text-red-700'; break;
    case 'Reviewed': colorClass = 'bg-gray-200 text-gray-800'; break;
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};


// ------------------------------------
// --- MAIN PROCUREMENT DASHBOARD ---
// ------------------------------------

export default function ProcurementDashboard() {
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [searchTerm, setSearchTerm] = useState(''); // New state for search input

  const availableStatuses = ['All Statuses', 'Draft', 'Issued', 'Reviewed', 'Approved', 'Received', 'Cancelled'];
  const availableDepartments = ['All Departments', 'IT', 'Admin', 'Operations', 'Procurement'];
  const totalPOCount = PO_REGISTER_DATA.length;

  const filteredPOs = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();

    return PO_REGISTER_DATA.filter(po => {
      // 1. Filter by Status and Department
      const statusMatch = statusFilter === 'All Statuses' || po.status === statusFilter;
      const deptMatch = departmentFilter === 'All Departments' || po.department === departmentFilter;

      // 2. Filter by Search Term
      const searchMatch = 
        !searchTerm || // If no search term, it matches
        po.poNumber.toLowerCase().includes(lowerCaseSearch) ||
        po.vendor.toLowerCase().includes(lowerCaseSearch) ||
        po.department.toLowerCase().includes(lowerCaseSearch);

      return statusMatch && deptMatch && searchMatch;
    });
  }, [statusFilter, departmentFilter, searchTerm]);

  const filteredPOValue = useMemo(() => {
    return filteredPOs.reduce((sum, po) => sum + po.totalAmount, 0);
  }, [filteredPOs]);


  // --- TABLE ACTIONS LOGIC ---
  const renderActions = (po) => {
    const icons = [];

    // 1. Eye icon (always present for viewing details)
    icons.push(<Eye key="view" className="w-4 h-4 text-gray-500 hover:text-indigo-600 cursor-pointer" title="View PO" />);
    
    // 2. Conditional Icons
    if (po.status === 'Issued' || po.status === 'Approved') {
      // Issued and Approved get FileTextIcon (for vendor bill conversion/action)
      icons.push(<FileTextIcon key="bill" className="w-4 h-4 text-gray-500 hover:text-indigo-600 cursor-pointer ml-2" title="Create Bill" />);
    } else if (po.status === 'Draft') {
      // Draft gets CircleCheckBig (for submission/approval)
      icons.push(<CircleCheckBig key="submit" className="w-4 h-4 text-gray-500 hover:text-indigo-600 cursor-pointer ml-2" title="Submit PO" />);
    }
    
    return <div className="flex items-center">{icons}</div>;
  };

  return (
    <Layout>
    <div className="p-1 min-h-screen bg-gray-50 w-full"> 
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procurement Management</h1>
          <p className="text-gray-500">Purchase Order creation, approval, and tracking with integrated vendor bill conversion</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors">
          <Plus className="w-5 h-5" />
          <span className="font-semibold">New Purchase Order</span>
        </button>
      </div>

      {/* --- METRICS CARDS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Purchase Orders"
          value={MOCK_METRICS.totalPOs}
          subtitle={formatCurrency(MOCK_METRICS.totalPOValue) + " total value"}
          icon={FileText}
          color="blue"
        />

        <MetricCard
          title="Sign-Off Compliance"
          value={MOCK_METRICS.signOffCompliance + "%"}
          subtitle={`${MOCK_METRICS.signedPOs} issued POs signed`}
          icon={CheckCircle2}
          color="green"
          complianceStatus={MOCK_METRICS.signOffCompliance < 80 ? 'Non-Compliant' : 'Compliant'}
        />

        <MetricCard
          title="PO-to-Bill Match Rate"
          value={MOCK_METRICS.poToBillMatchRate + "%"}
          subtitle="Vendor fulfillment accuracy"
          icon={FileText}
          color="purple"
        />

        <MetricCard
          title="Avg. Approval Time"
          value={MOCK_METRICS.avgApprovalTimeHours + "h"}
          subtitle="Time from Draft to Issued"
          icon={Clock}
          color="orange"
          secondaryText={MOCK_METRICS.avgApprovalTimeHours > MOCK_METRICS.avgApprovalTimeTarget ? `Above ${MOCK_METRICS.avgApprovalTimeTarget}h Target` : null}
        />
      </div>

      <hr className="my-8 border-gray-200" />

      {/* --- PO STATUS OVERVIEW --- */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 flex items-center">
          PO Status Overview
        </h2>
        <div className="flex space-x-4">
          {M_STATUSES.map(status => (
            <StatusOverviewCard key={status.name} status={status} />
          ))}
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* --- PURCHASE ORDER REGISTER --- */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Purchase Order Register</h2>
          <span className="text-sm font-medium text-gray-700">
             {filteredPOs.length} of {totalPOCount} POs
          </span>
        </div>
        
        {/* Filter Bar (Updated to include Search Input) */}
        <div className="flex space-x-3 items-center mb-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search PO number, vendor, department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              {availableStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Department Dropdown */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
        </div>

        <div className=" w-full overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                {['PO Number', 'Vendor', 'Status', 'Department', 'Items', 'Total Amount', 'Created Date', 'Actions'].map(header => (
                  <th
                    key={header}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPOs.map((po) => (
                <tr key={po.poNumber} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                        {po.alert && <AlertTriangle className="w-4 h-4 text-red-500" title="Alert" />}
                        <span className="truncate">{po.poNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[150px]">{po.vendor}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusTag status={po.status} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{po.department}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{po.items}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(po.totalAmount)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{po.createdDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {renderActions(po)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-700">
          <span>Showing {filteredPOs.length} purchase orders</span>
          <span>Total Value: <span className="font-bold text-gray-900">{formatCurrency(filteredPOValue)}</span></span>
        </div>
      </div>
    </div>
    </Layout>
  );
}