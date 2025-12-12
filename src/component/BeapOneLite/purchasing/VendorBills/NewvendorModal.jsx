'use client';

import { useState } from 'react';
import { Plus, Trash } from 'lucide-react';

export default function NewVendorModal({ open, onClose }) {
  if (!open) return null;

  // MAIN FORM STATE
  const [vendorName, setVendorName] = useState('');
  const [ewallet, setEwallet] = useState('');
  const [taxId, setTaxId] = useState('');
  const [regNo, setRegNo] = useState('');
  const [address, setAddress] = useState('');

  const [phones, setPhones] = useState(['']);
  const [whatsapps, setWhatsapps] = useState(['']);
  const [emails, setEmails] = useState(['']);

  // Helpers
  const addItem = (setter, list) => setter([...list, '']);
  const updateItem = (setter, list, index, value) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };
  const deleteItem = (setter, list, index) => {
    if (list.length === 1) return;
    setter(list.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = () => {
    const payload = {
      vendorName,
      ewallet,
      taxId,
      regNo,
      address,
      phones,
      whatsapps,
      emails,
    };

    console.log("NEW VENDOR:", payload);

    // TODO: Send to API

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* HEADER */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          New Vendor
        </h2>
        <p className="text-gray-600 mb-4">
          Create a new vendor profile with E-Wallet details
        </p>

        <div className="space-y-4">

          {/* Vendor Name */}
          <div>
            <label className="text-sm font-medium">Vendor Name *</label>
            <input
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="TechSupply Nigeria Ltd"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </div>

          {/* E-Wallet */}
          <div>
            <label className="text-sm font-medium">E-Wallet Address *</label>
            <input
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="ewallet-vendor@example.com"
              value={ewallet}
              onChange={(e) => setEwallet(e.target.value)}
            />
          </div>

          {/* TAX + REG NO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tax ID / VAT Number</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="TIN-45678901"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Business Registration No.</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="RC-123456"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Address</label>
            <input
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="15 Adeola Odeku Street, Lagos"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Phones */}
          <div>
            <section className='flex justify-between'>
                <label className="text-sm font-medium">Phone Numbers</label>
            <button
              className="flex items-center text-blue-600 mt-1"
              onClick={() => addItem(setPhones, phones)}
            >
              <Plus size={18} className="mr-1" /> Add
            </button>
            </section>
            {phones.map((p, i) => (
              <div key={i} className="flex items-center mt-1">
                <input
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="+234-802-555-0101"
                  value={p}
                  onChange={(e) =>
                    updateItem(setPhones, phones, i, e.target.value)
                  }
                />

                {phones.length > 1 && (
                  <button
                    onClick={() => deleteItem(setPhones, phones, i)}
                    className="ml-2 text-red-600"
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            ))}

            
          </div>

          {/* WhatsApp */}
          <div>
            <section className='flex justify-between'> 
            <label className="text-sm font-medium">WhatsApp Numbers</label>
             <button
              className="flex items-center text-blue-600 mt-1"
              onClick={() => addItem(setWhatsapps, whatsapps)}
            >
              <Plus size={18} className="mr-1" /> Add
            </button>

            </section>
            {whatsapps.map((w, i) => (
              <div key={i} className="flex items-center mt-1">
                <input
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="+234-802-555-0101"
                  value={w}
                  onChange={(e) =>
                    updateItem(setWhatsapps, whatsapps, i, e.target.value)
                  }
                />

                {whatsapps.length > 1 && (
                  <button
                    onClick={() => deleteItem(setWhatsapps, whatsapps, i)}
                    className="ml-2 text-red-600"
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            ))}

           
          </div>

          {/* Emails */}
          <div>
            <section className='flex justify-between'>
            <label className="text-sm font-medium">Email Addresses</label>
              <button
              className="flex items-center text-blue-600 mt-1"
              onClick={() => addItem(setEmails, emails)}
            >
              <Plus size={18} className="mr-1" /> Add
            </button>

            </section>
            {emails.map((e, i) => (
              <div key={i} className="flex items-center mt-1">
                <input
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="accounts@vendor.com"
                  value={e}
                  onChange={(ev) =>
                    updateItem(setEmails, emails, i, ev.target.value)
                  }
                />

                {emails.length > 1 && (
                  <button
                    onClick={() => deleteItem(setEmails, emails, i)}
                    className="ml-2 text-red-600"
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            ))}

          
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Create Vendor
          </button>
        </div>
      </div>
    </div>
  );
}
