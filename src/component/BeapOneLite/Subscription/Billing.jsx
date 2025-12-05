"use client";

import { FileText, Clock3, CheckCircle2 } from "lucide-react";

const billingData = {
  period: "November 2024",
  userSubscription: { quantity: 5, price: 1500 },
  dataStorage: { used: 3.8, limit: 5, price: 0 },
  eInvoice: { quantity: 30, price: 45 },
  total: 8850,
  nextBillingDate: "December 1, 2024",
};

const paymentHistory = [
  {
    amount: 7500,
    date: "Nov 1, 2024",
    method: "Bank Transfer",
    invoiceId: "INV-2024-11-001",
    status: "Success",
  },
  {
    amount: 9250,
    date: "Oct 1, 2024",
    method: "Card (Visa ****1234)",
    invoiceId: "INV-2024-10-001",
    status: "Success",
  },
  {
    amount: 7500,
    date: "Sep 1, 2024",
    method: "Bank Transfer",
    invoiceId: "INV-2024-09-001",
    status: "Success",
  },
];

export default function Billing() {
  return (
    <div className="  p-3 space-y-8">

      {/* Billing Calculation */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Current Billing Calculation</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Billing Period: <span className="font-medium">{billingData.period}</span>
        </p>

        {/* User Subscription */}
        <div className="flex justify-between py-3 border-b">
          <div>
            <p className="font-medium">User Subscription</p>
            <p className="text-sm text-gray-600">
              {billingData.userSubscription.quantity} × ₦{billingData.userSubscription.price.toLocaleString()}
            </p>
          </div>
          <p className="font-semibold">
            ₦{(billingData.userSubscription.quantity * billingData.userSubscription.price).toLocaleString()}
          </p>
        </div>

        {/* Data Storage */}
        <div className="flex justify-between py-3 border-b">
          <div>
            <p className="font-medium">Data Storage ({billingData.dataStorage.used} GB / {billingData.dataStorage.limit} GB)</p>
            <p className="text-sm text-gray-600">0 × ₦250</p>
          </div>
          <p className="font-semibold">₦0</p>
        </div>

        {/* eInvoice */}
        <div className="flex justify-between py-3 border-b">
          <div>
            <p className="font-medium">eInvoice Submissions ({billingData.eInvoice.quantity} invoices)</p>
            <p className="text-sm text-gray-600">
              {billingData.eInvoice.quantity} × ₦{billingData.eInvoice.price}
            </p>
          </div>
          <p className="font-semibold">
            ₦{(billingData.eInvoice.quantity * billingData.eInvoice.price).toLocaleString()}
          </p>
        </div>

        {/* Total */}
        <div className="text-right mt-4">
          <p className="text-xl font-bold text-indigo-700">₦{billingData.total.toLocaleString()}</p>
        </div>

        {/* Next Billing Date */}
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg  items-start gap-2">
          <p className="text-indigo-700 flex gap-1 items-center"> <Clock3 className="w-5 h-5 text-indigo-700" />Next Billing Date </p>
          <p className="text-sm text-gray-700">
            Your next payment of <span className="font-semibold">₦{billingData.total.toLocaleString()}</span> 
            will be processed on <span className="font-medium">{billingData.nextBillingDate}</span>.
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Payment History</h2>

        <div className="space-y-4">
          {paymentHistory.map((item, i) => (
            <div
              key={i}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">₦{item.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{item.date}</p>
                <p className="text-sm text-gray-500">{item.method}</p>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  {item.status}
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.invoiceId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
