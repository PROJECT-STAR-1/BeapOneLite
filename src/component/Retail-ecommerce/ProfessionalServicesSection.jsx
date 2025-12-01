'use client';

import React from 'react';
import { ArrowRight, Briefcase, Check } from 'lucide-react';
// IMPORTANT: In your Next.js project, you MUST use the following import:
// import Link from 'next/link';

// --- MOCK Link Component for Self-Contained Environment ---
// When you paste this into your Next.js project, REMOVE this mock component definition.
const Link = ({ href, children, className }) => (
  <a href={href} className={className}>
    {children}
  </a>
);
// -----------------------------------------------------------

// Component for a single service feature item
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

const ProfessionalServicesSection = () => {
  return (
    
    <section className="py-20 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        <div className="order-2 lg:order-1   ">
          
          {/* Icon Header */}
          <div className="w-12 h-12 p-3 bg-purple-100 rounded-xl mb-6 shadow-md">
            <Briefcase size={24} className="text-purple-600" />
          </div>

          {/* Title and Description */}
          <h1 className="text-4xl sm:text-5xl font-medium text-gray-900 mb-4">
            Professional Services
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-lg">
            Perfect for consultants, lawyers, accountants, designers, and agencies.
            Track time, bill clients, and manage projects efficiently.
          </p>

          {/* Feature List */}
          <div className="space-y-6 mb-12">
            <FeatureBullet 
              title="Project-Based Billing"
              description="Track billable hours by client and project"
            />
            <FeatureBullet 
              title="Recurring Invoices"
              description="Set up retainers and subscriptions"
            />
            <FeatureBullet 
              title="Expense Tracking"
              description="Capture client expenses for reimbursement"
            />
            <FeatureBullet 
              title="Professional Reports"
              description="Share financial summaries with partners"
            />
          </div>

          {/* Call-to-Action Button */}
          <Link
            href="/signin" // Assuming this button also goes to signin/signup
            className="inline-flex items-center space-x-2 px-8 py-3 text-lg font-bold 
                       text-white bg-gray-900 rounded-xl transition duration-300 shadow-xl 
                       hover:bg-gray-700 transform hover:scale-[1.03]"
          >
            <span>Start Free for Services</span>
            <ArrowRight size={20} className="ml-1" />
          </Link>
        </div>
        
        <div className="w-full mt-16">
          <div className="bg-purple-50/70 p-8 rounded-3xl shadow-xl border border-purple-400">
            
            {/* Success Story Header */}
            <div className="mb-6 pb-4 border-b border-purple-200">
              <h3 className="text-2xl font-medium text-gray-900">Success Story: Kwame Legal Associates</h3>
              <p className="text-sm text-purple-600 mt-1">Accra, Ghana • Legal Services</p>
            </div>

            {/* Testimonial */}
            <blockquote className="text-gray-700 italic mb-8 border-l-4 border-purple-400 pl-4">
              "As a law firm, we bill by the hour and manage multiple client cases.
              BEAPone's project tracking helps us bill accurately and the WhatsApp
              integration means clients pay faster."
            </blockquote>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-purple-200">
              <div className="p-2">
                <p className="text-3xl font-medium text-blue-600">40%</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Faster Payments</p>
              </div>
              <div className="p-2 border-x border-purple-200">
                <p className="text-3xl font-medium text-green-600">GH₵85K</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Monthly Revenue</p>
              </div>
              <div className="p-2">
                <p className="text-3xl font-medium text-purple-600">62</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Active Clients</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalServicesSection;