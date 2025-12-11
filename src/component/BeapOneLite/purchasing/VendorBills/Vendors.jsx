'use client';

import { Mail, Phone, Home, Info } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

// --- FORMAT NGN ---
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

  const ContactRow = ({ Icon, text }) => (
    <div className="flex items-center text-sm text-gray-700 mt-1">
      <Icon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );

  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 transition-shadow hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{vendor.name}</h3>

      <div className="border-b border-gray-200 pb-3 mb-3">
        <ContactRow Icon={Mail} text={vendor.email} />
        <ContactRow Icon={Phone} text={vendor.phone} />
        <ContactRow Icon={Home} text={`E-Wallet: ${vendor.eWallet}`} />
      </div>

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
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch vendors from your unified API
  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await fetch('/api/beapOnelite/vendorbills');
        const data = await res.json();
        setVendors(data.vendors); // <-- IMPORTANT
      } catch (err) {
        console.error('Failed to load vendors:', err);
      } finally {
        setLoading(false);
      }
    }

    loadVendors();
  }, []);

  const totalOwed = useMemo(() => {
    return vendors.reduce((sum, v) => sum + v.totalOwed, 0);
  }, [vendors]);

  if (loading) {
    return <p className="p-4">Loading vendors...</p>;
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 p-6">
            No vendors registered.
          </p>
        )}
      </div>

      {/* About Section */}
      <div className="mt-8 p-4 border border-blue-200 bg-blue-50 rounded-lg flex space-x-3 items-start">
        <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-blue-800 mb-1">
            About Vendor Bill Management (M7)
          </h3>
          <p className="text-sm text-blue-700">
            M7 tracks all <b>accounts payable</b>, including installment billing,
            aging analysis, and E-Wallet integration for seamless payment processing. All payments are executed through the SME's dedicated E-Wallet for complete cash flow visibility.
          </p>
        </div>
      </div>
    </div>
  );
}
