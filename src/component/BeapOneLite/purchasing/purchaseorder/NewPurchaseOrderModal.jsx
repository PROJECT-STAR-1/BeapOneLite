'use client';

import { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';

export default function NewPurchaseOrderModal({ isOpen, onClose }) {
  if (!open) return null;

  const vendorOptions = [
    { name: "TechSupply Nigeria Ltd", taxId: "TIN-45678901" },
    { name: "Office Furniture Pro", taxId: "TIN-78901234" },
    { name: "Global Logistics Services", taxId: "TIN-34567890" },
    { name: "Power Solutions Ltd", taxId: "TIN-56789012" }
  ];

  const departments = [
    "IT", "Admin", "Operations", "Finance",
    "Procurement", "Sales", "Marketing"
  ];

  const [poNumber] = useState("NGN01-2025-000128");
  const [vendor, setVendor] = useState("");
  const [department, setDepartment] = useState("");
  const [salesStaff, setSalesStaff] = useState("");

  const [items, setItems] = useState([
    { name: "", description: "", qty: 1, price: 0, tax: 7.5 }
  ]);

  // Add item
  const addItem = () => {
    setItems([
      ...items,
      { name: "", description: "", qty: 1, price: 0, tax: 7.5 }
    ]);
  };

  // Remove item
  const removeItem = (index) => {
    const arr = [...items];
    arr.splice(index, 1);
    setItems(arr);
  };

  // Update field
  const updateItem = (index, key, value) => {
    const arr = [...items];
    arr[index][key] = value;
    setItems(arr);
  };

  // Calculations
  const calcLineTotal = (item) =>
    (item.qty * item.price) * (1 + item.tax / 100);

  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.price, 0
  );

  const totalTax = items.reduce(
    (sum, item) => sum + (item.qty * item.price) * (item.tax / 100), 0
  );

  const grandTotal = subtotal + totalTax;

  const format = (amt) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amt);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start p-6 overflow-auto z-[9999]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">

        {/* CLOSE ICON */}
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-6 h-6 text-gray-600 hover:text-black" />
        </button>

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-gray-900">Create New Purchase Order</h2>
        <p className="text-gray-500">
          Create a formal Purchase Order to initiate procurement with vendor approval workflow
        </p>

        {/* PO NUMBER + STATUS */}
        <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-xs font-medium">PO Number (Auto-generated)</p>
            <p className="font-bold text-indigo-900 text-lg">{poNumber}</p>
          </div>
          <div>
            <p className="text-xs font-medium">Status</p>
            <span className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded-full">
              Draft
            </span>
          </div>
        </div>

        {/* FORM FIELDS */}
        <div className="mt-6 space-y-4">

          {/* Vendor */}
          <div>
            <label className="text-sm font-medium">Vendor *</label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
            >
              <option value="">Select vendor...</option>
              {vendorOptions.map((v) => (
                <option key={v.taxId} value={v.name}>
                  {v.name} — {v.taxId}
                </option>
              ))}
            </select>
          </div>

          {/* Department & Sales Staff */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option value="">Select department...</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Sales Staff (Optional)</label>
              <input
                type="email"
                placeholder="e.g., adebayo@example.com"
                className="w-full mt-1 p-2 border rounded-lg"
                value={salesStaff}
                onChange={(e) => setSalesStaff(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* LINE ITEMS SECTION */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Line Items</h3>
            <button
              className="flex items-center text-indigo-600 font-medium"
              onClick={addItem}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="mt-4 p-4 border rounded-lg bg-gray-50">

              <p className="font-semibold">Item #{index + 1}</p>

              {/* Item name + description */}
              <div className="grid grid-cols-2 gap-4 mt-3">
               <div className='flex flex-col gap-1'>
                 <label className='font-medium'> item Name *</label>
                <input
                  type="text"
                  placeholder="eg,, del laptop"
                  className="p-2 border rounded-lg"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                />
               </div>
                <div className='flex flex-col gap-1'>
                <label className='font-medium'> item description*</label>
                <input
                  type="text"
                  placeholder="
e.g., 14 inch FHD, i5, 8GB RAM
"
                  className="p-2 border rounded-lg"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
                </div>
              </div>

              {/* Qty, price, tax */}
              <div className="grid grid-cols-3 gap-4 mt-3">

                <div className='flex flex-col gap-1'>
                    <label htmlFor=""> Quantity*</label>
                    <input
                  type="number"
                  min="1"
                  className="p-2 border rounded-lg"
                  value={item.qty}
                  onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                />
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="">Unit Price (NGN) *</label>
                    <input
                  type="number"
                  min="0"
                  className="p-2 border rounded-lg"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="">Tax Rate (%)</label>
                    
                <input
                  type="number"
                  min="0"
                  className="p-2 border rounded-lg"
                  value={item.tax}
                  onChange={(e) => updateItem(index, 'tax', Number(e.target.value))}
                />
                </div>

              </div>

              {/* Line total + delete */}
              <div className="flex justify-between items-center mt-4">
                <p className="font-semibold">
                  Line Total (incl. tax): {format(calcLineTotal(item))}
                </p>

                {items.length > 1 && (
                  <button
                    className="text-red-600 flex items-center"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="mt-6 p-4 bg-indigo-900 text-white rounded-lg space-y-2">
          <p>Subtotal: {format(subtotal)}</p>
          <p>Total Tax: {format(totalTax)}</p>
          <p className="font-bold text-lg">
            Total Amount: {format(grandTotal)}
          </p>
        </div>

        {/* DIGITAL SIGN OFF INFO */}
        <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg flex space-x-2">
          <AlertCircle className="w-5 h-5 mt-1" />
          <p>
            This PO will be created in <strong>Draft</strong> status.
            A mandatory digital sign-off is required before issuing to vendor.
          </p>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 border rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="px-5 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800">
            Create Purchase Order
          </button>
        </div>

      </div>
    </div>
  );
}
