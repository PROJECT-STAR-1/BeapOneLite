"use client";

import { useEffect, useState } from "react";
import { Building2, FileText, MapPin, Coins, ChevronDown } from "lucide-react";
import SuccessModal from "@/component/BeapOneLite/Settings/Modal/SuccessModal";

export default function SettingsPage() {
  const [data, setData] = useState(null);


  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/beapOnelite/settings")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-10 text-gray-600">Loading...</div>;

  const business = data.businessInformation;
  const rates = data.exchangeRates.rates;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">

      {/* BUSINESS INFORMATION */}
      <div className="bg-white rounded-xl shadow p-8 space-y-6 border">
        <h2 className="text-2xl font-semibold">Business Information</h2>
        <p className="text-gray-600">Configure your business details</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

          {/* Business Name */}
          <div>
            <label className="font-medium mb-1 block">Business Name</label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
              <Building2 className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                className="bg-transparent w-full outline-none"
                defaultValue={business.businessName}
              />
            </div>
          </div>

          {/* Business Type (Select) */}
          <div>
            <label className="font-medium mb-1 block">Business Type</label>
            <div className="relative flex items-center bg-gray-100 rounded-lg px-3 py-3">
              <FileText className="w-5 h-5 text-gray-500 mr-2" />
              <select
                className="bg-transparent w-full outline-none appearance-none pr-6"
                defaultValue={business.businessType}
              >
                <option value="Consulting">Consulting</option>
                <option value="Retail">Retail</option>
                <option value="Technology">Technology</option>
                <option value="Services">Services</option>
              </select>
              <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Tax ID */}
          <div>
            <label className="font-medium mb-1 block">Tax ID / RC Number</label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
              <FileText className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                className="bg-transparent w-full outline-none"
                defaultValue={business.taxIdOrRcNumber}
              />
            </div>
          </div>

          {/* Base Currency (Select) */}
          <div>
            <label className="font-medium mb-1 block">Base Currency</label>
            <div className="relative flex items-center bg-gray-100 rounded-lg px-3 py-3">
              <Coins className="w-5 h-5 text-gray-500 mr-2" />
              <select
                className="bg-transparent w-full outline-none appearance-none pr-6"
                defaultValue={business.baseCurrency}
              >
                <option value="NGN - Nigerian Naira">NGN - Nigerian Naira</option>
                <option value="USD - US Dollar">USD - US Dollar</option>
                <option value="EUR - Euro">EUR - Euro</option>
                <option value="GBP - British Pound">GBP - British Pound</option>
              </select>
              <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Business Address */}
          <div className="md:col-span-2">
            <label className="font-medium mb-1 block">Business Address</label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                className="bg-transparent w-full outline-none"
                defaultValue={business.businessAddress}
              />
            </div>
          </div>
        </div>

        <button className="bg-black text-white px-6 py-3 rounded-lg mt-4"
         onClick={() => setShowModal(true)}>
          Save Changes
        </button>
      </div>

      {/* EXCHANGE RATES */}
      <div className="bg-white rounded-xl shadow p-8 border space-y-6">
        <h2 className="text-2xl font-semibold">Exchange Rates</h2>
        <p className="text-gray-600">
          Current FX rates for your base currency ({data.exchangeRates.baseCurrency})
        </p>

        <div className="space-y-4 mt-4">
          {rates.map((rate) => (
            <div
              key={rate.currencyCode}
              className="bg-gray-100 rounded-lg p-5 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">
                  {rate.currencyCode} - {rate.currencyName}
                </h3>
                <p className="text-sm text-gray-500">
                  Last updated: {rate.lastUpdated}
                </p>
              </div>
              <div className="text-lg font-semibold">{rate.value}</div>
            </div>
          ))}
        </div>
      </div>

 <SuccessModal open={showModal} onClose={() => setShowModal(false)} />

    </div>
  );
}
