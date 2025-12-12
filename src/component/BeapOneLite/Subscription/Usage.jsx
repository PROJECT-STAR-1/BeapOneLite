"use client";

import React, { useState, useEffect, useMemo } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";
import { Activity, MapPin, Lock, AlertCircle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  BarElement
);

// Define default structure for usage data
const initialUsageData = {
    usageTrends: { labels: [], activeUsersData: [], dataUsageGBData: [] },
    invoiceSubmissions: { labels: [], data: [] },
    locations: [],
    locationLimitReached: false,
};


export default function Usage() {
    const [usageMetrics, setUsageMetrics] = useState(initialUsageData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. DATA FETCHING (useEffect to fetch the API)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // FETCH THE API ROUTE
                const response = await fetch('/api/beapOnelite/subscriptions'); 
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Extract the usageMetrics object from the fetched data
                if (data && data.usageMetrics) {
                    setUsageMetrics(data.usageMetrics);
                } else {
                    throw new Error("Invalid data structure: usageMetrics object not found.");
                }
                setError(null);
            } catch (e) {
                console.error("Fetch error:", e);
                setError("Failed to load usage data.");
                setUsageMetrics(initialUsageData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 2. Derive chart data using useMemo for efficiency
    const usageTrendsData = useMemo(() => {
        return {
            labels: usageMetrics.usageTrends.labels,
            datasets: [
                {
                    label: "Active Users",
                    data: usageMetrics.usageTrends.activeUsersData,
                    borderColor: "#0f172a", // slate-900
                    backgroundColor: "#0f172a",
                    tension: 0.4,
                    pointRadius: 3,
                    yAxisID: 'y',
                },
                {
                    label: "Data Usage (GB)",
                    data: usageMetrics.usageTrends.dataUsageGBData,
                    borderColor: "#8b5cf6", // violet-500
                    backgroundColor: "#8b5cf6",
                    tension: 0.4,
                    pointRadius: 3,
                    yAxisID: 'y1', // Use a secondary axis if needed for different scales
                },
            ],
        };
    }, [usageMetrics]);

    const invoiceBarData = useMemo(() => {
        return {
            labels: usageMetrics.invoiceSubmissions.labels,
            datasets: [
                {
                    label: "Invoices",
                    data: usageMetrics.invoiceSubmissions.data,
                    backgroundColor: "#10b981", // emerald-500
                },
            ],
        };
    }, [usageMetrics]);

    // Chart options (kept separate from data)
    const usageOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { 
                beginAtZero: true,
                type: 'linear',
                position: 'left',
                title: { display: true, text: 'Active Users' }
            },
            y1: { 
                beginAtZero: true,
                type: 'linear',
                position: 'right',
                grid: { drawOnChartArea: false }, // Only draw grid lines for the main axis
                title: { display: true, text: 'Data Usage (GB)' }
            },
            x: {
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10 // Limit the number of date labels for clarity
                }
            }
        },
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: { position: "bottom", labels: { usePointStyle: true } },
            tooltip: { callbacks: { title: (context) => context[0].label } }
        },
    };

    const invoiceOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
    };

    // Handle Loading and Error States
    if (loading) {
        return (
            <div className="p-8 text-center text-lg font-medium text-indigo-600">
                Loading Usage Metrics...
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
        <div className="space-y-8 p-4 md:p-6">
            {/* ----------------------- */}
            {/* Usage Trends (30 days) */}
            {/* ----------------------- */}

            <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold">Usage Trends (Last 30 Days)</h2>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    Real-time monitoring of active users, data storage, and transaction volume
                </p>

                <div className="h-72">
                    <Line data={usageTrendsData} options={usageOptions} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ----------------------- */}
                {/* Invoice Submissions */}
                {/* ----------------------- */}

                <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Invoice Submissions (Monthly)</h2>
                    <div className="h-64">
                        <Bar data={invoiceBarData} options={invoiceOptions} />
                    </div>
                </div>

                {/* ----------------------- */}
                {/* Location Activity */}
                {/* ----------------------- */}

                <div className="bg-white rounded-2xl p-6 shadow border border-gray-100 space-y-4">
                    <h2 className="text-lg font-semibold">Location Activity</h2>

                    {usageMetrics.locations.map((location, index) => (
                        <div 
                            key={index} 
                            className={`p-4 bg-green-50 border border-green-100 rounded-xl flex justify-between items-center`}
                        >
                            <div>
                                <div className="flex items-center gap-2 font-medium">
                                    <MapPin className={`w-4 h-4 text-green-600`} />
                                    {location.name}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{location.type}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs rounded-full bg-green-600 text-white`}>
                                {location.status}
                            </span>
                        </div>
                    ))}
                    

                    {/* Upgrade Notice */}
                    {usageMetrics.locationLimitReached && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                            <Lock className="w-4 h-4 text-yellow-600 mt-1" />
                            <p className="text-sm text-yellow-800">
                                You've reached your 2-location limit. Upgrade to PREMIUM for unlimited locations.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}