"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Shield, CircleCheckBig, AlertCircle } from "lucide-react";

// Initial state structures
const initialFeatures = [];
const initialTierName = "Loading...";

export default function Features() {
  const [features, setFeatures] = useState(initialFeatures);
  const [currentTier, setCurrentTier] = useState(initialTierName);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DATA FETCHING
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use the shared API route
        const response = await fetch('/api/beapOnelite/subscriptions'); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract the feature matrix details
        if (data && data.featureMatrix && Array.isArray(data.featureMatrix.features)) {
            setFeatures(data.featureMatrix.features);
            // Optionally, pull the tier name from the top-level 'tier' field
            setCurrentTier(data.tier || data.featureMatrix.currentTier); 
        } else {
            throw new Error("Invalid data structure: featureMatrix or features array not found.");
        }
        setError(null);
      } catch (e) {
        console.error("Fetch error:", e);
        setError("Failed to load feature matrix.");
        setFeatures(initialFeatures);
        setCurrentTier("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Handle Loading and Error States
  if (loading) {
    return (
      <div className="p-8 text-center text-lg font-medium text-indigo-600">
        Loading Feature Entitlements...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-100 text-red-700 rounded-xl">
        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
        <p className="font-semibold">{error}</p>
        <p className="text-sm">Cannot display feature matrix.</p>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="w-full p-3 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-1 flex gap-1 items-center">
        <Shield size={24}/>
        Feature Entitlement Matrix
      </h2>
      <p className="text-gray-600 mb-6">
        Your current <span className="font-medium text-indigo-600">{currentTier}</span> plan includes access to the following modules:
      </p>

      <div className="space-y-3">
        {features.map((f) => (
          <div
            key={f.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition
              ${f.accessible 
                ? "bg-green-50 border-green-200" 
                : "bg-gray-50 border-gray-200"
              }
            `}
          >
            <div className="flex items-center gap-3">
              {f.accessible ? (
                <Unlock className="text-green-600 w-5 h-5" />
              ) : (
                <Lock className="text-gray-500 w-5 h-5" />
              )}

              <span className="font-medium">
                {f.id}: {f.title}
              </span>
            </div>

            {f.accessible ? (
              <span className="text-green-700 text-sm font-medium flex items-center gap-1">
                <CircleCheckBig className="w-4 h-4"/>
                Accessible
              </span>
            ) : (
              // This button would be wired up to open the Upgrade Modal in a real application
              <button 
                onClick={() => alert(`Showing upgrade options for ${f.title}`)}
                className="text-purple-600 text-sm font-medium px-3 py-1 rounded-md border border-purple-300 hover:bg-purple-100 transition"
              >
                Upgrade to Access
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}