'use client';

import React from 'react';
import { ArrowRight, TrendingUp, Landmark, Users } from 'lucide-react';
import Link from 'next/link';


// --- Data for Cards ---
const solutionsData = [
  {
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Startups & Solo',
    subtitle: '1 person, Just getting started',
    description: 'Perfect for freelancers, solo entrepreneurs, and brand new businesses',
    features: [
      { text: 'Free forever plan', color: 'text-blue-600' },
      { text: 'Unlimited invoices', color: 'text-blue-600' },
      { text: 'Mobile-first', color: 'text-blue-600' },
    ],
    buttonText: 'Start Free',
    buttonClass: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100',
    link: '/signup',
  },
  {
    icon: TrendingUp,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Growing SMEs',
    subtitle: '5-20 employees, scaling fast',
    description: 'For businesses that need financial reports and team collaboration',
    features: [
      { text: 'Multi-user access', color: 'text-purple-600' },
      { text: 'Financial reports', color: 'text-purple-600' },
      { text: 'Project tracking', color: 'text-purple-600' },
    ],
    buttonText: 'Try Standard',
    buttonClass: 'bg-gray-900 text-white hover:bg-gray-700',
    link: '/signup',
    highlight: true,
  },
  {
    icon: Landmark,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Multi-Location',
    subtitle: 'Multiple branches or franchises',
    description: 'For businesses operating in multiple locations or markets',
    features: [
      { text: 'Multi-location support', color: 'text-green-600' },
      { text: 'Consolidated reports', color: 'text-green-600' },
      { text: 'Advanced RBAC', color: 'text-green-600' },
    ],
    buttonText: 'Try Professional',
    buttonClass: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100',
    link: '/signup',
  },
];

// --- Single Solution Card Component ---
const SolutionCard = ({ data }) => {
  const IconComponent = data.icon;
  
  return (
    <div className={`flex flex-col h-full p-8 rounded-3xl transition duration-300 
                     ${data.highlight ? 'shadow-xl ring-2 ring-purple-300 bg-white' : 'shadow-md bg-white hover:shadow-lg'}`}>
      
      {/* Icon */}
      <div className={`w-12 h-12 p-3 ${data.iconBg} rounded-xl mb-6 shadow-sm`}>
        <IconComponent size={24} className={data.iconColor} />
      </div>

      {/* Title Block */}
      <h3 className="text-2xl font-medium text-gray-900 mb-1">{data.title}</h3>
      <p className="text-sm font-medium text-gray-500 mb-4">{data.subtitle}</p>
      
      {/* Description */}
      <p className="text-sm text-gray-600 mb-6 flex-grow">{data.description}</p>

      {/* Feature List */}
      <div className="space-y-3 mb-8">
        {data.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            {/* Using a dot/bullet point matching the image's style */}
            <span className={`w-2 h-2 rounded-full ${feature.color === 'text-blue-600' ? 'bg-blue-600' : feature.color === 'text-purple-600' ? 'bg-purple-600' : 'bg-green-600'} flex-shrink-0`}></span>
            <span className="text-base text-gray-700">{feature.text}</span>
          </div>
        ))}
      </div>

      {/* Button */}
      <Link
        href={data.link}
        className={`mt-auto inline-flex items-center justify-center space-x-2 w-full px-6 py-3 font-semibold 
                   rounded-xl transition duration-300 transform hover:scale-[1.01] shadow-lg ${data.buttonClass}`}
      >
        <span>{data.buttonText}</span>
        <ArrowRight size={18} className="ml-1" />
      </Link>
    </div>
  );
};

// --- Main Component ---
const BusinessSizeSolutions = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight">
            Solutions by Business Size
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            Whether you're just starting or scaling up, we have the right plan for you
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutionsData.map((data, index) => (
            <SolutionCard key={index} data={data} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default BusinessSizeSolutions;