"use client";

import { useEffect, useState } from "react";
import { Building2, MapPin } from "lucide-react";
import LocationModal from "@/component/BeapOneLite/Settings/Modal/LocationModal";

export default function SettingsPage() {
  const [data, setData] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/beapOnelite/settings");
      const json = await res.json();
      setData(json.businessLocations);
    }
    load();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  // Handle "Add Location"
  function handleAdd() {
    setEditingLocation({
      name: "",
      code: "",
      address: "",
      primary: false,
    });
    setIsModalOpen(true);
  }

  // Handle "Edit Location"
  function handleEdit(loc) {
    setEditingLocation(loc);
    setIsModalOpen(true);
  }

  // Save handler
  function handleSave(updated) {
    console.log("Saving:", updated);
    setIsModalOpen(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold">Business Locations</h1>
          <p className="text-gray-600 mt-1">Manage your branches and locations</p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <MapPin size={18} />
          Add Location
        </button>
      </div>

      {/* Locations List */}
      <div className="mt-6 space-y-4">
        {data.locations.map((loc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-5 border rounded-xl bg-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <Building2 size={22} />
              </div>

              <div>
                <p className="font-medium">{loc.name}</p>
                <p className="text-sm text-gray-500">{loc.code}</p>

                {loc.primary && (
                  <span className="inline-block mt-1 text-xs px-2 py-1 bg-gray-200 rounded-md">
                    Primary
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleEdit(loc)}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Add-on Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-700 border border-blue-100">
        {data.multiLocationAddon.description}
      </div>

      {/* Modal Component */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingLocation}
      />
    </div>
  );
}
