'use client'

import { useEffect, useState } from 'react';
import { CheckCircle, FileText, Zap, File, Calendar, ChevronDown } from 'lucide-react';

import Layout from "@/component/BeapOneLite/Layout";
import PLStatement from '@/component/BeapOneLite/FinancialReports/PLStatement';
import BalanceSheet from '@/component/BeapOneLite/FinancialReports/BalanceSheet';
import CashFlowStatement from '@/component/BeapOneLite/FinancialReports/CashFlowStatement';
import TaxPreviewReport from '@/component/BeapOneLite/FinancialReports/TaxPreviewReport';

export default function FinancialReporting() {
  // Fetched data states
  const [metrics, setMetrics] = useState([]);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [allReports, setAllReports] = useState(null);
  const [explanations, setExplanations] = useState(null);

  // UI States
  const [period, setPeriod] = useState('Last month');
  const [location, setLocation] = useState('Lagos HQ');
  const [startDate, setStartDate] = useState('2025-03-11');
  const [endDate, setEndDate] = useState('2025-03-12');
  const [activeTab, setActiveTab] = useState('P&L Statement');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from API
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/beapOnelite/financialreports');
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();

        setMetrics(json.metrics);
        setPeriodOptions(json.periodOptions);
        setLocationOptions(json.locationOptions);
        setTabs(json.tabs);
        setAllReports(json.reports); 
        setExplanations(json.explanations); 

        // Set initial defaults
        if (!period) setPeriod(json.periodOptions[3] || json.periodOptions[0]); 
        if (!location) setLocation(json.locationOptions[1] || json.locationOptions[0]); 
        
      } catch (error) {
        console.error("Failed to fetch financial data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // --- Aggregation Logic (Unchanged) ---

  const getAggregatedReportData = (periodKey) => {
    if (!allReports) return null;

    let totalRevenue = 0;
    let totalCogs = 0;
    let totalOperatingExpenses = 0;

    // Iterate over every location in allReports
    for (const locationKey in allReports) {
      const locationReports = allReports[locationKey];
      const report = locationReports[periodKey];

      if (report) {
        totalRevenue += report.totalRevenue;
        totalCogs += report.cogs;
        totalOperatingExpenses += report.operatingExpenses;
      }
    }
    
    if (totalRevenue === 0 && totalCogs === 0 && totalOperatingExpenses === 0) {
        return null; 
    }

    return {
      period: `${period} – All Locations`, 
      totalRevenue: totalRevenue,
      cogs: totalCogs,
      operatingExpenses: totalOperatingExpenses,
    };
  };


  // --- Report Data Retrieval Logic (Corrected) ---
  const getReportData = (selectedPeriod, selectedLocation) => {
    if (!allReports || !selectedPeriod || !selectedLocation || !explanations) {
      return null;
    }
    
    // **CORRECTED SANITIZATION LOGIC**
    // 1. Convert to lowercase.
    // 2. Trim whitespace.
    // The JSON keys are "lagos hq", "abuja branch", "port harcourt office"
    const locationKey = selectedLocation.toLowerCase().trim();
    const periodKey = selectedPeriod.toLowerCase();
    
    // 1. Handle "All locations" aggregation
    if (locationKey === 'all locations') {
        return getAggregatedReportData(periodKey);
    }
    
    // 2. Handle specific location lookup
    // This will correctly match "lagos hq" or "abuja branch" etc.
    const locationReports = allReports[locationKey]; 

    if (locationReports) {
      return locationReports[periodKey] || null;
    }
    
    // Fallback in case of a mismatch or key not found
    return null;
  };

  const currentReportData = getReportData(period, location);

  // Icons mapped by index
  const metricIcons = [
    { icon: CheckCircle, color: "text-green-500" },
    { icon: FileText,   color: "text-blue-500" },
    { icon: Zap,        color: "text-orange-500" },
    { icon: File,       color: "text-purple-500" }
  ];

  // Tab content handler
  const renderTabContent = () => {
    switch (activeTab) {
      case 'P&L Statement': 
        return (
          <PLStatement 
            reportData={currentReportData} 
            explanations={explanations} 
          />
        );
      case 'Balance Sheet': return <BalanceSheet />;
      case 'Cash Flow': return <CashFlowStatement />;
      case 'Tax Preview': return <TaxPreviewReport />;
      default: return null;
    }
  };

  // Map period to description
  const periodDescription = (() => {
    switch (period) {
      case 'Today': return 'Showing data for today';
      case 'Yesterday': return 'Showing data for yesterday';
      case 'Last 7 days': return 'Showing data for the last 7 days';
      case 'Last month': return 'Showing monthly data';
      case 'Last quarter': return 'Showing quarterly data';
      case 'Last year': return 'Showing yearly data';
      default: return 'Select a period to view data';
    }
  })();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen p-6 flex justify-center items-center text-gray-500">Loading Financial Reports...</div>
      </Layout>
    );
  }


  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-3 rounded-lg">

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Financial Reporting</h1>
          <p className="text-gray-600">Comprehensive financial statements and performance metrics</p>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metricIcons[index]?.icon;
            const color = metricIcons[index]?.color;

            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
                <div className="flex items-center mb-2">
                  {Icon && <Icon className={`w-5 h-5 mr-2 ${color}`} />}
                  <h2 className="text-sm font-semibold text-gray-700">{metric.title}</h2>
                </div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.target || metric.desc}</p>
              </div>
            );
          })}
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
                {periodOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
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
                disabled={period !== 'Custom'}
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
                disabled={period !== 'Custom'}
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
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-8 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

          </div>

          {/* Filter description */}
          <p className="text-xs text-gray-500 mt-2">{periodDescription} for {location}.</p>
        </div>

        {/* Tabs */}
        <div className="shadow-md overflow-hidden">
          <div className="flex border border-gray-200 rounded-full">
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