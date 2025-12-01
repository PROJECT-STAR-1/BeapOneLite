"use client";

import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-6 px-6">
        
        {/* Left section: Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#171568]" />
          <span className="text-lg font-medium text-gray-800">BEAPOne</span>
        </div>

        {/* Center navigation */}
        <nav className="hidden md:flex items-center gap-10 text-gray-600">
          <a href="#" className="hover:text-gray-900">Features</a>
          <a href="#" className="hover:text-gray-900">Pricing</a>
          <a href="#" className="hover:text-gray-900">Solutions</a>
          <a href="#" className="hover:text-gray-900">Customers</a>
          <a href="#" className="hover:text-gray-900">Resources</a>
        </nav>

        {/* Right side: Social icons + copyright */}
        <div className="flex items-center gap-6 text-gray-600">
          {/* Example icons—you can add or remove */}
          <Github className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
          <Linkedin className="w-5 h-5 hover:text-gray-900 cursor-pointer" />
          <Twitter className="w-5 h-5 hover:text-gray-900 cursor-pointer" />

          <span className="text-gray-700 text-sm">
            © 2024 BEAPOne
          </span>
        </div>

      </div>
    </footer>
  );
}
