'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';


const IndustrySolutions = () => {
  return (
    // Gradient Background Section matching the image (Purple/Blue/Pink)
    <header className="py-32 px-4 sm:px-6 lg:px-8 
                       bg-gradient-to-br from-blue-300 via-blue-600 to-purple-400 
                       text-white text-center shadow-2xl">
      <div className="max-w-4xl mx-auto">
        
        {/* Industry Solutions Badge */}
        <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold uppercase tracking-wider 
                         text-white bg-white/20 rounded-xl border border-white/25">
          Industry Solutions
        </span>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-tight tracking-tighter mb-6">
          Built for Your Industry
          <br />
          Designed for Your Success
        </h1>

        {/* Subtitle/Description */}
        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10">
          Whether you run a retail store, service business, wholesale operation, or restaurant,
          BEAPONE Lite has the tools you need to succeed.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex justify-center space-x-4">
          
          {/* Start Free Trial Button */}
          <Link
            href="/signin"
            className="inline-flex items-center space-x-2 px-8 py-3 text-lg font-bold 
                       text-gray-900 bg-white rounded-xl transition duration-300 shadow-xl 
                       hover:bg-gray-100 transform hover:scale-[1.05]"
          >
            <span>Start Free Trial</span>
            <ArrowRight size={20} className="ml-1" />
          </Link>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-3 text-lg font-bold 
                       text-white bg-white/10 border-2 border-white/50 rounded-xl transition duration-300 shadow-xl 
                       hover:bg-white/20 transform hover:scale-[1.05]"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </header>
  );
};

export default IndustrySolutions;