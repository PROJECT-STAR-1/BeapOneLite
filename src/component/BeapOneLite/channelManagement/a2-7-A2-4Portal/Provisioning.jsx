"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, UserPlus } from "lucide-react";

export default function BeapOneLitePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/a2-7-A2-4Portal")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  const { provisionForm, quota, recentRequests } = data;
  const usagePercent = (quota.quotaUsed / quota.quotaTotal) * 100;

  return (
    <div className=" space-y-8 bg-gray-50 min-h-screen">

      {/* Provision Form */}
      <div className="rounded-xl p-6 bg-white shadow-md space-y-6">
        <h2 className="text-xl font-semibold">{provisionForm.title}</h2>
        <p className="text-gray-600">{provisionForm.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">

          <div>
            <label className="text-sm font-semibold">Client Email *</label>
            <input className="w-full rounded-lg p-2 mt-1 bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="client@company.com" />
          </div>

          <div>
            <label className="text-sm font-semibold">Client Name *</label>
            <input className="w-full rounded-lg p-2 mt-1 bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500" defaultValue={provisionForm.fields.clientName} />
          </div>

          <div>
            <label className="text-sm font-semibold">Country</label>
            <select className="w-full rounded-lg p-2 mt-1 bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500">
              <option>Select country</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Initial Tier</label>
            <select className="w-full rounded-lg p-2 mt-1 bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500">
              <option>Select tier</option>
            </select>
          </div>
        </div>

        <button className="bg-indigo-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 mt-4 hover:bg-indigo-800 transition">
          <UserPlus size={18} />
          {provisionForm.buttonText}
        </button>
      </div>

      {/* Quota Section */}
      <div className="rounded-xl p-6 bg-white shadow-md space-y-4">
        <h2 className="text-lg font-semibold">{quota.title}</h2>
        <p className="text-gray-600">{quota.subtitle}</p>

        <div>
          <p className="font-semibold">{quota.partnerName}</p>
          <p className="text-gray-600">{quota.partnerDetails}</p>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold">Quota Usage</span>
          <span className="text-green-600">
            {quota.quotaUsed} / {quota.quotaTotal} Used
          </span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
          <div
            className="h-3 bg-indigo-900 rounded-full"
            style={{ width: `${usagePercent}%` }}
          />
        </div>

        <p className="text-gray-600 pt-1">{quota.remaining} provisions remaining</p>
      </div>

      {/* Recent Requests */}
      <div className="rounded-xl p-6 bg-white shadow-md space-y-4">
        <h2 className="text-lg font-semibold">{recentRequests.title}</h2>
        <p className="text-gray-600">{recentRequests.subtitle}</p>

        <div className="space-y-4">

          {recentRequests.entries.map((req, i) => {
            const SuccessIcon = req.status === "Success" ? CheckCircle : AlertCircle;
            const iconColor = req.status === "Success" ? "text-green-600" : "text-red-600";

            return (
              <div key={i} className="rounded-lg p-4 shadow-sm bg-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <SuccessIcon className={iconColor} size={22} />
                  <div>
                    <p className="font-medium">{req.email}</p>
                    <p className="text-gray-600 text-sm">{req.timestamp}</p>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  req.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {req.status}
                </div>

                <span className="text-gray-600">{req.duration}</span>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}
