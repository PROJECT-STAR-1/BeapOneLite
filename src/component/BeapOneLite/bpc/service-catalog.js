"use client";

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
  Loader2,
} from "lucide-react";

// --- UI CONFIGURATION & MAPPINGS ---

const CATEGORY_UI_MAP = {
  all: {
    icon: LayoutGrid,
    color: "text-gray-900",
    tagClass: "bg-gray-100 text-gray-700",
  },
  strategy: {
    icon: TrendingUp,
    color: "text-purple-600",
    tagClass: "bg-purple-100 text-purple-700",
  },
  growth: {
    icon: DollarSign,
    color: "text-green-600",
    tagClass: "bg-green-100 text-green-700",
  },
  financial: {
    icon: ShieldCheck,
    color: "text-blue-600",
    tagClass: "bg-blue-100 text-blue-700",
  },
  operations: {
    icon: Trello,
    color: "text-orange-600",
    tagClass: "bg-orange-100 text-orange-700",
  },
  market: {
    icon: Globe,
    color: "text-yellow-600",
    tagClass: "bg-yellow-100 text-yellow-700",
  },
  compliance: {
    icon: Tag,
    color: "text-red-600",
    tagClass: "bg-red-100 text-red-700",
  },
  default: {
    icon: LayoutGrid,
    color: "text-gray-600",
    tagClass: "bg-gray-100 text-gray-700",
  },
};

// --- REUSABLE COMPONENTS ---

/**
 * Tag component mirroring the style on the service cards.
 */
const CategoryTag = ({ categoryId, categoryName }) => {
  const uiConfig = CATEGORY_UI_MAP[categoryId] || CATEGORY_UI_MAP.default;
  const Icon = uiConfig.icon;

  if (categoryId === "all") return null;

  return (
    <span
      className={`absolute top-0 left-0 mt-5 ml-5 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider flex items-center shadow-sm ${uiConfig.tagClass}`}>
      <Icon size={12} className="mr-1" />
      {categoryName}
    </span>
  );
};

/**
 * Service Card component for a single consulting service.
 */
const ServiceCard = ({ service, categories }) => {
  // Find category name for display in tag
  const categoryObj = categories.find((c) => c.id === service.category);
  const categoryName = categoryObj ? categoryObj.name : service.category;

  // Resolve UI styling
  const uiConfig = CATEGORY_UI_MAP[service.category] || CATEGORY_UI_MAP.default;

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300">
      {/* Category Tag */}
      <CategoryTag categoryId={service.category} categoryName={categoryName} />

      {/* Price Tag (Top Right) */}
      <div className="absolute top-0 right-0 mt-5 mr-5 text-right flex flex-col items-end">
        <span className="text-xs text-gray-500 uppercase">From</span>
        <span className={`text-xl font-bold ${uiConfig.color}`}>
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
            {service.keyDeliverables?.map((item, index) => (
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

      {/* Request Consultation Button */}
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

// --- MAIN COMPONENT: ServiceCatalog ---

export default function ServiceCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref for the dropdown container to detect outside clicks
  const dropdownRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/bpc");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch service catalog data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Safe Data Access
  const categories = data?.categories ?? [];
  // Using services_1 as per requirement
  const services = data?.services_1 ?? [];

  // Filter and Search Logic
  const filteredServices = useMemo(() => {
    let filtered = services;

    // 1. Filter by Category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }

    // 2. Filter by Search Term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(lowerCaseSearch) ||
          service.description.toLowerCase().includes(lowerCaseSearch) ||
          service.detail.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm, services]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsDropdownOpen(false);
  };

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-10 h-10 text-indigo-700 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Services...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header and Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-2">
          BPC Service Catalog
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Expert consulting services for African SMEs - Browse and request
          specialized support
        </p>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search Input */}
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
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm placeholder-gray-700"
            />
          </div>

          {/* Category Dropdown */}
          <div
            ref={dropdownRef}
            className="relative w-full sm:w-56 flex-shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
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
              <ServiceCard
                key={service.id}
                service={service}
                categories={categories}
              />
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
