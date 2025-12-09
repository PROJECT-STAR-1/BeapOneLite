"use client";

import { Info, X } from "lucide-react";

export default function MultiLocationModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">

          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Info size={28} className="text-blue-500" />
          </div>

          <h2 className="text-xl font-semibold">Multi-Location Add-On</h2>

          <p className="text-gray-600 text-sm mt-2 mb-6">
            To add additional locations, you need to subscribe to this add-on at
            <strong> $7/month per location</strong>. Upgrade your plan to unlock
            multi-location support.
          </p>

          <button
            onClick={onClose}
            className="px-8 py-2 bg-indigo-900 text-white rounded-md"
          >
            OK
          </button>
        </div>

      </div>
    </div>
  );
}
