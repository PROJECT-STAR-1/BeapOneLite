"use client" ;

import React, { useState, useMemo } from 'react';
import { Check, X, ArrowRight, Minus, Plus, Zap, Star, Crown, Users, MapPin } from 'lucide-react';
import Link from 'next/link';



// --- Configuration ---
const FREE_BASE_PRICE = 0;
const STANDARD_BASE_PRICE = 15;
const PROFESSIONAL_BASE_PRICE = 30;
const USER_PRICE = 3;
const LOCATION_PRICE = 7;

// Function to render a feature list item
const FeatureItem = ({ text, included }) => (
  <li className={`flex items-start space-x-2 py-1 ${included ? 'text-gray-800' : 'text-gray-400'}`}>
    {included ? (
      <Check size={18} className="text-green-500 flex-shrink-0 mt-1" />
    ) : (
      <X size={18} className="text-gray-400 flex-shrink-0 mt-1" />
    )}
    <span className="text-sm">{text}</span>
  </li>
);

// --- Pricing Card Component ---
const PricingCard = ({ plan, price, description, icon: Icon, features, isPopular, gradient, isSelected, onSelect }) => {
  const isFree = plan === 'FREE';

  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-col p-6 rounded-3xl shadow-xl transition-all duration-500 cursor-pointer 
        ${isSelected
          ? 'border-4 border-indigo-500 bg-white shadow-3xl transform scale-[1.04]' 
          : isPopular
          ? 'border-2 border-indigo-500 bg-white hover:shadow-3xl transform hover:scale-[1.02]'
          : 'bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-lg transform hover:scale-[1.01]'
        }
      `}
      style={{ boxShadow: isSelected ? '0 25px 50px rgba(78, 20, 142, 0.3)' : '0 10px 20px rgba(0, 0, 0, 0.05)' }}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <span className="text-sm font-medium text-black bg-yellow-400 px-3 py-0.5 rounded-full shadow-lg flex items-center">
            <Star size={14} className="mr-1" fill="currentColor" /> MOST POPULAR
          </span>
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-14 h-14 p-3 rounded-xl mb-4 mx-auto ${gradient}`}
        style={{
          boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        }}
      >
        <Icon size={32} className="text-white mx-auto" fill="currentColor" />
      </div>

      {/* Price Block */}
      <div className="text-center mb-6">
        <span className={`text-xs font-semibold uppercase tracking-wider border rounded-xl px-2 ${isFree ? 'text-gray-800 bg-gray-100' : 'text-indigo-600 bg-indigo-100'}`}>
          {plan}
        </span>
        <h2 className="text-4xl font-extrabold text-gray-900 mt-1">
          {price}
          <span className="text-base font-normal text-gray-500"> /month</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      <div className="mb-8">
        <Link
          href="/signin"
          className={`flex items-center justify-center space-x-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition duration-300 w-full shadow-lg transform hover:scale-[1.01]
                     ${isFree 
                       ? 'bg-gray-700 hover:bg-gray-800' 
                       : isPopular 
                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                       : 'bg-indigo-600 hover:bg-indigo-700'
                     }`}
        >
          <span>{isFree ? 'Start Free' : 'Get Started'}</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Features List */}
      <ul className="space-y-3 flex-grow border-t pt-6 border-gray-100">
        {features.map((f, index) => (
          <FeatureItem key={index} text={f.text} included={f.included} />
        ))}
      </ul>
    </div>
  );
};

// --- Calculator Component ---
const PricingCalculator = ({ selectedPlan }) => {
  // Reset counts whenever the plan changes to accurately reflect the starting point
  const [users, setUsers] = useState(0);
  const [locations, setLocations] = useState(0);

  // Calculate the estimated total price using the selected plan's base price
  const estimatedTotal = useMemo(() => {
    const basePrice = selectedPlan.basePrice;
    const userCost = users * USER_PRICE;
    const locationCost = locations * LOCATION_PRICE;
    return basePrice + userCost + locationCost;
  }, [users, locations, selectedPlan.basePrice]);

  const updateCount = (type, delta) => {
    if (type === 'users') {
      setUsers(prev => Math.max(0, prev + delta));
    } else if (type === 'locations') {
      setLocations(prev => Math.max(0, prev + delta));
    }
  };

  // Render a single calculator row (Users or Locations)
  const CalculatorRow = ({ label, pricePerUnit, count, type }) => {
    // The restriction on the Free plan is removed, allowing calculations for add-ons.

    return (
      <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 p-2 rounded-xl text-white ${type === 'users' ? 'bg-indigo-500' : 'bg-pink-500'}`} style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {type === 'users' ? <Users size={24} className="mx-auto" /> : <MapPin size={24} className="mx-auto" />}
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-800">{label}</h4>
            <p className="text-sm text-gray-500">${pricePerUnit} per {type === 'users' ? 'user' : 'location'}/month</p>
          </div>
        </div>
        
        {/* +/- Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateCount(type, -1)}
            disabled={count === 0} 
            className={`w-10 h-10 flex items-center justify-center rounded-md text-gray-900 transition duration-150 
              ${count === 0 ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-medium text-xl text-gray-800">{count}</span>
          <button
            onClick={() => updateCount(type, 1)}
            className={`w-10 h-10 flex items-center justify-center rounded-md text-white transition duration-150 shadow-md 
              bg-indigo-500 hover:bg-indigo-600`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-16 bg-white p-8 rounded-3xl shadow-xl max-w-3xl mx-auto border border-gray-100">
      
      {/* Calculator Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full mb-3">
          Pricing Calculator
        </span>
        <h3 className="text-3xl font-medium text-gray-900 mb-1">
          Calculate Your Custom Price
        </h3>
        <p className="text-gray-500">Add extra users and locations as you grow</p>
      </div>

      {/* Calculator Body */}
      <div className="space-y-4">
        <CalculatorRow 
          label="Additional Users"
          pricePerUnit={USER_PRICE}
          count={users}
          type="users"
        />
        <CalculatorRow 
          label="Additional Locations"
          pricePerUnit={LOCATION_PRICE}
          count={locations}
          type="locations"
        />
      </div>

      {/* Estimated Total */}
      <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between items-center">
        <span className="text-lg font-medium text-gray-700">Estimated Total (monthly)</span>
        <span className="text-3xl font-extrabold text-gray-900">${estimatedTotal}</span>
      </div>

      {/* Get Started Button - Text changes based on selected plan */}
      <Link
        href="/signin"
        className="mt-8 flex items-center justify-center space-x-2 px-6 py-3 text-lg font-bold text-white rounded-xl transition duration-300 w-full shadow-lg 
                   bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.01]"
      >
        <span>{selectedPlan.btnText}</span>
        <ArrowRight size={20} />
      </Link>
    </div>
  );
};

// --- Main Component ---
const PricingTags = () => {
  // Define all plan details for easy access and state management
  const planDetails = {
    FREE: { name: 'FREE', price: `$${FREE_BASE_PRICE}`, basePrice: FREE_BASE_PRICE, btnText: 'Start Free', description: 'Perfect for testing and small operations', icon: Zap, gradient: "bg-gray-800", isPopular: false },
    STANDARD: { name: 'STANDARD', price: `$${STANDARD_BASE_PRICE}`, basePrice: STANDARD_BASE_PRICE, btnText: 'Get Started with STANDARD', description: 'Best for growing businesses', icon: Star, gradient: "bg-gradient-to-tr from-purple-500 to-indigo-600", isPopular: true },
    PROFESSIONAL: { name: 'PROFESSIONAL', price: `$${PROFESSIONAL_BASE_PRICE}`, basePrice: PROFESSIONAL_BASE_PRICE, btnText: 'Get Started with PROFESSIONAL', description: 'For established businesses', icon: Crown, gradient: "bg-gradient-to-tr from-pink-500 to-red-500", isPopular: false },
  };

  // State to track the currently selected plan (defaults to STANDARD)
  const [selectedPlan, setSelectedPlan] = useState(planDetails.STANDARD);

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planDetails[planName]);
  };
  
  const features = {
    free: [
      { text: '1 User', included: true },
      { text: '1 Location', included: true },
      { text: 'Unlimited invoices & quotes', included: true },
      { text: 'Expense tracking', included: true },
      { text: 'Basic reports (P&L)', included: true },
      { text: 'Mobile app access', included: true },
      { text: 'Multi-currency (3 currencies)', included: true },
      { text: 'Multi-language support', included: true },
      { text: 'Email support', included: true },
      { text: 'Advanced reports', included: false },
      { text: 'Bank reconciliation', included: false },
      { text: 'Custom branding', included: false },
    ],
    standard: [
      { text: '3 Users included', included: true },
      { text: '1 Location included', included: true },
      { text: 'Everything in Free, plus:', included: true },
      { text: 'Advanced financial reports', included: true },
      { text: 'Bank reconciliation', included: true },
      { text: 'Custom invoice branding', included: true },
      { text: 'Payment reminders', included: true },
      { text: 'All currencies supported', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Export to Excel/PDF', included: true },
      { text: 'Multi-location management', included: false },
      { text: 'API access', included: false },
    ],
    professional: [
      { text: '5 Users included', included: true },
      { text: '3 Locations included', included: true },
      { text: 'Everything in Standard, plus:', included: true },
      { text: 'Multi-location management', included: true },
      { text: 'Advanced permissions & roles', included: true },
      { text: 'API access for integrations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Phone & WhatsApp support', included: true },
      { text: 'Custom reporting', included: true },
      { text: 'Training for your team', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'Priority feature requests', included: true },
    ],
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Pricing Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.keys(planDetails).map((key) => {
            const planData = planDetails[key];
            return (
              <PricingCard
                key={key}
                plan={planData.name}
                price={planData.price}
                description={planData.description}
                icon={planData.icon}
                features={features[planData.name.toLowerCase()]}
                gradient={planData.gradient}
                isPopular={planData.isPopular}
                isSelected={selectedPlan.name === planData.name}
                onSelect={() => handlePlanSelect(key)}
              />
            );
          })}
        </div>

        {/* Pricing Calculator Section */}
        <PricingCalculator selectedPlan={selectedPlan} />

      </div>
    </section>
  );
};

export default PricingTags;