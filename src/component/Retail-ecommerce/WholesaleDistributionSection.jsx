'use client';

import React from 'react';
import { ArrowRight, Package, Check } from 'lucide-react';
import Link from 'next/link';


// Component for a single wholesale feature item
const FeatureBullet = ({ title, description }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 mt-1">
      <Check size={20} className="text-green-500" />
    </div>
    <div>
      <h4 className="text-base font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const WholesaleDistributionSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 "> 
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Title, Description, Features, and Button */}
        <div className="lg:sticky lg:top-10">
          
          {/* Icon Header (Green theme) */}
          <div className="w-12 h-12 p-3 bg-green-100 rounded-xl mb-6 shadow-md">
            <Package size={24} className="text-green-600" />
          </div>

          {/* Title and Description */}
          <h1 className="text-4xl sm:text-5xl font-medium text-gray-900 mb-4">
            Wholesale & Distribution
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-lg">
            Manage bulk orders, track inventory across warehouses, and handle
            complex B2B relationships with vendors and customers.
          </p>

          {/* Feature List */}
          <div className="space-y-6 mb-12">
            <FeatureBullet 
              title="Bulk Order Management"
              description="Handle large volume orders efficiently"
            />
            <FeatureBullet 
              title="Vendor Bill Tracking"
              description="Manage what you owe suppliers"
            />
            <FeatureBullet 
              title="Purchase Orders"
              description="Create POs and track fulfillment"
            />
            <FeatureBullet 
              title="Multi-Location Warehouses"
              description="Track stock across all locations"
            />
          </div>

          {/* Call-to-Action Button */}
          <Link
            href="/signin" 
            className="inline-flex items-center space-x-2 px-8 py-3 text-lg font-bold 
                       text-white bg-gray-900 rounded-xl transition duration-300 shadow-xl 
                       hover:bg-gray-700 transform hover:scale-[1.03]"
          >
            <span>Start Free for Wholesale</span>
            <ArrowRight size={20} className="ml-1" />
          </Link>
        </div>

        {/* Right Column: Success Story and Metrics Card (Green theme) */}
        <div className="w-full lg:pt-16">
          <div className="bg-green-50/70 p-8 rounded-3xl shadow-xl border border-green-400">
            
            {/* Success Story Header */}
            <div className="mb-6 pb-4 border-b border-green-200">
              <h3 className="text-2xl font-medium text-gray-900">Success Story: Okafor Trading Company</h3>
              <p className="text-sm text-green-600 mt-1">Port Harcourt, Nigeria • Wholesale</p>
            </div>

            {/* Testimonial */}
            <blockquote className="text-gray-700 italic mb-8 border-l-4 border-green-400 pl-4">
              "We distribute to 200+ retailers across 3 states. BEAPOne helps us track
              inventory in multiple warehouses and ensures we never oversell. The multi-
              currency feature is essential for our imports."
            </blockquote>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-green-200">
              <div className="p-2">
                <p className="text-3xl font-medium text-blue-600">200+</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Retail Partners</p>
              </div>
              <div className="p-2 border-x border-green-200">
                <p className="text-3xl font-medium text-green-600">₦18M</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Monthly Volume</p>
              </div>
              <div className="p-2">
                <p className="text-3xl font-medium text-purple-600">3</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Warehouses</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WholesaleDistributionSection;