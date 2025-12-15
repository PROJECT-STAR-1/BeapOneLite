import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Info } from 'lucide-react';
import PaymentModal from './PaymentModal'; // Shared modal

// --- Utility Functions ---

const formatNaira = (amount) => {
  return `₦${(amount || 0).toLocaleString('en-NG')}`;
};

// Component for the status tags
const StatusTag = ({ status, isInstallment = false }) => {
  let colorClass = '';
  let text = status;

  switch (status) {
    case 'Issued':
    case 'Scheduled':
      colorClass = 'bg-gray-200 text-gray-700';
      break;
    case 'Overdue':
      colorClass = 'bg-red-100 text-red-700';
      break;
    case 'Paid':
      colorClass = 'bg-green-100 text-green-700';
      break;
    case 'Partial':
    case 'Partially Paid':
      colorClass = 'bg-yellow-100 text-yellow-700';
      text = isInstallment ? 'Partial' : 'Partially Paid';
      break;
    default:
      colorClass = 'bg-gray-200 text-gray-700';
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClass}`}>
      {text}
    </span>
  );
};

// Component for a single Bill Card
const BillCard = ({ bill, openPaymentModal }) => {
  const isInstallments = bill.type === 'Installments';
  const showPayNow = bill.outstandingAmount > 0;
  
  const billStatusTag = bill.status === 'Partial' ? 'Partially Paid' : bill.status;

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm mb-6 bg-white">
      <div className="flex justify-between items-start">
        {/* Vendor Info and Description */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-1">
            {bill.vendor}
            <span className="ml-3">
                <StatusTag status={billStatusTag} />
            </span>
            {isInstallments && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                Installments
              </span>
            )}
          </h3>
          <p className="text-gray-600 mb-1">{bill.description}</p>
          <p className="text-sm text-gray-500">
            Bill: **{bill.id}** | Issued: **{bill.issuedDate}**
            {bill.status === 'Paid' ? ` | Due: ${bill.dueDate}` : ''}
          </p>
        </div>

        {/* Total Amount, Outstanding, and Pay Now Button */}
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800 mb-1">{formatNaira(bill.totalAmount)}</p>
          {bill.paidAmount > 0 && bill.outstandingAmount > 0 && (
            <p className="text-sm text-green-600">Paid: {formatNaira(bill.paidAmount)}</p>
          )}
          {bill.outstandingAmount > 0 ? (
            <p className="text-sm font-medium text-red-600 mb-3">Outstanding: {formatNaira(bill.outstandingAmount)}</p>
          ) : (
            <p className="text-sm font-medium text-green-600 mb-3">Paid: {formatNaira(bill.paidAmount)}</p>
          )}
          
          {showPayNow && (
            <button
              // Pass the full bill object as paymentContext
              onClick={() => openPaymentModal(bill)} 
              className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition duration-150 shadow-md"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>

      {/* Installment Schedule (if applicable) */}
      {isInstallments && bill.schedule && bill.schedule.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Payment Schedule:</h4>
          {bill.schedule.map((installment, index) => (
            <div
              key={installment.id}
              className={`flex justify-between items-center py-3 ${
                index < bill.schedule.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <span className="font-medium text-gray-700">
                  Installment #{installment.id}: Due: **{installment.dueDate}**
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold text-gray-800">{formatNaira(installment.amount)}</span>
                <StatusTag status={installment.status} isInstallment={true} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Bill Register Component
const BillRegister = () => {
  const API_URL = '/api/beapOnelite/vendorbills'; 
  const filters = ['All', 'Issued', 'Partial', 'Overdue', 'Paid'];

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentContext, setPaymentContext] = useState(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBills(data.bills || []);
      } catch (e) {
        console.error("Failed to fetch vendor bills:", e);
        setError("Failed to load bills. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [API_URL]);

  // --- Modal Handlers ---

  // Accepts either a full Bill object or a structured Installment object
  const handleOpenPaymentModal = (context) => {
    setPaymentContext(context);
    setIsModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsModalOpen(false);
    setPaymentContext(null);
  };

  // --- Filtering Logic ---

  const filteredBills = useMemo(() => {
    if (activeFilter === 'All') {
      return bills;
    }
    
    return bills.filter(bill => {
      switch (activeFilter) {
        case 'Issued':
          return bill.status === 'Issued'; 
        case 'Partial':
          return bill.status === 'Partial' || (bill.schedule && bill.schedule.some(inst => inst.status === 'Partial'));
        case 'Overdue':
          return bill.schedule && bill.schedule.some(inst => inst.status === 'Overdue');
        case 'Paid':
          return bill.status === 'Paid';
        default:
          return false;
      }
    });
  }, [activeFilter, bills]);
  
  // Count calculation for filters
  const getFilterCount = (filter) => {
    if (filter === 'All') return bills.length;
    
    return bills.filter(bill => {
      switch (filter) {
        case 'Issued':
          return bill.status === 'Issued';
        case 'Partial':
          return bill.status === 'Partial' || (bill.schedule && bill.schedule.some(inst => inst.status === 'Partial'));
        case 'Overdue':
          return bill.schedule && bill.schedule.some(inst => inst.status === 'Overdue');
        case 'Paid':
          return bill.status === 'Paid';
        default:
          return false;
      }
    }).length;
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-lg font-medium text-gray-600">Loading bill register...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Filter Buttons */}
      <div className="flex space-x-3 mb-8">
        {filters.map((filter) => {
          const count = getFilterCount(filter);
          const isActive = activeFilter === filter;
          
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ${
                isActive
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {filter} {filter === 'All' && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Bill List */}
      <div className="space-y-6">
        {filteredBills.length > 0 ? (
          filteredBills.map((bill) => (
            <BillCard key={bill.id} bill={bill} openPaymentModal={handleOpenPaymentModal} />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
            No bills found for the selected filter ({activeFilter}).
          </div>
        )}
      </div>

      {/* Info Block at the bottom */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start text-sm">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h5 className="font-semibold text-blue-800 mb-1">About Vendor Bill Management (M7)</h5>
          <p className="text-blue-700">
            M7 tracks all accounts payable (money owed to vendors) with support for installment payments, automated aging analysis, and E-Wallet integration for seamless payment processing. All payments are executed through the SME's dedicated E-Wallet for complete cash flow visibility.
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentContext && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={handleClosePaymentModal}
          paymentContext={paymentContext}
        />
      )}
    </div>
  );
};

export default BillRegister;