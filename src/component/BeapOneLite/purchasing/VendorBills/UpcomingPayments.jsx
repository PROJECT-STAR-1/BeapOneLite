import React, { useState, useEffect, useMemo } from 'react';
import { Ngn } from 'lucide-react';
import PaymentModal from './PaymentModal'; // Shared modal

// Utility function to format currency (needed if this component is rendered alone)
const formatNaira = (amount) => {
    return `₦${(amount || 0).toLocaleString('en-NG')}`;
};

const UpcomingPayments = () => {
    const API_URL = '/api/beapOnelite/vendorbills'; 

    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentContext, setPaymentContext] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchBills = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBills(data.bills || []);
            } catch (e) {
                console.error("Failed to fetch upcoming payments:", e);
                setError("Failed to load upcoming payments.");
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, [API_URL]);


    // --- Data Processing for Upcoming Payments ---
    const upcomingPayments = useMemo(() => {
        let installments = [];

        bills.forEach(bill => {
            if (bill.type === 'Installments' && bill.schedule) {
                bill.schedule.forEach(installment => {
                    // Only include scheduled payments that are not yet Paid
                    if (installment.status !== 'Paid') {
                        installments.push({
                            vendor: bill.vendor,
                            billId: bill.id,
                            description: bill.description,
                            totalBillAmount: bill.totalAmount,
                            installmentId: installment.id,
                            paymentType: `Installment #${installment.id}`,
                            amount: installment.amount,
                            dueDate: installment.dueDate,
                            status: installment.status,
                        });
                    }
                });
            }
        });

        // Sort by Due Date (earliest first)
        installments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        // Limit to the next 5
        return installments.slice(0, 5);
    }, [bills]);

    // --- Modal Handlers ---
    const handleOpenPaymentModal = (context) => {
        setPaymentContext(context);
        setIsModalOpen(true);
    };

    const handleClosePaymentModal = () => {
        setIsModalOpen(false);
        setPaymentContext(null);
    };

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-gray-600">Loading scheduled payments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
            </div>
        );
    }

    if (upcomingPayments.length === 0) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Next 5 Scheduled Payments</h3>
                <p className="text-gray-500">No upcoming scheduled payments found.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Next 5 Scheduled Payments</h3>
            <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                    <div
                        key={`${payment.billId}-${payment.installmentId}`}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                        {/* Payment Info */}
                        <div>
                            <p className="text-lg font-semibold text-gray-800">{payment.vendor}</p>
                            <p className="text-gray-600 text-sm">{payment.description}</p>
                            <p className="text-xs text-gray-500">
                                Bill: **{payment.billId}** • {payment.paymentType}
                            </p>
                        </div>

                        {/* Amount and Pay Now Button */}
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-800">{formatNaira(payment.amount)}</p>
                                <p className="text-sm text-gray-500">Due: **{payment.dueDate}**</p>
                            </div>
                            <button
                                // Pass the installment object as paymentContext
                                onClick={() => handleOpenPaymentModal(payment)} 
                                className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition duration-150 shadow-md flex items-center"
                            >
                                Pay Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* The shared modal */}
            {paymentContext && (
                <PaymentModal
                    isOpen={isModalOpen}
                    onClose={handleClosePaymentModal}
                    paymentContext={paymentContext}
                />
            )}
        </div>
    );
};

export default UpcomingPayments;