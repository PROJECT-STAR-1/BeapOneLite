"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  Building2,
  BarChart3,
  FileText,
  Menu,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  Users,
  Receipt,
  FolderOpen,
  Layers,
  File,
  DollarSign,
  Clipboard,
  Calendar,
} from "lucide-react";

// Helper component for a menu item
const MenuItem = ({ href, icon: Icon, label, status }) => (
  <Link href={href}>
    <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 rounded-lg text-sm">
      <Icon size={18} />
      {label}
      <span className="ml-auto text-green-400">{status}</span>
    </div>
  </Link>
);

// Helper component for a dropdown
const Dropdown = ({ title, icon: Icon, items, isOpen, toggle }) => (
  <div>
    <button
      onClick={toggle}
      className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg w-full text-sm"
    >
      <Icon size={18} />
      {title}
      <span className="ml-auto text-purple-400">S</span>
      {isOpen ? <ChevronDown /> : <ChevronRight />}
    </button>

    {isOpen && (
      <div className="ml-6 mt-1 space-y-2 text-gray-300 text-xs">
        {items.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <div className="flex items-center gap-2 p-2 hover:text-white cursor-pointer">
              <item.icon size={16} /> {item.label}
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Menu items and dropdown contents
  const menuItems = [
    { href: "/beapOneLite", icon: LayoutDashboard, label: "Dashboard", status: "✓" },
    { href: "/beapOneLite/ewallet", icon: Wallet, label: "eWallet & Payments", status: "✓" },
    { href: "/bank-reconciliation", icon: Building2, label: "Bank Reconciliation", status: "S" },
    { href: "/project-profitability", icon: FileText, label: "Project Profitability", status: "S" },
    { href: "/financial-reports", icon: BarChart3, label: "Financial Reports", status: "S" },
    { href: "/reporting-engine", icon: FileText, label: "Reporting Engine", status: "S" },
    { href: "/e-invoicing-tax", icon: FileText, label: "E-Invoicing & Tax", status: "P" },
    { href: "/document-management", icon: FileText, label: "Document Management", status: "P" },
    { href: "/subscription-billing", icon: FileText, label: "Subscription & Billing", status: "✓" },
    { href: "/bpc-portal", icon: FileText, label: "BPC Portal", status: "P" },
    { href: "/settings", icon: FileText, label: "Settings", status: "✓" },
  ];

  const salesInvoicingItems = [
    { href: "/invoices", icon: Clipboard, label: "Invoices" },
    { href: "/aging-schedule", icon: Calendar, label: "Aging Schedule" },
    { href: "/invoice-register", icon: File, label: "Invoice Register" },
    { href: "/tax-wht-report", icon: DollarSign, label: "Tax & WHT Report" },
    { href: "/sales-reports", icon: BarChart3, label: "Sales Reports" },
  ];

  const expensesItems = [
    { href: "/expenses-dashboard", icon: Clipboard, label: "Dashboard" },
    { href: "/expenses-register", icon: File, label: "Expense Register" },
    { href: "/expenses-legacy", icon: Calendar, label: "Legacy" },
  ];

  const purchasingItems = [
    { href: "/purchase-orders", icon: Clipboard, label: "Purchase Orders" },
    { href: "/purchasing-reports", icon: BarChart3, label: "Purchasing Reports" },
  ];

  const salesOrdersItems = [
    { href: "/sales-orders-overview", icon: Clipboard, label: "Overview" },
    { href: "/sales-orders-history", icon: Calendar, label: "History" },
  ];

  const documentsComplianceItems = [
    { href: "/compliance-documents", icon: File, label: "Compliance Documents" },
    { href: "/document-archiving", icon: Clipboard, label: "Document Archiving" },
  ];

  const channelManagementItems = [
    { href: "/channel-setup", icon: Clipboard, label: "Channel Setup" },
    { href: "/channel-reporting", icon: BarChart3, label: "Channel Reporting" },
  ];

  return (
    <div
      className={`bg-[#0A0F1F] text-white w-64 h-screen fixed left-0 top-0 overflow-y-auto transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } md:translate-x-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="text-xl font-bold">BEAPOne Lite</div>
        <button className="md:hidden" onClick={toggleSidebar}>
          <Menu className="text-white" />
        </button>
      </div>

      {/* Menu items */}
      <div className="mt-4 space-y-1 px-2">
        {menuItems.map((item, idx) => (
          <MenuItem key={idx} href={item.href} icon={item.icon} label={item.label} status={item.status} />
        ))}

        {/* Dropdowns */}
        <Dropdown
          title="Sales & Invoicing"
          icon={FileText}
          items={salesInvoicingItems}
          isOpen={openDropdowns.salesInvoicing}
          toggle={() => toggleDropdown("salesInvoicing")}
        />
        <Dropdown
          title="Expenses"
          icon={Receipt}
          items={expensesItems}
          isOpen={openDropdowns.expenses}
          toggle={() => toggleDropdown("expenses")}
        />
        <Dropdown
          title="Purchasing"
          icon={ShoppingCart}
          items={purchasingItems}
          isOpen={openDropdowns.purchasing}
          toggle={() => toggleDropdown("purchasing")}
        />
        <Dropdown
          title="Sales Orders"
          icon={FolderOpen}
          items={salesOrdersItems}
          isOpen={openDropdowns.salesOrders}
          toggle={() => toggleDropdown("salesOrders")}
        />
        <Dropdown
          title="Documents & Compliance"
          icon={FileText}
          items={documentsComplianceItems}
          isOpen={openDropdowns.documentsCompliance}
          toggle={() => toggleDropdown("documentsCompliance")}
        />
        <Dropdown
          title="Channel Management"
          icon={Layers}
          items={channelManagementItems}
          isOpen={openDropdowns.channelManagement}
          toggle={() => toggleDropdown("channelManagement")}
        />

        {/* Plan Section */}
        <div className="mt-8 p-4 text-center border-t border-gray-700">
          <div className="text-xs text-gray-400">Current Plan</div>
          <div className="text-sm font-semibold text-white">FREE TIER</div>
          <button className="mt-2 px-4 py-2 text-xs text-white bg-purple-500 rounded-md hover:bg-purple-600">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
