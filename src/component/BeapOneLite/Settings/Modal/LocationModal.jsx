"use client";
import { useState, useEffect } from "react";

export default function LocationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  if (!isOpen) return null;

  const [form, setForm] = useState(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold">Edit Location</h2>
        <p className="text-gray-600 mt-1 mb-5">
          Edit the selected location details.
        </p>

        {/* Form Layout */}
        <div className="space-y-5">
          {/* Location Name + Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Location Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 mt-1 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location Code</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                className="w-full p-3 mt-1 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-black outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Location Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg border bg-gray-50 h-20 resize-none focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Primary Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Primary Location</span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="primary"
                className="sr-only peer"
                checked={form.primary}
                onChange={handleChange}
              />

              {/* Track */}
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-black transition-colors"></div>

              {/* Thumb */}
              <div
                className="
      absolute left-0.5 top-0.5 
      w-5 h-5 bg-white rounded-full shadow 
      transition-transform 
      peer-checked:translate-x-5
    "
              ></div>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-900"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
