'use client'; 

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Calendar, Info, DollarSign } from 'lucide-react';

// --- MOCK DATA ---
const BILLS_DATA = [
  {
    id: 5,
    vendor: 'TechSupply Nigeria Ltd',
    description: 'Office computers and accessories',
    billId: 'TS-INV-10152025',
    issuedDate: 'Oct 15, 2025',
    dueDate: 'Nov 14, 2025',
    totalAmount: 500000,
    outstanding: 0,
    paid: 500000,
    status: 'Paid',
    isInstallment: false,
    alwaysShowDetails: false, // Paid items are collapsed by default in the visual
  },
  // Item 2 (Partially Paid/Partial, second in the list visual)
  {
    id: 2,
    vendor: 'Office Furniture Pro',
    description: 'Office furniture - desks, chairs, cabinets',
    billId: 'OFP-INV-10202025',
    issuedDate: 'Oct 20, 2025',
    totalAmount: 1200000,
    outstanding: 800000,
    paid: 400000,
    status: 'Partial',
    isInstallment: true,
    alwaysShowDetails: true, // Show schedule inline
    installments: [
      { id: 1, amount: 400000, dueDate: 'Nov 20, 2025', status: 'Paid' },
      { id: 2, amount: 400000, dueDate: 'Dec 20, 2025', status: 'Scheduled' },
      { id: 3, amount: 400000, dueDate: 'Jan 20, 2026', status: 'Scheduled' },
    ],
  },
  // Item 4 (Issued, third in the list visual)
  {
    id: 4,
    vendor: 'Global Logistics Services',
    description: 'Freight and delivery services',
    billId: 'GLS-INV-11102025',
    issuedDate: 'Nov 10, 2025',
    dueDate: 'Dec 10, 2025',
    totalAmount: 350000,
    outstanding: 350000,
    paid: 0,
    status: 'Issued',
    isInstallment: false,
    alwaysShowDetails: false,
  },
  // Item 1 (Overdue, fourth in the list visual)
  {
    id: 1,
    vendor: 'Power Solutions Ltd',
    description: 'Generator and installation',
    billId: 'PS-INV-09012025',
    issuedDate: 'Sep 1, 2025',
    totalAmount: 2400000,
    outstanding: 1600000,
    paid: 800000,
    status: 'Overdue',
    isInstallment: true,
    alwaysShowDetails: true, // Show schedule inline
    installments: [
      { id: 1, amount: 800000, dueDate: 'Oct 1, 2025', status: 'Paid' },
      { id: 2, amount: 800000, dueDate: 'Nov 1, 2025', status: 'Overdue' },
      { id: 3, amount: 800000, dueDate: 'Dec 1, 2025', status: 'Scheduled' },
    ],
  },
  // Item 3 (Issued/Installments, last in the list visual)
  {
    id: 3,
    vendor: 'TechSupply Nigeria Ltd',
    description: 'Software licenses and IT equipment',
    billId: 'TS-INV-11202025',
    issuedDate: 'Nov 20, 2025',
    totalAmount: 900000,
    outstanding: 900000,
    paid: 0,
    status: 'Issued',
    isInstallment: true,
    alwaysShowDetails: true, // Show schedule inline
    installments: [
      { id: 1, amount: 300000, dueDate: 'Dec 20, 2025', status: 'Scheduled' },
      { id: 2, amount: 300000, dueDate: 'Jan 20, 2026', status: 'Scheduled' },
      { id: 3, amount: 300000, dueDate: 'Feb 20, 2026', status: 'Scheduled' },
    ],
  },
];

// --- UTILITY FUNCTION ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

// --- STATUS TAGS COMPONENT ---
const StatusTag = ({ status }) => {
  let colorClass = '';
  switch (status) {
    case 'Issued':
    case 'Scheduled':
      colorClass = 'bg-blue-600/10 text-blue-800 font-semibold';
      break;
    case 'Partial':
    case 'Partially Paid':
      colorClass = 'bg-yellow-600/10 text-yellow-800 font-semibold';
      break;
    case 'Overdue':
      colorClass = 'bg-red-600/10 text-red-800 font-semibold';
      break;
    case 'Paid':
      colorClass = 'bg-gray-700 text-white font-semibold';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-700';
  }
  return (
    <span className={`px-2 py-0.5 text-xs rounded ${colorClass}`}>
      {status}
    </span>
  );
};

// --- BILL ITEM COMPONENT ---
const BillItem = ({ bill }) => {
  // Use local state only for items that are not explicitly shown expanded in the mock visuals
  const [isExpanded, setIsExpanded] = useState(bill.alwaysShowDetails || false);

  const outstandingColor = bill.status === 'Overdue' ? 'text-red-600' : 'text-gray-500';
  const isExpandable = bill.isInstallment || bill.status === 'Overdue' || bill.status === 'Partial';
  const showExpandIcon = isExpandable && !bill.alwaysShowDetails;

  return (
    <div className={`p-4 border-b last:border-b-0 ${isExpanded ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
      {/* Bill Header (Main Row) */}
      <div 
        className={`flex justify-between items-start ${showExpandIcon ? 'cursor-pointer' : 'cursor-default'}`} 
        onClick={() => showExpandIcon && setIsExpanded(!isExpanded)}
      >
        
        {/* Left Side: Vendor and Details */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-lg font-semibold ${bill.status === 'Paid' ? 'text-gray-700' : 'text-gray-900'}`}>{bill.vendor}</span>
            <StatusTag status={bill.status === 'Partial' ? 'Partially Paid' : bill.status} />
            {bill.isInstallment && <StatusTag status="Installments" />}
          </div>
          <p className="text-sm text-gray-600 truncate">{bill.description}</p>
          <div className="text-xs text-gray-500 mt-1">
            Bill: **{bill.billId}** | Issued: **{bill.issuedDate}**
            {bill.dueDate && ` | Due: ${bill.dueDate}`}
          </div>
        </div>

        {/* Right Side: Amounts and Pay Button */}
        <div className="flex items-center space-x-6">
          <div className="text-right whitespace-nowrap">
            <p className={`text-xl font-bold ${bill.status === 'Paid' ? 'text-gray-700' : 'text-black'}`}>{formatCurrency(bill.totalAmount)}</p>
            {bill.outstanding > 0 && (
              <p className={`text-sm ${outstandingColor}`}>Outstanding: {formatCurrency(bill.outstanding)}</p>
            )}
            {bill.paid > 0 && (
              <p className="text-sm text-green-600">Paid: {formatCurrency(bill.paid)}</p>
            )}
          </div>
          
          {bill.status !== 'Paid' && (
            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
              Pay Now
            </button>
          )}

          {showExpandIcon && (
            (isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />)
          )}
        </div>
      </div>

      {/* Bill Body (Installment Schedule - Shown if isExpanded or alwaysShowDetails) */}
      {(isExpanded || bill.alwaysShowDetails) && bill.isInstallment && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-bold mb-3 text-gray-700">Payment Schedule:</h4>
          {bill.installments.map((installment, index) => (
            <div key={installment.id} className="flex justify-between items-center py-2">
              {/* Installment Left */}
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">Installment #{index + 1}</span>
                <span className="text-sm text-gray-600">Due: **{installment.dueDate}**</span>
              </div>
              
              {/* Installment Right */}
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-900">{formatCurrency(installment.amount)}</span>
                
                {installment.status === 'Overdue' ? (
                  <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium">Overdue</button>
                ) : (
                  <StatusTag status={installment.status} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// ------------------------------------
// --- MAIN BILLS REGISTER COMPONENT ---
// ------------------------------------

export default function BillsRegister() {
  const [filter, setFilter] = useState('All'); // State for the filter tabs

  // Utility to filter bills based on the selected tab
  const filteredBills = useMemo(() => {
    return BILLS_DATA.filter(bill => {
      const statusName = bill.status === 'Partial' ? 'Partially Paid' : bill.status;
      if (filter === 'All') return true;
      if (filter === 'Partial' && bill.status === 'Partial') return true;
      if (filter === 'Issued' && bill.status === 'Issued') return true;
      if (filter === 'Overdue' && bill.status === 'Overdue') return true;
      if (filter === 'Paid' && bill.status === 'Paid') return true;
      return false;
    });
  }, [filter]);

  const filters = ['All (5)', 'Issued', 'Partial', 'Overdue', 'Paid'];

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      
      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f.split(' ')[0])} 
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              (filter === f.split(' ')[0] || (filter === 'All' && f.startsWith('All')))
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bill List */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {filteredBills.length > 0 ? (
          filteredBills.map(bill => (
            <BillItem key={bill.id} bill={bill} />
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No bills found for this filter.</p>
        )}
      </div>

      {/* --- About Vendor Bill Management (M7) --- */}
      <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg flex space-x-3 items-start">
        <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-blue-800 mb-1">About Vendor Bill Management (M7)</h3>
          <p className="text-sm text-blue-700">
            M7 tracks all **accounts payable** (money owed to vendors) with support for **installment payments**, **automated aging analysis**, and **E-Wallet integration** for seamless payment processing. All payments are executed through the SME's dedicated E-Wallet for complete cash flow visibility.
          </p>
        </div>
      </div>
    </div>
  );
}