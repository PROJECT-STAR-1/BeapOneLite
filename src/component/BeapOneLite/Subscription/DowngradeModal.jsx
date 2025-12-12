// components/DowngradeModal.jsx

import React from 'react';
import { X, Crown, MinusCircle } from "lucide-react";

/**
 * Renders the subscription downgrade confirmation modal.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @param {object} props.data - The downgrade data fetched from the API.
 */
export default function DowngradeModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  const cost = data.estimatedMonthlyCost;
  const activeUsers = data.currentActiveUsers;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100">
        
        {/* Header and Close Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
             <Crown className="w-5 h-5 text-gray-600"/> Downgrade to {data.targetTierName}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Estimated Cost Section (Light Gray/Indigo Box) */}
          <div className="p-6 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
            <p className="text-sm font-medium text-indigo-700">
              Estimated Monthly Cost
            </p>
            <p className="text-5xl font-extrabold text-indigo-800 my-2">
              ₦{cost.toLocaleString()}
            </p>
            <p className="text-sm text-indigo-600">
              Based on {activeUsers} active users
            </p>
          </div>

          {/* Features Lost Section */}
          <div>
            <h4 className="text-md font-semibold mb-3">
              Features you will lose:
            </h4>
            <div className="space-y-3">
              {data.featuresLost.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-red-700">
                  <MinusCircle className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Prorated Warning Box */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            {data.proratedWarning}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 space-x-3 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert(`Downgrading to ${data.targetTierName} for ₦${cost.toLocaleString()}`);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              Confirm Downgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}