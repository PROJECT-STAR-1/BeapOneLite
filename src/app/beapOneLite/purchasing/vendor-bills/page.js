
'use client'; 

import { useState, useMemo } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- MOCK DATA ---
const MOCK_METRICS = {
  totalOutstanding: '₦3,650,000',
  avgDPO: '21.9 days',
  onTimePayment: '100.0%',
  overdueItems: 1,
  upcomingItems: 0,
};

const CHART_DATA = {
  labels: ['Not Due', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
  datasets: [
    {
      label: 'Outstanding Amount',
      data: [1790000, 830000, 830000, 0, 0], 
      backgroundColor: '#252F70', 
      borderRadius: 4, 
      barPercentage: 0.8, 
      categoryPercentage: 0.9,
    },
  ],
};

// ------------------------------------
// --- REUSABLE COMPONENTS (NESTED) ---
// ------------------------------------

/**
 * MetricCard Component
 */
const MetricCard = ({ title, value, subtitle, icon: Icon, iconColor, isOverdue = false }) => {
  return (
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
};

/**
 * Accounts Payable Aging Schedule Chart Component 
 */
const AgingScheduleChart = () => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom', 
        labels: {
          boxWidth: 12,
          padding: 20,
        },
      },
      tooltip: {
         callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                  minimumFractionDigits: 0, 
                }).format(context.parsed.y);
              }
              return label;
            },
          },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1800000, 
        ticks: { 
          stepSize: 450000,
          callback: function (value) {
            if (value === 0) return '0';
            if (value === 450000) return '450000';
            if (value === 900000) return '900000';
            if (value === 1350000) return '1350000';
            if (value === 1800000) return '1800000';
            return null;
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', 
        },
      },
      x: {
        grid: {
          display: false, 
        },
      },
    },
  };

  return (
    <div className="relative h-96">
      <Bar data={CHART_DATA} options={chartOptions} /> 
    </div>
  );
};


// ------------------------------------
// --- MAIN DASHBOARD COMPONENT ---
// ------------------------------------

export default function VendorBillsDashboard() {
  
  const tabs = useMemo(() => ({
    'Bills Register': () => (
      <BillsRegister/>
    ),
    'Upcoming Payments': () => (
      <UpcomingPayments/>
    ),
    Vendors: () => (
      <Vendors/>
    ),
  }), []);

  const tabNames = Object.keys(tabs);
  const [activeTab, setActiveTab] = useState(tabNames[0]);

  const ActiveTabContent = tabs[activeTab];

  return (
    <Layout>
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Bills & Payables</h1>
          <p className="text-gray-500">Manage accounts payable and vendor relationships</p>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">New Vendor</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-semibold">New Bill</span>
          </button>
        </div>
      </div>
      
      {/* --- Metrics Cards Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Outstanding"
          value={MOCK_METRICS.totalOutstanding}
          subtitle="Accounts Payable"
          icon={DollarSign}
          iconColor="text-red-500"
        />

        <MetricCard
          title="Avg DPO"
          value={MOCK_METRICS.avgDPO}
          subtitle="Target: 30-45 days"
          icon={Clock}
          iconColor="text-yellow-600"
        />

        <MetricCard
          title="On-Time Payment"
          value={MOCK_METRICS.onTimePayment}
          subtitle="Target: ≥ 95%"
          icon={CheckCircle}
          iconColor="text-green-600"
        />

        <MetricCard
          title="Overdue Items"
          value={MOCK_METRICS.overdueItems}
          subtitle={`${MOCK_METRICS.upcomingItems} upcoming (7 days)`}
          icon={AlertTriangle}
          iconColor="text-red-600"
          isOverdue={true}
        />
      </div>

      <hr className="my-8 border-gray-200" />

      {/* --- Accounts Payable Aging Schedule Chart Section --- */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Accounts Payable Aging Schedule</h2>
        <AgingScheduleChart />
      </div>

      {/* --- Tab Navigation and Content Section --- */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border rounded-full justify-around w-full border-gray-200">
          {tabNames.map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`py-3 px-6 text-sm font-medium transition-all duration-200 w-full  ${
                activeTab === tabName
                  ? 'bg-gray-100 text-black border-2 rounded-full border-black w-full'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>

        <div>
          <ActiveTabContent />
        </div>
      </div>
    </div>
    </Layout>
  );
}