"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  DollarSign,
  CheckCircle2,
  Clock,
  Target,
  Users2,
  AlertCircle,
  FileText
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/beapOnelite/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-8">Loading...</div>;

  const s = data.summary;
  const aging = data.aging_schedule;

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Invoice & Quotes Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Complete sales-to-cash cycle overview for {data.branch}
        </p>
      </div>

      {/* OVERDUE BANNER */}
      <div className="bg-red-50 border border-red-300 rounded-md px-5 py-4 flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-red-600 mt-1" />
          <div>
            <p className="text-red-700 font-semibold text-sm">
              {s.overdue_notice.message}
            </p>
            <p className="text-red-600 text-sm">
              Total overdue: ₦{s.overdue_notice.total_overdue.toLocaleString()}.
              {s.overdue_notice.percentage_past_due} of issued invoices are past due.
            </p>
          </div>
        </div>

        <button className="border border-gray-300 px-4 py-1.5 rounded-md text-sm flex items-center space-x-2 hover:bg-gray-100">
          <Eye size={16} />
          <span>View</span>
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <SummaryCard
          title="Total Outstanding"
          amount={s.total_outstanding.amount}
          subtitle={`${s.total_outstanding.unpaid_invoices} unpaid invoices`}
          icon={<DollarSign className="text-purple-600" />}
        />

        <SummaryCard
          title="Collected (Paid)"
          amount={s.collected_paid.amount}
          subtitle={`${s.collected_paid.paid_invoices} invoices`}
          icon={<CheckCircle2 className="text-green-600" />}
        />

        <SummaryCard
          title="Avg DSO"
          amount={`${s.avg_dso.days} days`}
          subtitle="Days Sales Outstanding"
          icon={<Clock className="text-yellow-500" />}
        />

        <SummaryCard
          title="Conversion Rate"
          amount={s.conversion_rate.rate}
          subtitle="Quote → Invoice"
          icon={<Target className="text-blue-500" />}
        />
      </div>

      {/* SECOND SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <SubCard
          title="Pending"
          amount={s.pending.amount}
          subtitle={`${s.pending.invoices} invoices`}
        />

        <SubCard
          title="Overdue"
          amount={s.overdue.amount}
          subtitle={`${s.overdue.invoices} invoices`}
          amountClass="text-red-600"
        />

        <SubCard
          title="Total Quotes"
          amount={s.total_quotes.count}
          subtitle={`${s.total_quotes.converted} converted`}
        />

        <SubCard
          title="Draft Invoices"
          amount={s.draft_invoices.count}
          subtitle="Not yet sent"
        />
      </div>

      {/* MIDDLE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* AGING SCHEDULE */}
        <div className="bg-white rounded-md shadow-md p-5 space-y-4">
          <h2 className="font-semibold">Aging Schedule Summary</h2>
          <p className="text-gray-500 text-sm">Outstanding balance by aging period</p>

          <AgingRow label="Current (Not Due)" amount={aging.current_not_due.amount} color="bg-green-100" />
          <AgingRow label="1-30 Days" amount={aging["1_30_days"].amount} color="bg-yellow-100" />
          <AgingRow label="31-60 Days" amount={aging["31_60_days"].amount} color="bg-orange-100" />
          <AgingRow label="60+ Days" amount={aging["60_plus_days"].amount} color="bg-red-100" />

          <button className="w-full border border-gray-300 mt-3 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2 hover:bg-gray-100">
            <FileText size={16} />
            <span>View Full Aging Report</span>
          </button>
        </div>

        {/* TOP CUSTOMERS */}
        <div className="bg-white rounded-md shadow-md p-5 space-y-4">
          <h2 className="font-semibold flex items-center space-x-2">
            <Users2 size={18} />
            <span>Top Customers (Outstanding)</span>
          </h2>
          <p className="text-gray-500 text-sm">Clients with highest unpaid balances</p>

          {data.top_customers_outstanding.map((c, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">{c.customer}</p>
              <p className="mt-1 font-semibold">₦{c.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT INVOICES */}
      <div className="bg-white rounded-md shadow-md p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold">Recent Invoices</h2>

          <button className="border border-gray-300 px-4 py-1.5 rounded-md text-sm flex items-center space-x-2 hover:bg-gray-100">
            <Eye size={16} />
            <span>View All</span>
          </button>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Latest 5 invoices for {data.branch}
        </p>

        <div className="space-y-3">
          {data.recent_invoices.map((inv, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-md flex items-center justify-between">
              <div>
                <p className="font-medium">{inv.customer}</p>
                <p className="text-gray-500 text-sm">
                  {inv.invoice_number} • {inv.date}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">US${inv.amount_usd.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">
                  ≈ ₦{inv.amount_ngn.toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  inv.status === "Paid"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {inv.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ------------------- COMPONENTS ------------------- */

function SummaryCard({ title, amount, subtitle, icon }) {
  return (
    <div className="bg-white rounded-md shadow-md p-5 space-y-1">
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">{title}</p>
        {icon}
      </div>

      <p className="text-2xl font-bold">
        {typeof amount === "number"
          ? `₦${amount.toLocaleString()}`
          : amount}
      </p>

      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}

function SubCard({ title, amount, subtitle, amountClass = "" }) {
  return (
    <div className="bg-white rounded-md shadow-md p-5 space-y-1">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-xl font-semibold ${amountClass}`}>
        ₦{amount.toLocaleString()}
      </p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}

function AgingRow({ label, amount, color }) {
  return (
    <div className={`${color} p-3 rounded-md`}>
      <p className="text-sm">{label}</p>
      <p className="font-semibold">₦{amount.toLocaleString()}</p>
    </div>
  );
}
