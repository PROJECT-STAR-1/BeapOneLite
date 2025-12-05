'use client'
import React, { useState, useMemo } from 'react';
import Layout from "@/component/BeapOneLite/Layout";

import {
  Calendar,
  MapPin,
  Users,
  Download,
  DollarSign,
  Zap,
  FileText,
  CheckCircle,
  Trophy,
  ClipboardList,
} from 'lucide-react';

// --- MOCK DATA ---

// Available filters
const TIME_OPTIONS = [
  { label: 'Today', key: 'today' },
  { label: 'This Week', key: 'this_week' },
  { label: 'This Month', key: 'this_month' },
  { label: 'This Quarter', key: 'this_quarter' },
  { label: 'This Year', key: 'this_year' },
];

const LOCATION_OPTIONS = [
  { label: 'All Locations', key: 'all' },
  { label: 'Lagos Main Branch', key: 'lagos' },
  { label: 'Abuja Office', key: 'abuja' },
  { label: 'Port Harcourt', key: 'ph' },
];

const STAFF_OPTIONS = [
  { label: 'All Staff Members', key: 'all' },
  { label: 'Adebayo Okonkwo', key: 'adebayo' },
  { label: 'Chioma Nwosu', key: 'chioma' },
  { label: 'Ibrahim Hassan', key: 'ibrahim' },
  { label: 'Fatima Abdullahi', key: 'fatima' },
  { label: 'Oluwaseun Ajayi', key: 'oluwaseun' },
];

// Base Staff Data
const STAFF_DETAILS = [
  { id: 'oluwaseun', initials: 'OA', name: 'Oluwaseun Ajayi', role: 'Sales Representative' },
  { id: 'fatima', initials: 'FA', name: 'Fatima Abdullahi', role: 'Business Development' },
  { id: 'adebayo', initials: 'AO', name: 'Adebayo Okonkwo', role: 'Sales Manager' },
  { id: 'chioma', initials: 'CN', name: 'Chioma Nwosu', role: 'Account Executive' },
  { id: 'ibrahim', initials: 'IH', name: 'Ibrahim Hassan', role: 'Sales Representative' },
];

// Mock data structure by time/location/staff to simulate filtering
const MOCK_SALES_DATA = {
  // Default values (All Time/All Location/All Staff)
  default: {
    revenue: 21118000.00,
    quotes_created: 100,
    quotes_approved: 80,
    paid_invoices: 5,
    staff_performance: [
      { id: 'oluwaseun', sales: 7737500.00, quotes: 30, converted: 5, avg_invoice: 1547500.00 },
      { id: 'fatima', sales: 5880500.00, quotes: 25, converted: 0, avg_invoice: 0 },
      { id: 'adebayo', sales: 2500000.00, quotes: 15, converted: 0, avg_invoice: 0 },
      { id: 'chioma', sales: 2500000.00, quotes: 15, converted: 0, avg_invoice: 0 },
      { id: 'ibrahim', sales: 2500000.00, quotes: 15, converted: 0, avg_invoice: 0 },
    ],
  },
  // Data for 'Today' (used by default)
  today: {
    revenue: 1500000.00,
    quotes_created: 10,
    quotes_approved: 8,
    paid_invoices: 1,
    staff_performance: [
      { id: 'oluwaseun', sales: 1500000.00, quotes: 5, converted: 1, avg_invoice: 1500000.00 },
      { id: 'fatima', sales: 0, quotes: 3, converted: 0, avg_invoice: 0 },
      { id: 'adebayo', sales: 0, quotes: 2, converted: 0, avg_invoice: 0 },
    ],
  },
  // Data for 'lagos'
  lagos: {
    revenue: 15000000.00,
    quotes_created: 70,
    quotes_approved: 60,
    paid_invoices: 3,
    staff_performance: [
      { id: 'adebayo', sales: 5000000.00, quotes: 20, converted: 2, avg_invoice: 2500000.00 },
      { id: 'chioma', sales: 5000000.00, quotes: 20, converted: 1, avg_invoice: 5000000.00 },
      { id: 'ibrahim', sales: 5000000.00, quotes: 30, converted: 0, avg_invoice: 0 },
    ],
  },
  // Data for single staff member 'fatima'
  fatima: {
    revenue: 5880500.00,
    quotes_created: 25,
    quotes_approved: 20,
    paid_invoices: 0,
    staff_performance: [
      { id: 'fatima', sales: 5880500.00, quotes: 25, converted: 0, avg_invoice: 0 },
    ],
  },
};

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || amount === 0) return '₦0.00';
  return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const calculateConversionRate = (converted, quotes) => {
  if (quotes === 0) return 0.0;
  return ((converted / quotes) * 100).toFixed(1);
};

// --- SHARED COMPONENTS ---

const DropdownFilter = ({ label, options, selected, setSelected, Icon }) => (
  <div className="relative w-full sm:w-auto flex justify-around">
    <select
      className="appearance-none block w-full bg-white border border-gray-200 text-gray-700 py-2.5 pl-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm text-sm font-medium"
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.key} value={option.key}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon className="w-4 h-4 text-gray-400" />
    </div>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor, valueColor }) => (
  <div className="flex-1 p-5 bg-white rounded-xl shadow-md border border-gray-100 flex justify-between items-center transition duration-300 hover:shadow-lg">
    <div>
      <div className="text-sm font-semibold text-gray-600">{title}</div>
      <p className={`text-3xl font-bold mt-1 ${valueColor || 'text-gray-900'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
    <div className={`w-12 h-12 flex items-center justify-center rounded-full ${iconBg} bg-opacity-70`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const StaffPerformanceReport = () => {
  const [timeFilter, setTimeFilter] = useState(TIME_OPTIONS[0].key);
  const [locationFilter, setLocationFilter] = useState(LOCATION_OPTIONS[0].key);
  const [staffFilter, setStaffFilter] = useState(STAFF_OPTIONS[0].key);

  // Memoize filtered data based on state
  const reportData = useMemo(() => {
    // 1. Determine the primary data set key
    const primaryKey = staffFilter !== 'all' ? staffFilter : (locationFilter !== 'all' ? locationFilter : timeFilter);
    const dataSet = MOCK_SALES_DATA[primaryKey] || MOCK_SALES_DATA.default;

    // 2. Calculate summary metrics
    const totalRevenue = dataSet.revenue;
    const quotesCreated = dataSet.quotes_created;
    const quotesApproved = dataSet.quotes_approved || 0;
    const convertedToInvoices = dataSet.paid_invoices;
    const avgConversionRate = calculateConversionRate(convertedToInvoices, quotesCreated);
    const totalQuotesConverted = convertedToInvoices;

    // 3. Process staff performance (merge with static details and calculate conversion)
    let staffData = dataSet.staff_performance.map(perf => {
      const details = STAFF_DETAILS.find(s => s.id === perf.id);
      const conversionRate = calculateConversionRate(perf.converted, perf.quotes);
      const status = conversionRate > 20 ? 'Excellent' : conversionRate > 0 ? 'Improving' : 'Needs Improvement';
      const progress = parseFloat(conversionRate); // Use conversion rate for progress bar mock

      return {
        ...details,
        ...perf,
        conversionRate,
        status,
        progress,
      };
    });

    // Sort for Top Performers (by sales amount)
    const topPerformers = [...staffData].sort((a, b) => b.sales - a.sales).slice(0, 3);

    return {
      totalRevenue,
      avgConversionRate,
      quotesCreated,
      totalQuotesConverted,
      paidInvoices: convertedToInvoices,
      quotesApproved,
      staffData,
      topPerformers,
    };
  }, [timeFilter, locationFilter, staffFilter]);

  // --- RENDERING COMPONENTS ---

  const renderTopPerformers = (performers) => (
    
    <div className="p-6 mt-6 bg-indigo-900 rounded-xl shadow-xl">
      <div className="flex items-center text-white mb-6">
        <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
        <div>
          <h2 className="text-xl font-bold">Top Performers</h2>
          <p className="text-sm text-indigo-300">Sales champions for {TIME_OPTIONS.find(o => o.key === timeFilter)?.label.toLowerCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performers.map((staff, index) => (
          <div
            key={staff.id}
            className={`p-4 rounded-lg text-white border-2 transition duration-300 ${
              index === 0
                ? 'bg-gradient-to-br from-yellow-600 to-yellow-800 border-yellow-400 shadow-xl scale-[1.02]'
                : index === 1
                ? 'bg-indigo-700 border-indigo-500'
                : 'bg-indigo-700 border-indigo-500'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-2xl font-black">{`#${index + 1}`}</span>
              {index === 0 && <span className="text-yellow-300"><Trophy className="w-5 h-5 fill-current" /></span>}
            </div>
            <h3 className="text-lg font-bold truncate">{staff.name}</h3>
            <p className="text-xs font-medium opacity-80 mb-3">{staff.role}</p>
            <div className="text-sm font-medium">
              <p>Sales: <span className="float-right font-semibold">{formatCurrency(staff.sales)}</span></p>
              <p className="mt-1">Conversion: <span className="float-right font-semibold">{staff.conversionRate}%</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailedStaffPerformance = (staffList) => (
    <div className="p-6 mt-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Detailed Staff Performance</h2>
      <p className="text-sm text-gray-500 mb-6">Comprehensive metrics for all team members</p>

      <div className="space-y-4">
        {staffList.map((staff) => (
          <div key={staff.id} className="p-4 border border-gray-100 rounded-lg transition duration-150 hover:shadow-sm">
            <div className="flex flex-wrap items-center justify-between">
              {/* Staff Info */}
              <div className="flex items-center space-x-4 mb-2 min-w-[200px]">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">
                  {staff.initials}
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">{staff.name}</p>
                  <p className="text-sm text-gray-500">{staff.role}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-2 gap-x-6 flex-grow">
                {[
                  { label: 'Total Sales', value: formatCurrency(staff.sales) },
                  { label: 'Quotes Created', value: staff.quotes },
                  { label: 'Converted', value: staff.converted },
                  { label: 'Conversion Rate', value: `${staff.conversionRate}%`, color: 'text-blue-600' },
                  { label: 'Avg Invoice', value: formatCurrency(staff.avg_invoice) },
                ].map((metric) => (
                  <div key={metric.label}>
                    <p className="text-xs text-gray-500">{metric.label}</p>
                    <p className={`text-sm font-semibold ${metric.color || 'text-gray-700'}`}>{metric.value}</p>
                  </div>
                ))}
              </div>

              {/* Status Badge */}
              <span className={`px-3 py-1 text-xs font-semibold rounded-full min-w-[120px] text-center ml-auto ${
                staff.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                staff.status === 'Improving' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {staff.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Conversion Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${Math.min(staff.progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-right text-gray-500 mt-1">{staff.progress}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConversionFunnel = (data) => (
    <div className="p-6 mt-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Quote-to-Invoice Conversion Funnel</h2>
      <p className="text-sm text-gray-500 mb-6">Overall conversion pipeline analysis</p>

      <div className="flex flex-col items-center">
        {/* Stage 1: Quotes Created */}
        <FunnelStage
          title="Quotes Created"
          value={data.quotesCreated}
          color="bg-purple-100 text-purple-700"
          Icon={FileText}
        />

        <FunnelConnector />

        {/* Stage 2: Quotes Sent/Approved */}
        <FunnelStage
          title="Quotes Sent/Approved"
          value={data.quotesApproved}
          color="bg-blue-100 text-blue-700"
          Icon={ClipboardList}
        />

        <FunnelConnector />

        {/* Stage 3: Converted to Invoices */}
        <FunnelStage
          title="Converted to Invoices"
          value={data.paidInvoices}
          color="bg-green-100 text-green-700"
          Icon={CheckCircle}
        >
          <p className="text-xs text-gray-500 font-medium">{data.avgConversionRate}% conversion rate</p>
        </FunnelStage>
      </div>
    </div>
  );

  const FunnelStage = ({ title, value, color, Icon, children }) => (
    <div className={`w-full max-w-lg p-4 rounded-lg flex justify-between items-center ${color}`}>
      <div>
        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {children}
      </div>
      <Icon className="w-6 h-6" />
    </div>
  );

  const FunnelConnector = () => (
    <div className="relative w-0 h-8 my-1">
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300"></div>
    </div>
  );

  // --- MAIN LAYOUT ---
  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Header and Export */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Performance & Conversion Report</h1>
          <p className="text-gray-500">Sales team effectiveness and quote-to-invoice conversion tracking</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 shadow-sm mt-3 sm:mt-0">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <DropdownFilter
          Icon={Calendar}
          options={TIME_OPTIONS}
          selected={timeFilter}
          setSelected={setTimeFilter}
        />
        <DropdownFilter
          Icon={MapPin}
          options={LOCATION_OPTIONS}
          selected={locationFilter}
          setSelected={setLocationFilter}
        />
        <DropdownFilter
          Icon={Users}
          options={STAFF_OPTIONS}
          selected={staffFilter}
          setSelected={setStaffFilter}
        />
      </div>

      {/* Metric Cards */}
      <div className="flex flex-wrap gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(reportData.totalRevenue)}
          subtitle="From paid invoices"
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-600"
        />
        <MetricCard
          title="Avg Conversion Rate"
          value={`${reportData.avgConversionRate}%`}
          subtitle="Quote → Invoice"
          icon={Zap}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Total Quotes"
          value={reportData.quotesCreated}
          subtitle={`${reportData.totalQuotesConverted} converted`}
          icon={FileText}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Paid Invoices"
          value={reportData.paidInvoices}
          subtitle="Successfully collected"
          icon={CheckCircle}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Top Performers */}
      {reportData.topPerformers.length > 0 && renderTopPerformers(reportData.topPerformers)}

      {/* Detailed Staff Performance */}
      {reportData.staffData.length > 0 && renderDetailedStaffPerformance(reportData.staffData)}

      {/* Conversion Funnel */}
      {renderConversionFunnel(reportData)}
    </div>
    </Layout>
  );
};

export default StaffPerformanceReport;