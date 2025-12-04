import React from "react";
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
} from "lucide-react";

/* ============================================================
 * 1. CONFIGURATION DATA
 * Define all data used in the sub-components
 * ============================================================ */

// DM OV1 Data
const FEATURE_STATS = [
  { value: "8", label: "Documents Stored Securely" },
  { value: "3", label: "Business Locations Connected" },
  { value: "89%", label: "Compliance Ready" },
];

// DM OV2 Data (Why Use Document Hub?)
const BENEFITS_DATA = [
  {
    icon: CheckCircle,
    color: "text-green-600",
    title: "Never Lose Important Documents",
    description:
      "No more searching through filing cabinets or email attachments. Your tax receipts, contracts, and compliance certificates are always accessible—even if your office floods or gets broken into.",
  },
  {
    icon: Clock,
    color: "text-yellow-600",
    title: "Automatic Backup & Security",
    description:
      "Your documents are automatically backed up and encrypted. Even if your computer crashes, your business records are safe. Bank-level security protects sensitive contracts.",
  },
  {
    icon: MapPin,
    color: "text-indigo-600",
    title: "Access From Anywhere",
    description:
      "Need a client contract while visiting your Lagos branch? Access it instantly from your phone. Your documents follow you wherever your business takes you.",
  },
  {
    icon: Globe,
    color: "text-orange-600",
    title: "Multi-Location Sharing",
    description:
      "Have branches in Accra, Nairobi, and Kigali? Everyone sees the same documents instantly. No more emailing files back and forth or wondering which version is current.",
  },
  {
    icon: ListChecks,
    color: "text-purple-600",
    title: "Audit-Ready Compliance",
    description:
      "Tax authority audit coming? All your receipts and invoices are organized by date, type, and purpose. Generate compliance reports in seconds, not days.",
  },
  {
    icon: Eye,
    color: "text-red-600",
    title: "Track Who Accessed What",
    description:
      "Complete audit trail shows who uploaded, viewed, or downloaded each document. Perfect for compliance investigations or internal accountability.",
  },
];

// DM OV3 Data (How It Works)
const WORKFLOW_DATA = [
  {
    step: 1,
    title: "Upload Your Documents",
    description:
      'Click the "Upload Document" button and select your file. Add basic information like document type (Invoice, Contract, Receipt, etc.), description, and tags. The system automatically records who uploaded it and when.',
    example: {
      text: 'Example: Upload a signed client contract → Select "Contract" type → Add tag "Client-Adeola" → System automatically knows it\'s from your company and today\'s date → Click Save. Done in 30 seconds!',
      color: "blue",
    },
    security: null,
  },
  {
    step: 2,
    title: "Organize & Find Documents",
    description:
      "Go to the Documents tab to see all your files. Filter by document type, date range, or search by tags. Sort by upload date or file name. Every document is categorized and searchable.",
    example: {
      text: 'Example: Tax auditor asks for all February 2024 expense receipts → Go to Documents tab → Filter "Type: Receipt" + "Date: Feb 2024" → Export list with one click → Print for auditor. Takes 2 minutes instead of 2 days!',
      color: "green",
    },
    security: null,
  },
  {
    step: 3,
    title: "Download & Share Securely",
    description:
      "Click any document to download it. The system creates a secure, time-limited download link (expires after 1-48 hours depending on your settings). You can access documents from any device—laptop, phone, or tablet.",
    example: null,
    security: {
      text: "Security: Every download is tracked and logged. If someone unauthorized tries to access your documents, you'll know immediately. All files are encrypted both during upload and storage.",
    },
  },
];

// DM OV4 Data (What Can You Store?)
const DOC_TYPES_DATA = [
  {
    icon: HeartHandshake,
    color: "bg-blue-100 text-blue-700",
    title: "Client Contracts",
    subtitle: "Service agreements, NDAs, payment terms, scope documents",
  },
  {
    icon: DollarSign,
    color: "bg-green-100 text-green-700",
    title: "Tax & Receipts",
    subtitle: "VAT receipts, tax filings, PAYE records, expense receipts",
  },
  {
    icon: FileBadge,
    color: "bg-purple-100 text-purple-700",
    title: "Invoices & Bills",
    subtitle: "Customer invoices, vendor bills, payment confirmations",
  },
  {
    icon: Shield,
    color: "bg-orange-100 text-orange-700",
    title: "Compliance Docs",
    subtitle: "Business licenses, permits, certifications, regulatory filings",
  },
  {
    icon: User,
    color: "bg-yellow-100 text-yellow-700",
    title: "HR Documents",
    subtitle: "Employment contracts, payroll records, performance reviews",
  },
  {
    icon: Briefcase,
    color: "bg-red-100 text-red-700",
    title: "Financial Reports",
    subtitle: "Balance sheets, P&L statements, cash flow reports",
  },
];

// DM OV6 Data (Technical Architecture)
const ARCH_MODULES_DATA = [
  {
    title: "BEAPOne Lite (Client)",
    color: "border-blue-300 bg-blue-50 text-blue-800",
    details: "Source of documents, metadata, and user/app context",
  },
  {
    title: "G2: Admin Management",
    color: "border-green-300 bg-green-50 text-green-800",
    details: "User roles and permissions for access control",
  },
  {
    title: "B1: Legal Entity",
    color: "border-purple-300 bg-purple-50 text-purple-800",
    details: "Validates appId for multi-tenancy enforcement",
  },
  {
    title: "A2: Journaling",
    color: "border-orange-300 bg-orange-50 text-orange-800",
    details: "Immutable audit logs for all document lifecycle events",
  },
];

const SECURITY_FEATURES = [
  // Left Column
  "mTLS Authentication (Mutual TLS)",
  "AES-256 Encryption (at-rest & in-transit)",
  "Multi-Tenancy Isolation (company_id)",
  // Right Column
  "Time-Limited Signed URLs (1-48hr TTL)",
  "Real-time Virus Scanning",
  "Immutable Audit Trail (A2 Journaling)",
];

/* ============================================================
 * 2. COMPONENT BUILDING BLOCKS
 * ============================================================ */

// Header and Stats
const FeatureBanner = () => (
  <div className="bg-indigo-900 p-8 rounded-2xl shadow-xl text-white mb-8">
    <div className="flex items-start mb-6">
      <Database size={36} className="text-yellow-400 mr-4 mt-1 flex-shrink-0" />
      <div>
        {/* Less bold header */}
        <h2 className="text-3xl font-bold mb-1">G5 Document Hub</h2>
        <p className="text-sm text-indigo-300">
          Your company's secure document vault in the cloud
        </p>
      </div>
    </div>
    <p className="text-gray-200 leading-relaxed mb-8 text-lg">
      Store, organize, and access all your business documents from anywhere.
      Client contracts, tax receipts, compliance certificates, invoices—
      everything in one secure place with automatic backup and audit tracking.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {FEATURE_STATS.map((stat, index) => (
        <div
          key={index}
          // Apply transparent background to the entire stat block, padding, and border
          className="p-4 rounded-xl bg-white/10 border-t-2 border-indigo-500 text-center sm:text-left transition duration-300 hover:bg-white/20">
          <p className="text-4xl font-extrabold text-yellow-300 inline-block mb-1">
            {stat.value}
          </p>
          {/* Increase visibility of the label */}
          <p className="text-sm text-gray-100 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
);

// Benefit Card
const BenefitCard = ({ benefit }) => {
  const Icon = benefit.icon;
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

// Workflow Step
const WorkflowStep = ({ stepData }) => {
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
        {/* Step Number Circle */}
        <div className="w-8 h-8 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-md">
          {step}
        </div>
        {/* Connector Line (Hidden on last step) */}
        {step < WORKFLOW_DATA.length && (
          <div className="w-0.5 h-full bg-gray-300 my-1"></div>
        )}
      </div>
      <div className="flex-grow pt-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>

        {/* Example Box */}
        {example && (
          <div
            className={`p-4 rounded-xl text-sm border ${getExampleClasses(
              example.color
            )} mb-4`}>
            {example.text}
          </div>
        )}

        {/* Security Highlight Box */}
        {security && (
          <div className="p-4 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-sm">
            <span className="font-semibold">Security:</span> {security.text}
          </div>
        )}
      </div>
    </div>
  );
};

// Document Type Card
const DocTypeCard = ({ typeData }) => {
  const Icon = typeData.icon;

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

/* ============================================================
 * 3. MAIN SECTION COMPONENTS (REORDERED)
 * ============================================================ */

// 1. Why Use Document Hub?
const WhyHubSection = () => (
  <section className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
    <div className="flex items-center text-green-600 mb-6">
      <CheckCircle size={24} className="mr-2 flex-shrink-0" />
      <h2 className="text-xl font-bold text-gray-900">Why Use Document Hub?</h2>
    </div>
    <p className="text-gray-600 mb-6">
      Real problems solved for African SMEs every day
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      {BENEFITS_DATA.map((benefit, index) => (
        <BenefitCard key={index} benefit={benefit} />
      ))}
    </div>
  </section>
);

// 2. How It Works
const HowItWorksSection = () => (
  <section className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
    <h2 className="text-xl font-bold text-gray-900 mb-2">How It works</h2>
    <p className="text-gray-600 mb-8">
      From uploading documents to finding them when you need them
    </p>

    {WORKFLOW_DATA.map((step, index) => (
      <WorkflowStep key={index} stepData={step} />
    ))}
  </section>
);

// 3. What Can You Store?
const WhatToStoreSection = () => (
  <section className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-900">What Can You Store?</h2>
      <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
        Unlimited Document Types
      </span>
    </div>
    <p className="text-gray-600 mb-6">
      Common document types used by African SMEs
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {DOC_TYPES_DATA.map((type, index) => (
        <DocTypeCard key={index} typeData={type} />
      ))}
    </div>
  </section>
);

// 4. Real Story
const RealStorySection = () => (
  <section className="mt-12 p-6 sm:p-8 bg-green-50 border border-green-300 rounded-2xl shadow-lg">
    <div className="flex items-center text-green-700 mb-4">
      <CheckCircle size={24} className="mr-2 flex-shrink-0" />
      <h2 className="text-xl font-bold">
        Real Story: How Tunde's Construction Company Passed Their Tax Audit
      </h2>
    </div>

    <div className="text-gray-700 space-y-3 text-sm">
      <p>
        <span className="font-bold text-gray-900">The Problem:</span> Tunde runs
        a construction company in Lagos with projects across Nigeria. The FIRS
        (tax authority) announced a surprise audit requesting 2 years of expense
        receipts—literally thousands of documents. His team had receipts in
        filing cabinets, email attachments, and WhatsApp messages. Organizing
        them would take weeks.
      </p>
      <p>
        <span className="font-bold text-gray-900">The Solution:</span> After
        implementing G5 Document Hub, Tunde's team uploaded all receipts going
        forward, tagging them by project and expense type. When the next audit
        came, they simply filtered "Document Type: Receipt" + "Date Range: Jan
        2023 - Dec 2024" → Generated compliance report → Submitted to FIRS in 1
        hour. The auditor was impressed. Tunde passed with zero issues.
      </p>
      <p className="mt-4 font-semibold">
        <span role="img" aria-label="lightbulb">
          💡
        </span>{" "}
        Result: Saved 3 weeks of work, avoided{" "}
        <span className="text-green-800">₦500,000 in potential penalties</span>,
        and now they're always audit-ready.
      </p>
    </div>
  </section>
);

// 5. Technical Architecture Details (Consolidated)
const TechnicalArchSection = () => {
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
          Technical Architecture Details (For IT/Technical Users)
        </h2>
        <p className="text-gray-600">
          How G5 integrates with BEAPOne modules behind the scenes
        </p>
      </div>

      <div className="space-y-8">
        {/* Modules */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ARCH_MODULES_DATA.map((module, index) => (
            <ModuleCard key={index} module={module} />
          ))}
        </div>

        {/* Security Features (Moved here) */}
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">
          Security Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {SECURITY_FEATURES.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center text-gray-700">
              <CheckCircle
                size={18}
                className="text-green-500 mr-2 flex-shrink-0"
              />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
          {SECURITY_FEATURES.slice(3).map((feature, index) => (
            <div key={index + 3} className="flex items-center text-gray-700">
              <CheckCircle
                size={18}
                className="text-green-500 mr-2 flex-shrink-0"
              />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* API Endpoints */}
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

// 6. Prototype Mode Warning
const PrototypeWarningSection = () => (
  <section className="mt-12 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg text-yellow-800">
    <div className="flex items-start">
      <AlertTriangle size={20} className="mt-0.5 mr-3 flex-shrink-0" />
      <p className="text-sm">
        <span className="font-bold">Prototype Mode (Demo Data)</span>
        <br />
        This is a functional prototype demonstrating G5 Document Hub
        capabilities. In production, this will connect to real Supabase Object
        Storage, PostgreSQL for metadata, and A2 journaling for immutable audit
        trails. All data shown is for demonstration purposes.
      </p>
    </div>
  </section>
);

/* ============================================================
 * 4. MAIN EXPORT COMPONENT (Aggregator)
 * ============================================================ */

export default function OverviewTabContent() {
  return (
    <div className="space-y-12">
      {/* Implicit Header/Stats */}
      <FeatureBanner />

      {/* 1. Why Use Document Hub? */}
      <WhyHubSection />

      {/* 2. How It Works */}
      <HowItWorksSection />

      {/* 3. What Can You Store? */}
      <WhatToStoreSection />

      {/* 4. Real Story */}
      <RealStorySection />

      {/* 5. Technical Architecture Details (Now includes Security and APIs) */}
      <TechnicalArchSection />

      {/* 6. Prototype Mode (Demo Data) */}
      <PrototypeWarningSection />
    </div>
  );
}
