"use client";

import React, { useState, useEffect } from 'react';

import {
  MapPin,
  Database,
  Mail,
  Phone,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

// 1. IMPORT MODAL COMPONENTS (Assuming they are correctly located)
import UpgradeModal from './UpgradeModal'; 
import DowngradeModal from './DowngradeModal'; 


// Initial state structures to prevent errors while loading
const initialPricingData = [];
const initialModalData = {
    upgradeModal: null, // Will hold the upgrade data structure
    downgradeModal: null, // Will hold the downgrade data structure
};

export default function Tier() {
  const [pricingData, setPricingData] = useState(initialPricingData);
  const [modalData, setModalData] = useState(initialModalData); // NEW: State for modal content
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. NEW: State for modal visibility
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); 
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false); 

  // Function to handle the CTA button click
  const handleCtaClick = (tierId, tierTitle) => {
    if (tierId === 'free') {
      // Logic for Downgrade button (only applies to the 'Free' tier button)
      if (modalData.downgradeModal) {
          setIsDowngradeModalOpen(true);
      }
    } else {
      // Logic for Upgrade button
      if (modalData.upgradeModal) {
          setIsUpgradeModalOpen(true);
      }
    }
    // NOTE: In a real app, you would dynamically fetch the specific modal data 
    // for the chosen tier (e.g., Standard or Premium), but here we reuse 
    // the single upgradeModal object (for Premium) and downgradeModal object (for Free).
  };


  // 3. DATA FETCHING (Updated to pull modal data)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/beapOnelite/subscriptions'); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract all necessary data structures
        if (data && Array.isArray(data.pricingTiers)) {
            setPricingData(data.pricingTiers);
            setModalData({
                upgradeModal: data.upgradeModal,
                downgradeModal: data.downgradeModal,
            });
        } else {
            throw new Error("Invalid data structure.");
        }
        setError(null);
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Failed to load pricing data.");
        setPricingData(initialPricingData);
        setModalData(initialModalData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Loading and Error States
  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="text-xl font-medium text-purple-600">
             Loading Tier Options...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="p-6 bg-red-100 text-red-700 rounded-xl max-w-lg text-center">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold">{error}</p>
            <p className="text-sm">Cannot display pricing tiers.</p>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <>
      <div className="w-full flex justify-center py-12">
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          {pricingData.map((tier) => {
            const isCurrent = tier.current;

            return (
              <div
                key={tier.id}
                className={`border rounded-xl shadow-sm p-6 flex flex-col relative ${
                  isCurrent
                    ? "border-purple-600 ring-2 ring-purple-400"
                    : "border-gray-200"
                }`}
              >
                {/* Recommended badge */}
                {tier.recommended && (
                  <span className="absolute top-0 -translate-y-1/2 left-4 bg-yellow-400 text-sm font-medium px-3 py-1 rounded-full">
                    Recommended
                  </span>
                )}

                {/* Current badge */}
                {tier.current && (
                  <span className="absolute top-0 right-4 -translate-y-1/2 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Current
                  </span>
                )}

                <h2 className="text-2xl font-bold text-center mt-4">
                  {tier.title}
                </h2>

                <p className="text-center mt-4 text-4xl font-extrabold">
                  ₦{tier.price.toLocaleString()}
                </p>
                <p className="text-center text-gray-500 -mt-1">
                  per user/month
                </p>

                {/* Metadata */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={18} /> {tier.locations}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Database size={18} /> {tier.storage}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={18} /> eInvoice: {tier.einvoice}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={18} /> {tier.support}
                  </div>
                </div>

                {/* Features List (Omitted for brevity, assumed unchanged) */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">FEATURES INCLUDED:</h3>
                  <ul className="space-y-2 text-gray-700">
                    {Object.entries(tier.features).map(([key, value]) => {
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());

                      return (
                        <li key={key} className="flex items-center gap-2">
                          {value ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <X size={18} className="text-gray-400" />
                          )}
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* 4. CTA Button - Wired to open the correct modal */}
                <div className="mt-6">
                  {isCurrent ? (
                    <button 
                      
                    >
                    </button>
                  ) : (
                    <button 
                        onClick={() => handleCtaClick(tier.id, tier.title)} // CALL HANDLER FUNCTION
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                      {tier.price === 0
                        ? "Downgrade to Free Tier"
                        : "Upgrade to " + tier.title}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 5. RENDER MODALS */}
      {modalData.upgradeModal && (
        <UpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
          data={modalData.upgradeModal} // Pass fetched upgrade data
        />
      )}
      
      {modalData.downgradeModal && (
        <DowngradeModal 
          isOpen={isDowngradeModalOpen} 
          onClose={() => setIsDowngradeModalOpen(false)} 
          data={modalData.downgradeModal} // Pass fetched downgrade data
        />
      )}
    </>
  );
}