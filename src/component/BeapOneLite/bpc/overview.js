import React from "react";
import {
  Briefcase,
  CheckCircle,
  FileText,
  Clock,
  Clipboard,
  Zap,
  TrendingUp,
  Scale,
  Globe,
  Settings,
  Info,
  Layers,
  BarChart2,
  DollarSign,
  Users,
} from "lucide-react";

// ====================================================================
// 1. DATA DEFINITIONS
// ====================================================================

// Hero Metrics (from BPC OV1.png)
const METRICS = [
  { icon: Layers, value: "6", label: "Expert Services Available" },
  { icon: DollarSign, value: "$12K - $22K", label: "Typical Engagement Range" },
  { icon: Clock, value: "6-12 Weeks", label: "Average Project Duration" },
];

// Why Use features (from BPC OV1.png)
const FEATURES = [
  {
    title: "Africa-Focused Expertise",
    icon: Users,
    color: "green",
    description:
      "Consultants with deep experience in African markets, regulations, and business culture across Nigeria, Ghana, Kenya, and beyond.",
  },
  {
    title: "Proven Methodologies",
    icon: CheckCircle,
    color: "yellow",
    description:
      "International best practices adapted for local markets. Get actionable strategies, not generic advice.",
  },
  {
    title: "Seamless Integration",
    icon: Zap,
    color: "blue",
    description:
      "Request consulting directly from your project dashboard. Your project data (budget, timeline, scope) is automatically shared—no need to re-explain your situation.",
  },
  {
    title: "Clear Deliverables",
    icon: FileText,
    color: "teal",
    description:
      "Every service includes specific deliverables—reports, models, roadmaps, and implementation support. You know exactly what you’re getting.",
  },
  {
    title: "Simple Billing",
    icon: Scale,
    color: "purple",
    description:
      "All consulting fees are billed through your existing BEAPOne subscription. One invoice, one payment process.",
  },
  {
    title: "Post-Engagement Support",
    icon: TrendingUp,
    color: "red",
    description:
      "Most services include follow-up sessions to help you implement recommendations and track progress.",
  },
];

// How It Works steps (from BPC OV2.png)
const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Browse Services & Request Help",
    content:
      'Go to the <span class="font-bold">Service Catalog</span> tab and browse available consulting services. When you find what you need, click "Request Consultation." If you\'re working on a specific project in BEAPOne, your project details are automatically shared with the consultant.',
    example: {
      color: "blue",
      text: 'You\'re planning to expand into Ghana. From your "Ghana Expansion" project, click Request Consultation → Select "Market Entry Strategy" → Your project budget, timeline, and scope are automatically sent.',
    },
  },
  {
    step: 2,
    title: "Consultant Reviews & Proposes",
    content:
      "A specialized consultant reviews your request and project context. Within 48 hours, they'll contact you to discuss your needs, clarify scope, and provide a detailed proposal with timeline and final pricing.",
    example: {
      color: "green",
      text: "What happens? You'll receive a call/email to discuss your specific challenges. The consultant will explain their approach, share similar case studies, and answer your questions before you commit.",
    },
  },
  {
    step: 3,
    title: "Agreement, Work & Billing",
    content:
      "Once you agree to the proposal, the consultant starts work. You'll receive regular updates and deliverables according to the agreed timeline. The consulting fee is automatically added to your next BEAPOne subscription invoice.",
    example: {
      color: "purple",
      text: "Billing example: $15,000 Growth Strategy Consulting added to your subscription invoice. Payment terms: Net 30 days. All tracked in your BEAPOne account.",
    },
  },
];

// Available Services (from BPC OV3.png)
const SERVICES = [
  {
    name: "Growth Strategy Consulting",
    description: "Comprehensive growth strategy development for African SMEs",
    price: "$15K",
    duration: "8 weeks",
    deliverables: "5 deliverables",
  },
  {
    name: "Financial Restructuring Advisory",
    description:
      "Expert guidance on financial optimization and debt restructuring",
    price: "$22K",
    duration: "12 weeks",
    deliverables: "5 deliverables",
  },
  {
    name: "Market Entry Strategy (New Geography)",
    description: "Strategic planning for expansion into new African markets",
    price: "$19K",
    duration: "10 weeks",
    deliverables: "5 deliverables",
  },
  {
    name: "Operations Excellence Program",
    description: "Process optimization and operational efficiency improvement",
    price: "$13K",
    duration: "6 weeks",
    deliverables: "5 deliverables",
  },
];

// Technical Steps (from BPC OV4.png)
const TECHNICAL_STEPS = [
  {
    step: 1,
    title: "Service Catalog API (BEAPOne Lite — BPC Portal)",
    method: "GET",
    endpoint: "/api/bpc/v1/catalog",
    description:
      "BEAPOne Lite fetches available services with real-time pricing and availability",
    details: null,
  },
  {
    step: 2,
    title: "Context Transfer (BEAPOne Lite — BPC Portal)",
    method: "POST",
    endpoint: "/api/bpc/v1/context",
    description:
      "Securely transfers project metadata with audit trail and mandatory justification note",
    details:
      "Security: JWT/OAuth 2.0, TLS 1.2+, 60-minute context token expiry",
  },
  {
    step: 3,
    title: "Billing Event (BPC Portal — Subscription Management)",
    method: "POST",
    endpoint: "/api/financial/v1/billing-event",
    description: "Automatically creates invoice upon agreement finalization",
    details:
      "Includes: Service fee, currency, transaction ID, audit correlation ID",
  },
];

// ====================================================================
// 2. REUSABLE COMPONENTS
// ====================================================================

/**
 * Renders an example box with dynamic background/text colors.
 */
const ExampleBox = ({ text, color }) => {
  const bgColor = `bg-${color}-50`;
  const borderColor = `border-${color}-300`;
  const textColor = `text-${color}-800`;

  return (
    <div
      className={`p-4 mt-3 rounded-xl border-l-4 ${borderColor} ${bgColor} ${textColor} text-sm`}>
      <span dangerouslySetInnerHTML={{ __html: `Example: ${text}` }} />
    </div>
  );
};

/**
 * Renders a standard section header (e.g., Why Use, How It Works)
 */
const SectionHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-6 mt-12">
    <h2 className="text-xl font-bold text-gray-900 flex items-center mb-1">
      <Icon size={20} className="text-green-500 mr-2" />
      {title}
    </h2>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

// ====================================================================
// 3. SECTIONS
// ====================================================================

const HeroSection = () => (
  <div className="bg-indigo-900 rounded-xl p-6 sm:p-8 text-white shadow-xl mb-10">
    <div className="flex items-center space-x-3 mb-4">
      <Briefcase size={28} className="text-yellow-400" />
      {/* Reduced boldness to font-semibold */}
      <h1 className="text-2xl sm:text-3xl font-semibold">
        Business & Project Consulting Portal
      </h1>
    </div>
    <p className="mb-8 text-indigo-200">
      Expert guidance on financial planning, market expansion, and more—all
      billed seamlessly through your existing BEAPOne subscription.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {METRICS.map((metric, index) => (
        <div
          key={index}
          className="bg-indigo-700/50 backdrop-blur-sm rounded-lg p-5 text-center transition hover:bg-indigo-700">
          {/* Reduced boldness to font-bold and changed color to text-yellow-400 */}
          <p className="text-3xl font-bold text-yellow-400 mb-1">
            {metric.value}
          </p>
          <p className="text-sm font-medium text-indigo-200">{metric.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const WhyUseSection = () => (
  <section className="mt-12">
    <SectionHeader
      title="Why Use Our Consulting Services?"
      subtitle="Real business challenges solved by experts who understand your market"
      icon={TrendingUp}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {FEATURES.map((feature, index) => {
        const Icon = feature.icon;
        const iconClass = `text-${feature.color}-500`;
        const borderClass = `border-${feature.color}-200`;

        return (
          <div
            key={index}
            className={`flex space-x-4 p-5 bg-white border-l-4 ${borderClass} rounded-lg shadow-sm transition hover:shadow-md`}>
            <Icon size={24} className={`flex-shrink-0 ${iconClass}`} />
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

const HowItWorksSection = () => (
  <section className="mt-12">
    <SectionHeader
      title="How It Works"
      subtitle="From browsing services to getting expert help in 3 simple steps"
      icon={Clipboard}
    />
    <div className="space-y-6">
      {HOW_IT_WORKS.map((step, index) => (
        <div
          key={step.step}
          className="relative pl-10 md:pl-12 py-4 border-l-2 border-indigo-200">
          {/* Step Number Circle */}
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
          <ExampleBox
            text={step.example.text}
            color={index === 1 ? "green" : step.example.color}
          />
        </div>
      ))}
    </div>
  </section>
);

const ServicesSection = () => (
  <section className="mt-12">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-900">
        Available Consulting Services
      </h2>
      <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-300">
        {SERVICES.length} Services Active
      </span>
    </div>
    <p className="text-gray-500 text-sm mb-6">
      Click on "Service Catalog" tab to browse full details and request
      consultations
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {SERVICES.map((service) => (
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

const TechnicalSection = () => (
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
      {TECHNICAL_STEPS.map((step) => (
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

// ====================================================================
// 4. MAIN EXPORT
// ====================================================================

export default function BpcOverview() {
  return (
    // Reduced padding from p-3 sm:p-6 lg:p-8 to p-2 sm:p-4 lg:p-6 for a tighter fit
    <div className="p-2 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <HeroSection />
        <WhyUseSection />
        <HowItWorksSection />
        <ServicesSection />
        <TechnicalSection />
      </div>
    </div>
  );
}
