'use client';

import Layout from "@/component/BeapOneLite/Layout";
import { useState, useEffect } from 'react';
import { Shield, FileText, X, Info } from 'lucide-react';
import StatusTrackerTab from "@/component/BeapOneLite/E-invoicing/StatusTrackerTab";
import Jurisdictions from "@/component/BeapOneLite/E-invoicing/Jurisdictions";
import FIRSReport from "@/component/BeapOneLite/E-invoicing/FIRSReport";

export default function EInvoicingCompliance() {
  const [activeTab, setActiveTab] = useState('status-tracker');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [jurisdictionFilter, setJurisdictionFilter] = useState('All Jurisdictions');
  const [periodFilter, setPeriodFilter] = useState('Last 30 Days');

  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/beapOnelite/einvoice");
      const json = await res.json();
      setData(json);
    };
    load();
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="p-10 text-center text-gray-500">
          Loading E-Invoicing data…
        </div>
      </Layout>
    );
  }

  const { kpis, breakdown } = data;

  const jurisdictions = ['All Jurisdictions', 'Nigeria (NG)', 'Kenya (KE)', 'Uganda (UG)'];
  const periods = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Last Year'];
  const currencies = [
    'USD - US Dollar', 'EUR - Euro', 'GBP - British Pound',
    'NGN - Nigerian Naira', 'KES - Kenyan Shilling', 'UGX - Ugandan Shilling'
  ];

  return (
    <Layout>
      <div className="px-2">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-2 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  E-Invoicing & Tax Compliance
                </h1>
                <p className="text-sm text-gray-600">
                  FIRS Compliance Module • Hub-and-Spoke Architecture
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <select
                value={jurisdictionFilter}
                onChange={(e) => setJurisdictionFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {jurisdictions.map(j => <option key={j}>{j}</option>)}
              </select>

              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {periods.map(p => <option key={p}>{p}</option>)}
              </select>

              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Submit E-Invoice
              </button>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* IRN Success Rate */}
          <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
            <p className="text-lg font-bold text-red-700 mb-2">IRN Issuance Success Rate</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-red-700">{kpis.irnSuccessRate.value}%</p>
              <span className="text-sm font-medium text-red-600 mb-1">{kpis.irnSuccessRate.change}</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">Target: {kpis.irnSuccessRate.target}</p>
            <p className="text-xs text-gray-500 mt-1">{kpis.irnSuccessRate.desc}</p>
          </div>

          {/* Latency Avg */}
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <p className="text-lg font-bold text-green-700 mb-2">End-to-End Latency (Avg)</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-green-700">{kpis.latencyAvg.value}</p>
              <span className="text-sm font-medium text-green-600 mb-1">{kpis.latencyAvg.change}</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">Target: {kpis.latencyAvg.target}</p>
            <p className="text-xs text-gray-500 mt-1">{kpis.latencyAvg.desc}</p>
          </div>

          {/* P95 Latency */}
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <p className="text-lg font-bold text-green-700 mb-2">P95 Latency</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-green-700">{kpis.latencyP95.value}</p>
              <span className="text-sm font-medium text-green-600 mb-1">{kpis.latencyP95.change}</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">Target: {kpis.latencyP95.target}</p>
            <p className="text-xs text-gray-500 mt-1">{kpis.latencyP95.desc}</p>
          </div>

          {/* FX Reliability */}
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <p className="text-lg font-bold text-green-700 mb-2">Q7 FX Reliability</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-green-700">{kpis.fxReliability.value}</p>
              <span className="text-sm font-medium text-gray-600 mb-1">{kpis.fxReliability.change}</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">Target: {kpis.fxReliability.target}</p>
            <p className="text-xs text-gray-500 mt-1">{kpis.fxReliability.desc}</p>
          </div>

          {/* Data Integrity */}
          <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
            <p className="text-lg font-bold text-red-700 mb-2">Q13 Data Integrity</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-red-700">{kpis.dataIntegrity.value}</p>
              <span className="text-sm font-medium text-gray-600 mb-1">{kpis.dataIntegrity.change}</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">Target: {kpis.dataIntegrity.target}</p>
            <p className="text-xs text-gray-500 mt-1">{kpis.dataIntegrity.desc}</p>
          </div>

          {/* Active Jurisdictions */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <p className="text-lg font-bold text-blue-700 mb-2">Active Jurisdictions</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-blue-700">{kpis.activeJurisdictions.value}</p>
              <span className="text-sm font-medium text-blue-600 mb-1">{kpis.activeJurisdictions.change}</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">Target: {kpis.activeJurisdictions.target}</p>
            <p className="text-xs text-gray-500 mt-1">{kpis.activeJurisdictions.desc}</p>
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="px-2 pb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Compliance Status Breakdown
            </h3>
            <p className="text-sm text-gray-600 mb-8">
              Real-time transaction status across Q4 Hub and Q16 Spokes
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-gray-700">{breakdown.total}</p>
                <p className="text-sm text-gray-600 mt-2">Total Submissions</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 text-center border-2 border-green-200">
                <p className="text-4xl font-bold text-green-700">{breakdown.cleared}</p>
                <p className="text-sm text-gray-600 mt-2">Cleared</p>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-6 text-center border-2 border-yellow-200">
                <p className="text-4xl font-bold text-yellow-700">{breakdown.pending}</p>
                <p className="text-sm text-gray-600 mt-2">Pending</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 text-center border-2 border-red-200">
                <p className="text-4xl font-bold text-red-700">{breakdown.failed}</p>
                <p className="text-sm text-gray-600 mt-2">Failed</p>
              </div>
            </div>

            {/* TABS */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
              {['status-tracker', 'jurisdictions', 'firs-report'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-md text-sm font-medium transition ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'status-tracker' && 'Status Tracker'}
                  {tab === 'jurisdictions' && 'Jurisdictions'}
                  {tab === 'firs-report' && 'FIRS Report'}
                </button>
              ))}
            </div>

            <div className="animate-fade-in">

              {/* ⭐ PASS FILTERS HERE */}
              {activeTab === 'status-tracker' && (
                <StatusTrackerTab
                  jurisdiction={jurisdictionFilter}
                  period={periodFilter}
                />
              )}

              {activeTab === 'jurisdictions' && <Jurisdictions />}
              {activeTab === 'firs-report' && <FIRSReport />}
            </div>
          </div>
        </div>

        {/* MODAL */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh]  overflow-y-auto">

              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-indigo-600" />
                  Submit E-Invoice for CTC Clearance
                </h3>
                <button onClick={() => setShowSubmitModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="p-8 space-y-7">
                <p className="text-sm text-gray-600">
                  Enter invoice details for regulatory compliance submission
                </p>

                {/* FORM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="INV-2024-XXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Company Ltd."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jurisdiction <span className="text-red-600">*</span>
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option>Select jurisdiction</option>
                      <option>Nigeria (NG)</option>
                      <option>Kenya (KE)</option>
                      <option>Uganda (UG)</option>
                    </select>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency of Transaction (COT) <span className="text-red-600">*</span>
                      </label>
                      <select
                        defaultValue="USD - US Dollar"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        {currencies.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="$ 0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right font-medium focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g. Q4 equipment supply contract - priority clearance required"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500"
                    maxLength={500}
                  />
                  <p className="text-right text-xs text-gray-500 mt-1">0/500 characters</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-900 leading-relaxed">
                    This submission will route through Q4-LCFM Hub for security and signing,
                    then to the FIRS via the Q16 L-DEM Spoke for compliance clearance.
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Submit to Q4 Hub
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
