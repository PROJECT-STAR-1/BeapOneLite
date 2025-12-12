"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Clock3, CheckCircle2, AlertCircle } from "lucide-react";

// Initial state for the billing data structure
const initialBillingState = {
    period: "Loading...",
    userSubscription: { quantity: 0, price: 0 },
    // Include overagePricePerGB to enable dynamic calculation
    dataStorage: { used: 0, limit: 0, overagePricePerGB: 0 }, 
    eInvoice: { quantity: 0, price: 0 },
    total: 0,
    nextBillingDate: "N/A",
};
const initialPaymentHistory = [];

export default function Billing() {
    // 1. USE STATE FOR DYNAMIC DATA
    const [billingData, setBillingData] = useState(initialBillingState);
    const [paymentHistory, setPaymentHistory] = useState(initialPaymentHistory);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. DATA FETCHING
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
                
                if (data && data.billingDetails) {
                    setBillingData(data.billingDetails.currentBilling || initialBillingState);
                    setPaymentHistory(data.billingDetails.paymentHistory || initialPaymentHistory);
                } else {
                    throw new Error("Invalid data structure: billingDetails not found.");
                }
                setError(null);
            } catch (e) {
                console.error("Fetch error:", e);
                setError("Failed to load billing data.");
                setBillingData(initialBillingState);
                setPaymentHistory(initialPaymentHistory);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 3. DYNAMIC CALCULATIONS
    const userSubTotal = billingData.userSubscription.quantity * billingData.userSubscription.price;
    const eInvoiceTotal = billingData.eInvoice.quantity * billingData.eInvoice.price;

    // Calculate data overage cost (only charged if usage exceeds limit)
    const overageGB = Math.max(0, billingData.dataStorage.used - billingData.dataStorage.limit);
    const dataStorageCost = overageGB * billingData.dataStorage.overagePricePerGB;
    
    // The visual total will be the sum of calculated parts, not necessarily the hardcoded 'total' field
    const calculatedTotal = userSubTotal + eInvoiceTotal + dataStorageCost;


    // Handle Loading and Error States
    if (loading) {
        return (
            <div className="p-8 text-center text-lg font-medium text-indigo-600">
                Loading Billing Details...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-100 text-red-700 rounded-xl">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <p className="font-semibold">{error}</p>
                <p className="text-sm">Cannot display billing details.</p>
            </div>
        );
    }

    // --- MAIN RENDER ---
    return (
        <div className="p-3 space-y-8 max-w-4xl mx-auto"> 

            {/* Billing Calculation */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold">Current Billing Calculation</h2>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                    Billing Period: <span className="font-medium">{billingData.period}</span>
                </p>

                {/* User Subscription */}
                <div className="flex justify-between py-3 border-b">
                    <div>
                        <p className="font-medium">User Subscription</p>
                        <p className="text-sm text-gray-600">
                            {billingData.userSubscription.quantity} × ₦{billingData.userSubscription.price.toLocaleString()}
                        </p>
                    </div>
                    {/* Dynamic Subtotal */}
                    <p className="font-semibold">
                        ₦{userSubTotal.toLocaleString()}
                    </p>
                </div>

                {/* Data Storage */}
                <div className="flex justify-between py-3 border-b">
                    <div>
                        <p className="font-medium">
                            Data Storage ({billingData.dataStorage.used} GB / {billingData.dataStorage.limit} GB)
                        </p>
                        <p className="text-sm text-gray-600">
                            {overageGB.toFixed(1)}  × ₦{billingData.dataStorage.overagePricePerGB.toLocaleString()}
                        </p>
                    </div>
                    {/* Dynamic Subtotal */}
                    <p className="font-semibold">₦{dataStorageCost.toLocaleString()}</p>
                </div>

                {/* eInvoice */}
                <div className="flex justify-between py-3 border-b">
                    <div>
                        <p className="font-medium">eInvoice Submissions ({billingData.eInvoice.quantity} invoices)</p>
                        <p className="text-sm text-gray-600">
                            {billingData.eInvoice.quantity} × ₦{billingData.eInvoice.price}
                        </p>
                    </div>
                    {/* Dynamic Subtotal */}
                    <p className="font-semibold">
                        ₦{eInvoiceTotal.toLocaleString()}
                    </p>
                </div>

                {/* Total */}
                <div className="text-right mt-4">
                    <p className="text-xl font-bold text-indigo-700">₦{calculatedTotal.toLocaleString()}</p>
                </div>

                {/* Next Billing Date */}
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg space-y-1">
                    <p className="text-indigo-700 flex gap-1 items-center font-semibold"> 
                        <Clock3 className="w-5 h-5 text-indigo-700" />Next Billing Date 
                    </p>
                    <p className="text-sm text-gray-700">
                        Your next payment of <span className="font-semibold">₦{calculatedTotal.toLocaleString()}</span> 
                        will be processed on <span className="font-medium">{billingData.nextBillingDate}</span>.
                    </p>
                </div>
            </div>

            {/* Payment History */}
            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Payment History</h2>

                <div className="space-y-4">
                    {paymentHistory.length > 0 ? (
                        paymentHistory.map((item, i) => (
                            <div
                                key={i}
                                className="border p-4 rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold">₦{item.amount.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">{item.date}</p>
                                    <p className="text-sm text-gray-500">{item.method}</p>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-green-600 text-sm font-medium">
                                        <CheckCircle2 className="w-4 h-4" />
                                        {item.status}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{item.invoiceId}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="text-center text-gray-500 p-4 border border-dashed rounded-lg">
                            No payment history found for your account.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}