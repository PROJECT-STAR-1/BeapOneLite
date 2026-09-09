'use client';
import React, { useState, useMemo } from 'react';
import { X, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

// --- Configuration Constants ---
const THRESHOLD_AMOUNT = 500000;

// --- Utility Functions ---
const formatNaira = (amount) => {
    // Ensures accurate formatting of Naira amounts, handles null/undefined safely
    return `₦${(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

/**
 * Parses the tax rate string or number into a usable decimal rate (e.g., "7.5%" -> 0.075).
 * @param {string|number} rate - The tax rate from the PO data.
 * @returns {number} The decimal tax rate.
 */
const parseTaxRate = (rate) => {
    if (typeof rate === 'number') {
        // If it's already a decimal (e.g., 0.075), return it.
        if (rate < 1) return rate;
        // If it's a whole number (e.g., 7.5) treat it as a percentage to be converted.
        return rate / 100;
    }
    if (typeof rate === 'string') {
        // Remove percentage sign and parse. Example: "7.5%" -> 7.5 -> 0.075
        const numericPart = parseFloat(rate.replace('%', '').trim());
        return isNaN(numericPart) ? 0 : numericPart / 100;
    }
    return 0;
};

/**
 * Calculates the financial summary for the PO based on line items.
 * @param {Array} items - List of line items.
 * @returns {{subtotal: number, totalTax: number, total: number, displayTaxRate: number}}
 */
const calculatePoSummary = (items) => {
    let subtotal = 0;
    let totalTax = 0;
    
    // We will use the tax rate from the first item for the summary display label
    const firstTaxRate = items.length > 0 ? parseTaxRate(items[0].taxRate) : 0; 
    const displayTaxRate = firstTaxRate;

    items.forEach(item => {
        const lineSubtotal = item.quantity * item.unitPrice;
        const taxRateDecimal = parseTaxRate(item.taxRate); // Use the parser here
        const tax = lineSubtotal * taxRateDecimal;
        subtotal += lineSubtotal;
        totalTax += tax;
    });

    return {
        subtotal,
        totalTax,
        total: subtotal + totalTax,
        displayTaxRate // Decimal rate for internal use
    };
};

// --- Component ---

const PoSignOffModal = ({ isOpen, onClose, po }) => {
    const [justificationNote, setJustificationNote] = useState('');
    const [isReviewed, setIsReviewed] = useState(false);

    // If PO data is missing, we render nothing (or a loading/error state)
    if (!po || !po.lineItems) {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                    <p className="text-lg font-semibold text-red-500">Error: PO data not loaded.</p>
                    <button onClick={onClose} className="mt-4 text-blue-500">Close</button>
                </div>
            </div>
        );
    }
    
    // Calculate PO financials only when PO data changes
    const poSummary = useMemo(() => calculatePoSummary(po.lineItems), [po.lineItems]);

    // Calculate if the PO total exceeds the threshold using the calculated total
    const exceedsThreshold = poSummary.total > THRESHOLD_AMOUNT;

    // Validation: Button is enabled only if confirmation is checked 
    // AND a justification is provided (if threshold is exceeded).
    const isSignOffEnabled = isReviewed && (exceedsThreshold ? justificationNote.trim().length > 0 : true);

    if (!isOpen) return null;

    const handleSignOff = () => {
        if (!isSignOffEnabled) return;
        
        console.log(`PO ${po.poNumber} Approved and Signed Off!`);
        // In a real application, you would call an API here to update the status (Draft -> Issued)
        onClose();
        alert(`PO ${po.poNumber} signed off and status changed to Issued! (Data refresh required)`);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-purple-600" />
                        Digital Sign-Off Required
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Instructions */}
                    <p className="text-sm text-gray-600 mb-6">Review and approve this Purchase Order before issuance to vendor</p>

                    {/* Alert Box for Threshold Exceeded - Conditionally Rendered */}
                    {exceedsThreshold && (
                        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 text-sm rounded-lg">
                            <h4 className="flex items-center font-bold text-yellow-800 mb-1">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                Sign-Off Authority Threshold Exceeded
                            </h4>
                            <p>
                                This PO amount of <span className="font-semibold text-gray-900">{formatNaira(poSummary.total)}</span> exceeds the standard threshold of <span className="font-semibold text-gray-900">{formatNaira(THRESHOLD_AMOUNT)}</span>. 
                                A mandatory justification note is required for approval.
                            </p>
                        </div>
                    )}

                    {/* PO Summary Table (Top) */}
                    <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
                        <div className="text-gray-800 font-medium">PO Number: <span className='font-semibold text-purple-700 block'>{po.poNumber}</span></div>
                        <div className="text-gray-800 font-medium">Vendor: <span className='font-semibold text-gray-900 block'>{po.vendor}</span></div>
                        <div className="text-gray-800 font-medium">Department: <span className='font-semibold text-gray-900 block'>{po.department}</span></div>
                        <div className="text-gray-800 font-medium">Current Status: <span className='font-semibold block'><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">{po.status}</span></span></div>
                    </div>

                    {/* Line Items Review Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                        <div className="bg-white p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Line Items Review</h3>
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-2/5">Item</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tax Rate</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Line Total </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {po.lineItems.map((item, index) => {
                                        // Use the parser to get the decimal rate
                                        const taxRateDecimal = parseTaxRate(item.taxRate); 
                                        const itemSubtotal = item.quantity * item.unitPrice;
                                        // FIX: Correctly calculate line total inclusive of tax
                                        const itemTotal = itemSubtotal * (1 + taxRateDecimal);
                                        
                                        // Display the tax rate as a percentage (e.g., 7.5%)
                                        const taxRateDisplay = (taxRateDecimal * 100).toFixed(1) + '%'; 

                                        return (
                                            <tr key={index}>
                                                <td className="px-4 py-3 whitespace-normal">
                                                    <p className="font-medium text-gray-900">{item.item}</p>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{item.quantity}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-gray-700">{formatNaira(item.unitPrice)}</td>
                                                
                                                {/* FIX: Displaying the tax rate */}
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-gray-700">{taxRateDisplay}</td>
                                                
                                                {/* FIX: Displaying the Line Total (including tax) */}
                                                <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-gray-900">{formatNaira(itemTotal)}</td>
                                            </tr>
                                        )})}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary and Justification */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Justification & Confirmation */}
                        <div>
                            <label htmlFor="justification-note" className="block text-sm font-medium text-gray-700 mb-2">Sign-Off Justification Note {exceedsThreshold && <span className="text-red-500">*</span>}</label>
                            <textarea
                                id="justification-note"
                                value={justificationNote}
                                onChange={(e) => setJustificationNote(e.target.value)}
                                rows="3"
                                placeholder={exceedsThreshold ? "MANDATORY: Provide justification for exceeding the sign-off threshold..." : "Optional: Add any relevant sign-off notes..."}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                                disabled={!exceedsThreshold && isReviewed} 
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1 mb-4">This note will be recorded in the audit log as a mandatory compliance record.</p>

                            {/* Confirmation Checkbox */}
                            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                                <label className="flex items-start cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isReviewed}
                                        onChange={(e) => setIsReviewed(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-purple-900">I confirm that I have reviewed this Purchase Order in full</p>
                                        <p className="text-xs text-purple-700 mt-1">
                                            By checking this box and clicking "Approve & Sign Off", I digitally confirm that:
                                        </p>
                                        <ul className="list-disc pl-5 text-xs text-purple-700 space-y-0.5 mt-1">
                                            <li>I have reviewed all line items, quantities, and pricing</li>
                                            <li>The vendor and total amount are correct</li>
                                            <li>This expenditure is authorized and budgeted</li>
                                            <li>This action will change the PO status from Draft to Issued</li>
                                        </ul>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Financial Box and What Happens */}
                        <div>
                            {/* Financial Summary */}
                            <div className="bg-indigo-900 text-white p-4 rounded-lg mb-6">
                                <h4 className="text-lg font-bold mb-2">Total Amount</h4>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between"><span>Subtotal:</span><span>{formatNaira(poSummary.subtotal)}</span></div>
                                    <div className="flex justify-between">
                                        {/* FIX: Displays the calculated tax rate as a percentage AND the calculated Naira tax amount */}
                                        <span>Total Tax <span className='text-indigo-300'>({(poSummary.displayTaxRate * 100).toFixed(1)}%)</span>:</span>
                                        <span className='font-semibold'>{formatNaira(poSummary.totalTax)}</span> 
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-indigo-700 font-bold text-xl">
                                        <span>Total Amount:</span>
                                        <span>{formatNaira(poSummary.total)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* What Happens After Sign-Off */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 h-fit">
                                <h4 className="text-md font-semibold text-blue-800 flex items-center mb-3">
                                    <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                                    What happens after sign-off?
                                </h4>
                                <ul className="list-disc pl-5 text-sm text-blue-700 space-y-2">
                                    <li>PO status will be changed to **Issued (Sent)**</li>
                                    <li>Your digital signature (User ID and timestamp) will be recorded</li>
                                    <li>The PO can then be sent to the vendor for fulfillment</li>
                                    <li>An audit log entry will be created for compliance tracking</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSignOff}
                        disabled={!isSignOffEnabled}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition duration-150 flex items-center ${isSignOffEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        <Shield className="w-5 h-5 mr-2" />
                        Approve & Sign Off
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PoSignOffModal;