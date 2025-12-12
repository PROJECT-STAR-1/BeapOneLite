"use client";

import { useEffect, useState } from "react";
import { CheckCircle, CircleAlert, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/beapOnelite/a2-7-A2-4Portal");
      const json = await res.json();
      setData(json);
    }
    load();
  }, []);

  if (!data) {
    return <div className="p-6 text-gray-500">Loading…</div>;
  }

  const statusConfig = {
    "On Track": {
      color: "bg-green-100 text-green-700 border border-green-300",
      icon: <CheckCircle className="w-4 h-4" />
    },
    "Exceeds": {
      color: "bg-green-100 text-green-700 border border-green-300",
      icon: <TrendingUp className="w-4 h-4" />
    },
    "Meets": {
      color: "bg-blue-100 text-blue-700 border border-blue-300",
      icon: <CheckCircle className="w-4 h-4" />
    }
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold">Consolidated KPIs & Metrics</h2>
        <p className="text-gray-500 mt-1">
          Performance indicators for channel management integration
        </p>

        <table className="w-full mt-6">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3">KPI / Metric</th>
              <th className="py-3">Current Value</th>
              <th className="py-3">Target</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.kpis.map((kpi, i) => {
              const style = statusConfig[kpi.status];

              return (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-4">{kpi.metric}</td>
                  <td className="py-4 text-gray-700">{kpi.currentValue}</td>
                  <td className="py-4 text-gray-700">{kpi.target}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${style.color}`}
                    >
                      {style.icon}
                      {kpi.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
