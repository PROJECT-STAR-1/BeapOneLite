"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  CheckCircle,
  Clock,
  MapPin,
  Globe,
  ListChecks,
  Eye,
  DollarSign,
  Briefcase,
  User,
  HeartHandshake,
  FileBadge,
  AlertTriangle,
  Server,
  Code,
  Shield,
  Loader2,
} from "lucide-react";

/* ============================================================
    UI CONFIGURATION & MAPPINGS
============================================================ */

const ICON_MAP = {
  Database,
  CheckCircle,
  Clock,
  MapPin,
  Globe,
  ListChecks,
  Eye,
  DollarSign,
  Briefcase,
  User,
  HeartHandshake,
  FileBadge,
  AlertTriangle,
  Server,
  Code,
  Shield,
};

/* ============================================================
    SUB-COMPONENTS
============================================================ */

// 1. Header and Stats (Text Hardcoded as Requested)
const FeatureBanner = ({ stats }) => (
  <div className="bg-indigo-900 p-8 rounded-2xl shadow-xl text-white mb-8">
    <div className="flex items-start mb-6">
      <Database size={36} className="text-yellow-400 mr-4 mt-1 flex-shrink-0" />
      <div>
        <h2 className="text-3xl font-bold mb-1">G5 Document Hub</h2>
        <p className="text-sm text-indigo-300">
          Your company's secure document vault in the cloud
        </p>
      </div>
    </div>
    <p className="text-gray-200 leading-relaxed mb-8 text-lg">
      Store, organize, and access all your business documents from anywhere.
      Client contracts, tax receipts, compliance certificates,
      invoices—everything in one secure place with automatic backup and audit
      tracking.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats?.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-xl bg-white/10 border-t-2 border-indigo-500 text-center sm:text-left transition duration-300 hover:bg-white/20">
          <p className="text-4xl font-extrabold text-yellow-300 inline-block mb-1">
            {stat.value}
          </p>
          <p className="text-sm text-gray-100 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
);

// 2. Benefit Card
const BenefitCard = ({ benefit }) => {
  const Icon = ICON_MAP[benefit.iconId] || CheckCircle;
  const iconBgClass = benefit.color.replace("text-", "bg-") + "100";

  return (
    <div className="p-4 flex">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${iconBgClass}`}>
        <Icon size={20} className={benefit.color} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {benefit.title}
        </h3>
        <p className="text-sm text-gray-600">{benefit.description}</p>
      </div>
    </div>
  );
};

// 3. Workflow Step
const WorkflowStep = ({ stepData, totalSteps }) => {
  const { step, title, description, example, security } = stepData;

  const getExampleClasses = (color) => {
    switch (color) {
      case "blue":
        return "text-blue-800 bg-blue-50 border-blue-200";
      case "green":
        return "text-green-800 bg-green-50 border-green-200";
      case "purple":
        return "text-purple-800 bg-purple-50 border-purple-200";
      default:
        return "text-gray-800 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="flex mb-8 last:mb-0">
      <div className="flex flex-col items-center mr-6">
        <div className="w-8 h-8 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-md">
          {step}
        </div>
        {step < totalSteps && (
          <div className="w-0.5 h-full bg-gray-300 my-1"></div>
        )}
      </div>
      <div className="flex-grow pt-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>

        {example && (
          <div
            className={`p-4 rounded-xl text-sm border ${getExampleClasses(
              example.color
            )} mb-4`}>
            {example.text}
          </div>
        )}

        {security && (
          <div className="p-4 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-sm">
            <span className="font-semibold">Security:</span> {security.text}
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Document Type Card
const DocTypeCard = ({ typeData }) => {
  const Icon = ICON_MAP[typeData.iconId] || FileBadge;

  return (
    <div
      className={`p-6 rounded-xl shadow-sm border ${typeData.color.replace(
        "bg-",
        "border-"
      )} transition duration-300 hover:shadow-lg h-full`}>
      <div className="flex items-center mb-3">
        <Icon size={24} className={`${typeData.color.split(" ")[1]} mr-3`} />
        <h4 className="text-lg font-bold text-gray-900">{typeData.title}</h4>
      </div>
      <p className="text-sm text-gray-700">{typeData.subtitle}</p>
    </div>
  );
};

// 5. Real Story Section (Dynamic Data)
const RealStorySection = ({ data }) => (
  <section className="mt-12 p-6 sm:p-8 bg-green-50 border border-green-300 rounded-2xl shadow-lg">
    <div className="flex items-center text-green-700 mb-4">
      <CheckCircle size={24} className="mr-2 flex-shrink-0" />
      <h2 className="text-xl font-bold">{data?.title}</h2>
    </div>

    <div className="text-gray-700 space-y-3 text-sm">
      <p>
        <span className="font-bold text-gray-900">The Problem:</span>{" "}
        {data?.problem}
      </p>
      <p>
        <span className="font-bold text-gray-900">The Solution:</span>{" "}
        {data?.solution}
      </p>
      <p className="mt-4 font-semibold">
        <span role="img" aria-label="lightbulb">
          💡
        </span>{" "}
        Result: {data?.result}
      </p>
    </div>
  </section>
);

// 6. Technical Architecture Section
const TechnicalArchSection = ({ header, modules, features }) => {
  const ModuleCard = ({ module }) => (
    <div
      className={`p-4 rounded-xl border-2 ${module.color} flex flex-col justify-between h-full`}>
      <h4 className="font-semibold text-lg text-gray-900 mb-1">
        {module.title}
      </h4>
      <p className="text-sm text-gray-700">{module.details}</p>
    </div>
  );

  return (
    <section className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {header?.title}
        </h2>
        <p className="text-gray-600">{header?.subtitle}</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {modules?.map((module, index) => (
            <ModuleCard key={index} module={module} />
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">
          Security Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {features?.map((feature, index) => (
            <div key={index} className="flex items-center text-gray-700">
              <CheckCircle
                size={18}
                className="text-green-500 mr-2 flex-shrink-0"
              />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-900 border-b pb-2 pt-4">
          API Endpoints
        </h3>
        <div className="space-y-3">
          <div className="text-sm flex flex-col sm:flex-row sm:items-center">
            <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg text-xs mr-3 flex-shrink-0">
              POST
            </span>
            <code className="bg-gray-100 p-2 rounded text-gray-800 text-xs sm:text-sm whitespace-pre-wrap break-words">
              /api/g5/v1/documents/upload
            </code>
            <span className="text-gray-500 ml-0 sm:ml-3 mt-1 sm:mt-0 text-xs">
              — Upload with mandatory metadata (mTLS required)
            </span>
          </div>
          <div className="text-sm flex flex-col sm:flex-row sm:items-center">
            <span className="bg-green-600 text-white font-bold px-3 py-1 rounded-lg text-xs mr-3 flex-shrink-0">
              GET
            </span>
            <code className="bg-gray-100 p-2 rounded text-gray-800 text-xs sm:text-sm whitespace-pre-wrap break-words">
              /api/g5/v1/documents/{"{"}documentId{"}"}/retrieve
            </code>
            <span className="text-gray-500 ml-0 sm:ml-3 mt-1 sm:mt-0 text-xs">
              — Request signed URL for secure download
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// 7. Prototype Mode Warning (Dynamic Data)
const PrototypeWarningSection = ({ data }) => (
  <section className="mt-12 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg text-yellow-800">
    <div className="flex items-start">
      <AlertTriangle size={20} className="mt-0.5 mr-3 flex-shrink-0" />
      <p className="text-sm">
        <span className="font-bold">{data?.title}</span>
        <br />
        {data?.message}
      </p>
    </div>
  </section>
);

/* ============================================================
    MAIN EXPORT COMPONENT
============================================================ */

export default function OverviewTabContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/document");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch document overview data");
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
  const sectionHeaders = data?.sectionHeaders;
  const featureStats = data?.featureStats ?? [];
  const benefitsData = data?.benefitsData ?? [];
  const workflowData = data?.workflowData ?? [];
  const docTypesData = data?.docTypesData ?? [];
  const archModulesData = data?.archModulesData ?? [];
  const securityFeatures = data?.securityFeatures ?? [];
  const realStoryData = data?.realStoryData;
  const prototypeWarningData = data?.prototypeWarningData;

  return (
    <div className="space-y-12">
      {/* 1. Header with Hardcoded Text */}
      <FeatureBanner stats={featureStats} />

      {/* 2. Why Use Document Hub? */}
      <section className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center text-green-600 mb-6">
          <CheckCircle size={24} className="mr-2 flex-shrink-0" />
          <h2 className="text-xl font-bold text-gray-900">
            {sectionHeaders?.benefits?.title}
          </h2>
        </div>
        <p className="text-gray-600 mb-6">
          {sectionHeaders?.benefits?.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {benefitsData.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} />
          ))}
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {sectionHeaders?.workflow?.title}
        </h2>
        <p className="text-gray-600 mb-8">
          {sectionHeaders?.workflow?.subtitle}
        </p>

        {workflowData.map((step, index) => (
          <WorkflowStep
            key={index}
            stepData={step}
            totalSteps={workflowData.length}
          />
        ))}
      </section>

      {/* 4. What Can You Store? */}
      <section className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {sectionHeaders?.docTypes?.title}
          </h2>
          <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
            {sectionHeaders?.docTypes?.badge}
          </span>
        </div>
        <p className="text-gray-600 mb-6">
          {sectionHeaders?.docTypes?.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docTypesData.map((type, index) => (
            <DocTypeCard key={index} typeData={type} />
          ))}
        </div>
      </section>

      {/* 5. Real Story (Dynamic) */}
      <RealStorySection data={realStoryData} />

      {/* 6. Technical Architecture Details */}
      <TechnicalArchSection
        header={sectionHeaders?.architecture}
        modules={archModulesData}
        features={securityFeatures}
      />

      {/* 7. Prototype Mode Warning (Dynamic) */}
      <PrototypeWarningSection data={prototypeWarningData} />
    </div>
  );
}
