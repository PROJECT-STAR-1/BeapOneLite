"use client";

import { X, AlertCircle } from "lucide-react";

export default function UpgradeModal({ open, onClose, tier }) {
  if (!open || !tier) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X />
        </button>

        {/* Icon Header */}
        <div className="w-full bg-purple-100 rounded-full py-6 flex justify-center mb-6">
          <AlertCircle className="text-purple-700 w-10 h-10" />
        </div>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Upgrade to {tier.name}?
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center max-w-md mx-auto">
          You will be charged {tier.price}. This upgrade will unlock{" "}
          {tier.features.join(", ")} features.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="border px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            className="bg-purple-900 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
