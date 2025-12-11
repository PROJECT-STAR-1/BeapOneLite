import { useState } from "react";
import { X, Calendar } from "lucide-react";

const vendors = [
  "TechSupply Nigeria Ltd",
  "Office Furniture Pro",
  "Global Logistics Services",
  "Power Solutions Ltd",
];

const frequencies = ["Weekly", "Bi-Weekly", "Monthly"];

export default function NewBillModal({ open, onClose }) {
  const [vendor, setVendor] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [description, setDescription] = useState("");

  const [installmentsEnabled, setInstallmentsEnabled] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState("3");
  const [paymentFrequency, setPaymentFrequency] = useState("Monthly");
  const [firstPaymentDate, setFirstPaymentDate] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Vendor Bill</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Vendor */}
        <label className="block font-medium mb-1">Vendor *</label>
        <select
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4"
        >
          <option value="">Select Vendor</option>
          {vendors.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Issue Date *</label>
            <div className="relative">
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Due Date</label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Bill Amount & Reference */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-medium mb-1">Bill Amount *</label>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Reference Number</label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g., INV-12345"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Description */}
        <label className="block font-medium mt-4 mb-1">Description</label>
        <textarea
          value={description}
          placeholder="Describe what this bill is for........."
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-md px-3 py-2 h-20"
        />

        {/* Installments Section */}
        <div className="mt-6 border rounded-lg p-4 bg-purple-50">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={installmentsEnabled}
              onChange={(e) => setInstallmentsEnabled(e.target.checked)}
            />
            <span className="font-medium">Split into Installment Payments</span>
          </label>

          {installmentsEnabled && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Number of Installments</label>
                  <input
                    type="number"
                    value={installmentsCount}
                    onChange={(e) => setInstallmentsCount(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Payment Frequency</label>
                  <select
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    {frequencies.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">First Payment Date</label>
                <input
                  type="date"
                  value={firstPaymentDate}
                  onChange={(e) => setFirstPaymentDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to default to 30 days from issue date.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-800"
          >
            Create Bill
          </button>
        </div>
      </div>
    </div>
  );
}
