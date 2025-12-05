import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Briefcase,
  Layers,
  Search,
  ChevronDown,
  Info,
  Tag,
  Trello,
  LayoutGrid,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Globe,
} from "lucide-react";

// --- Mock Data ---

// Define categories with specific colors based on the images
const CATEGORIES = [
  {
    id: "all",
    name: "All Categories",
    icon: LayoutGrid,
    color: "text-gray-900",
    tagClass: "bg-gray-100 text-gray-700",
  },
  {
    id: "strategy",
    name: "Strategy",
    icon: TrendingUp,
    color: "text-purple-600",
    tagClass: "bg-purple-100 text-purple-700",
  },
  {
    id: "growth",
    name: "Growth",
    icon: DollarSign,
    color: "text-green-600",
    tagClass: "bg-green-100 text-green-700",
  },
  {
    id: "financial",
    name: "Financial Advisory",
    icon: ShieldCheck,
    color: "text-blue-600",
    tagClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "operations",
    name: "Operations",
    icon: Trello,
    color: "text-orange-600",
    tagClass: "bg-orange-100 text-orange-700",
  },
  {
    id: "market",
    name: "Market Expansion",
    icon: Globe,
    color: "text-yellow-600",
    tagClass: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "compliance",
    name: "Compliance",
    icon: Tag,
    color: "text-red-600",
    tagClass: "bg-red-100 text-red-700",
  },
];

// Combine data from BPC SC1, SC3, SC4
const SERVICE_CATALOG_DATA = [
  {
    id: 1,
    title: "Growth Strategy Consulting",
    category: "growth",
    description: "Comprehensive growth strategy development for African SMEs",
    detail:
      "Our Growth Strategy Consulting service helps African SMEs identify market opportunities, develop competitive positioning, and create actionable growth roadmaps. We leverage local market intelligence and international best practices.",
    price: "$15,000",
    duration: "8 weeks",
    deliverablesCount: 5,
    keyDeliverables: [
      "Market Analysis Report",
      "Competitive Landscape Assessment",
      "Growth Strategy Roadmap",
    ],
  },
  {
    id: 2,
    title: "Financial Restructuring Advisory",
    category: "financial",
    description:
      "Expert guidance on financial optimization and debt restructuring",
    detail:
      "Specialized financial advisory for businesses facing cash flow challenges or seeking to optimize their capital structure. Includes debt negotiation support and financial modeling.",
    price: "$22,000",
    duration: "12 weeks",
    deliverablesCount: 5,
    keyDeliverables: [
      "Financial Health Assessment",
      "Restructuring Options Analysis",
      "Creditor Negotiation Support",
    ],
  },
  {
    id: 3,
    title: "Market Entry Strategy (New Geography)",
    category: "market",
    description: "Strategic planning for expansion into new African markets",
    detail:
      "End-to-end market entry consulting for SMEs looking to expand across African borders. Covers regulatory compliance, market sizing, partner identification, and go-to-market strategy.",
    price: "$18,500",
    duration: "10 weeks",
    deliverablesCount: 5,
    keyDeliverables: [
      "Target Market Analysis (3 countries)",
      "Regulatory & Compliance Roadmap",
      "Partnership & Distribution Strategy",
    ],
  },
  {
    id: 4,
    title: "Operations Excellence Program",
    category: "operations",
    description: "Process optimization and operational efficiency improvement",
    detail:
      "Comprehensive operational assessment and improvement program focusing on process efficiency, cost reduction, and quality enhancement for manufacturing and service businesses.",
    price: "$12,500",
    duration: "6 weeks",
    deliverablesCount: 5,
    keyDeliverables: [
      "Current State Assessment",
      "Process Mapping & Bottleneck Analysis",
      "Efficiency Improvement Recommendations",
    ],
  },
  {
    id: 5,
    title: "Tax & Compliance Strategy",
    category: "compliance",
    description: "Multi-jurisdiction tax planning and regulatory compliance",
    detail:
      "Strategic tax planning for businesses operating across multiple African jurisdictions. Includes transfer pricing guidance, VAT optimization, and regulatory compliance roadmaps.",
    price: "$16,000",
    duration: "8 weeks",
    deliverablesCount: 5,
    keyDeliverables: [
      "Multi-Jurisdiction Tax Analysis",
      "Transfer Pricing Framework",
      "VAT Optimization Strategy",
    ],
  },
  {
    id: 6,
    title: "Digital Transformation Roadmap",
    category: "strategy",
    description: "Technology adoption and digital business transformation",
    detail:
      "Strategic consulting for SMEs seeking to digitize operations, adopt cloud technologies, and leverage data analytics for competitive advantage.",
    price: "$14,000",
    duration: "7 weeks",
    deliverablesCount: 5,
    keyDeliverables: [
      "Digital Maturity Assessment",
      "Technology Stack Recommendations",
      "Phased Implementation Roadmap",
    ],
  },
];

// --- Sub-Components ---

/**
 * Tag component mirroring the style on the service cards (e.g., GROWTH tag).
 * Uses a specific category's styling.
 */
const CategoryTag = ({ categoryId }) => {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category || category.id === "all") return null;

  return (
    <span
      className={`absolute top-0 left-0 mt-5 ml-5 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center shadow-sm ${category.tagClass}`}>
      <category.icon size={12} className="mr-1" />
      {category.name}
    </span>
  );
};

/**
 * Service Card component for a single consulting service.
 */
const ServiceCard = ({ service }) => {
  // Find the category object for color mapping
  const category = CATEGORIES.find((c) => c.id === service.category);
  const priceColor = category ? category.color : "text-purple-600"; // Default to purple

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300">
      {/* Category Tag */}
      <CategoryTag categoryId={service.category} />

      {/* Price Tag (Top Right) */}
      <div className="absolute top-0 right-0 mt-5 mr-5 text-right flex flex-col items-end">
        <span className="text-xs text-gray-500 uppercase">From</span>
        <span className={`text-xl font-bold ${priceColor}`}>
          {service.price}
        </span>
      </div>

      <div className="pt-16 pb-4">
        {/* Title and Description */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {service.title}
        </h2>
        <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">
          {service.description}
        </p>

        {/* Duration and Deliverables (Inline/Horizontal) */}
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <Clock size={14} className="mr-1 text-gray-400" />
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center">
            <Briefcase size={14} className="mr-1 text-gray-400" />
            <span>{service.deliverablesCount} deliverables</span>
          </div>
        </div>

        {/* Key Deliverables Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Key Deliverables:
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {service.keyDeliverables.map((item, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle
                  size={14}
                  className="text-green-500 mr-2 flex-shrink-0"
                />
                {item}
              </li>
            ))}
            <li className="flex items-center text-xs text-gray-500 mt-1">
              +2 more deliverables
            </li>
          </ul>
        </div>
      </div>

      {/* Request Consultation Button - UPDATED */}
      <button
        onClick={() =>
          console.log(`Requesting consultation for: ${service.title}`)
        }
        className="mt-auto w-full bg-indigo-700 text-white font-semibold py-3 rounded-xl hover:bg-indigo-800 transition-colors duration-200 shadow-md hover:shadow-lg">
        Request Consultation
      </button>
    </div>
  );
};

/**
 * Integration Info Box (Bottom of the page)
 */
const SeamlessIntegrationInfo = () => (
  <div className="mt-8 p-6 rounded-xl bg-blue-50 border border-blue-200 shadow-sm flex items-start">
    <Info size={24} className="text-blue-500 mt-0.5 flex-shrink-0" />
    <div className="ml-4">
      <h3 className="text-base font-semibold text-blue-800 mb-1">
        Seamless Integration with Your Projects
      </h3>
      <p className="text-sm text-blue-700">
        When you request a consultation from within a K4 Project, your project
        context (budget, timeline, scope) is automatically transferred to our
        BPC Portal, eliminating the need to re-enter information. All billing is
        processed through your existing subscription management.
      </p>
    </div>
  </div>
);

// --- Main Component ---

export default function ServiceCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref for the dropdown container to detect outside clicks
  const dropdownRef = useRef(null);

  // Filter and Search Logic
  const filteredServices = useMemo(() => {
    let services = SERVICE_CATALOG_DATA;

    // 1. Filter by Category
    if (selectedCategory !== "all") {
      services = services.filter(
        (service) => service.category === selectedCategory
      );
    }

    // 2. Filter by Search Term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      services = services.filter(
        (service) =>
          service.title.toLowerCase().includes(lowerCaseSearch) ||
          service.description.toLowerCase().includes(lowerCaseSearch) ||
          service.detail.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return services;
  }, [selectedCategory, searchTerm]);

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside the dropdown component
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    // Only attach listener if the dropdown is open
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]); // Re-run effect when dropdown state changes

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsDropdownOpen(false);
  };

  const currentCategory = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header and Title (Updated Font Size and Boldness) */}
        <h1 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-2">
          BPC Service Catalog
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Expert consulting services for African SMEs - Browse and request
          specialized support
        </p>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search Input (with Dark Mode Placeholder Fix) */}
          <div className="relative flex-grow">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Added placeholder-gray-700 for better visibility in Dark Mode
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm placeholder-gray-700"
            />
          </div>

          {/* Category Dropdown (with Ref and Dark Mode Fixes) */}
          <div
            ref={dropdownRef}
            className="relative w-full sm:w-56 flex-shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              // Explicitly using text-gray-900 for high contrast
              className="w-full flex justify-between items-center px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium hover:bg-gray-50 shadow-sm transition-colors">
              <span className="truncate">
                {currentCategory?.name || "All Categories"}
              </span>
              <ChevronDown
                size={18}
                className={`ml-2 transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    // Explicitly using text-gray-900 for high contrast
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-indigo-50 text-sm text-gray-900 ${
                      selectedCategory === category.id
                        ? "bg-indigo-100 font-semibold"
                        : "font-normal"
                    }`}>
                    <span>{category.name}</span>
                    {selectedCategory === category.id && (
                      <CheckCircle size={14} className="text-indigo-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Service Cards Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-100">
            <Layers size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              No Services Found
            </h2>
            <p className="text-gray-500">
              Try adjusting your search term or category filter.
            </p>
          </div>
        )}

        {/* Seamless Integration Footer */}
        <SeamlessIntegrationInfo />
      </div>
      <div className="h-12"></div> {/* Bottom spacer */}
    </div>
  );
}
