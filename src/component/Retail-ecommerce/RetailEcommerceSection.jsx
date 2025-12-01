'use client';

import React from 'react';
import { ArrowRight, ShoppingCart, Check } from 'lucide-react';
import Link from 'next/link';



// Component for a single retail feature item
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

const RetailEcommerceSection = () => {
  return (
    <section className="py-15 px-15 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Title, Description, Features, and Button */}
        <div className="lg:sticky lg:top-10">
          
          {/* Icon Header */}
          <div className="w-12 h-12 p-3 bg-blue-100 rounded-xl mb-6 shadow-md">
            <ShoppingCart size={24} className="text-blue-600" />
          </div>

          {/* Title and Description */}
          <h1 className="text-4xl sm:text-5xl font-medium text-gray-900 mb-4">
            Retail & E-commerce
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-lg">
            Manage your physical store, online shop, or both with ease. Track
            inventory, process sales, and understand what's selling.
          </p>

          {/* Feature List */}
          <div className="space-y-6 mb-12">
            <FeatureBullet 
              title="Point of Sale (POS)"
              description="Quick invoicing for walk-in customers"
            />
            <FeatureBullet 
              title="Inventory Tracking"
              description="Know what's in stock across all locations"
            />
            <FeatureBullet 
              title="Multi-Channel Sales"
              description="Track sales from store, WhatsApp, Instagram"
            />
            <FeatureBullet 
              title="Customer Management"
              description="Build customer database with purchase history"
            />
          </div>

          {/* Call-to-Action Button */}
          <Link
            href="/signin" 
            className="inline-flex items-center space-x-2 px-8 py-3 text-lg font-bold 
                       text-white bg-gray-900 rounded-xl transition duration-300 shadow-xl 
                       hover:bg-gray-700 transform hover:scale-[1.03]"
          >
            <span>Start Free for Retail</span>
            <ArrowRight size={20} className="ml-1" />
          </Link>
        </div>

        {/* Right Column: Success Story and Metrics Card */}
        <div className="w-full lg:pt-16 ">
          <div className="bg-white/40 p-8 rounded-3xl shadow-xl border border-blue-300">
            
            {/* Success Story Header */}
            <div className="mb-6 pb-4 border-b border-blue-200 ">
              <h3 className="text-2xl font-medium text-gray-900">Success Story: Adaeze Fashion Boutique</h3>
              <p className="text-sm text-blue-600 mt-1">Lagos, Nigeria • Retail</p>
            </div>

            {/* Testimonial */}
            <blockquote className="text-gray-700 italic mb-8 border-l-4 border-blue-400 pl-4">
              "Before BEAPONE, I was using Excel and it was chaos. Now I can track sales
              from my physical store and Instagram all in one place. I know exactly what's
              selling and what to restock."
            </blockquote>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-blue-200">
              <div className="p-2">
                <p className="text-4xl font-medium text-blue-600">3x</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Revenue Growth</p>
              </div>
              <div className="p-2 border-x border-blue-200">
                <p className="text-4xl font-medium text-green-600">₦2.1M</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Monthly Sales</p>
              </div>
              <div className="p-2">
                <p className="text-4xl font-medium text-purple-600">450+</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Customers</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default RetailEcommerceSection;