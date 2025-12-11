// Vendors.jsx
'use client';

import { DollarSign, Mail, Phone, Home, Info } from 'lucide-react';
import React, { useMemo } from 'react';

// --- MOCK DATA ---
const VENDORS_DATA = [
  // Vendor 1: Power Solutions Ltd (Total Owed: 1,600,000, Active Bills: 1)
  {
    id: 1,
    name: 'Power Solutions Ltd',
    email: 'finance@powersolutions.ng',
    phone: '+234-805-555-0401',
    eWallet: 'ewallet-powersolutions@example.com',
    totalOwed: 1600000,
    activeBills: 1,
  },
  // Vendor 2: TechSupply Nigeria Ltd (Total Owed: 900,000, Active Bills: 1)
  {
    id: 2,
    name: 'TechSupply Nigeria Ltd',
    email: 'accounts@techsupply.ng',
    phone: '+234-802-555-0101',
    eWallet: 'ewallet-techsupply@example.com',
    totalOwed: 900000,
    activeBills: 1,
  },
  // Vendor 3: Office Furniture Pro (Total Owed: 800,000, Active Bills: 1)
  {
    id: 3,
    name: 'Office Furniture Pro',
    email: 'billing@officefurniture.ng',
    phone: '+234-803-555-0201',
    eWallet: 'ewallet-officefurniture@example.com',
    totalOwed: 800000,
    activeBills: 1,
  },
  // Vendor 4: Global Logistics Services (Total Owed: 350,000, Active Bills: 1)
  {
    id: 4,
    name: 'Global Logistics Services',
    email: 'payments@globallogistics.ng',
    phone: '+234-804-555-0301',
    eWallet: 'ewallet-globallogistics@example.com',
    totalOwed: 350000,
    activeBills: 1,
  },
  // Mock another vendor for a larger list
  {
    id: 5,
    name: 'Marketing Solutions Co.',
    email: 'info@marketingsolutions.com',
    phone: '+234-801-123-4567',
    eWallet: 'ewallet-marketing@example.com',
    totalOwed: 0,
    activeBills: 0,
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

// --- VENDOR CARD COMPONENT ---
const VendorCard = ({ vendor }) => {
  const isOwed = vendor.totalOwed > 0;
  
  // Helper for contact rows
  const ContactRow = ({ Icon, text }) => (
    <div className="flex items-center text-sm text-gray-700 mt-1">
      <Icon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );

  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 transition-shadow hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{vendor.name}</h3>

      {/* Contact Information */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <ContactRow Icon={Mail} text={vendor.email} />
        <ContactRow Icon={Phone} text={vendor.phone} />
        <ContactRow Icon={Home} text={`E-Wallet: ${vendor.eWallet}`} />
      </div>

      {/* Financial Summary */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Owed:</span>
          <span className={`font-bold ${isOwed ? 'text-red-600' : 'text-gray-700'}`}>
            {formatCurrency(vendor.totalOwed)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-gray-600">Active Bills:</span>
          <span className="font-bold text-gray-700">{vendor.activeBills}</span>
        </div>
      </div>
      
    </div>
  );
};

// ------------------------------------
// --- MAIN VENDORS COMPONENT ---
// ------------------------------------

export default function Vendors() {
  const vendors = VENDORS_DATA;

  // Calculate overall metrics
  const totalOwed = useMemo(() => {
    return vendors.reduce((sum, vendor) => sum + vendor.totalOwed, 0);
  }, [vendors]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      
     

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.length > 0 ? (
          vendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 p-6">No vendors registered.</p>
        )}
      </div>

      {/* --- About Vendor Bill Management (M7) --- */}
      {/* Replicating the information block at the bottom */}
      <div className="mt-8 p-4 border border-blue-200 bg-blue-50 rounded-lg flex space-x-3 items-start">
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