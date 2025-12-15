'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { X, FileText, CheckCircle, AlertCircle, ShoppingCart, AlertTriangle } from 'lucide-react';

// Define the fixed tax rate
const TAX_RATE = 0.075; // 7.5%

// --- Utility Functions ---
const formatNaira = (amount) => {
    return `₦${(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Calculates the line total and tax for a single item based on received quantity.
 * @param {number} receivedQuantity - The quantity received.
 * @param {number} unitPrice - The unit price.
 * @returns {{subtotal: number, tax: number, lineTotal: number, status: string, hasDiscrepancy: boolean}}
 */
const calculateLineTotal = (item) => {
    const { receivedQuantity, unitPrice, quantity: orderedQuantity } = item;
    
    // Line Total = Received Qty * Unit Price
    const subtotal = receivedQuantity * unitPrice;
    
    // Tax = 7.5% of Subtotal
    const tax = subtotal * TAX_RATE;
    
    // Line Total (including tax)
    const lineTotal = subtotal + tax;
    
    // Discrepancy check
    const hasDiscrepancy = receivedQuantity !== orderedQuantity;
    const status = receivedQuantity === orderedQuantity ? "Full" : (receivedQuantity > orderedQuantity ? "Over-received" : "Partial");

    return { subtotal, tax, lineTotal, status, hasDiscrepancy };
};

// --- Modal Component ---

const ConvertPoToBillModal = ({ isOpen, onClose, po }) => {
    // State to manage the quantities received for each line item
    const [receivedItems, setReceivedItems] = useState([]);
    const [conversionNote, setConversionNote] = useState('');

    // Initialize received items based on the PO's line items
    useEffect(() => {
        if (po && po.lineItems) {
            const initialReceived = po.lineItems.map(item => ({
                ...item,
                // Start with Ordered Quantity as the Received Quantity
                receivedQuantity: item.quantity, 
            }));
            setReceivedItems(initialReceived);
        }
    }, [po]);

    if (!isOpen || !po) return null;

    // Handler for updating a received quantity
    const handleQuantityChange = (index, value) => {
        // Ensure input is a valid non-negative integer
        const newQty = Math.max(0, parseInt(value) || 0);

        setReceivedItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index].receivedQuantity = newQty;
            return newItems;
        });
    };

    // --- New Bill Calculation (Memoized for efficiency) ---
    const newBillSummary = useMemo(() => {
        let newSubtotal = 0;
        let newTax = 0;
        let newTotal = 0;
        let anyQuantityDiscrepancy = false;

        receivedItems.forEach(item => {
            const { subtotal, tax, lineTotal, hasDiscrepancy } = calculateLineTotal(item);
            newSubtotal += subtotal;
            newTax += tax;
            newTotal += lineTotal;
            if (hasDiscrepancy) {
                anyQuantityDiscrepancy = true;
            }
        });

        const originalTotal = po.totalAmount; // Assuming po.totalAmount is the total including tax from the original PO
        const variance = newTotal - originalTotal;
        
        // Determine if the *final bill amount* has changed (i.e., a financial variance)
        const hasFinancialVariance = Math.abs(variance) > 0.01; // Using a small tolerance for floating point

        return {
            subtotal: newSubtotal,
            tax: newTax,
            total: newTotal,
            variance: variance,
            anyQuantityDiscrepancy, // Whether any item's received quantity differs from ordered
            hasFinancialVariance, // Whether the total bill amount differs from the PO amount
        };
    }, [receivedItems, po.totalAmount]);
    
    const { subtotal, tax, total, variance, anyQuantityDiscrepancy, hasFinancialVariance } = newBillSummary;


    const handleConversion = () => {
        // ... (API submission logic remains similar, passing new quantities)
        console.log("Submitting Bill Creation with new quantities:", receivedItems);
        alert(`PO ${po.poNumber} successfully converted to Vendor Bill with new total: ${formatNaira(total)}!`);
        onClose(); // Close the modal
    };
    
    // Dynamic styling based on financial variance
    const billAmountBgClass = hasFinancialVariance 
        ? "bg-yellow-100 rounded-lg border border-yellow-400" 
        : "bg-blue-50 rounded-lg border border-blue-200";
    
    // Dynamic Button Class
    const convertButtonClass = anyQuantityDiscrepancy
        ? "px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition duration-150 flex items-center"
        : "px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150 flex items-center";

    // Dynamic Button Text/Icon
    const convertButtonText = anyQuantityDiscrepancy
        ? "Convert with Discrepancies"
        : "Convert to Bill";
    
    const convertButtonIcon = anyQuantityDiscrepancy
        ? AlertTriangle
        : CheckCircle;
        
    const ButtonIcon = convertButtonIcon;


    // --- JSX Render ---
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-purple-600" />
                        Convert PO to Vendor Bill
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Sub-Header / PO Info */}
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">Confirm received quantities and create a vendor bill with automatic discrepancy detection</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                        <div className="text-gray-800 flex flex-col items-start gap-0.5">PO Number: <span className='font-semibold text-blue-800'>{po.poNumber}</span></div>
                        <div className="text-gray-800 flex flex-col items-start">Vendor: <span className='font-semibold text-gray-900'>{po.vendor}</span></div>
                        <div className="text-gray-800 flex flex-col items-start ">E-Wallet: <span className="text-purple-600 break-all">{po.vendorInfo.ewalletAddress}</span></div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Quantity Verification Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            Verify Received Quantities
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">Update the received quantities to match what was actually delivered by the vendor.</p>

                        {/* Line Items Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-2/5">Item</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ordered Qty</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-1/12">Received Qty</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tax (7.5%)</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Line Total</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {receivedItems.map((item, index) => {
                                        const { subtotal: lineSubtotal, tax: lineTax, lineTotal, status, hasDiscrepancy } = calculateLineTotal(item);
                                        return (
                                            <tr key={index}>
                                                <td className="px-4 py-3 whitespace-normal">
                                                    <p className="text-sm font-medium text-gray-900">{item.item}</p>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-medium text-gray-700">
                                                    {po.lineItems[index].quantity}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                                    <div className='flex items-center justify-center'>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={item.receivedQuantity}
                                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                            className="w-16 p-1 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        />
                                                        {/* Discrepancy Alert Icon - uses AlertTriangle as requested */}
                                                        {hasDiscrepancy && (
                                                            <AlertTriangle className="w-4 h-4 text-orange-500 inline-block ml-2 align-text-bottom" title={`Difference: ${po.lineItems[index].quantity - item.receivedQuantity}`} />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                    {formatNaira(item.unitPrice)}
                                                </td>
                                                {/* New Column: Tax */}
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">
                                                    {formatNaira(lineTax)}
                                                </td>
                                                {/* New Column: Line Total */}
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                                                    {formatNaira(lineTotal)}
                                                </td>
                                                {/* New Column: Status */}
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-center">
                                                     <span className={`px-2 py-0.5 rounded-full font-semibold ${hasDiscrepancy ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                                        {status}
                                                     </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        
                        {anyQuantityDiscrepancy && (
                            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                                <AlertCircle className="w-4 h-4 inline mr-2" />
                                **Quantity Discrepancy Detected:** The received quantity differs from the ordered quantity for one or more items. The final bill amount has been adjusted based on the received quantities.
                            </div>
                        )}
                    </div>
                    
                    {/* Financial Summary and Conversion Note */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        {/* 1. Amounts Section */}
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <h4 className="text-md font-semibold text-gray-800 mb-2">Original PO Amount</h4>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>{formatNaira(po.details.subtotal)}</span></div>
                                    <div className="flex justify-between text-gray-600"><span>Tax:</span><span>{formatNaira(po.details.totalTax)}</span></div>
                                    <div className="flex justify-between pt-2 border-t border-gray-300 font-bold text-lg text-gray-900">
                                        <span>Total:</span>
                                        <span>{formatNaira(po.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* New Bill Amount Section - Dynamic BG */}
                            <div className={`p-4 ${billAmountBgClass}`}>
                                <h4 className="text-md font-semibold text-gray-800 mb-2">New Bill Amount</h4>
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between text-gray-700"><span>Subtotal:</span><span>{formatNaira(subtotal)}</span></div>
                                    <div className="flex justify-between text-gray-700"><span>Tax:</span><span>{formatNaira(tax)}</span></div>
                                    <div className="flex justify-between pt-2 border-t border-gray-300 font-bold text-xl text-gray-900">
                                        <span>Total:</span>
                                        <span>{formatNaira(total)}</span>
                                    </div>
                                    
                                    {/* Variance Display */}
                                    {hasFinancialVariance && (
                                        <div className="flex justify-between text-sm pt-2 text-yellow-800 font-semibold border-t border-dashed border-yellow-300 mt-2">
                                            <span>Variance:</span>
                                            <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>{formatNaira(variance)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <label className="block text-sm font-medium text-gray-700">Conversion Note (Optional)</label>
                            <textarea
                                value={conversionNote}
                                onChange={(e) => setConversionNote(e.target.value)}
                                rows="3"
                                placeholder="Optional: Add any notes about this conversion..."
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                            ></textarea>
                        </div>
                        
                        {/* 2. What Happens After Conversion */}
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 h-fit">
                            <h4 className="text-md font-semibold text-purple-800 flex items-center mb-3">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                What happens after conversion?
                            </h4>
                            <ul className="list-disc pl-5 text-sm text-purple-700 space-y-2">
                                <li>A new vendor bill will be created in M7 with the received quantities.</li>
                                <li>The PO status will be changed to **Received (Closed)**.</li>
                                <li>Payment must be made via the dedicated E-Wallet system.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions - Dynamic Button */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConversion}
                        className={convertButtonClass}
                    >
                        <ButtonIcon className="w-5 h-5 mr-2" />
                        {convertButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConvertPoToBillModal;