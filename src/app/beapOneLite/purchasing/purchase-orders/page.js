'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Eye, FileText, CheckCircle, AlertTriangle, Plus, DollarSign, Users, CheckSquare, Clock, X, BarChart2 } from 'lucide-react';
import PurchaseOrderDetailsModal from '@/component/BeapOneLite/purchasing/purchaseorder/PurchaseOrderDetailsModal';
import ConvertPoToBillModal from '@/component/BeapOneLite/purchasing/purchaseorder/ConvertPoToBillModal';
import Layout from '@/component/BeapOneLite/Layout'
import NewPurchaseOrderModal from '@/component/BeapOneLite/purchasing/purchaseorder/NewPurchaseOrderModal'; 
import PoSignOffModal from '@/component/BeapOneLite/purchasing/purchaseorder/PoSignOffModal'; 

// --- Utility Functions (omitted for brevity, assume they are correct) ---
const formatNaira = (amount) => {
    return `₦${(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const formatTimeHours = (hours) => {
    if (hours === null || isNaN(hours)) return 'N/A';
    return `${hours.toFixed(1)}h`;
};

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
        case 'Reviewed':
            color = 'bg-yellow-100 text-yellow-800';
            break;
        default:
            color = 'bg-gray-200 text-gray-700';
    }
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${color}`}>{status}</span>;
};

// --- Main Component ---

const PurchaseOrderRegister = () => {
    const API_URL = '/api/beapOnelite/purchaseorders'; 
    
    const [allPOs, setAllPOs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    
    // State for Modals
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
    
    // *** NEW STATE FOR NEW PO MODAL ***
    const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
    
    const [selectedPO, setSelectedPO] = useState(null);

    const allStatuses = ['All Statuses', 'Draft', 'Issued', 'Reviewed', 'Approved', 'Received', 'Cancelled'];
    const allDepartments = ['All Departments', 'IT', 'Admin', 'Operations', 'Procurement'];

    // --- Dynamic Metrics Calculation (omitted for brevity) ---
    const summaryMetrics = useMemo(() => {
        // ... (Metrics calculation logic remains the same)
        const purchaseOrders = allPOs || []; 

        const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

        const statusCounts = purchaseOrders.reduce((acc, po) => {
            acc[po.status] = (acc[po.status] || 0) + 1;
            return acc;
        }, { Draft: 0, Issued: 0, Reviewed: 0, Approved: 0, Received: 0, Cancelled: 0 });
        
        const countablePOs = purchaseOrders.filter(po => ['Issued', 'Approved', 'Received'].includes(po.status));
        const signedPOs = countablePOs.filter(po => po.isSigned);
        const complianceRate = countablePOs.length > 0 ? (signedPOs.length / countablePOs.length) * 100 : 0;
        const complianceTarget = 100;

        const approvedPOs = purchaseOrders.filter(po => po.timeToIssueHours !== null && po.timeToIssueHours > 0);
        const totalApprovalTime = approvedPOs.reduce((sum, po) => sum + po.timeToIssueHours, 0);
        const avgApprovalHours = approvedPOs.length > 0 ? totalApprovalTime / approvedPOs.length : null;
        const approvalTarget = 4;

        const poToBillMatchRate = 0.0; 

        return {
            totalPOs: purchaseOrders.length,
            totalValue: totalValue,
            signOffCompliance: {
                rate: parseFloat(complianceRate.toFixed(1)),
                issuedCount: countablePOs.length,
                compliant: complianceRate >= complianceTarget,
                target: complianceTarget
            },
            poToBillMatchRate: poToBillMatchRate,
            avgApprovalTime: {
                hours: avgApprovalHours,
                formatted: formatTimeHours(avgApprovalHours),
                target: approvalTarget
            },
            statusCounts: statusCounts
        };
    }, [allPOs]); 


    // --- Data Fetching from API Endpoint (omitted for brevity) ---
    const fetchPOs = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (Array.isArray(data.purchaseOrders)) {
                const enrichedPOs = data.purchaseOrders.map(po => {
                    if (po.status === 'Draft' && !po.lineItems) {
                        // Mock data to ensure Sign-Off modal works with 'Draft' POs
                        // You should replace this with actual data loading logic
                        return { 
                            ...po, 
                            lineItems: [
                                { item: "Mock Item A", description: "From JSON data mock", quantity: 1, unitPrice: po.totalAmount / 1.075, taxRate: 0.075 },
                            ]
                        };
                    }
                    return po;
                });

                setAllPOs(enrichedPOs); 
            } else {
                throw new Error("API response is invalid (purchaseOrders is not an array).");
            }
            
        } catch (e) {
            console.error("API fetch failed:", e);
            setError(`Failed to load purchase orders. Error: ${e.message}.`);
            setAllPOs([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPOs();
    }, [API_URL]);


    // --- Filtering and Searching Logic (omitted for brevity) ---
    const filteredPOs = useMemo(() => {
        // ... (Filtering logic remains the same)
        const currentPOs = allPOs || []; 
        let filtered = currentPOs;
        // 1. Status Filter
        if (statusFilter !== 'All Statuses') {
            filtered = filtered.filter(po => po.status === statusFilter);
        }
        // 2. Department Filter
        if (departmentFilter !== 'All Departments') {
            filtered = filtered.filter(po => po.department === departmentFilter);
        }
        // 3. Search Term 
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(po => 
                po.poNumber.toLowerCase().includes(lowerCaseSearch) ||
                po.vendor.toLowerCase().includes(lowerCaseSearch) ||
                po.department.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return filtered;
    }, [allPOs, statusFilter, departmentFilter, searchTerm]);

    const filteredTotalValue = filteredPOs.reduce((sum, po) => sum + po.totalAmount, 0);


    // --- Modal Handlers ---
    const openDetailsModal = (po) => {
        setSelectedPO(po);
        setIsDetailsModalOpen(true); 
    };

    const closeDetailsModal = () => {
        setSelectedPO(null);
        setIsDetailsModalOpen(false); 
    };

    const openConvertModal = (po) => {
        setSelectedPO(po);
        setIsConvertModalOpen(true); 
    };

    const closeConvertModal = () => {
        setSelectedPO(null);
        setIsConvertModalOpen(false);
        fetchPOs(); 
    };

    const openSignOffModal = (po) => {
        if (!po.lineItems || po.lineItems.length === 0) {
            alert(`Cannot sign off PO ${po.poNumber}. Missing required line item data.`);
            return;
        }
        setSelectedPO(po);
        setIsSignOffModalOpen(true);
    };

    const closeSignOffModal = () => {
        setSelectedPO(null);
        setIsSignOffModalOpen(false);
        fetchPOs(); 
    };
    
    // *** NEW HANDLERS FOR NEW PO MODAL ***
    const openNewPOModal = () => {
        setIsNewPOModalOpen(true);
    };

    const closeNewPOModal = (poCreated = false) => {
        setIsNewPOModalOpen(false);
        // If a PO was created, refresh the list to show the new Draft PO
        if (poCreated) {
            fetchPOs();
        }
    };


    // --- Render Logic ---

    if (loading) {
        return <div className="p-8 text-center text-lg font-medium text-gray-600">Loading Purchase Orders...</div>;
    }

    const displayError = error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
        </div>
    );

    const { signOffCompliance, avgApprovalTime, statusCounts } = summaryMetrics;

    return (
      <Layout>
        <div className="w-full overflow-hidden bg-gray-50 min-h-screen p-8">
            {/* --- TOP HEADER SECTION --- */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Procurement Management</h1>
                {/* *** WIRING FIX: Update onClick handler *** */}
                <button 
                    onClick={openNewPOModal}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-150 flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Purchase Order
                </button>
            </div>
            {/* ... (rest of the header, metrics, and filter logic remains the same) ... */}

            <p className="text-gray-600 mb-8">Purchase Order creation, approval, and tracking with integrated vendor bill conversion</p>

            {displayError}

            {/* --- KEY METRICS CARDS (omitted for brevity) --- */}
            {/* ... */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {/* 1. Total Purchase Orders */}
                <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-blue-600">
                    <div className="flex items-center text-blue-600 mb-2">
                        <DollarSign className="w-5 h-5 mr-2" />
                        <span className="font-medium">Total Purchase Orders</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{summaryMetrics.totalPOs}</p>
                    <p className="text-sm text-gray-500">{formatNaira(summaryMetrics.totalValue)} total value</p>
                </div>

                {/* 2. Sign-Off Compliance */}
                <div className={`p-5 bg-white rounded-xl shadow-md border-l-4 ${signOffCompliance.rate < signOffCompliance.target ? 'border-red-600' : 'border-green-600'}`}>
                    <div className="flex items-center text-gray-600 mb-2">
                        <CheckSquare className="w-5 h-5 mr-2" />
                        <span className="font-medium">Sign-Off Compliance</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{signOffCompliance.rate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">{signOffCompliance.issuedCount} issued POs signed</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${signOffCompliance.rate < signOffCompliance.target ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {signOffCompliance.rate < signOffCompliance.target ? 'Non-Compliant' : 'Compliant'}
                    </span>
                </div>

                {/* 3. PO-to-Bill Match Rate */}
                <div className="p-5 bg-white rounded-xl shadow-md border-l-4 border-purple-600">
                    <div className="flex items-center text-gray-600 mb-2">
                        <FileText className="w-5 h-5 mr-2" />
                        <span className="font-medium">PO-to-Bill Match Rate</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{summaryMetrics.poToBillMatchRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">Vendor fulfillment accuracy</p>
                </div>

                {/* 4. Avg. Approval Time */}
                <div className={`p-5 bg-white rounded-xl shadow-md border-l-4 ${avgApprovalTime.hours > avgApprovalTime.target ? 'border-orange-600' : 'border-green-600'}`}>
                    <div className="flex items-center text-gray-600 mb-2">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="font-medium">Avg. Approval Time</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{avgApprovalTime.formatted}</p>
                    <p className="text-sm text-gray-500">Time from Draft to Issued</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${avgApprovalTime.hours > avgApprovalTime.target ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {avgApprovalTime.hours > avgApprovalTime.target ? `Above ${avgApprovalTime.target}h Target` : `Below ${avgApprovalTime.target}h Target`}
                    </span>
                </div>
            </div>

            {/* --- PO STATUS OVERVIEW (omitted for brevity) --- */}
            <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                    <BarChart2 className="w-5 h-5 mr-2" />
                    PO Status Overview
                </h2>
                <div className="grid grid-cols-6 gap-4 text-center">
                    <div className="p-3 border rounded-lg bg-gray-50"><p className="text-2xl font-bold text-gray-900">{statusCounts.Draft}</p><p className="text-sm text-gray-600">Draft</p></div>
                    <div className="p-3 border rounded-lg bg-blue-50"><p className="text-2xl font-bold text-gray-900">{statusCounts.Issued}</p><p className="text-sm text-blue-600">Issued</p></div>
                    <div className="p-3 border rounded-lg bg-gray-50"><p className="text-2xl font-bold text-gray-900">{statusCounts.Reviewed}</p><p className="text-sm text-gray-600">Reviewed</p></div>
                    <div className="p-3 border rounded-lg bg-green-50"><p className="text-2xl font-bold text-gray-900">{statusCounts.Approved}</p><p className="text-sm text-green-600">Approved</p></div>
                    <div className="p-3 border rounded-lg bg-purple-50"><p className="text-2xl font-bold text-gray-900">{statusCounts.Received}</p><p className="text-sm text-purple-600">Received</p></div>
                    <div className="p-3 border rounded-lg bg-red-50"><p className="text-2xl font-bold text-gray-900">{statusCounts.Cancelled}</p><p className="text-sm text-red-600">Cancelled</p></div>
                </div>
            </div>
            
            {/* --- PO REGISTER START (omitted for brevity) --- */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">Purchase Order Register</h1>
                <span className="text-sm text-gray-500">
                    {(filteredPOs || []).length} of {(allPOs || []).length} POs
                </span>
            </div>

            {/* Filter Row (omitted for brevity) */}
            {/* ... */}
            
            {/* PO Table (omitted for brevity) */}
            {/* ... */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div>
                    <table className="w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(filteredPOs || []).length > 0 ? (
                                filteredPOs.map((po) => (
                                    <tr key={po.poNumber}>
                                        <td className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 flex items-center">
                                            {po.hasAlert && <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />}
                                            {po.poNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-wrap text-sm text-gray-700">{po.vendor}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={po.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{po.department}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{po.itemsCount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">{formatNaira(po.totalAmount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{po.createdDate}</td>
                                        
                                        {/* Actions Column (Fixed to the right) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium sticky left-0 bg-white z-0 shadow-l">
                                            <div className="flex space-x-2 justify-center">
                                                {/* Convert to Bill */}
                                                {(po.status === 'Approved' || po.status === 'Issued' || po.status === 'Received') && (
                                                    <button 
                                                        title="Convert to Bill"
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        onClick={() => openConvertModal(po)} 
                                                    >
                                                        <FileText className="w-5 h-5" />
                                                    </button>
                                                )}
                                                
                                                {/* Sign-Off Draft */}
                                                {po.status === 'Draft' && (
                                                    <button 
                                                        title="Approve & Sign Off Draft"
                                                        className="text-green-600 hover:text-green-900 p-1"
                                                        onClick={() => openSignOffModal(po)}
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                
                                                {/* View Details Button (Eye Icon) */}
                                                <button
                                                    title="View Details"
                                                    onClick={() => openDetailsModal(po)}
                                                    className="text-gray-600 hover:text-gray-900 p-1"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                        No Purchase Orders match your current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Table Footer (omitted for brevity) */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                <p><span>Showing {(filteredPOs || []).length} purchase orders</span></p>
                <span>Total Value: <span className="font-bold">{formatNaira(filteredTotalValue)}</span></span>
            </div>


            {/* --- MODAL RENDERING --- */}
            
            {/* New Purchase Order Modal */}
            {isNewPOModalOpen && (
                <NewPurchaseOrderModal
                    isOpen={isNewPOModalOpen} 
                    onClose={closeNewPOModal} 
                    // Pass a flag indicating if a PO was successfully created for data refresh
                />
            )}
            
            {/* Details Modal */}
            {selectedPO && (
                <PurchaseOrderDetailsModal
                    isOpen={isDetailsModalOpen} 
                    onClose={closeDetailsModal} 
                    po={selectedPO}
                />
            )}

            {/* Convert PO to Bill Modal */}
            {selectedPO && (
                <ConvertPoToBillModal
                    isOpen={isConvertModalOpen} 
                    onClose={closeConvertModal} 
                    po={selectedPO}
                />
            )}
            
            {/* Sign-Off Modal */}
            {selectedPO && (
                <PoSignOffModal
                    isOpen={isSignOffModalOpen} 
                    onClose={closeSignOffModal} 
                    po={selectedPO}
                />
            )}
            
        </div>
      </Layout>
    );
};

export default PurchaseOrderRegister;