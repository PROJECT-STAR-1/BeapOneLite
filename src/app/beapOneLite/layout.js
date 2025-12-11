// SidebarLayout.jsx (or DefaultLayout.jsx, depending on your naming preference)
"use client";

import Sidebar from "@/component/BeapOneLite/Sidebar"; // Your Sidebar import

export default function SidebarLayout({ children }) {
  // Or DefaultLayout
  return (
    // This container ensures the content fills the full height of the screen
    <div className="flex flex-col min-h-screen">
      {/* 1. Navbar and Footer are REMOVED */}

      {/* 2. Main Content Area: Sidebar and Page Content side-by-side */}
      <div className="flex flex-1">
        {/* The Sidebar Component: Fixed width (w-64 is a common Tailwind value) */}
        <Sidebar />

        {/* The Main Content Area: Takes up all remaining space (flex-1) */}
        {/* The content will scroll vertically if it overflows */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
