import React from 'react';
import { X, CornerRightUp, Info } from 'lucide-react';

// Utility function to format currency
const formatNaira = (amount) => {
  return `₦${(amount || 0).toLocaleString('en-NG')}`;
};

// This modal now accepts a generic 'paymentContext' which can be a full bill or an installment object
const PaymentModal = ({ isOpen, onClose, paymentContext }) => {
  if (!isOpen || !paymentContext) return null;

  // Determine context type and extract data
  // An installment object will have a specific 'paymentType' field
  const isInstallment = paymentContext.paymentType && paymentContext.paymentType.startsWith('Installment #');
  
  const vendor = paymentContext.vendor;
  // Use 'billId' for installments, 'id' for full bills
  const billId = paymentContext.billId || paymentContext.id; 
  const paymentType = isInstallment ? paymentContext.paymentType : 'Full Bill Payment';
  // Use 'amount' for installments, 'outstandingAmount' for full bills
  const paymentAmount = paymentContext.amount || paymentContext.outstandingAmount; 
  
  // Custom utility for placeholder email
  const getEwalletEmail = (vendorName) => {
    return `ewallet-${vendorName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@example.com`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto flex flex-col max-h-[90vh]">
        
        {/* Modal Header: Fixed position at the top of the modal */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Initiate payment disbursement through the SME E-Wallet system
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: This section will scroll if the content overflows */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Vendor Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-500">Vendor:</div>
            <div className="font-medium text-gray-800">{vendor}</div>

            <div className="text-gray-500">Bill Reference:</div>
            <div className="font-medium text-gray-800">{billId}</div>

            {isInstallment && (
                <div className="text-gray-500">Payment Type:</div>
            )}
            {isInstallment && (
                <div className="font-medium text-gray-800">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                        {paymentType}
                    </span>
                </div>
            )}

            <div className="text-gray-500">Payment Amount:</div>
            <div className="text-2xl font-bold text-gray-800 mt-2">
              {formatNaira(paymentAmount)}
            </div>
          </div>
          
          <hr className="my-4" />

          {/* E-Wallet Transfer Block */}
          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-blue-700 font-semibold mb-3">
              <CornerRightUp className="w-5 h-5 mr-2" />
              E-Wallet Transfer
            </div>
            <p className="text-sm text-blue-600 mb-2">Funds will be transferred from your SME E-Wallet to:</p>
            <input
              type="email"
              placeholder="ewallet-vendor@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              defaultValue={getEwalletEmail(vendor)}
            />
          </div>

          {/* Payment Note (Optional) */}
          <div className="mt-4">
            <label htmlFor="payment-note" className="text-md font-semibold text-gray-800 mb-2 block">
              Payment Note (Optional)
            </label>
            <textarea
              id="payment-note"
              placeholder="Add a note about this payment..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-300 focus:border-gray-300"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              This note will be included in the audit log for accountability
            </p>
          </div>

          {/* Warning */}
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm flex items-start">
            <Info className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <span>
              **This action will initiate a real payment transfer.** Ensure the E-Wallet address and amount are correct before proceeding.
            </span>
          </div>
        </div>

        {/* Modal Footer (Pay Button): Fixed position at the bottom of the modal */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end flex-shrink-0">
          <button
            onClick={() => {
              alert(`Initiating payment of ${formatNaira(paymentAmount)} for ${paymentType} to ${vendor} (Bill: ${billId})`);
              onClose();
            }}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition duration-150 shadow-md"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;