"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  CheckCircle,
  FileText,
  Clock,
  Clipboard,
  Zap,
  TrendingUp,
  Scale,
  Settings,
  Info,
  Layers,
  DollarSign,
  Users,
  Loader2,
} from "lucide-react";

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const ICON_MAP = {
  layers: Layers,
  "dollar-sign": DollarSign,
  clock: Clock,
  users: Users,
  "check-circle": CheckCircle,
  zap: Zap,
  "file-text": FileText,
  scale: Scale,
  "trending-up": TrendingUp,
  clipboard: Clipboard,
  briefcase: Briefcase,
};

const COLOR_MAP = {
  green: {
    text: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
    borderStrong: "border-green-300",
    textStrong: "text-green-800",
  },
  yellow: {
    text: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    borderStrong: "border-yellow-300",
    textStrong: "text-yellow-800",
  },
  blue: {
    text: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    borderStrong: "border-blue-300",
    textStrong: "text-blue-800",
  },
  teal: {
    text: "text-teal-500",
    bg: "bg-teal-50",
    border: "border-teal-200",
    borderStrong: "border-teal-300",
    textStrong: "text-teal-800",
  },
  purple: {
    text: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    borderStrong: "border-purple-300",
    textStrong: "text-purple-800",
  },
  red: {
    text: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    borderStrong: "border-red-300",
    textStrong: "text-red-800",
  },
  default: {
    text: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    borderStrong: "border-gray-300",
    textStrong: "text-gray-800",
  },
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

const ExampleBox = ({ text, colorId }) => {
  const styles = COLOR_MAP[colorId] || COLOR_MAP.default;

  return (
    <div
      className={`p-4 mt-3 rounded-xl border-l-4 ${styles.borderStrong} ${styles.bg} ${styles.textStrong} text-sm`}>
      <span dangerouslySetInnerHTML={{ __html: `Example: ${text}` }} />
    </div>
  );
};

const SectionHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-6 mt-12">
    <h2 className="text-xl font-bold text-gray-900 flex items-center mb-1">
      <Icon size={20} className="text-green-500 mr-2" />
      {title}
    </h2>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

const HeroSection = ({ metrics }) => {
  // Mapping for specific hero metrics icons if needed, or fallback
  const getHeroIcon = (id) => {
    if (id === "services-count") return Layers;
    if (id === "engagement-range") return DollarSign;
    if (id === "project-duration") return Clock;
    return Layers;
  };

  return (
    <div className="bg-indigo-900 rounded-xl p-6 sm:p-8 text-white shadow-xl mb-10">
      <div className="flex items-center space-x-3 mb-4">
        <Briefcase size={28} className="text-yellow-400" />
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Business & Project Consulting Portal
        </h1>
      </div>
      <p className="mb-8 text-indigo-200">
        Expert guidance on financial planning, market expansion, and more—all
        billed seamlessly through your existing BEAPOne subscription.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics?.map((metric, index) => {
          // const Icon = getHeroIcon(metric.id); // Icon logic can be added if needed in UI
          return (
            <div
              key={index}
              className="bg-indigo-700/50 backdrop-blur-sm rounded-lg p-5 text-center transition hover:bg-indigo-700">
              <p className="text-3xl font-bold text-yellow-400 mb-1">
                {metric.value}
              </p>
              <p className="text-sm font-medium text-indigo-200">
                {metric.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WhyUseSection = ({ features }) => (
  <section className="mt-12">
    <SectionHeader
      title="Why Use Our Consulting Services?"
      subtitle="Real business challenges solved by experts who understand your market"
      icon={TrendingUp}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features?.map((feature, index) => {
        const Icon = ICON_MAP[feature.iconId] || CheckCircle;
        const styles = COLOR_MAP[feature.colorId] || COLOR_MAP.default;

        return (
          <div
            key={index}
            className={`flex space-x-4 p-5 bg-white border-l-4 ${styles.border} rounded-lg shadow-sm transition hover:shadow-md`}>
            <Icon size={24} className={`flex-shrink-0 ${styles.text}`} />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

const HowItWorksSection = ({ steps }) => (
  <section className="mt-12">
    <SectionHeader
      title="How It Works"
      subtitle="From browsing services to getting expert help in 3 simple steps"
      icon={Clipboard}
    />
    <div className="space-y-6">
      {steps?.map((step, index) => (
        <div
          key={step.step}
          className="relative pl-10 md:pl-12 py-4 border-l-2 border-indigo-200">
          <div className="absolute left-0 top-4 w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm transform -translate-x-1/2 shadow-lg">
            {step.step}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {step.title}
          </h3>
          <p
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: step.content }}
          />
          {step.example && (
            <ExampleBox
              text={step.example.text}
              colorId={step.example.colorId}
            />
          )}
        </div>
      ))}
    </div>
  </section>
);

const ServicesSection = ({ services }) => (
  <section className="mt-12">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-900">
        Available Consulting Services
      </h2>
      <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-300">
        {services?.length || 0} Services Active
      </span>
    </div>
    <p className="text-gray-500 text-sm mb-6">
      Click on "Service Catalog" tab to browse full details and request
      consultations
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services?.map((service) => (
        <div
          key={service.name}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transition hover:ring-2 hover:ring-purple-400">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
            <p className="text-xl font-bold text-purple-700">{service.price}</p>
          </div>
          <p className="text-sm text-gray-500 mb-4">{service.description}</p>

          <div className="flex space-x-4 text-xs text-gray-600 font-medium">
            <div className="flex items-center">
              <Clock size={14} className="mr-1 text-purple-500" />
              <span>{service.duration}</span>
            </div>
            <div className="flex items-center">
              <FileText size={14} className="mr-1 text-purple-500" />
              <span>{service.deliverables}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const TechnicalSection = ({ steps }) => (
  <section className="mt-12">
    <div className="flex items-center space-x-3 mb-4">
      <h2 className="text-xl font-bold text-gray-900">
        Technical Integration Details
      </h2>
      <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
        For IT/Technical Users
      </span>
    </div>
    <p className="text-gray-500 text-sm mb-6">
      How the three-tier integration works behind the scenes
    </p>

    <div className="space-y-4">
      {steps?.map((step) => (
        <div
          key={step.step}
          className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {step.step}
            </span>
            <h3 className="font-semibold text-gray-900 text-base">
              {step.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 ml-9">{step.description}</p>
          <p className="text-xs text-indigo-600 font-mono bg-indigo-50 px-2 py-1 inline-block rounded mt-2 ml-9">
            {step.method} {step.endpoint}
          </p>
          {step.details && (
            <p className="text-xs text-gray-500 mt-2 ml-9 border-l-2 border-gray-300 pl-3 italic">
              {step.details}
            </p>
          )}
        </div>
      ))}
    </div>

    {/* Prototype Warning */}
    <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg text-yellow-800">
      <div className="flex items-center">
        <Info size={20} className="flex-shrink-0 mr-3" />
        <span className="font-semibold">Prototype Mode (Demo Data)</span>
      </div>
      <p className="text-sm mt-1 ml-7">
        This is a functional prototype demonstrating the BPC Portal integration.
        In production, this will connect to real consulting service APIs, actual
        consultants, and live billing systems. All data shown is for
        demonstration purposes.
      </p>
    </div>
  </section>
);

/* ============================================================
    MAIN COMPONENT
============================================================ */

export default function BpcOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/bpc");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch BPC overview data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-10 h-10 text-indigo-700 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Overview...</p>
      </div>
    );
  }

  // Safe Data Access
  const heroMetrics = data?.heroMetrics ?? [];
  const features = data?.features ?? [];
  const howItWorks = data?.howItWorks ?? [];
  const services = data?.services ?? [];
  const technicalSteps = data?.technicalSteps ?? [];

  return (
    <div className="p-2 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <HeroSection metrics={heroMetrics} />
        <WhyUseSection features={features} />
        <HowItWorksSection steps={howItWorks} />
        <ServicesSection services={services} />
        <TechnicalSection steps={technicalSteps} />
      </div>
    </div>
  );
}
