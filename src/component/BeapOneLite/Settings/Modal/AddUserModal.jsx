"use client";

import { X } from "lucide-react";

export default function AddUserModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative shadow-lg">

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold">Add User</h2>
        <p className="text-gray-600 text-sm mb-4">
          Add a new user to your business.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              placeholder="+234 XXX XXX XXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>Cashier (Location-Restricted)</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button className="px-6 py-2 bg-black text-white rounded-md">
            Send Invitation
          </button>
        </div>

      </div>
    </div>
  );
}
