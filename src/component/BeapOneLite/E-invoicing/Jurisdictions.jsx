"use client";

import { useEffect, useState } from "react";
import { Globe, FileJson, Gauge, Building2, Check } from "lucide-react";

export default function Jurisdictions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/beapOnelite/einvoice") // adjust path to your JSON file
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!data) return <p className="text-red-500">Failed to load data.</p>;

  const { jurisdictions, plannedJurisdictions, rolloutMetrics, oStackStatus } = data;

  return (
    <div className="w-full space-y-8 mt-5">
      {/* ------------------------------------------------------ */}
      {/* Pan-African Rollout Strategy */}
      {/* ------------------------------------------------------ */}
      <div className="border rounded-xl p-5 bg-gray-100 shadow-sm">
        <div className="flex items-start gap-3">
          <Globe size={20} className="mt-1 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-800">
              Pan-African E-Invoicing Rollout Strategy:
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              BEAPOne O-Stack currently supports {jurisdictions.length} active jurisdictions with{" "}
              {plannedJurisdictions.length} markets planned for deployment. Each jurisdiction operates as a
              decentralized O16 I-DEM Spoke connected to the centralized O4 I-CEM Hub.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* Active Jurisdictions */}
      {/* ------------------------------------------------------ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-lg">
            Active Jurisdictions
          </h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
            {jurisdictions.length} LIVE
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Currently operational O16 I-DEM Spokes ({jurisdictions.length} markets)
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {jurisdictions.map((j) => (
            <div
              key={j.id}
              className="border-2 border-emerald-400 rounded-xl p-5 bg-green-50 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Globe className="text-green-600" size={20} />
                  <span className="font-semibold text-gray-900">{j.name}</span>
                </div>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-md">
                  {j.status}
                </span>
              </div>

              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                  {j.code}
                </span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                  {j.currency}
                </span>
              </div>

              <div className="mt-4 flex items-start gap-2">
                <Building2 size={16} className="text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Tax Authority</p>
                  <p className="text-sm font-medium text-gray-800">
                    {j.taxAuthority}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2">
                <FileJson size={16} className="text-gray-700 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Schema Format</p>
                  <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded-md">
                    {j.schemaFormat}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2">
                <Gauge size={16} className="text-gray-700 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Avg Latency</p>
                  <span className="text-sm text-gray-900 font-medium">{j.latency}ms</span>
                </div>
              </div>

              <div className="border border-emerald-100 w-full mt-3"></div>

              {j.complianceDeadline && (
                <p className="mt-4 text-xs text-gray-600">
                  Compliance Deadline: {j.complianceDeadline}
                </p>
              )}

              <div className="border border-emerald-100 w-full mt-3"></div>

              <p className="mt-3 text-xs text-blue-600 font-mono">{j.endpoint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* Planned Jurisdictions */}
      {/* ------------------------------------------------------ */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-lg">
            Planned Jurisdictions
          </h3>

          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
            {plannedJurisdictions.length} PLANNED
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Markets in pipeline for O16 I-DEM Spoke deployment ({plannedJurisdictions.length} markets)
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {plannedJurisdictions.map((j) => (
            <div
              key={j.id}
              className="border rounded-xl p-5 bg-gray-50 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Globe className="text-gray-600" size={20} />
                  <span className="font-semibold text-gray-900">{j.name}</span>
                </div>

                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md">
                  {j.status}
                </span>
              </div>

              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                  {j.code}
                </span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                  {j.currency}
                </span>
              </div>

              <div className="mt-4 flex items-start gap-2">
                <Building2 size={16} className="text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Tax Authority</p>
                  <p className="text-sm font-medium text-gray-800">{j.taxAuthority}</p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2">
                <FileJson size={16} className="text-gray-700 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Schema Format</p>
                  <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded-md">
                    {j.schemaFormat}
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 w-full mt-4"></div>

              <p className="mt-3 text-xs text-gray-600">Status: Awaiting Deployment</p>

              <div className="border border-gray-200 w-full mt-3"></div>

              <p className="mt-3 text-xs text-blue-600 font-mono">{j.endpoint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* Rollout Metrics */}
      {/* ------------------------------------------------------ */}
      <div className="border rounded-xl p-6 bg-white/90 shadow-sm">
        <h3 className="font-semibold text-gray-800 text-lg">Pan-African Rollout Strategy</h3>
        <p className="text-sm text-gray-600 mt-1">
          Hub-and-Spoke model for scalable compliance across 20+ African markets
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-2xl font-semibold text-purple-700">
              {rolloutMetrics.marketsOperational}/{rolloutMetrics.totalMarkets}
            </p>
            <p className="text-sm text-gray-600">Markets Operational</p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-2xl font-semibold text-purple-700">{rolloutMetrics.deploymentProgress}%</p>
            <p className="text-sm text-gray-600">Deployment Progress</p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-2xl font-semibold text-purple-700">{rolloutMetrics.deploymentTime}</p>
            <p className="text-sm text-gray-600">Spoke Deployment Time</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-medium text-gray-800 mb-2">Key Architecture Principles</p>
          <div className="border rounded-lg p-4 bg-gray-50">
            <ul className="space-y-2">
              {rolloutMetrics.principles.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">
                    <Check size={16} />
                  </span>
                  <span className="text-sm text-gray-700">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* O-Stack Architecture Status */}
      {/* ------------------------------------------------------ */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <p className="font-semibold text-gray-800 text-lg">O-Stack Architecture Status</p>
        <p className="text-sm text-gray-600 mt-1">Centralized Hub (O4) / Decentralized Spoke (O16) Model</p>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* O4 HUB */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-purple-600" />
              <p className="font-medium text-gray-900">{oStackStatus.hub.name}</p>
            </div>
            <p className="text-xs text-gray-600 mt-1">{oStackStatus.hub.description}</p>
            <span className="mt-3 inline-block text-xs px-2 py-1 rounded-md bg-green-100 text-green-700">
              {oStackStatus.hub.status}
            </span>
          </div>

          {/* O16 SPOKES */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-purple-600" />
              <p className="font-medium text-gray-900">{oStackStatus.spokes.name}</p>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {oStackStatus.spokes.active} Active / {oStackStatus.spokes.planned} Planned
            </p>
            <span className="mt-3 inline-block text-xs px-2 py-1 rounded-md bg-green-100 text-green-700">
              {oStackStatus.spokes.status}
            </span>
          </div>

          {/* O7 / O13 */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-purple-600" />
              <p className="font-medium text-gray-900">{oStackStatus.treasury.name}</p>
            </div>
            <p className="text-xs text-gray-600 mt-1">{oStackStatus.treasury.description}</p>
            <span className="mt-3 inline-block text-xs px-2 py-1 rounded-md bg-green-100 text-green-700">
              {oStackStatus.treasury.uptime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
