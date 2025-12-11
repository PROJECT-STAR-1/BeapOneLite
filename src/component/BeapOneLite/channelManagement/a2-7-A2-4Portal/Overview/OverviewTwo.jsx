"use client";

import { useEffect, useState } from "react";
import {
  Circle,
  CheckCircle,
  Info,
  ArrowRight
} from "lucide-react";

export default function IntegrationPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/a2-7-A2-4Portal")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-8">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          {data.titles}
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
            {data.badge}
          </span>
        </h1>
        <p className="text-gray-600">{data.subtitles}</p>
      </div>

      {/* FLOWS */}
      <div className="space-y-6">
        {data.flows.map((flow) => (
          <div key={flow.id} className="p-6 bg-white shadow rounded-lg">
            <div className="flex items-start gap-4">
              {/* Colored Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                  flow.id === 1
                    ? "bg-blue-600"
                    : flow.id === 2
                    ? "bg-green-600"
                    : "bg-purple-600"
                }`}
              >
                {flow.id}
              </div>

              {/* Flow Details */}
              <div>
                <h2 className="text-lg font-semibold">{flow.title}</h2>
                <p className="mt-1">
                  <strong>{flow.method}</strong> {flow.endpoint} –{" "}
                  {flow.notes}
                </p>

                {flow.payload && (
                  <p className="text-gray-700 mt-1">
                    <strong>Payload:</strong> {flow.payload}
                  </p>
                )}

                {flow.response && (
                  <p className="text-gray-700 mt-1">
                    <strong>Response:</strong> {flow.response}
                  </p>
                )}

                {flow.billingNote && (
                  <p className="text-gray-700 mt-1">
                    → {flow.billingNote}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* KPI SECTION */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h3 className="font-semibold text-lg mb-4">
          {data.kpiTitle}
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.kpiss.map((kpi, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="text-green-600 w-5 h-5" />
              <span>{kpi}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PROTOTYPE MODE BOX */}
      <div className="p-6 bg-yellow-100 border-yellow-300 border rounded-lg">
        <h4 className="font-semibold mb-1 flex items-center gap-2">
          <Info className="w-5 h-5 text-yellow-700" />
          {data.prototypeMode.title}
        </h4>
        <p className="text-yellow-800">{data.prototypeMode.text}</p>
      </div>
    </div>
  );
}
