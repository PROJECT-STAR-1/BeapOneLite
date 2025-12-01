import { FileIcon, Globe, DollarSign, Users, BarChart, Grid } from 'lucide-react';

export default function Home() {
  return (
    <div className="font-sans bg-gray-50">

      {/* Header Section */}
      <div className="text-center py-20 px-8 bg-white">
        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
          Everything you need
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Powerful features designed to help your business grow
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 p-12 max-w-6xl mx-auto">
        <div className="text-center">
          <FileIcon className="mx-auto text-blue-500" size={48} />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Invoicing</h3>
          <p className="text-gray-600">Create and send professional invoices in seconds</p>
        </div>

        <div className="text-center">
          <DollarSign className="mx-auto text-yellow-500" size={48} />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Expense tracking</h3>
          <p className="text-gray-600">Keep track of every naira spent</p>
        </div>

        <div className="text-center">
          <BarChart className="mx-auto text-green-500" size={48} />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Financial reports</h3>
          <p className="text-gray-600">Real-time insights into your business</p>
        </div>

        <div className="text-center">
          <Globe className="mx-auto text-blue-600" size={48} />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Multi-currency</h3>
          <p className="text-gray-600">Handle transactions in any currency</p>
        </div>

        <div className="text-center">
          <Users className="mx-auto text-purple-500" size={48} />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Team management</h3>
          <p className="text-gray-600">Add users with role-based access</p>
        </div>

        <div className="text-center">
          <Grid className="mx-auto text-indigo-500" size={48} />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Offline mode</h3>
          <p className="text-gray-600">Work without internet, sync later</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center gap-12">
          <div>
            <h2 className="text-5xl font-bold text-gray-800">10,000+</h2>
            <p className="text-lg text-gray-600 mt-2">Active Users</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-gray-800">₦50B+</h2>
            <p className="text-lg text-gray-600 mt-2">Processed</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-gray-800">15+</h2>
            <p className="text-lg text-gray-600 mt-2">Countries</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-gray-800">99.9%</h2>
            <p className="text-lg text-gray-600 mt-2">Uptime</p>
          </div>
        </div>
      </div>

      {/* Trusted Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl text-gray-600 mb-12">
            Trusted by businesses across Africa
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {/* Placeholder Logo Boxes */}
            <div className="h-20 bg-gray-100 rounded-xl"></div>
            <div className="h-20 bg-gray-100 rounded-xl"></div>
            <div className="h-20 bg-gray-100 rounded-xl"></div>
            <div className="h-20 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 text-white text-center py-24 relative overflow-hidden">
        <h2 className="text-5xl font-bold">Start growing today</h2>
        <p className="text-lg mt-4">
          Join thousands of businesses already using BEAPOne
        </p>

        <button className="mt-10 bg-white text-indigo-600 py-3 px-10 rounded-full font-semibold text-xl shadow-lg hover:scale-105 transition">
          Get started free
        </button>

        <p className="mt-4 text-sm text-indigo-200">No credit card required</p>
      </div>

    </div>
  );
}
