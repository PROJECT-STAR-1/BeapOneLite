'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  FileText,
} from 'lucide-react';

import Layout from "@/component/BeapOneLite/Layout";
import BillsRegister from '@/component/BeapOneLite/purchasing/VendorBills/BillsRegister';
import UpcomingPayments from '@/component/BeapOneLite/purchasing/VendorBills/UpcomingPayments';
import Vendors from '@/component/BeapOneLite/purchasing/VendorBills/Vendors';
import NewVendorModal from '@/component/BeapOneLite/purchasing/VendorBills/NewvendorModal';
import NewBillModal from '@/component/BeapOneLite/purchasing/VendorBills/NewBillModal';

import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// -----------------------
// Metric Card Component
// -----------------------
const MetricCard = ({ title, value, subtitle, icon: Icon, iconColor, isOverdue = false }) => (
  <div
    className={`p-5 rounded-xl shadow-sm border ${
      isOverdue ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'
    } transition-shadow hover:shadow-lg`}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {Icon && (
        <div className={`p-1.5 rounded-full ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>

    <p className="text-2xl font-medium text-gray-900 mb-1">{value}</p>

    <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
      {subtitle}
    </p>
  </div>
);

// -----------------------
// Fetching & Main Component
// -----------------------
export default function VendorBillsDashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch vendor bills data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/beapOnelite/vendorbills");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to load vendor bills:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Tabs
  const tabs = useMemo(() => ({
    'Bills Register': () => (<BillsRegister />),
    'Upcoming Payments': () => (<UpcomingPayments />),
    Vendors: () => (<Vendors />),
  }), []);

  const tabNames = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabNames[0]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const ActiveTabContent = tabs[activeTab];

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <p>Loading data...</p>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="p-8">
          <p className="text-red-600">Failed to load vendor bills data.</p>
        </div>
      </Layout>
    );
  }

  const { metrics, agingSchedule } = data;

  const chartData = {
    labels: agingSchedule.labels,
    datasets: [
      {
        label: "Outstanding Amount",
        data: agingSchedule.values,
        backgroundColor: "#252F70",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" },
    },
  };

  return (
    <Layout>
      <div className="p-8 min-h-screen bg-gray-50">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Bills & Payables</h1>
            <p className="text-gray-500">Manage accounts payable and vendor relationships</p>
          </div>

          <div className="flex space-x-4">
            <button
  onClick={() => setShowVendorModal(true)}
  className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
>
              <Plus className="w-5 h-5" />
              <span>New Vendor</span>
            </button>

            <button
            onClick={() => setShowBillModal(true)}
             className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg">
              <FileText className="w-5 h-5" />
              <span>New Bill</span>
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Outstanding"
            value={metrics.totalOutstanding}
            subtitle="Accounts Payable"
            icon={DollarSign}
            iconColor="text-red-500"
          />

          <MetricCard
            title="Avg DPO"
            value={metrics.avgDPO}
            subtitle="Target: 30–45 days"
            icon={Clock}
            iconColor="text-yellow-600"
          />

          <MetricCard
            title="On-Time Payment"
            value={metrics.onTimePayment}
            subtitle="Target: ≥ 95%"
            icon={CheckCircle}
            iconColor="text-green-600"
          />

          <MetricCard
            title="Overdue Items"
            value={metrics.overdueItems}
            subtitle={`${metrics.upcomingItems} upcoming (7 days)`}
            icon={AlertTriangle}
            iconColor="text-red-600"
            isOverdue
          />
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Accounts Payable Aging Schedule</h2>
          <div className="h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border rounded-full justify-around w-full border-gray-200">
            {tabNames.map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`py-3 px-6 text-sm font-medium transition-all w-full ${
                  activeTab === tabName
                    ? 'bg-gray-100 text-black border-2 rounded-full border-black'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>

          <div className="p-6">
            <ActiveTabContent />
          </div>
        </div>

      </div>
      <NewVendorModal 
  open={showVendorModal}
  onClose={() => setShowVendorModal(false)}
/>
<NewBillModal
  open={showBillModal}
  onClose={() => setShowBillModal(false)}
/>


    </Layout>
  );
}
