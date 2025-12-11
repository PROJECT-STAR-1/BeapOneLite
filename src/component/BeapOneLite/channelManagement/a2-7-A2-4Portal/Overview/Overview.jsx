"use client";

import { useEffect, useState } from "react";
import OverviewTwo from "@/component/BeapOneLite/channelManagement/a2-7-A2-4Portal/Overview/OverviewTwo"
import {
  Users,
  DollarSign,
  CheckCircle,
  BarChart3,
  Globe,
  Rocket,
  Layers,
  Monitor,
  ArrowRightCircle
} from "lucide-react";

export default function ChannelPortalPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/a2-7-A2-4Portal")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-8">Loading…</div>;

  const { header, why_become_partner, how_it_works, real_story } = data;

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="p-10 bg-[#1a1572] text-white rounded-b-2xl shadow-md">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8" />
          {header.title}
        </h1>

        <p className="mt-1 text-lg opacity-90">{header.subtitle}</p>

        <p className="mt-4 max-w-4xl text-white/90 leading-relaxed">
          {header.description}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <p className="text-3xl font-bold">{header.metrics.monthly_partner_revenue}</p>
            <p className="opacity-90 mt-1">Monthly Partner Revenue</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <p className="text-3xl font-bold">{header.metrics.active_client_accounts}</p>
            <p className="opacity-90 mt-1">Active Client Accounts</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <p className="text-3xl font-bold">{header.metrics.provisioning_success_rate}</p>
            <p className="opacity-90 mt-1">Provisioning Success Rate</p>
          </div>
        </div>
      </div>

      {/* WHY BECOME A PARTNER */}
      <div className="p-10">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle className="text-green-600 w-6 h-6" />
          {why_become_partner.title}
        </h2>
        <p className="text-gray-600 mt-1">{why_become_partner.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {why_become_partner.items.map((item, idx) => {
            const icons = [DollarSign, Rocket, BarChart3, Layers, Globe, Monitor];
            const Icon = icons[idx] || ArrowRightCircle;

            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="text-indigo-600 w-6 h-6" />
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="p-10">
        <h2 className="text-2xl font-bold">{how_it_works.title}</h2>
        <p className="text-gray-600 mt-1">{how_it_works.subtitle}</p>

        <div className="space-y-10 mt-6">
          {how_it_works.steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl font-bold text-indigo-700">{step.step}</div>

              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>

              <p className="mt-3 text-gray-700 leading-relaxed">{step.text}</p>

              {step.example && (
                <div className="mt-5 p-4 bg-blue-50 rounded-xl shadow-sm text-blue-900 leading-relaxed">
                  {step.example}
                </div>
              )}

              {step.behind_the_scenes && (
                <div className="mt-5 p-4 bg-green-50 rounded-xl shadow-sm text-green-900 leading-relaxed">
                  {step.behind_the_scenes}
                </div>
              )}

              {step.dashboard_example && (
                <div className="mt-5 p-4 bg-purple-50 rounded-xl shadow-sm text-purple-900 leading-relaxed">
                  {step.dashboard_example}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* REAL STORY */}
      <div className="p-10">
        <div className="bg-green-50 p-8 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-green-700">{real_story.title}</h2>

          <p className="mt-4 leading-relaxed">
            <strong>The Partner:</strong> {real_story.partner}
          </p>

          <p className="mt-4 leading-relaxed">
            <strong>The Strategy:</strong> {real_story.strategy}
          </p>

          <p className="mt-4 leading-relaxed">
            <strong>The Results:</strong> {real_story.results}
          </p>

          <p className="mt-5 italic text-green-900 leading-relaxed">
            {real_story.quote}
          </p>
        </div>
      </div>
      <OverviewTwo />
    </div>
  );
}
