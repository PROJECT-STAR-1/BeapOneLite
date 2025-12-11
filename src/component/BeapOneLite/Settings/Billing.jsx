"use client";

import { useEffect, useState } from "react";
import { UserPlus, MapPin, Check } from "lucide-react";
import UpgradeModal from "@/component/BeapOneLite/Settings/Modal/UpgradeModal";
import AddUserModal from "@/component/BeapOneLite/Settings/Modal/AddUserModal";
import MultiLocationModal from "@/component/BeapOneLite/Settings/Modal/MultiLocationModal";

export default function SettingsPage() {
  const [data, setData] = useState(null);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

   const [showAddUser, setShowAddUser] = useState(false);
  const [showMultiLocation, setShowMultiLocation] = useState(false);


  useEffect(() => {
    fetch("/api/beapOnelite/settings")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <div className="p-8">Loading...</div>;

  const { currentSubscription, tiers, addons } = data;

  const openModal = (tier) => {
    setSelectedTier(tier);
    setModalOpen(true);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
         {/* CURRENT SUBSCRIPTION */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{currentSubscription.title}</h2>
        <p className="text-gray-600">{currentSubscription.description}</p>

        <div className="border rounded-xl p-6 bg-green-50 relative">
          <span className="absolute top-4 right-4 text-sm bg-gray-200 px-2 py-1 rounded">
            {currentSubscription.plan.status}
          </span>

          <h3 className="text-lg font-bold">{currentSubscription.plan.name}</h3>
          <p className="text-gray-600">{currentSubscription.plan.tagline}</p>

          <ul className="mt-4 space-y-2">
            {currentSubscription.plan.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="text-green-600 w-5 h-5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 font-semibold">{currentSubscription.plan.price}</p>
        </div>
      </section>

      {/* SUBSCRIPTION TIERS */}
      <section className="grid md:grid-cols-2 gap-6">
        {tiers.map((tier, i) => (
          <div key={i} className="border rounded-xl p-6 bg-white shadow-sm">

            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{tier.name}</h3>

              {tier.tag && (
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {tier.tag}
                </span>
              )}
            </div>

            <p className="text-gray-600">{tier.tagline}</p>

            <ul className="mt-4 space-y-2">
              {tier.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="text-purple-600 w-5 h-5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-lg font-semibold">{tier.price}</p>

            <button
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              onClick={() => openModal(tier)}
            >
              {tier.buttonText}
            </button>
          </div>
        ))}
      </section>

      {/* ADD-ONS */}
<section className="">
  <h2 className="text-xl font-semibold">{addons.title}</h2>
  <p className="text-gray-600 mb-4">{addons.description}</p>

  <div className="space-y-4">
    
    {/* --- ADDITIONAL USER --- */}
    <div className="flex items-center justify-between border rounded-xl p-4 bg-white">
      <div className="flex items-center gap-3">
        <UserPlus className="text-blue-600 w-6 h-6" />

        <div>
          <p className="font-semibold">{addons.items[0].name}</p>
          <p className="text-gray-600 text-sm">{addons.items[0].description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-semibold">{addons.items[0].price}</span>

        <button className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
          onClick={() => setShowAddUser(true)}>
          {addons.items[0].buttonText}
        </button>
      </div>
    </div>

    {/* --- ADDITIONAL LOCATION --- */}
    <div className="flex items-center justify-between border rounded-xl p-4 bg-white">
      <div className="flex items-center gap-3">
        <MapPin className="text-green-600 w-6 h-6" />

        <div>
          <p className="font-semibold">{addons.items[1].name}</p>
          <p className="text-gray-600 text-sm">{addons.items[1].description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-semibold">{addons.items[1].price}</span>

        <button className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
        onClick={() => setShowMultiLocation(true)}>
          {addons.items[1].buttonText}
        </button>
      </div>
    </div>

  </div>
</section>


      <div>
         {/* UPGRADE MODAL */}
      <UpgradeModal
        open={modalOpen}
        tier={selectedTier}
        onClose={() => setModalOpen(false)}
      />
      </div>
       <AddUserModal open={showAddUser} onClose={() => setShowAddUser(false)} />
      <MultiLocationModal open={showMultiLocation} onClose={() => setShowMultiLocation(false)} />
    </div>
  );
}
