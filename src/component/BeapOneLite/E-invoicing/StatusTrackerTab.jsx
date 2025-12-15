'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  Globe,
  Landmark,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Eye,
  Database
} from 'lucide-react';

export default function StatusTrackerTab({ jurisdiction, period }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [data, setData] = useState(null);

  // ─────────────────────────────────────────────
  // Fetch JSON from API
  // ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/beapOnelite/einvoice');
      const json = await res.json();
      setData(json);
    };
    load();
  }, []);

  if (!data) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading transactions...
      </div>
    );
  }

  const transactions = data.transactions || [];
  const ostack = data.ostack || {};

  // ─────────────────────────────────────────────
  // VALID FILTER — search bar only
  // ─────────────────────────────────────────────
  const filtered = transactions.filter((t) =>
    t.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.irn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // (OPTIONAL — you can re-enable these later)
  // if (jurisdiction !== "All Jurisdictions") {
  //   filtered = filtered.filter(t => t.jurisdiction === jurisdiction);
  // }

  // if (period) {
  //   filtered = filtered.filter(t => filterByPeriod(t.date, period));
  // }

  // ─────────────────────────────────────────────
  // Styling Helpers
  // ─────────────────────────────────────────────
  const getStatusBadge = (status) => {
    const styles = {
      CLEARED: 'bg-green-100 text-green-800 border border-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      FAILED: 'bg-red-100 text-red-800 border border-red-200'
    };
    return `px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${styles[status] || ''}`;
  };

  const getLatencyBadge = (ms) => {
    let color = 'bg-gray-100 text-gray-700';
    if (ms < 1000) color = 'bg-green-100 text-green-800';
    else if (ms < 2000) color = 'bg-yellow-100 text-yellow-800';
    else color = 'bg-red-100 text-red-800';
    return `px-2.5 py-1 rounded-md text-xs font-medium ${color}`;
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Transaction Status Tracker</h3>
          <p className="text-sm text-gray-600 mt-1">
            Real-time monitoring of e-invoice submissions through Q4/Q16 architecture
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices, IRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase">Customer</th>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase">Jurisdiction</th>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase">Amount</th>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase">Status</th>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase">IRN</th>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase">Latency</th>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase">Submitted</th>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filtered.map((txn) => (
                <React.Fragment key={txn.id}>
                  <tr
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === txn.id ? null : txn.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{txn.invoice}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">{txn.customer}</td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                        {txn.jurisdiction}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{txn.amount}</div>
                        <div className="text-gray-500">{txn.localAmount}</div>
                      </div>
                    </td>

                    <td className="px-2 py-4">
                      <span className={getStatusBadge(txn.status)}>
                        {txn.status === 'CLEARED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {txn.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {txn.status === 'FAILED' && <XCircle className="w-3.5 h-3.5" />}
                        {txn.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {txn.irn === 'Pending' ? <span className="text-gray-400">Pending</span> : txn.irn}
                    </td>

                    <td className="px-6 py-4">
                      <span className={getLatencyBadge(txn.latency)}>
                        {txn.latency}ms
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">{txn.submitted}</td>

                    <td className="px-6 py-4 text-right">
                      {expandedRow === txn.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedRow === txn.id && (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                          {/* LEFT COLUMN */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4">Transaction Details</h4>
                            <dl className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <dt className="text-gray-500">Transaction ID:</dt>
                                <dd className="font-medium">{txn.txId}</dd>
                              </div>

                              <div className="flex justify-between">
                                <dt className="text-gray-500">Invoice Date:</dt>
                                <dd className="font-medium">{txn.date}</dd>
                              </div>

                              <div className="flex justify-between">
                                <dt className="text-gray-500">FX Rate (Q7):</dt>
                                <dd className="font-medium">{txn.fxRate}</dd>
                              </div>

                              {txn.clearanceTime && (
                                <div className="flex justify-between">
                                  <dt className="text-gray-500">Clearance Time:</dt>
                                  <dd className="font-medium">{txn.clearanceTime}</dd>
                                </div>
                              )}

                              <div className="flex justify-between">
                                <dt className="text-gray-500">Submission Time:</dt>
                                <dd className="font-medium">{txn.submitted}</dd>
                              </div>
                            </dl>
                          </div>

                          {/* RIGHT COLUMN */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4">O-Stack Processing Status</h4>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Q4 Hub Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                  ${txn.hubStatus.includes('SUCCESS') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                `}>
                                  {txn.hubStatus.replace(/_/g, ' ')}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Q16 Spoke Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold
                                  ${txn.spokeStatus.includes('CLEARED') ? 'bg-green-100 text-green-800' :
                                    txn.spokeStatus.includes('ERROR') ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                  }
                                `}>
                                  {txn.spokeStatus.replace(/_/g, ' ')}
                                </span>
                              </div>

                              {txn.irn !== 'Pending' && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">IRN:</span>
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-green-700 font-mono">
                                    {txn.irn}
                                  </code>
                                </div>
                              )}
                            </div>

                            {txn.error && (
                              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-bold text-red-900">Error Details</p>
                                    <p className="text-sm text-red-700 mt-1">{txn.error}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {txn.note && (
                              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">Transaction Note</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{txn.note.split('\n')[0]}</p>
                                    <p className="text-xs text-gray-500 mt-1">{txn.note.split('\n')[1]}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 flex justify-center gap-2">
          Showing <strong>{filtered.length}</strong> transaction
          {filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ─────────────────────────────────────────────── */}
      {/*  O-Stack Architecture Status */}
      {/* ─────────────────────────────────────────────── */}
      <div className="mt-12">
        <div className="bg-gray-50/80 rounded-3xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Database size={30} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">O-Stack Architecture Status</h3>
          </div>

          <p className="text-sm text-purple-700 mb-8">
            Centralized Hub (Q4) / Decentralized Spoke (Q16) Model
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Q4 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{ostack.q4?.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{ostack.q4?.desc}</p>
                  <div className="mt-5">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                      {ostack.q4?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Q16 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{ostack.q16?.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{ostack.q16?.desc}</p>
                  <div className="mt-5">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                      {ostack.q16?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Q7/Q13 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Landmark className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{ostack.q7q13?.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{ostack.q7q13?.desc}</p>
                  <div className="mt-5">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                      {ostack.q7q13?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
