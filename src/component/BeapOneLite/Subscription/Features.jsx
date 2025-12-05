"use client";

import { Lock, Unlock,  Shield, CircleCheckBig } from "lucide-react";

const features = [
  // Accessible modules (Standard Tier)
  {
    id: "M1",
    title: "Client Invoicing",
    tier: "standard",
    accessible: true,
  },
  {
    id: "M2",
    title: "Expense Tracking",
    tier: "standard",
    accessible: true,
  },
  {
    id: "M3",
    title: "Account Management",
    tier: "standard",
    accessible: true,
  },
  {
    id: "M4",
    title: "Bank Reconciliation",
    tier: "standard",
    accessible: true,
  },
  {
    id: "M5",
    title: "Project Profitability",
    tier: "standard",
    accessible: true,
  },
  {
    id: "M6",
    title: "Financial Reporting",
    tier: "standard",
    accessible: true,
  },

  // Premium locked modules
  {
    id: "M7",
    title: "Bills & Payables",
    tier: "premium",
    accessible: false,
  },
  {
    id: "M8",
    title: "Procurement",
    tier: "premium",
    accessible: false,
  },
  {
    id: "M9",
    title: "Sales Orders",
    tier: "premium",
    accessible: false,
  },
  {
    id: "M10",
    title: "Document Management",
    tier: "premium",
    accessible: false,
  },
];

export default function Features() {
  return (
    <div className="w-full  p-3">
      <h2 className="text-lg font-semibold mb-1 flex gap-1 items-center">
        <Shield size={24}/>
        Feature Entitlement Matrix
      </h2>
      <p className="text-gray-600 mb-6">
        Your current Standard Tier plan includes access to the following modules
      </p>

      <div className="space-y-3">
        {features.map((f) => (
          <div
            key={f.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition
              ${f.accessible 
                ? "bg-green-50 border-green-200" 
                : "bg-gray-50 border-gray-200"
              }
            `}
          >
            <div className="flex items-center gap-3">
              {f.accessible ? (
                <Unlock className="text-green-600 w-5 h-5" />
              ) : (
                <Lock className="text-gray-500 w-5 h-5" />
              )}

              <span className="font-medium">
                {f.id}: {f.title}
              </span>
            </div>

            {f.accessible ? (
              <span className="text-green-700 text-sm font-medium flex items-center gap-1">
                <CircleCheckBig className="w-4 h-4"/>
                Accessible
              </span>
            ) : (
              <button className="text-purple-600 text-sm font-medium px-3 py-1 rounded-md border border-purple-300 hover:bg-purple-100 transition">
                Upgrade to Access
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
