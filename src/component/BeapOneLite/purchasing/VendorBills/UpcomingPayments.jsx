'use client';

import { Calendar, FileText, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

// --- FORMAT CURRENCY ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

// --- PAYMENT ITEM ---
const PaymentItem = ({ payment }) => {
  const paymentDetails = `${payment.billId} • Installment ${payment.installment}`;

  return (
    <div className="flex justify-between items-start py-4 border-b last:border-b-0">
      {/* Left */}
      <div className="flex-1 min-w-0 pr-4">
        <span className="text-lg font-semibold text-gray-900">{payment.vendor}</span>
        <p className="text-sm text-gray-600 truncate mt-0.5">
          {payment.description}
        </p>
        <div className="text-xs text-gray-500 mt-1">
          Bill: <b>{paymentDetails}</b>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4 ml-auto">
        <div className="text-right whitespace-nowrap">
          <p className="text-xl font-bold text-black">
            {formatCurrency(payment.amount)}
          </p>
          <div className="flex items-center justify-end text-sm text-gray-500 mt-0.5">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Due: {payment.dueDate}</span>
          </div>
        </div>

        <button className="flex items-center space-x-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors h-10">
          <FileText className="w-4 h-4" />
          <span>Pay Now</span>
        </button>
      </div>
    </div>
  );
};

// -------------------------------
// MAIN COMPONENT
// -------------------------------
export default function UpcomingPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from API
  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetch('/api/beapOnelite/vendorbills');
        const data = await res.json();
        setPayments(data.upcomingPayments); // <-- from JSON
      } catch (error) {
        console.error('Failed to fetch upcoming payments:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  if (loading) {
    return <p className="p-4">Loading scheduled payments...</p>;
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Next {payments.length} Scheduled Payments
      </h2>

      {/* Payment List */}
      <div className="border border-gray-200 rounded-xl overflow-hidden px-4">
        {payments.length > 0 ? (
          payments.map(payment => (
            <PaymentItem key={payment.id} payment={payment} />
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">
            No upcoming scheduled payments.
          </p>
        )}
      </div>

      {/* About Block */}
      <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg flex space-x-3 items-start">
        <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-blue-800 mb-1">
            About Vendor Bill Management (M7)
          </h3>
          <p className="text-sm text-blue-700">
            M7 tracks all <b>accounts payable</b> with support for installment payments,
            automated aging analysis, and E-Wallet integration  for seamless payment processing. All payments are executed through the SME's dedicated E-Wallet for complete cash flow visibility..
          </p>
        </div>
      </div>
    </div>
  );
}
