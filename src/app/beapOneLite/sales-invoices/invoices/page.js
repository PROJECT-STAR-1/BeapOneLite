'use client'
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  Plus,
  FileText,
  Calendar,
  Eye,
  MoreVerticalIcon,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  MessageCircle,
  Download
} from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";
import CreateInvoiceQuoteModal from "@/component/BeapOneLite/SalesInvoices/invoices/CreateInvoiceQuoteModal";

const statuses = ["All Status", "Draft", "Pending", "Paid", "Overdue"];

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-black text-white",
    Pending: "bg-yellow-100 text-yellow-700",
    Draft: "bg-gray-200 text-gray-700",
    Overdue: "bg-red-600 text-white",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const MetricCard = ({ title, value, icon: Icon, colorClass }) => {
  const iconColorClass = colorClass.includes('blue') ? 'text-blue-600' :
    colorClass.includes('green') ? 'text-green-600' :
    colorClass.includes('yellow') ? 'text-yellow-600' :
    'text-red-600';

  const iconBgClass = colorClass.includes('blue') ? 'bg-blue-100' :
    colorClass.includes('green') ? 'bg-green-100' :
    colorClass.includes('yellow') ? 'bg-yellow-100' :
    'bg-red-100';

  return (
    <div className={`p-4 rounded-xl shadow-sm border ${colorClass} bg-white flex flex-col justify-between`}>
      <div className="flex justify-between items-start">
        <h3 className="text-md font-medium text-gray-700">{title}</h3>
        <div className={`p-1.5 rounded-full ${iconBgClass}`}>
          <Icon size={20} className={iconColorClass} />
        </div>
      </div>
      <p className="text-2xl font-bold mt-2 text-gray-900">
        {value.startsWith('₦') ? value : `₦${value}`}
      </p>
    </div>
  );
};

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [activeTab, setActiveTab] = useState("Invoices");
  const [viewModal, setViewModal] = useState(false);
const [selectedInvoice, setSelectedInvoice] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const openInvoice = (invoice) => {
  setSelectedInvoice(invoice);
  setViewModal(true);
};

const closeInvoice = () => {
  setViewModal(false);
  setSelectedInvoice(null);
};


  const formatNaira = (value) => {
    let cleanedValue = String(value || 0).replace(/[^\d.]/g, '');
    return cleanedValue;
  };

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await fetch("/api/beapOnelite/invoices");
        const json = await res.json();
        setInvoices(json.invoices || []);
        setMetrics(json.metrics || null);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    }
    loadInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    return (invoices || [])
      .filter((invoice) => {
        const matchesSearch =
          invoice.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          selectedStatus === "All Status" || invoice.status === selectedStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [invoices, searchQuery, selectedStatus, sortDirection]);

  const InvoiceCard = ({ invoice }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="font-medium text-lg flex items-center gap-2">{invoice.company}</h2>
          <p className="text-sm text-gray-500">{invoice.id} • {invoice.date}</p>

          <p className="text-[15px] font-semibold mt-2">
            {invoice.amountUSD}
            <span className="text-gray-500 mx-1">•</span>
            <span className="text-sm text-gray-500">{invoice.amountNGN}</span>
          </p>

          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Calendar size={20} /> Due: {invoice.due}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <StatusBadge status={invoice.status} />
          <button
           onClick={() => openInvoice(invoice)}
           className="flex items-center gap-1 text-gray-700 border px-4 py-1.5 rounded-lg">
            <Eye size={18} /> View
          </button>
          <button className="border p-2 rounded-lg">
            <MoreVerticalIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-6 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Invoices</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage invoices and quotes for Lagos Main Branch
            </p>
          </div>

          <button
          onClick={() => setIsModalOpen(true)}
           className="bg-indigo-950 text-white font-medium px-3 py-2 rounded-lg flex gap-1.5 items-center">
            <Plus size={18} />
            Create Invoice
          </button>
        </div>

        {/* METRICS */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Total Value" value={formatNaira(metrics.totalValue)} icon={DollarSign} colorClass="border-l-4 border-l-blue-600" />
            <MetricCard title="Paid" value={formatNaira(metrics.paid)} icon={CheckCircle} colorClass="border-l-4 border-l-green-600" />
            <MetricCard title="Pending" value={formatNaira(metrics.pending)} icon={Clock} colorClass="border-l-4 border-l-yellow-600" />
            <MetricCard title="Overdue" value={formatNaira(metrics.overdue)} icon={AlertCircle} colorClass="border-l-4 border-l-red-600" />
          </div>
        )}

        {/* FILTERS */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by client name or invoice number..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setStatusOpen(!statusOpen)}
                  className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-gray-50"
                >
                  {selectedStatus}
                  <ChevronDown size={16} />
                </button>

                {statusOpen && (
                  <div className="absolute mt-2 bg-white border rounded-lg shadow-md w-40 z-10">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setStatusOpen(false);
                        }}
                        className="block text-left px-4 py-2 w-full hover:bg-gray-100"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="border p-2 rounded-lg bg-gray-50"
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
              >
                <ArrowUpDown size={18} />
              </button>
            </div>

          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center border rounded-full overflow-hidden w-full mx-auto">
          <button
            className={`px-8 py-3 w-full  transition ${activeTab === "Invoices" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("Invoices")}
          >
            Invoices
            <span className="ml-1 text-sm bg-white/20 px-2 py-0.5 rounded-full">{filteredInvoices.length}</span>
          </button>

          <button
            className={`px-8 py-3 w-full  transition ${activeTab === "Quotes" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("Quotes")}
          >
            Quotes
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-4">
          {activeTab === "Invoices" && (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          )}

          {activeTab === "Quotes" && (
            <div className="border rounded-lg bg-white flex flex-col gap-4 justify-center w-full items-center py-10">
              <FileText size={48} className="text-purple-600 bg-purple-100 p-1 rounded-lg" />
              <p className="font-medium">No quotes found</p>
              <p className="text-gray-500 text-sm">Quotes you create will appear here</p>
            </div>
          )}
        </div>

        



      </div>

      

      {viewModal && selectedInvoice && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white w-[600px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">

      <button
        className="absolute right-4 top-4 text-gray-600"
        onClick={closeInvoice}
      >
        ✕
      </button>

      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-3">{selectedInvoice.id}</h2>
      <p className="text-gray-500 mb-4">Invoice details and line items</p>

      {/* TOP CARD */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-5 rounded-xl">
        <h3 className="text-2xl font-bold">BEAPOne Lite</h3>
        <p className="text-sm opacity-80">Enterprise SME Solution</p>

        <div className="grid grid-cols-2 mt-4 text-sm">
          <p><strong>Date Issued:</strong> {selectedInvoice.date}</p>
          <p><strong>Due Date:</strong> {selectedInvoice.due}</p>
        </div>

        <p className="mt-4 text-right text-lg font-semibold">
          Invoice {selectedInvoice.id}
        </p>
      </div>

      {/* BILL TO */}
      <div className="mt-5">
        <p className="text-sm text-gray-500">Bill To:</p>
        <p className="font-semibold">{selectedInvoice.company}</p>

        <p className="text-sm text-gray-500 mt-3">Amount Due:</p>
        <p className="text-xl font-bold">{selectedInvoice.amountUSD}</p>
        <p className="text-gray-500 text-sm">{selectedInvoice.amountNGN}</p>
      </div>

      {/* ITEMS TABLE */}
      <div className="mt-6">
        <h3 className="font-medium mb-2">Items</h3>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Unit Price</th>
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {selectedInvoice.items?.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{item.description}</td>
                <td className="p-2">{item.qty}</td>
                <td className="p-2">{item.unitPrice}</td>
                <td className="p-2">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end text-lg font-semibold mt-3">
          Total: {selectedInvoice.amountUSD}
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex gap-4 mt-6 w-full">
        <button className="flex w-full items-center gap-2 justify-center  bg-green-600 text-white py-2 rounded-lg">
          <MessageCircle size={22}/>
          Share via WhatsApp
        </button>
        <button className="flex w-full items-center justify-center gap-2 border py-2 rounded-lg">
          <MessageSquare size={22}/>
          Send Email
        </button>
      </div>

      <button className="w-full flex justify-center gap-2 items-center mt-3 border py-2 rounded-lg">
        <Download size={22}/>
        Download PDF
      </button>
    </div>
  </div>
)}


{isModalOpen && (
                <CreateInvoiceQuoteModal 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
    </Layout>
  );
};

export default InvoicesPage;
