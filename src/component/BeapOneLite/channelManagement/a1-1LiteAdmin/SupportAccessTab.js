"use client";

import { useEffect, useState } from "react";
import { Eye, AlertTriangle } from "lucide-react";

export default function SupportAccessPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/a1-1LiteAdmin")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className=" max-w-4xl space-y-8">

      {/* TITLE */}
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600" />
          {data.title}
        </h1>
        <p className="text-gray-600 mt-1">{data.subtitle}</p>
      </div>

      {/* SECURITY NOTICE BOX */}
      <div className="border rounded-md bg-yellow-50 p-5 flex gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-600" />
        <div>
          <h2 className="font-semibold text-yellow-700">
            {data.securityNoticeHeading}
          </h2>
          <p className="text-sm text-yellow-800 mt-1">
            {data.securityNoticeText}
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-6">

        {/* INSTANCE */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            {data.form.instanceLabel}
          </label>
          <select className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-50">
            <option>{data.form.instancePlaceholder}</option>
          </select>
        </div>

        {/* TICKET */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            {data.form.ticketLabel}
          </label>
          <input
            type="text"
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder={data.form.ticketPlaceholder}
          />
        </div>

        {/* JUSTIFICATION */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            {data.form.justificationLabel} *
          </label>
          <textarea
            className="mt-1 w-full border rounded-md px-3 py-2 h-28"
            placeholder={data.form.justificationPlaceholder}
          />
          <p className="text-xs text-gray-500 mt-1">
            This note will be permanently recorded in the audit log.
          </p>
        </div>

        {/* BUTTON */}
        <button className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2">
          <Eye className="w-4 h-4" />
          {data.form.buttonText}
        </button>
      </div>

      {/* RECENT SESSIONS */}
      <div className="border rounded-md p-6 bg-white space-y-4">
        <h2 className="font-semibold text-lg">
          {data.sessionsSection.title}
        </h2>
        <p className="text-gray-600">{data.sessionsSection.subtitle}</p>

        {data.sessionsSection.sessions.map((s, idx) => (
          <div
            key={idx}
            className="border rounded-md p-4 flex items-start justify-between bg-gray-50"
          >
            <div className="flex gap-3">
              <Eye className="w-6 h-6 text-indigo-600" />
              <div>
                <p className="font-semibold">{s.instance}</p>
                <p className="text-sm text-gray-700">{s.staff}</p>
                <p className="text-sm text-gray-600 mt-1">{s.description}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">{s.timestamp}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
