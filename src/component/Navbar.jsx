"use client";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ============================================================
   MENUS THAT USE MEGA-DROPDOWN STYLE
============================================================ */
const multiSectionMenus = [
  "Features",
  "Solutions",
  "Partner with us",
  "Customers",
  "Resources",
];

/* ============================================================
   FULL DROPDOWN LAYOUTS
============================================================ */
const dropdownLayouts = {
  /* -----------------------------
     FEATURES
  ------------------------------ */
  Features: {
    sections: [
      {
        title: "By Module",
        items: [
          { label: "Client Invoicing", sub: "Create & share professional invoices", href: "/features/invoicing" },
          { label: "Expense Tracking", sub: "Capture receipts & track spending", href: "/features/expenses" },
          { label: "Bank Reconciliation", sub: "Match transactions automatically", href: "/features/bank" },
          { label: "Financial Reports", sub: "P&L, Balance Sheet & more", href: "/features/reports" },
        ],
      },
      {
        title: "By Capability",
        items: [
          { label: "Multi-Currency Support", href: "/features/multi-currency" },
          { label: "Multi-Location Management", href: "/features/locations" },
          { label: "Role-Based Access Control", href: "/features/rbac" },
          { label: "Offline Mode", href: "/features/offline" },
        ],
      },
    ],
  },

  /* -----------------------------
     SOLUTIONS
  ------------------------------ */
  Solutions: {
    sections: [
      {
        title: "By Industry",
        items: [
          {
            label: "Retail & E-commerce",
            sub: "Inventory, POS & online sales",
            href: "/solutions/retail-ecommerce",
          },
          {
            label: "Professional Services",
            sub: "Consulting, legal & accounting",
            href: "/solutions/professional-services",
          },
          {
            label: "Wholesale & Distribution",
            sub: "B2B sales & supply chain",
            href: "/solutions/wholesale-distribution",
          },
          {
            label: "Hospitality & Food Service",
            sub: "Restaurants, hotels & catering",
            href: "/solutions/hospitality-food",
          },
        ],
      },
      {
        title: "By Business Size",
        items: [
          { label: "Startups & Solo Entrepreneurs", href: "/solutions/startups" },
          { label: "Growing SMEs (5–20 employees)", href: "/solutions/smes" },
          { label: "Multi-Location Businesses", href: "/solutions/multi-location" },
        ],
      },
    ],
  },

  /* -----------------------------
     PARTNER WITH US
  ------------------------------ */
  "Partner with us": {
    sections: [
      {
        title: null,
        items: [
          {
            label: "Become a Partner",
            sub: "Join our partner ecosystem",
            href: "/partner/become",
          },
          {
            label: "Reseller Program",
            sub: "Sell BEAPOne to your clients",
            href: "/partner/reseller",
          },
          {
            label: "Integration Partners",
            sub: "Build integrations with our API",
            href: "/partner/integration",
          },
          {
            label: "Developer API",
            sub: "Access our developer docs",
            href: "/partner/api",
          },
        ],
      },
    ],
  },

  /* -----------------------------
     CUSTOMERS
  ------------------------------ */
  Customers: {
    sections: [
      {
        title: null,
        items: [
          { label: "Customer Stories", href: "/customers/stories" },
          { label: "Success Stories", href: "/customers/success" },
          { label: "Case Studies", href: "/customers/case-studies" },
        ],
      },
      {
        title: "By Region",
        items: [
          { label: "Nigeria", href: "/customers/nigeria" },
          { label: "Kenya", href: "/customers/kenya" },
          { label: "Ghana", href: "/customers/ghana" },
          { label: "South Africa", href: "/customers/south-africa" },
        ],
      },
    ],
  },

  /* -----------------------------
     RESOURCES
  ------------------------------ */
  Resources: {
    sections: [
      {
        title: null,
        items: [
          { label: "Help Center", href: "/resources/help-center" },
          { label: "Documentation", href: "/resources/docs" },
          { label: "API Reference", href: "/resources/api" },
          { label: "Video Tutorials", href: "/resources/videos" },
          { label: "Blog", href: "/resources/blog" },
          { label: "Community Forum", href: "/resources/forum" },
        ],
      },
      {
        title: null,
        items: [
          { label: "System Status", href: "/resources/status" },
          { label: "Roadmap", href: "/resources/roadmap" },
        ],
      },
    ],
  },
};

/* ============================================================
   SIMPLE MENU LIST
============================================================ */
const menuItems = [
  { label: "Features" },
  { label: "Solutions" },
  { label: "Customers" },
  { label: "Partner with us" },
  { label: "Resources" },
];

/* ============================================================
   NAVBAR
============================================================ */
export default function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);     // Desktop dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile entire menu
  const [mobileDropdowns, setMobileDropdowns] = useState({}); // Mobile accordion

  const isActive = (href) => pathname.startsWith(href);

  const toggleMobileDropdown = (label) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-900"></div>
          <span className="text-xl font-semibold text-black">BEAPOne</span>
        </div>

        {/* ===== Desktop Navigation ===== */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((menu, i) => {
            const isMulti = multiSectionMenus.includes(menu.label);

            return (
              <div key={i} className="relative">

                {/* BUTTON */}
                <button
                  onClick={() => setOpenMenu(openMenu === i ? null : i)}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-gray-800 hover:bg-gray-200 transition"
                >
                  {menu.label}
                  <ChevronDown size={16} className={`transition ${openMenu === i ? "rotate-180" : ""}`} />
                </button>

                {/* ===============================
                    DESKTOP MEGA DROPDOWN
                =============================== */}
                {isMulti && openMenu === i && (
                  <div className="absolute left-0 mt-3 w-80 bg-white shadow-xl rounded-xl p-4 border z-50">
                    {dropdownLayouts[menu.label].sections.map((section, sIdx) => (
                      <div
                        key={sIdx}
                        className="mb-4 last:mb-0 pb-3 border-b last:border-b-0 last:pb-0"
                      >
                        {section.title && (
                          <h4 className="font-semibold text-gray-800 mb-3">{section.title}</h4>
                        )}

                        {section.items.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            className={`block px-3 py-2 rounded-md transition
                              ${isActive(item.href)
                                ? "bg-gray-200 text-black"
                                : "text-gray-800 hover:bg-gray-100"
                              }`}
                          >
                            <span className="font-medium">{item.label}</span>
                            {item.sub && (
                              <span className="block text-xs text-gray-500 -mt-1">{item.sub}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* PRICING */}
          <Link
            href="/pricing"
            className={`px-3 py-2 rounded-md transition
              ${
                isActive("/pricing")
                  ? "bg-indigo-100 text-indigo-900"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
          >
            Pricing
          </Link>
        </div>

        {/* RIGHT BUTTONS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/signin"
            className={`px-3 py-2 rounded-md transition
              ${
                isActive("/signin")
                  ? "bg-indigo-100 text-indigo-900"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
          >
            Sign in
          </Link>

          <Link href="/get-started">
            <button className="bg-indigo-900 text-white px-6 py-2 rounded-full hover:bg-indigo-800 transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* ===== Mobile Hamburger ===== */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ============================================================
          MOBILE MENU
      ============================================================ */}
      {mobileOpen && (
        <div className="md:hidden bg-white px-6 pb-6 border-t shadow-lg">

          <div className="flex flex-col mt-4">

            {menuItems.map((menu, idx) => {
              const isMulti = multiSectionMenus.includes(menu.label);
              const isOpen = mobileDropdowns[menu.label];

              return (
                <div key={idx} className="mb-2">

                  {/* Mobile Button */}
                  <button
                    onClick={() => isMulti ? toggleMobileDropdown(menu.label) : null}
                    className="flex justify-between items-center w-full px-3 py-3 rounded-md bg-gray-100 text-gray-800"
                  >
                    {menu.label}
                    {isMulti && (
                      <ChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
                    )}
                  </button>

                  {/* MOBILE DROPDOWN ACCORDION */}
                  {isMulti && isOpen && (
                    <div className="mt-2 ml-4 border-l pl-4">
                      {dropdownLayouts[menu.label].sections.map((section, sIdx) => (
                        <div key={sIdx} className="mb-4">
                          {section.title && (
                            <h4 className="font-semibold text-gray-700 mb-2">{section.title}</h4>
                          )}
                          {section.items.map((item, i2) => (
                            <Link
                              key={i2}
                              href={item.href}
                              className="block py-2 text-gray-700 hover:text-indigo-700"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}

            {/* PRICING */}
            <Link href="/pricing" className="mt-2 block px-3 py-2 bg-gray-100 rounded-md">
              Pricing
            </Link>

            {/* AUTH BUTTONS */}
            <Link href="/signin" className="mt-4 block text-gray-800">
              Sign in
            </Link>

            <Link href="/get-started">
              <button className="mt-3 w-full bg-indigo-900 text-white py-2 rounded-full">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
