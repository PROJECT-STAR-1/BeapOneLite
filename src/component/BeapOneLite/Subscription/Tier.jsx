"use client";

import {
  MapPin,
  Database,
  Mail,
  Phone,
  Check,
  X,
} from "lucide-react";

const pricingData = [
  {
    id: "free",
    title: "Free Tier",
    price: 0,
    locations: "1 Location",
    storage: "1 GB Storage",
    einvoice: "₦100 (up to 0% off)",
    support: "Community Support",
    recommended: false,
    current: false,
    features: {
      invoicing: true,
      expenseTracking: true,
      accountManagement: true,
      bankReconciliation: false,
      projectProfitability: false,
      financialReporting: false,
    },
  },
  {
    id: "standard",
    title: "Standard Tier",
    price: 1500,
    locations: "2 Locations",
    storage: "5 GB Storage",
    einvoice: "₦50 (up to 15% off)",
    support: "Email Support (24hr SLA)",
    recommended: true,
    current: true, // <-- mark current tier
    features: {
      invoicing: true,
      expenseTracking: true,
      accountManagement: true,
      bankReconciliation: true,
      projectProfitability: true,
      financialReporting: true,
    },
  },
  {
    id: "premium",
    title: "Premium Tier",
    price: 3500,
    locations: "Unlimited Locations",
    storage: "10 GB Storage",
    einvoice: "₦50 (up to 30% off)",
    support: "Priority Phone/Chat (1hr SLA)",
    recommended: false,
    current: false,
    features: {
      invoicing: true,
      expenseTracking: true,
      accountManagement: true,
      bankReconciliation: true,
      projectProfitability: true,
      financialReporting: true,
    },
  },
];

export default function Tier() {
  return (
    <div className="w-full flex justify-center py-12">
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        {pricingData.map((tier) => {
          const isCurrent = tier.current;

          return (
            <div
              key={tier.id}
              className={`border rounded-xl shadow-sm p-6 flex flex-col relative ${
                isCurrent
                  ? "border-purple-600 ring-2 ring-purple-400"
                  : "border-gray-200"
              }`}
            >
              {/* Recommended badge */}
              {tier.recommended && (
                <span className="absolute top-0 -translate-y-1/2 left-4 bg-yellow-400 text-sm font-medium px-3 py-1 rounded-full">
                  Recommended
                </span>
              )}

              {/* Current badge */}
              {tier.current && (
                <span className="absolute top-0 right-4 -translate-y-1/2 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Current
                </span>
              )}

              <h2 className="text-2xl font-bold text-center mt-4">
                {tier.title}
              </h2>

              <p className="text-center mt-4 text-4xl font-extrabold">
                ₦{tier.price.toLocaleString()}
              </p>
              <p className="text-center text-gray-500 -mt-1">
                per user/month
              </p>

              {/* Metadata */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={18} /> {tier.locations}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Database size={18} /> {tier.storage}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={18} /> eInvoice: {tier.einvoice}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} /> {tier.support}
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">FEATURES INCLUDED:</h3>
                <ul className="space-y-2 text-gray-700">
                  {Object.entries(tier.features).map(([key, value]) => {
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());

                    return (
                      <li key={key} className="flex items-center gap-2">
                        {value ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <X size={18} className="text-gray-400" />
                        )}
                        {label}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-6">
                {isCurrent ? (
                  <></>
                ) : (
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg">
                    {tier.price === 0
                      ? "Downgrade to Free Tier"
                      : "Upgrade to " + tier.title}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
