
import React ,{ useState } from 'react';
import { Search,Shield, Globe, Landmark, ChevronUp, AlertCircle, CheckCircle2, Clock, XCircle, FileText, Eye, Database } from 'lucide-react';

export default function StatusTrackerTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const transactions = [
    {
      id:  1,
      invoice: 'INV-2024-1159',
      customer: 'Zenith Bank',
      jurisdiction: 'NG',
      amount: 'GBP 12,000',
      localAmount: 'NGN 23,640,000',
      status: 'CLEARED',
      irn: 'FIRS-NG-2024-IRN-89234712',
      latency: 1460,
      submitted: 'Nov 27, 02:40 PM',
      txId: 'TXN-2024-008',
      date: '2024-11-27',
      fxRate: '1970.0000',
      clearanceTime: 'Nov 27, 02:40 PM',
      hubStatus: 'ROUTED_SUCCESS',
      spokeStatus: 'FIRS_CLEARED',
    },
    {
      id: 2,
      invoice: 'INV-2024-1149',
      customer: 'Equity Bank Kenya',
      jurisdiction: 'KE',
      amount: 'USD 28,000',
      localAmount: 'KES 3,668,000',
      status: 'PENDING',
      irn: 'Pending',
      latency: 920,
      submitted: 'Nov 27, 10:55 AM',
      txId: 'TXN-2024-007',
      date: '2024-11-27',
      fxRate: '131.0000',
      hubStatus: 'ROUTING_IN_PROGRESS',
      spokeStatus: 'AWAITING_KRA_RESPONSE',
    },
    {
      id: 3,
      invoice: 'INV-2024-1148',
      customer: 'Access Bank Plc',
      jurisdiction: 'NG',
      amount: 'EUR 15,000',
      localAmount: 'NGN 26,775,000',
      status: 'CLEARED',
      irn: 'FIRS-NG-2024-IRN-89234711',
      latency: 1380,
      submitted: 'Nov 27, 08:12 AM',
      txId: 'TXN-2024-006',
      date: '2024-11-27',
      fxRate: '1785.0000',
      clearanceTime: 'Nov 27, 08:12 AM',
      hubStatus: 'ROUTED_SUCCESS',
      spokeStatus: 'FIRS_CLEARED',
    },
    {
      id: 4,
      invoice: 'INV-2024-1147',
      customer: 'Guaranty Trust Bank',
      jurisdiction: 'NG',
      amount: 'USD 45,000',
      localAmount: 'NGN 69,750,000',
      status: 'FAILED',
      irn: 'Pending',
      latency: 2340,
      submitted: 'Nov 26, 03:20 PM',
      txId: 'TXN-2024-005',
      date: '2024-11-26',
      fxRate: '1550.0000',
      error: 'Invalid VAT calculation. Expected 7.5% but received 7.0%',
      hubStatus: 'ROUTED_SUCCESS',
      spokeStatus: 'FIRS_ERROR',
      note: 'VAT miscalculation – correcting and resubmitting\nBy USER-002 · Nov 26, 03:25 PM',
    },
    {
      id: 5,
      invoice: 'INV-2024-1146',
      customer: 'MTN Uganda Limited',
      jurisdiction: 'UG',
      amount: 'USD 32,000',
      localAmount: 'UGX 118,400,000',
      status: 'CLEARED',
      irn: 'URA-UG-2024-EFRIS-34567890',
      latency: 1520,
      submitted: 'Nov 26, 12:30 PM',
      txId: 'TXN-2024-004',
      date: '2024-11-26',
      fxRate: '3700.0000',
      clearanceTime: 'Nov 26, 12:30 PM',
      hubStatus: 'ROUTED_SUCCESS',
      spokeStatus: 'URA_CLEARED',
    },
    {
      id: 6,
      invoice: 'INV-2024-1145',
      customer: 'First Bank of Nigeria',
      jurisdiction: 'NG',
      amount: 'NGN 12,500,000',
      localAmount: 'NGN 12,500,000',
      status: 'PENDING',
      irn: 'Pending',
      latency: 850,
      submitted: 'Nov 26, 09:45 AM',
      txId: 'TXN-2024-003',
      date: '2024-11-26',
      fxRate: '1.0000',
      hubStatus: 'ROUTING_IN_PROGRESS',
      spokeStatus: 'AWAITING_FIRS_RESPONSE',
    },
    {
      id: 7,
      invoice: 'INV-2024-1144',
      customer: 'Safaricom Limited',
      jurisdiction: 'KE',
      amount: 'EUR 18,500',
      localAmount: 'KES 2,960,000',
      status: 'CLEARED',
      irn: 'KRA-KE-2024-EBM-56789012',
      latency: 1680,
      submitted: 'Nov 25, 11:22 AM',
      txId: 'TXN-2024-002',
      date: '2024-11-25',
      fxRate: '160.0000',
      clearanceTime: 'Nov 25, 11:22 AM',
      hubStatus: 'ROUTED_SUCCESS',
      spokeStatus: 'KRA_CLEARED',
    },
    {
      id: 8,
      invoice: 'INV-2024-1143',
      customer: 'Dangote Industries Limited',
      jurisdiction: 'NG',
      amount: 'USD 25,000',
      localAmount: 'NGN 38,750,000',
      status: 'CLEARED',
      irn: 'FIRS-NG-2024-IRN-89234710',
      latency: 1420,
      submitted: 'Nov 25, 10:15 AM',
      txId: 'TXN-2024-001',
      date: '2024-11-25',
      fxRate: '1550.0000',
      clearanceTime: 'Nov 25, 10:15 AM',
      hubStatus: 'ROUTED_SUCCESS',
      spokeStatus: 'FIRS_CLEARED',
    },
  ];

  const filtered = transactions.filter(t =>
    t.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.irn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      CLEARED: 'bg-green-100 text-green-800 border border-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      FAILED: 'bg-red-100 text-red-800 border border-red-200',
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
                <th className="text-left px-2 py-4 text-xs  text-gray-500 uppercase">Latency</th>
                <th className="text-left px-2 py-4 text-xs  text-gray-500 uppercase">Submitted</th>
                <th className="text-left px-2 py-4 text-xs text-gray-500 uppercase"> Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((txn) => (
                <React.Fragment key={txn.id}>
                  <tr className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setExpandedRow(expandedRow === txn.id ? null : txn.id)}>
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

                  {/* EXPANDED ROW */}
                  {expandedRow === txn.id && (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left: Transaction Details */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4">Transaction Details</h4>
                            <dl className="space-y-2 text-sm">
                              <div className="flex justify-between"><dt className="text-gray-500">Transaction ID:</dt><dd className="font-medium">{txn.txId}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">Invoice Date:</dt><dd className="font-medium">{txn.date}</dd></div>
                              <div className="flex justify-between"><dt className="text-gray-500">FX Rate (Q7):</dt><dd className="font-medium">{txn.fxRate}</dd></div>
                              {txn.clearanceTime && (
                                <div className="flex justify-between"><dt className="text-gray-500">Clearance Time:</dt><dd className="font-medium">{txn.clearanceTime}</dd></div>
                              )}
                              <div className="flex justify-between"><dt className="text-gray-500">Submission Time:</dt><dd className="font-medium">{txn.submitted}</dd></div>
                            </dl>
                          </div>

                          {/* Right: Processing Status */}
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4">O-Stack Processing Status</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Q4 Hub Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  txn.hubStatus.includes('SUCCESS') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {txn.hubStatus.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Q16 Spoke Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  txn.spokeStatus.includes('CLEARED') ? 'bg-green-100 text-green-800' :
                                  txn.spokeStatus.includes('ERROR') ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
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

                            {/* Error Box */}
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

                            {/* Note */}
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
          Showing <strong>{filtered.length}</strong> transaction{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

{/* O-Stack Architecture Status — 100% MATCHES YOUR FINAL DESIGN */}
<div className="mt-12">
  <div className="bg-gray-50/80 rounded-3xl border border-gray-200 p-8">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
        <Database size={30} className='text-white'/>
      </div>
      <h3 className="text-xl font-bold text-gray-900">O-Stack Architecture Status</h3>
    </div>
    <p className="text-sm text-purple-700 mb-8">
      Centralized Hub (Q4) / Decentralized Spoke (Q16) Model
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Q4 LCFM Hub */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-7 h-7 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg">Q4 LCFM Hub</h4>
            <p className="text-sm text-gray-600 mt-1">Security, Signing & Routing</p>
            <div className="mt-5">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Q16 L-DEM Spokes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Globe className="w-7 h-7 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg">Q16 L-DEM Spokes</h4>
            <p className="text-sm text-gray-600 mt-1">3 Active / 3 Planned</p>
            <div className="mt-5">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                3 LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Q7 Treasury / Q13 G/L */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Landmark className="w-7 h-7 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg">Q7 Treasury / Q13 G/L</h4>
            <p className="text-sm text-gray-600 mt-1">FX Conversion & Ledger Posting</p>
            <div className="mt-5">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                100% UPTIME
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