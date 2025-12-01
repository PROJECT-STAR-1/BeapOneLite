"use client" ;

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';


const PricingHero = () => {
  // State for the pricing toggle: true for Annual, false for Monthly
  const [isAnnual, setIsAnnual] = useState(true);

 

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4e148e] via-[#6a0dad] to-[#ec1673] p-4 sm:p-8">
      <div className="text-center max-w-4xl w-full py-16">

        {/* Top Badge: "Simple, Transparent Pricing" */}
        <div className="mb-8">
          <span className="inline-block px-4 py-1 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm rounded-full tracking-wider shadow-lg">
            Simple, Transparent Pricing
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
          Pricing That Grows <br /> With Your Business
        </h1>

        {/* Subtitle/Description */}
        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-xl mx-auto">
          Start free, upgrade when you're ready. All plans include unlimited invoices, offline
          mode, and multi-currency support.
        </p>

        {/* Pricing Toggle Section */}
        <div className="flex justify-center items-center space-x-3 mb-16">
          
          {/* Monthly Label */}
          <span className={`text-sm font-medium transition-colors duration-300 ${!isAnnual ? 'text-white' : 'text-white/60'}`}>
            Monthly
          </span>

          {/* Custom Toggle Switch */}
          <div
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer bg-white/20 transition-all duration-300 shadow-inner"
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                isAnnual ? 'translate-x-8' : 'translate-x-0'
              }`}
            ></div>
          </div>

          {/* Annual Label and Save Badge */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium transition-colors duration-300 ${isAnnual ? 'text-white' : 'text-white/60'}`}>
              Annual
            </span>
            <span className="text-xs font-bold text-black bg-lime-400 px-2 py-0.5 rounded-full shadow-md">
              Save 20%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          
          {/* Primary Button: Start Free Trial -> /signin */}
          {/* Uses the Link component with the correct Next.js href prop */}
          <Link
            href="/signin"
            className="flex items-center justify-center space-x-2 px-8 py-3 text-lg font-bold text-white 
                       rounded-xl transition duration-300 shadow-xl w-full sm:w-auto
                       bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                       transform hover:scale-[1.02]"
          >
            <span>Start Free Trial</span>
            <ArrowRight size={20} />
          </Link>

          {/* Secondary Button: Back to Home -> / */}
          {/* Uses the Link component with the correct Next.js href prop */}
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 px-8 py-3 text-lg font-bold text-white/80 
                       rounded-xl border border-white/50 transition duration-300 w-full sm:w-auto
                       hover:bg-white/10 hover:border-white transform hover:scale-[1.02]"
          >
            <span>Back to Home</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PricingHero;