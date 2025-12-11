"use client";

import React, { useState, useEffect, useMemo } from 'react';

import {
  Users,
  MapPin,
  Database,
  DollarSign,
  Calendar,
  Crown,
  AlertCircle,
} from "lucide-react";

// Initial state to prevent errors while data is loading
const initialSubscriptionState = {
  tier: "Loading...",
  paid: false,
  activeUsers: 0,
  userPrice: 0,
  activeLocations: 0,
  locationLimit: 1, // Avoid division by zero
  dataUsed: 0,
  dataLimit: 1,     // Avoid division by zero
  monthlyCharge: 0,
  renewalDate: "N/A",
  nextBillingDate: "N/A",
};

export default function Overview() {
  // New state to store fetched data
  const [subscription, setSubscription] = useState(initialSubscriptionState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. DATA FETCHING (useEffect to fetch the API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // FETCH THE API ROUTE EXACTLY AS REQUESTED
        const response = await fetch('/api/beapOnelite/subscriptions'); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setSubscription(data);
        setError(null);
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Failed to load subscription data.");
        setSubscription(initialSubscriptionState);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Calculations (useMemo is good practice for derived state)
  const { dataPercent, locationPercent } = useMemo(() => {
    const dataP = subscription.dataLimit > 0 
      ? (subscription.dataUsed / subscription.dataLimit) * 100 
      : 0;
      
    const locationP = subscription.locationLimit > 0 
      ? (subscription.activeLocations / subscription.locationLimit) * 100 
      : 0;
      
    return { dataPercent: dataP, locationPercent: locationP };
  }, [subscription]);

  // Handle Loading and Error States
  if (loading) {
    return (
        <div className="p-8 text-center text-lg font-medium text-indigo-600">
            Loading Subscription Details...
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-8 text-center bg-red-100 text-red-700 rounded-xl">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold">{error}</p>
            <p className="text-sm">Please check the console for more details.</p>
        </div>
    );
  }


  return (
    <div className="p-3 space-y-6">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-xl text-white p-6 shadow">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Crown className="w-5 h-5" /> {subscription.tier}
            </h2>
            <p className="text-sm opacity-80">Current Subscription Plan</p>
          </div>

          {subscription.paid && (
            <div className="bg-white text-purple-700 px-4 py-1 rounded-full text-sm font-semibold">
              Paid
            </div>
          )}
        </div>

        {/* TOP METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

          {/* USERS */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
            <Users className="w-6 h-6 mx-auto text-blue-300" />
            <p className="text-3xl font-bold mt-2">{subscription.activeUsers}</p>
            <p className="text-sm">Active Users</p>
            <p className="text-xs opacity-80">
              ₦{subscription.userPrice.toLocaleString()}/user
            </p>
          </div>

          {/* LOCATIONS */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
            <MapPin className="w-6 h-6 mx-auto text-green-300" />
            <p className="text-3xl font-bold mt-2">
              {subscription.activeLocations}
            </p>
            <p className="text-sm">Active Locations</p>
            <p className="text-xs opacity-80">
              Limit: {subscription.locationLimit}
            </p>
          </div>

          {/* DATA STORAGE */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
            <Database className="w-6 h-6 mx-auto text-purple-300" />
            <p className="text-3xl font-bold mt-2">{subscription.dataUsed} GB</p>
            <p className="text-sm">Data Storage</p>
            <p className="text-xs opacity-80">
              {subscription.dataLimit} GB limit
            </p>
          </div>

          {/* PRICE */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
            <DollarSign className="w-6 h-6 mx-auto text-yellow-300" />
            <p className="text-3xl font-bold mt-2">
              ₦{subscription.monthlyCharge.toLocaleString()}
            </p>
            <p className="text-sm">Monthly Charge</p>
            <p className="text-xs opacity-80">Next: {subscription.renewalDate}</p>
          </div>
        </div>

        {/* BILLING INFO */}
        <div className="flex justify-between items-center text-sm mt-6">
          <p>
            <span className="opacity-80">Billing Cycle:</span>{" "}
            <span className="font-medium">Monthly</span>
          </p>
          <p>
            <span className="opacity-80">Renewal Date:</span>{" "}
            <span className="font-medium">{subscription.renewalDate}</span>
          </p>

          <button className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
            <Crown className="w-4 h-4" /> Upgrade Now
          </button>
        </div>
      </div>

      {/* STORAGE & LOCATION USAGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* DATA STORAGE USAGE */}
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="font-semibold flex gap-2 items-center">
            <Database className="w-4 h-4" /> Data Storage Usage
          </p>

          <p className="text-sm mt-4">
            Current Usage:{" "}
            <span className="font-semibold">
              {subscription.dataUsed} GB / {subscription.dataLimit} GB
            </span>
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
            <div
              className="h-2 bg-purple-700 rounded-full"
              style={{ width: `${dataPercent}%` }}
            ></div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {dataPercent.toFixed(1)}% used • Overage: ₦250/GB
          </p>
        </div>

        {/* LOCATION USAGE */}
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="font-semibold flex gap-2 items-center">
            <MapPin className="w-4 h-4" /> Location Usage
          </p>

          <p className="text-sm mt-4">
            Active Locations:{" "}
            <span className="font-semibold">
              {subscription.activeLocations} / {subscription.locationLimit}
            </span>
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
            <div
              className="h-2 bg-red-600 rounded-full"
              style={{ width: `${locationPercent}%` }}
            ></div>
          </div>

          {/* LIMIT REACHED WARNING */}
          {locationPercent >= 100 && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mt-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <p className="text-sm">
                You’ve reached your location limit. Upgrade to PREMIUM to add
                more locations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FINANCIAL METRICS */}
      <div className="bg-white rounded-xl p-6 shadow">
        <p className="font-semibold">Financial Metrics</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm opacity-75">Monthly Recurring Revenue (MRR)</p>
            <p className="text-2xl font-bold text-blue-700">
              ₦{subscription.monthlyCharge.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm opacity-75">
              Average Revenue Per User (ARPU)
            </p>
            <p className="text-2xl font-bold text-green-700">
              ₦{subscription.userPrice.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm opacity-75">Next Billing Date</p>
            <p className="text-2xl font-bold text-purple-700">
              {subscription.nextBillingDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}