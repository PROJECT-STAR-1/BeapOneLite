"use client";
import Sidebar from "@/component/BeapOneLite/Sidebar";
import Navbar from "@/component/BeapOneLite/Navbar";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function BeapOneLiteLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex relative">

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(false)} 
      />

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#0A0F1F] p-3 flex items-center gap-4 z-40">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="text-white" size={28} />
        </button>
        <span className="text-white font-semibold">BEAPOne Lite</span>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur  md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
       <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        <div className="p-6 flex-1 bg-gray-50 mt-12 md:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
