'use client';
import { useState, useMemo, useCallback } from 'react';
import {
    X,
    Save,
    Send,
    ChevronDown,
    ChevronUp,
    FileText,
    Calendar,
    Plus,
    Trash2,
    Upload,
    Paperclip,
    DollarSign,
    Percent,
    Calculator,
    CreditCard,
    Zap
} from 'lucide-react';

// --- Static Data ---
const CLIENT_SUGGESTIONS = [
    "Dangote Industries Ltd",
    "MTN Nigeria Communications",
    "Guaranty Trust Bank",
    "Access Bank Plc"
];
const CURRENCIES = {
    NGN: 'NGN - Nigerian Naira',
    USD: 'USD - US Dollar',
    EUR: 'EUR - Euro',
    GBP: 'GBP - British Pound'
};
const PAYMENT_TERMS = [
    'Net 30',
    'Net 15',
    'Net 7',
    'Due on Receipt',
    'Cash on Delivery'
];
const TAX_CALCULATION_METHODS = [
    { value: 'exclusive', label: 'Tax Exclusive (Add tax on top)', note: 'Tax will be added to line totals' },
    { value: 'inclusive', label: 'Tax Inclusive (Tax included in price)', note: 'Tax is already included in prices' }
];
const ID_TYPES = [
    'National ID',
    'Passport',
    'TIN',
    'Other'
];

// --- Line Item Component ---
const LineItem = ({ item, index, updateLineItem, removeLineItem, taxMethod }) => {
    // Ensure inputs are numeric strings, replace commas
    const qty = Number(String(item.qty).replace(/,/g, ''));
    const unitPrice = Number(String(item.unitPrice).replace(/,/g, ''));
    const taxRate = Number(String(item.taxRate).replace(/,/g, ''));
    const discountRate = Number(String(item.discountRate).replace(/,/g, ''));

    // Calculate Line Total based on Tax Method
    const subtotal = qty * unitPrice;
    const discountAmount = subtotal * (discountRate / 100);
    const taxedBase = subtotal - discountAmount;
    
    let lineTotal = 0;

    if (taxMethod === 'exclusive') {
        const taxAmount = taxedBase * (taxRate / 100);
        lineTotal = taxedBase + taxAmount;
    } else { // inclusive
        // If tax is included, the price *already* includes the tax
        // If we want to show the 'Line Total' as the final price, it's just the taxed base
        lineTotal = taxedBase;
    }

    const formatAmount = (num) => isNaN(num) ? '0.00' : num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formatInput = (num) => isNaN(num) ? '' : num; // Keep raw number for input field

    return (
        <div className="p-4 bg-gray-50 border rounded-lg mb-3">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Item {index + 1}</h4>
                {index > 0 && (
                    <button 
                        onClick={() => removeLineItem(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition"
                        title="Remove Item"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>
            
            <input 
                type="text" 
                placeholder="Description (e.g., Consulting Services)" 
                value={item.description}
                onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                className="w-full p-2 border rounded-lg mb-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            <div className="grid grid-cols-4 gap-3">
                <InputGroup label="Qty" value={formatInput(qty)} onChange={(v) => updateLineItem(index, 'qty', v)} type="number" min="1" />
                <InputGroup label="Unit Price" value={formatInput(unitPrice)} onChange={(v) => updateLineItem(index, 'unitPrice', v)} type="number" min="0" prefix="₦" />
                <InputGroup label="Tax %" value={formatInput(taxRate)} onChange={(v) => updateLineItem(index, 'taxRate', v)} type="number" min="0" max="100" />
                <InputGroup label="Disc. %" value={formatInput(discountRate)} onChange={(v) => updateLineItem(index, 'discountRate', v)} type="number" min="0" max="100" />
            </div>

            <div className="mt-3 flex justify-end items-center text-sm font-semibold text-gray-800">
                Line Total: <span className="ml-2 text-base">₦{formatAmount(lineTotal)}</span>
            </div>
        </div>
    );
};

// --- Custom Input Group Helper ---
const InputGroup = ({ label, value, onChange, type = 'text', prefix = '', ...props }) => (
    <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">{label}</label>
        <div className="relative">
            {prefix && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${prefix ? 'pl-8' : 'pl-3'}`}
                {...props}
            />
        </div>
    </div>
);


// --- Main Modal Component ---
const CreateInvoiceQuoteModal = ({ onClose }) => {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('Invoice');
    const [clientName, setClientName] = useState('');
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        businessRegNo: '', taxId: '', fullAddress: '', email1: '', email2: '',
        phone1: '', phone2: '', whatsapp1: '', whatsapp2: '', idType: '', idNumber: ''
    });
    const [invoiceDetails, setInvoiceDetails] = useState({
        currency: 'NGN', 
        paymentTerm: 'Net 30',
        dueDate: '',
        taxMethod: 'exclusive' // 'exclusive' or 'inclusive'
    });
    const [lineItems, setLineItems] = useState([{ 
        description: '', qty: 1, unitPrice: 0, taxRate: 7.5, discountRate: 0 
    }]);
    const [whtEnabled, setWhtEnabled] = useState(false);
    const [whtRate, setWhtRate] = useState(5);
    const [showDeliveryNote, setShowDeliveryNote] = useState(false);
    const [deliveryNote, setDeliveryNote] = useState({ dnNumber: 'DN-2025-001', dnDate: '', notes: '' });

    // --- Line Item Handlers ---
    const addLineItem = () => {
        setLineItems(prev => [...prev, { 
            description: '', qty: 1, unitPrice: 0, taxRate: 7.5, discountRate: 0 
        }]);
    };

    const updateLineItem = useCallback((index, field, value) => {
        setLineItems(prev => prev.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        ));
    }, []);

    const removeLineItem = (index) => {
        setLineItems(prev => prev.filter((_, i) => i !== index));
    };

    // --- Calculation Logic (Memoized) ---
    const { subtotal, totalTax, grandTotal } = useMemo(() => {
        let currentSubtotal = 0;
        let currentTotalTax = 0;

        lineItems.forEach(item => {
            const qty = Number(String(item.qty).replace(/[^\d.]/g, '')) || 0;
            const unitPrice = Number(String(item.unitPrice).replace(/[^\d.]/g, '')) || 0;
            const taxRate = Number(String(item.taxRate).replace(/[^\d.]/g, '')) || 0;
            const discountRate = Number(String(item.discountRate).replace(/[^\d.]/g, '')) || 0;

            const grossPrice = qty * unitPrice;
            const discountAmount = grossPrice * (discountRate / 100);
            const netAmount = grossPrice - discountAmount;

            if (invoiceDetails.taxMethod === 'exclusive') {
                const taxAmount = netAmount * (taxRate / 100);
                currentSubtotal += netAmount;
                currentTotalTax += taxAmount;
            } else { // inclusive
                // Formula to reverse-calculate tax: Net = Gross / (1 + TaxRate)
                const taxFactor = 1 + (taxRate / 100);
                const netAmountExclusive = netAmount / taxFactor;
                const taxAmount = netAmount - netAmountExclusive;
                
                currentSubtotal += netAmountExclusive; // Subtotal is net of tax
                currentTotalTax += taxAmount;
            }
        });

        const currentGrandTotal = currentSubtotal + currentTotalTax;
        
        return {
            subtotal: currentSubtotal,
            totalTax: currentTotalTax,
            grandTotal: currentGrandTotal,
        };
    }, [lineItems, invoiceDetails.taxMethod]);

    const formatAmount = (num) => isNaN(num) ? '0.00' : num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    // WHT Calculation
    const whtAmount = whtEnabled ? grandTotal * (whtRate / 100) : 0;
    const finalBalanceDue = grandTotal - whtAmount;


    // --- Rendering Functions ---

    const renderClientInformation = () => (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 mt-4 flex items-center gap-2"><CreditCard size={18} /> Client Information</h3>
            <div className="relative">
                <label htmlFor="clientName" className="text-sm font-medium text-gray-700">Client Name *</label>
                <input
                    id="clientName"
                    type="text"
                    placeholder="Enter client name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mt-1"
                />
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
                {CLIENT_SUGGESTIONS.map(name => (
                    <button 
                        key={name} 
                        onClick={() => setClientName(name)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Additional Customer Details Toggle */}
            <button 
                onClick={() => setShowCustomerDetails(!showCustomerDetails)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
            >
                {showCustomerDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showCustomerDetails ? 'Hide' : 'Show'} Additional Customer Details (Optional)
            </button>

            {/* Additional Customer Details Content */}
            {showCustomerDetails && (
                <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50">
                    <InputGroup label="Business Reg. No." value={customerDetails.businessRegNo} onChange={(v) => setCustomerDetails({...customerDetails, businessRegNo: v})} />
                    <InputGroup label="Tax ID (TIN)" value={customerDetails.taxId} onChange={(v) => setCustomerDetails({...customerDetails, taxId: v})} />
                    <div className="col-span-2">
                        <InputGroup label="Full Address" value={customerDetails.fullAddress} onChange={(v) => setCustomerDetails({...customerDetails, fullAddress: v})} placeholder="Enter complete business address" />
                    </div>
                    <InputGroup label="Email 1" value={customerDetails.email1} onChange={(v) => setCustomerDetails({...customerDetails, email1: v})} placeholder="primary@company.com" />
                    <InputGroup label="Email 2" value={customerDetails.email2} onChange={(v) => setCustomerDetails({...customerDetails, email2: v})} placeholder="secondary@company.com" />
                    <InputGroup label="Phone 1" value={customerDetails.phone1} onChange={(v) => setCustomerDetails({...customerDetails, phone1: v})} placeholder="+234 XXX XXX XXXX" />
                    <InputGroup label="Phone 2" value={customerDetails.phone2} onChange={(v) => setCustomerDetails({...customerDetails, phone2: v})} placeholder="+234 XXX XXX XXXX" />
                    <InputGroup label="WhatsApp 1" value={customerDetails.whatsapp1} onChange={(v) => setCustomerDetails({...customerDetails, whatsapp1: v})} placeholder="+234 XXX XXX XXXX" />
                    <InputGroup label="WhatsApp 2" value={customerDetails.whatsapp2} onChange={(v) => setCustomerDetails({...customerDetails, whatsapp2: v})} placeholder="+234 XXX XXX XXXX" />
                    
                    <div>
                        <label className="text-xs text-gray-500 mb-1">ID Type</label>
                        <select 
                            value={customerDetails.idType} 
                            onChange={(e) => setCustomerDetails({...customerDetails, idType: e.target.value})}
                            className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mt-1"
                        >
                            <option value="">Select ID type</option>
                            {ID_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <InputGroup label="ID Number" value={customerDetails.idNumber} onChange={(v) => setCustomerDetails({...customerDetails, idNumber: v})} placeholder="Enter ID number" />

                </div>
            )}
        </div>
    );

    const renderInvoiceDetails = () => (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 mt-6 flex items-center gap-2">
                <Calendar size={18} /> {activeTab} Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Currency */}
                <div>
                    <label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency *</label>
                    <select
                        id="currency"
                        value={invoiceDetails.currency}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, currency: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mt-1"
                    >
                        {Object.entries(CURRENCIES).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                </div>
                
                {/* Payment Terms */}
                <div>
                    <label htmlFor="paymentTerm" className="text-sm font-medium text-gray-700">Payment Terms</label>
                    <select
                        id="paymentTerm"
                        value={invoiceDetails.paymentTerm}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, paymentTerm: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mt-1"
                    >
                        {PAYMENT_TERMS.map(term => <option key={term} value={term}>{term}</option>)}
                    </select>
                </div>
                
                {/* Due Date */}
                <div>
                    <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">Due Date *</label>
                    <div className="relative mt-1">
                        <input
                            id="dueDate"
                            type="date"
                            value={invoiceDetails.dueDate}
                            onChange={(e) => setInvoiceDetails({...invoiceDetails, dueDate: e.target.value})}
                            className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        />
                        <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Tax Calculation Method */}
                <div>
                    <label htmlFor="taxMethod" className="text-sm font-medium text-gray-700">Tax Calculation Method *</label>
                    <select
                        id="taxMethod"
                        value={invoiceDetails.taxMethod}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, taxMethod: e.target.value})}
                        className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mt-1"
                    >
                        {TAX_CALCULATION_METHODS.map(method => (
                            <option key={method.value} value={method.value}>{method.label}</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2 text-sm text-gray-500">
                    <Zap size={14} className="inline mr-1 text-yellow-600" />
                    {TAX_CALCULATION_METHODS.find(m => m.value === invoiceDetails.taxMethod)?.note}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700">Location</h4>
                <div className="p-3 bg-gray-100 rounded-lg text-gray-800 mt-1">Lagos Main Branch (LG-MAIN)</div>
            </div>
            
        </div>
    );

    const renderLineItems = () => (
        <div className="space-y-4 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Calculator size={18} /> Line Items * ({lineItems.length})</h3>
                <button 
                    onClick={addLineItem}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition"
                >
                    <Plus size={18} /> Add Item
                </button>
            </div>

            <div>
                {lineItems.map((item, index) => (
                    <LineItem 
                        key={index} 
                        item={item} 
                        index={index} 
                        updateLineItem={updateLineItem} 
                        removeLineItem={removeLineItem}
                        taxMethod={invoiceDetails.taxMethod}
                    />
                ))}
            </div>
        </div>
    );

    const renderSummary = () => (
        <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2 text-right text-sm">
                    <div className="flex justify-between font-medium">
                        <span className="text-gray-700">Subtotal</span>
                        <span>₦{formatAmount(subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                        <span className="text-gray-700">Total Tax ({invoiceDetails.taxMethod === 'exclusive' ? 'Exclusive' : 'Inclusive'})</span>
                        <span>₦{formatAmount(totalTax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Grand Total</span>
                        <span>₦{formatAmount(grandTotal)}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderWHTSection = () => (
        <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setWhtEnabled(!whtEnabled)}>
                <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <Percent size={18} /> Withholding Tax (WHT)
                </label>
                <input 
                    type="checkbox" 
                    checked={whtEnabled} 
                    onChange={(e) => setWhtEnabled(e.target.checked)} 
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                />
            </div>

            {whtEnabled && (
                <div className="mt-4 p-4 border rounded-lg bg-orange-50/50 space-y-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-orange-700">WHT Rate (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={whtRate}
                            onChange={(e) => setWhtRate(Number(e.target.value))}
                            className="w-1/2 p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 mt-1"
                        />
                    </div>
                    <div className="text-right text-sm">
                        <div className="flex justify-between font-medium text-orange-700">
                            <span>WHT Amount ({whtRate}%)</span>
                            <span>₦{formatAmount(whtAmount)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                            <span className="text-gray-900">Final Balance Due</span>
                            <span className="text-gray-900">₦{formatAmount(finalBalanceDue)}</span>
                        </div>
                    </div>
                    <p className="text-xs text-orange-700 flex items-center gap-1">
                        <Zap size={14} /> WHT will be deducted from the total payment received
                    </p>
                </div>
            )}
        </div>
    );

    const renderSourceDocuments = () => (
        <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Paperclip size={18} /> Source Documents (Optional)
            </h3>
            <p className="text-xs text-gray-500 mt-1">Max 5 files, 5MB each</p>

            <div 
                className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-indigo-500 transition"
                // Implement drag & drop and click to upload functionality here
            >
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, Images (PNG, JPG)</p>
            </div>
        </div>
    );

    const renderDeliveryNote = () => (
        <div className="border-t border-gray-200 pt-6 mt-6">
            {/* Delivery Note Toggle */}
            <button 
                onClick={() => setShowDeliveryNote(!showDeliveryNote)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
            >
                {showDeliveryNote ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showDeliveryNote ? 'Hide' : 'Show'} Delivery Note Details (Optional)
            </button>

            {showDeliveryNote && (
                <div className="mt-4 grid grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50">
                    <InputGroup label="DN Number" value={deliveryNote.dnNumber} onChange={(v) => setDeliveryNote({...deliveryNote, dnNumber: v})} placeholder="DN-2025-001" />
                    
                    {/* DN Date */}
                    <div>
                        <label htmlFor="dnDate" className="text-xs text-gray-500 mb-1">DN Date</label>
                        <div className="relative mt-1">
                            <input
                                id="dnDate"
                                type="date"
                                value={deliveryNote.dnDate}
                                onChange={(e) => setDeliveryNote({...deliveryNote, dnDate: e.target.value})}
                                className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                            />
                            <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <InputGroup label="Notes & Terms (Optional)" value={deliveryNote.notes} onChange={(v) => setDeliveryNote({...deliveryNote, notes: v})} placeholder="Add payment terms, thank you message, or other notes..." />
                    </div>
                </div>
            )}
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold">Create New {activeTab}</h2>
                            <p className="text-sm text-gray-500">Fill in the details to create a new {activeTab.toLowerCase()}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
                            <X size={24} />
                        </button>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex border-b mt-4">
                        <button
                            onClick={() => setActiveTab('Invoice')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'Invoice' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileText size={18} className="inline mr-1" /> Invoice
                        </button>
                        <button
                            onClick={() => setActiveTab('Quote')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'Quote' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <DollarSign size={18} className="inline mr-1" /> Quote
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* 1. Client Information */}
                    {renderClientInformation()}

                    {/* 2. Invoice/Quote Details */}
                    {renderInvoiceDetails()}

                    {/* 3. Line Items */}
                    {renderLineItems()}

                    {/* 4. Financial Summary */}
                    {renderSummary()}

                    {/* 5. Withholding Tax */}
                    {renderWHTSection()}

                    {/* 6. Source Documents */}
                    {renderSourceDocuments()}

                    {/* 7. Delivery Note */}
                    {renderDeliveryNote()}

                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                        <X size={18} /> Cancel
                    </button>
                    <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                        <Save size={18} /> Save as Draft
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-indigo-950 text-white font-medium hover:bg-indigo-800 flex items-center gap-1">
                        <Send size={18} /> Create & Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoiceQuoteModal;

// --- How to use this component (Example in a parent file) ---
/*
import CreateInvoiceQuoteModal from './CreateInvoiceQuoteModal';

const ParentComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
            {isModalOpen && (
                <CreateInvoiceQuoteModal 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </>
    );
};
*/