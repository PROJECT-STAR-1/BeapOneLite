'use client'
import { useState } from 'react';
import { CheckCircle, FileText, Zap, File, Calendar, ChevronDown } from 'lucide-react'; 
import Layout from "@/component/BeapOneLite/Layout";
import PLStatement from '@/component/BeapOneLite/FinancialReports/PLStatement';
import BalanceSheet from '@/component/BeapOneLite/FinancialReports/BalanceSheet';
import CashFlowStatement from '@/component/BeapOneLite/FinancialReports/CashFlowStatement';
import TaxPreviewReport from '@/component/BeapOneLite/FinancialReports/TaxPreviewReport';


export default function FinancialReporting() {
  const [period, setPeriod] = useState('Last Month');
  const [location, setLocation] = useState('All Locations');
  const [startDate, setStartDate] = useState('2025-03-11'); // Formatted for input type="date"
  const [endDate, setEndDate] = useState('2025-03-12'); // Formatted for input type="date"
  const [activeTab, setActiveTab] = useState('P&L Statement');

  // Structured data for metrics
  const metrics = [
    {
      title: 'Success Rate',
      value: '100.00%',
      target: '>= 99.9% (RGSR)',
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    {
      title: 'Data Consistency',
      value: '100%',
      target: '100% (DCCPR)',
      icon: FileText,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Avg Latency',
      value: '7.5s',
      target: '<= 10s (RGL)',
      icon: Zap,
      iconColor: 'text-orange-500',
    },
    {
      title: 'Total Reports',
      value: '3',
      desc: 'Generated reports',
      icon: File,
      iconColor: 'text-purple-500',
    },
  ];

  // Dropdown options structured as arrays
  const periodOptions = [
    'Today',
    'Yesterday',
    'Last 7 days',
    'Last month',
    'Last quarter',
    'Last year',
  ];

  const locationOptions = [
    'All locations',
    'Lagos HQ',
    'Abuja branch',
    'Port Harcourt office',
  ];

  // Tab options
  const tabs = ['P&L Statement', 'Balance Sheet', 'Cash Flow', 'Tax Preview'];

  // Render content based on active tab (using switch for clarity)
  const renderTabContent = () => {
    switch (activeTab) {
      case 'P&L Statement':
        return <PLStatement/>;
      case 'Balance Sheet':
        return <BalanceSheet/>;
      case 'Cash Flow':
        return <CashFlowStatement/>;
      case 'Tax Preview':
        return <TaxPreviewReport/>;
      default:
        return null;
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 p-3 rounded-lg">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Financial Reporting</h1>
        <p className="text-gray-600">Comprehensive financial statements and performance metrics</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
            <div className="flex items-center mb-2">
              <metric.icon className={`w-5 h-5 mr-2 ${metric.iconColor}`} />
              <h2 className="text-sm font-semibold text-gray-700">{metric.title}</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.target || metric.desc}</p>
          </div>
        ))}
      </div>

      {/* Report Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <ChevronDown className="w-4 h-4 mr-2 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">Report Filters</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Period Dropdown */}
          <div className="relative flex-1">
            <label className="block text-xs text-gray-500 mb-1">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none"
            >
              {periodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-8 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Start Date */}
          <div className="relative flex-1">
            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <Calendar className="absolute right-3 top-8 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* End Date */}
          <div className="relative flex-1">
            <label className="block text-xs text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <Calendar className="absolute right-3 top-8 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Location Dropdown */}
          <div className="relative flex-1">
            <label className="block text-xs text-gray-500 mb-1">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white appearance-none"
            >
              {locationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-8 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
  {(() => {
    switch (period) {
      case 'Today': return 'Showing data for today';
      case 'Yesterday': return 'Showing data for yesterday';
      case 'Last 7 days': return 'Showing data for the last 7 days';
      case 'Last month': return 'Showing monthly data';
      case 'Last quarter': return 'Showing quarterly data';
      case 'Last year': return 'Showing yearly data';
      default: return 'Showing selected period data';
    }
  })()}
</p>
      </div>

      {/* Tabs */}
      <div className=" shadow-md overflow-hidden">
        <div className="flex border border-gray-200 rounded-full ">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'bg-white text-gray-900 border rounded-full border-blue-500'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div>{renderTabContent()}</div>
      </div>
    </div>
    </Layout>
  );
}