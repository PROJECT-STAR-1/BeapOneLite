"use client";
import Sidebar from "@/component/BeapOneLite/Sidebar";
import Navbar from "@/component/BeapOneLite/Navbar"; 
import { useState } from "react";

export default function BeapOneLiteLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar /> {/* custom navbar */}
        <div className="p-6 flex-1 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}
