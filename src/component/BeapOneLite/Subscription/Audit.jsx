"use client";

import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  Calculator,
  Webhook,
  Shuffle,
  AlertCircle,
} from "lucide-react";

const initialAuditData = [];

// Helper function to map the event type to the appropriate icon and color
const getEventIconAndColor = (type) => {
    switch (type) {
        case "TIER CHANGE":
            return { 
                icon: <FileEdit className="w-5 h-5" />, 
                iconClass: "text-purple-600",
                bgClass: "bg-purple-100"
            };
        case "CHARGE CALC":
            return { 
                icon: <Calculator className="w-5 h-5" />, 
                iconClass: "text-blue-600",
                bgClass: "bg-blue-100"
            };
        case "PG WEBHOOK RECEIVE":
            return { 
                icon: <Webhook className="w-5 h-5" />, 
                iconClass: "text-green-600",
                bgClass: "bg-green-100"
            };
        case "STATUS TRANSITION":
            return { 
                icon: <Shuffle className="w-5 h-5" />, 
                iconClass: "text-gray-700",
                bgClass: "bg-gray-200"
            };
        default:
            return { 
                icon: <AlertCircle className="w-5 h-5" />, 
                iconClass: "text-red-600",
                bgClass: "bg-red-100"
            };
    }
};

export default function Audit() {
    const [auditData, setAuditData] = useState(initialAuditData);
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
                
                // Extract the audit log data
                if (data && Array.isArray(data.auditLog)) {
                    setAuditData(data.auditLog);
                } else {
                    throw new Error("Invalid data structure: auditLog array not found.");
                }
                setError(null);
            } catch (e) {
                console.error("Fetch error:", e);
                setError("Failed to load audit log.");
                setAuditData(initialAuditData);
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
                Loading Audit Log...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-100 text-red-700 rounded-xl">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <p className="font-semibold">{error}</p>
                <p className="text-sm">Cannot display audit log.</p>
            </div>
        );
    }

    // --- MAIN RENDER ---
    return (
        <div className="p-6 bg-white border border-gray-400 rounded-lg shadow-sm max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-1">Subscription Audit Log</h2>
            <p className="text-sm text-gray-600 mb-6">
                Immutable record of all subscription changes and billing events
            </p>

            <div className="space-y-6">
                {auditData.map((item) => {
                    // Get dynamic icon and color based on the item type
                    const { icon, iconClass, bgClass } = getEventIconAndColor(item.type);

                    return (
                        <div
                            key={item.id}
                            className="border  border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-3">
                                    {/* Apply dynamic icon and background classes */}
                                    <div className={`p-2 rounded-lg shadow-sm ${bgClass} ${iconClass}`}>
                                        {icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.type}</p>
                                        <p className="text-xs text-gray-600">{item.date}</p>
                                    </div>
                                </div>

                                <span className="text-xs px-2 py-1 rounded border bg-white">
                                    {item.tag}
                                </span>
                            </div>

                            {/* Audit Note */}
                            {item.note && (
                                <div className="mt-4 border border-gray-400 rounded-lg bg-blue-50 p-4">
                                    <p className="text-sm mb-1">{item.note}</p>
                                    <p className="text-xs text-gray-700 font-medium">
                                        By: {item.author}
                                    </p>
                                </div>
                            )}

                            {/* Charge */}
                            {item.chargeAmount && (
                                <p className="mt-3 text-sm font-medium">
                                    Charge Amount: <span className="text-indigo-600">{item.chargeAmount}</span>
                                </p>
                            )}

                            {/* Status */}
                            {item.status && (
                                <p className="mt-1 text-sm">Status: <span className="font-medium text-green-700">{item.status}</span></p>
                            )}

                            {/* From → To */}
                            {item.from && (
                                <p className="mt-3 text-sm">
                                    <span className="text-gray-600">{item.from}</span> → <span className="font-semibold">{item.to}</span>
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}