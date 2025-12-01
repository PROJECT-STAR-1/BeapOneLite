'use client';

import React from 'react';
import { ArrowRight, Utensils, Check } from 'lucide-react';
import Link from 'next/link';



// Component for a single feature item
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

const HospitalityFoodServiceSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 "> 
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        <div className="order-1 lg:order-1  lg:top-10 w-full lg:mt-26">
          {/* Using a light orange/peach theme for the card */}
          <div className="bg-orange-50/70 p-8 rounded-3xl shadow-xl border border-orange-300">
            
            {/* Success Story Header */}
            <div className="mb-6 pb-4 border-b border-orange-200">
              <h3 className="text-2xl font-medium text-gray-900">Success Story: Mama Njeri's Kitchen</h3>
              <p className="text-sm text-orange-600 mt-1">Nairobi, Kenya • Restaurant</p>
            </div>

            {/* Testimonial */}
            <blockquote className="text-gray-700 italic mb-8 border-l-4 border-orange-400 pl-4">
              "Running a restaurant is hectic! BEAPOne helps me track daily sales, food
              costs, and staff expenses. The mobile app means I can check business even
              when I'm not there."
            </blockquote>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-orange-200">
              <div className="p-2">
                <p className="text-3xl font-medium text-blue-600">25%</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Cost Reduction</p>
              </div>
              <div className="p-2 border-x border-orange-200">
                <p className="text-3xl font-medium text-green-600">KES 2.8M</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Monthly Sales</p>
              </div>
              <div className="p-2">
                <p className="text-3xl font-medium text-purple-600">2</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Locations</p>
              </div>
            </div>

          </div>
        </div>
        
        {/* Right Column (Content/Features) - Swapped order for visual match to image */}
        <div className="order-2 lg:order-2 lg:pt-16">
          
          {/* Icon Header (Orange theme, using Utensils) */}
          <div className="w-12 h-12 p-3 bg-orange-100 rounded-xl mb-6 shadow-md">
            <Utensils size={24} className="text-orange-600" />
          </div>

          {/* Title and Description */}
          <h1 className="text-4xl sm:text-5xl font-medium text-gray-900 mb-4">
            Hospitality & Food Service
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-lg">
            Built for restaurants, cafes, catering services, and hotels. Track daily sales,
            manage food costs, and control expenses across multiple shifts.
          </p>

          {/* Feature List */}
          <div className="space-y-6 mb-12">
            <FeatureBullet 
              title="Daily Sales Tracking"
              description="Monitor revenue by shift and server"
            />
            <FeatureBullet 
              title="Food Cost Management"
              description="Track ingredient purchases and usage"
            />
            <FeatureBullet 
              title="Staff Expense Tracking"
              description="Manage payroll and tips"
            />
            <FeatureBullet 
              title="Multi-Location Support"
              description="Manage multiple branches from one dashboard"
            />
          </div>

          {/* Call-to-Action Button */}
          <Link
            href="/signin" 
            className="inline-flex items-center space-x-2 px-8 py-3 text-lg font-bold 
                       text-white bg-gray-900 rounded-xl transition duration-300 shadow-xl 
                       hover:bg-gray-700 transform hover:scale-[1.03]"
          >
            <span>Start Free for Hospitality</span>
            <ArrowRight size={20} className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HospitalityFoodServiceSection;