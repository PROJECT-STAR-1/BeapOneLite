"use client";

import {
  FileEdit,
  Calculator,
  Webhook,
  Shuffle,
} from "lucide-react";

const auditData = [
  {
    id: 1,
    type: "TIER CHANGE",
    icon: <FileEdit className="text-purple-600 w-5 h-5" />,
    tag: "USER_ACTION",
    date: "Nov 1, 2024, 01:00 AM",
    note: "Business expanded to 5 users and 2 locations. Upgraded to access Bank Reconciliation and Project Profitability features.",
    author: "Adebayo Okonkwo",
    from: "FREE",
    to: "STANDARD",
  },
  {
    id: 2,
    type: "CHARGE CALC",
    icon: <Calculator className="text-blue-600 w-5 h-5" />,
    tag: "S1_CRON",
    date: "Nov 1, 2024, 11:30 AM",
    chargeAmount: "₦7,500",
  },
  {
    id: 3,
    type: "PG WEBHOOK RECEIVE",
    icon: <Webhook className="text-green-600 w-5 h-5" />,
    tag: "PG_WEBHOOK",
    date: "Nov 1, 2024, 11:35 AM",
    chargeAmount: "₦7,500",
    status: "Pending → Paid",
  },
  {
    id: 4,
    type: "STATUS TRANSITION",
    icon: <Shuffle className="text-gray-700 w-5 h-5" />,
    tag: "USER_ACTION",
    date: "Oct 15, 2024, 03:22 PM",
    note: "Evaluated STANDARD tier but decided to stay on FREE for now. Will upgrade when second location opens.",
    author: "Adebayo Okonkwo",
    from: "FREE",
    to: "FREE",
  },
];

export default function Audit() {
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-1">Subscription Audit Log</h2>
      <p className="text-sm text-gray-600 mb-6">
        Immutable record of all subscription changes and billing events
      </p>

      <div className="space-y-6">
        {auditData.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold">{item.type}</p>
                  <p className="text-xs text-gray-600">{item.date}</p>
                </div>
              </div>

              <span className="text-xs px-2 py-1 rounded border bg-white">
                {item.tag}
              </span>
            </div>

            {/* Audit Note */}
            {item.note && (
              <div className="mt-4 border rounded-lg bg-blue-50 p-4">
                <p className="text-sm mb-1">{item.note}</p>
                <p className="text-xs text-gray-700 font-medium">
                  By: {item.author}
                </p>
              </div>
            )}

            {/* Charge */}
            {item.chargeAmount && (
              <p className="mt-3 text-sm font-medium">
                Charge Amount: <span>{item.chargeAmount}</span>
              </p>
            )}

            {/* Status */}
            {item.status && (
              <p className="mt-1 text-sm">Status: {item.status}</p>
            )}

            {/* From → To */}
            {item.from && (
              <p className="mt-3 text-sm">
                {item.from} → <span className="font-semibold">{item.to}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
