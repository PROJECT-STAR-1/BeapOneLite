import React, { useState } from 'react';
import { X, FileText, Package, Clock, DollarSign, AlertTriangle, CircleCheckBig } from 'lucide-react';

// --- Utility Functions ---

const formatNaira = (amount) => {
    // Ensuring the amount is treated as a number before formatting
    return `₦${(amount || 0).toLocaleString('en-NG')}`;
};

const TAB_MAP = {
    'Details': 'Details',
    'Vendor Info': 'Vendor Info',
    'Line Items': 'Line Items',
    'Audit Log': 'Audit Log',
};

// Component for a status badge
const StatusBadge = ({ status }) => {
    let color = '';
    switch (status) {
        case 'Issued':
            color = 'bg-blue-100 text-blue-800';
            break;
        case 'Approved':
            color = 'bg-green-100 text-green-800';
            break;
        case 'Draft':
            color = 'bg-gray-100 text-gray-800';
            break;
        case 'Received':
            color = 'bg-purple-100 text-purple-800';
            break;
        case 'Cancelled':
            color = 'bg-red-100 text-red-800';
            break;
        case 'SignedOff':
            color = 'bg-green-100 text-green-800';
            break;
        case 'Created':
            color = 'bg-blue-100 text-blue-800';
            break;
        default:
            color = 'bg-gray-200 text-gray-700';
    }
    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${color}`}>{status}</span>;
};


// --- Tab Content Components ---

const DetailsTab = ({ po }) => (
    <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Purchase Order Information</h3>
        
        <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-sm">
            {/* Row 1 */}
            <div className="text-gray-500">Branch ID</div>
            <div className="text-gray-500">Department</div>
            <div className="text-gray-500">Sales Staff</div>
            <div className="font-medium text-gray-800">{po.details.branchId || 'N/A'}</div>
            <div className="font-medium text-gray-800">{po.department || 'N/A'}</div>
            <div className="font-medium text-gray-800">{po.details.salesStaff || 'N/A'}</div>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm border-t pt-4">
            {/* Row 2 */}
            <div className="text-gray-500">Created By</div>
            <div className="text-gray-500">Updated At</div>
            <div className="font-medium text-gray-800">{po.details.createdBy || 'N/A'}</div>
            <div className="font-medium text-gray-800">{po.details.updatedAt || 'N/A'}</div>
        </div>
        
        <h4 className="text-md font-semibold text-green-600 flex items-center pt-4 border-t">
            <span className="mr-2"><CircleCheckBig size={24}/></span> Digital Sign-Off Information
        </h4>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div className="text-gray-500">Signed By</div>
            <div className="text-gray-500">Signed At</div>
            <div className="font-medium text-gray-800">{po.details.signedBy || 'N/A'}</div>
            <div className="font-medium text-gray-800">{po.details.signedAt || 'N/A'}</div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 border-t pt-4 mt-6">Financial Summary</h3>
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-medium text-gray-800">{formatNaira(po.details.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Tax:</span>
                <span className="font-medium text-gray-800">{formatNaira(po.details.totalTax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total Amount:</span>
                <span className="text-black">{formatNaira(po.details.totalAmount)}</span>
            </div>
        </div>
    </div>
);

const VendorInfoTab = ({ po }) => (
    <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendor Information</h3>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div className="text-gray-500">Vendor Name</div>
            <div className="text-gray-500">Vendor ID</div>
            <div className="font-medium text-gray-800">{po.vendor || 'N/A'}</div>
            <div className="font-medium text-gray-800">{po.vendorInfo.vendorId || 'N/A'}</div>

            <div className="col-span-2 text-gray-500 pt-2">E-Wallet Address</div>
            <div className="col-span-2 font-medium text-gray-800 py-2 px-3 bg-gray-50 rounded-lg">{po.vendorInfo.ewalletAddress || 'N/A'}</div>

            <div className="text-gray-500">Tax ID</div>
            <div className="text-gray-500">Business Registration Number</div>
            <div className="font-medium text-gray-800">{po.vendorInfo.taxId || 'N/A'}</div>
            <div className="font-medium text-gray-800">{po.vendorInfo.businessRegNumber || 'N/A'}</div>

            <div className="col-span-2 text-gray-500 pt-2">Address</div>
            <div className="col-span-2 font-medium text-gray-800">{po.vendorInfo.address || 'N/A'}</div>

            <div className="text-gray-500 pt-2">Phone Numbers</div>
            <div className="text-gray-500 pt-2">Email Addresses</div>
            <div className="font-medium text-gray-800 space-y-1">
                {(po.vendorInfo.phoneNumbers || ['N/A']).map((phone, i) => <div key={i}>{phone}</div>)}
            </div>
            <div className="font-medium text-gray-800 space-y-1">
                {(po.vendorInfo.emailAddresses || ['N/A']).map((email, i) => <div key={i}>{email}</div>)}
            </div>
        </div>
    </div>
);

const LineItemsTab = ({ po }) => (
    <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Line Items ({po.lineItems?.length || 0})</h3>
        
        {po.lineItems && po.lineItems.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Rate</th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Line Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {po.lineItems.map((item, index) => (
                            <tr key={index}>
                                <td className="px-3 py-4 whitespace-nowrap">
                                    <p className="text-sm font-medium text-gray-900">{item.item}</p>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{item.quantity}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{formatNaira(item.unitPrice)}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{item.taxRate}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">{formatNaira(item.lineTotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center py-4 text-gray-500">No line items recorded for this PO.</div>
        )}

        <div className="flex justify-end pt-4 mt-4 border-t">
            <div className="text-lg font-bold">Total: {formatNaira(po.details?.totalAmount || 0)}</div>
        </div>
    </div>
);

const AuditLogTab = ({ po }) => (
    <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
            <Clock className="w-5 h-5 mr-2" />
            Audit Trail ({po.auditLog?.length || 0} entries)
        </h3>
        <div className="space-y-6 border-l-2 border-gray-200 pl-4">
            {po.auditLog && po.auditLog.length > 0 ? (
                po.auditLog.map((log, index) => (
                    <div key={index} className="relative">
                        <div className="absolute w-3 h-3 bg-gray-400 rounded-full mt-1 -left-5 border-2 border-white"></div>
                        <div className="flex justify-between items-start">
                            <h4 className={`font-semibold text-md ${log.event.includes('Created') ? 'text-blue-600' : 'text-green-600'}`}>{log.event}</h4>
                            <span className="text-xs text-gray-500">{log.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">👤 {log.user}</p>
                        
                        {log.note && (
                            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                                Note: {log.note}
                            </div>
                        )}

                        {log.oldStatus && log.oldStatus !== log.newStatus && (
                            <p className="text-xs text-gray-500 mt-1">
                                Old: {`{poStatus: "${log.oldStatus}"}`} New: {`{poStatus: "${log.newStatus}"}`}
                            </p>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-4 text-gray-500">No audit log entries found.</div>
            )}
        </div>
    </div>
);


// --- Main Modal Component ---

const PurchaseOrderDetailsModal = ({ isOpen, onClose, po }) => {
    const [activeTab, setActiveTab] = useState(TAB_MAP.Details);

    if (!isOpen || !po) return null;

    const renderContent = () => {
        // FIX: Use bracket notation for object keys that contain spaces.
        switch (activeTab) {
            case TAB_MAP.Details:
                return <DetailsTab po={po} />;
            case TAB_MAP['Vendor Info']: // Corrected from TAB_MAP.Vendor
                return <VendorInfoTab po={po} />;
            case TAB_MAP['Line Items']: // Corrected
                return <LineItemsTab po={po} />;
            case TAB_MAP['Audit Log']: // Corrected
                return <AuditLogTab po={po} />;
            default:
                return <DetailsTab po={po} />;
        }
    };

    return (
        // Modal Container (fixed position, full screen)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            {/* Modal Content (max width, max height, overflow handling) */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col max-h-[90vh]">
                
                {/* Modal Header (fixed) */}
                <div className="p-6 flex-shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <FileText className="w-6 h-6 mr-3" />
                            Purchase Order Details
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-gray-600 text-sm">Complete information, line items, and audit history for **{po.poNumber}**</p>
                </div>

                {/* PO Summary Card (fixed) */}
                <div className="px-6 pb-4 flex-shrink-0">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500">PO Number</p>
                            <p className="text-lg font-bold text-gray-800">{po.poNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500">Status</p>
                            <StatusBadge status={po.status} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-lg font-bold text-gray-800">{formatNaira(po.totalAmount)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500">Created Date</p>
                            <p className="text-sm font-medium text-gray-800">{po.createdDate}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation (fixed) */}
                <div className="px-6 border-b border-gray-200 flex space-x-4 flex-shrink-0">
                    {Object.values(TAB_MAP).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 text-sm font-medium transition duration-150 ${
                                activeTab === tab
                                    ? 'text-black border-b-2 border-black'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tabs Content (scrollable) */}
                <div className="overflow-y-auto flex-1">
                    {renderContent()}
                </div>

                {/* Modal Footer (fixed) */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-150"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderDetailsModal;