// components/UpgradeModal.jsx

import React from 'react';
import { X, Check } from "lucide-react";

/**
 * Renders the subscription upgrade confirmation modal.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @param {object} props.data - The upgrade data fetched from the API.
 */
export default function UpgradeModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  // Calculate the cost based on the data if needed, but using the pre-calculated one for simplicity based on the image
  const cost = data.estimatedMonthlyCost || data.targetTierPricePerUser * data.currentActiveUsers;
  const activeUsers = data.currentActiveUsers;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100">
        
        {/* Header and Close Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            Confirm Upgrade
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Estimated Cost Section (Purple Box) */}
          <div className="p-6 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <p className="text-sm font-medium text-purple-700">
              Estimated Monthly Cost
            </p>
            <p className="text-5xl font-extrabold text-purple-800 my-2">
              ₦{cost.toLocaleString()}
            </p>
            <p className="text-sm text-purple-600">
              Based on {activeUsers} active users
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h4 className="text-md font-semibold mb-3">
              You'll get access to:
            </h4>
            <div className="space-y-3">
              {data.featuresGained.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Prorated Warning Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
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
              // Replace with actual upgrade logic
              onClick={() => {
                alert(`Upgrading to ${data.targetTierName} for ₦${cost.toLocaleString()}`);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            >
              Confirm Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}