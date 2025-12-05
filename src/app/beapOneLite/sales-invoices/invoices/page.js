'use client'
import { useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  FileText,
  Calendar,
  Eye,
  MoreVerticalIcon,
} from "lucide-react";
import Layout from "@/component/BeapOneLite/Layout";

// Mock data for invoices and quotes
const mockInvoices = [
  {
    id: "INV-001",
    company: "Acme Corporation",
    date: "11/20/2025",
    amountUSD: "US$5,000.00",
    amountNGN: "₦7,737,500.00",
    due: "12/20/2025",
    status: "Paid",
  },
  {
    id: "INV-004",
    company: "TechStart Ltd",
    date: "11/15/2025",
    amountUSD: "US$3,800.00",
    amountNGN: "₦5,880,500.00",
    due: "12/15/2025",
    status: "Paid",
  },
  {
    id: "INV-003",
    company: "Guaranty Trust Bank",
    date: "10/15/2025",
    amountUSD: "US$1,200.00",
    amountNGN: "₦1,857,000.00",
    due: "11/14/2025",
    status: "Overdue",
  },
];

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

const InvoicesPage = () => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" for ascending, "desc" for descending
  const [activeTab, setActiveTab] = useState("Invoices");

  // Handle search and status filtering
  const filteredInvoices = mockInvoices
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

  const InvoiceCard = ({ invoice }) => (
    <div className="bg-white p-5 rounded-xl border shadow-sm mb-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="font-medium text-lg flex items-center gap-2">{invoice.company}</h2>
          <p className="text-sm text-gray-500">
            {invoice.id} • {invoice.date}
          </p>
          <p className="text-[15px] font-semibold mt-2">
            {invoice.amountUSD}
            <span className="text-gray-500 mx-1">•</span>
            <span className="text-sm text-gray-500">{invoice.amountNGN}</span>
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <span>
              <Calendar size={20} />
            </span>{" "}
            Due: {invoice.due}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={invoice.status} />
          <button className="flex items-center gap-1 text-gray-700 border px-4 py-1.5 rounded-lg">
            <span>
              <Eye size={18} />
            </span>{" "}
            View
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
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Invoices</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage invoices and quotes for Lagos Main Branch
            </p>
          </div>
          <button className="bg-indigo-950 text-white font-medium px-3 py-1.5 rounded-lg flex gap-1.5 items-center border-white/98 border">
            <Plus size={18} />
            Create Invoice
          </button>
        </div>

        <div className="mt-6 bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
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

            {/* Filters */}
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

              {/* Sort Button */}
              <button
                className="border p-2 rounded-lg bg-gray-50"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center border rounded-full ">
          <button
            className={`px-6 py-3 rounded-full w-full ${activeTab === "Invoices" ? "border-blue-600 text-blue-600 font-medium border-2" : "text-gray-500 hover:text-black"}`}
            onClick={() => setActiveTab("Invoices")}
          >
            Invoices <span className="ml-1 text-sm bg-gray-200 px-2 py-0.5 rounded">{filteredInvoices.length}</span>
          </button>
          <button
            className={`px-6 py-3 rounded-full w-full ${activeTab === "Quotes" ? "border-blue-600 text-blue-600 font-medium border-2" : "text-gray-500 hover:text-black"}`}
            onClick={() => setActiveTab("Quotes")}
          >
            Quotes
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="mt-6">
          {activeTab === "Invoices" && (
            <div className="mt-6">
              {filteredInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-6">
          {activeTab === "Quotes" && (
            <div className="mt-6">
      <div className="border rounded-lg bg-white flex flex-col gap-4 justify-center w-full items-center py-9 ">
      <FileText size={48} className="text-purple-600 bg-purple-100 p-1 rounded-lg"/>
      <p className="font-medium">No quotes found</p>
      <p className="text-gray-500 text-xs">Quotes you create will appear here </p>

    </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InvoicesPage;
