'use client';

import React from 'react';
import { ArrowRight, Globe, MapPin, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';



// --------------------------------------------------------------------------------
// 1. What Every Business Gets (Features Section)
// --------------------------------------------------------------------------------

const coreFeatures = [
  { icon: Globe, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', title: 'Multi-Currency', description: 'Invoice in any currency' },
  { icon: MapPin, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', title: 'Multi-Location', description: 'Manage all branches' },
  { icon: Users, iconBg: 'bg-green-100', iconColor: 'text-green-600', title: 'Team Access', description: 'Role-based permissions' },
  { icon: TrendingUp, iconBg: 'bg-orange-100', iconColor: 'text-orange-600', title: 'Real Insights', description: 'Financial reports' },
];

const FeatureItem = ({ data }) => {
  const IconComponent = data.icon;
  
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className={`w-16 h-16 p-4 ${data.iconBg} rounded-xl mb-4 shadow-sm`}>
        <IconComponent size={32} className={data.iconColor} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{data.title}</h3>
      <p className="text-sm text-gray-500">{data.description}</p>
    </div>
  );
};

const FooterFeaturesSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight">
            What Every Business Gets
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Regardless of your industry, you get these powerful features
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {coreFeatures.map((data, index) => (
            <FeatureItem key={index} data={data} />
          ))}
        </div>

      </div>
    </section>
  );
};





const MainFooter = () => {
  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8 
                          bg-gradient-to-br from-blue-300 via-blue-600 to-purple-400 
                          text-white text-center shadow-inner">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-medium leading-tight tracking-tighter mb-4">
            Find Your Perfect Solution
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Start free and scale as you grow. No credit card required.
          </p>

          <div className='flex gap-4 justify-center'>

          <Link
            href="/signin"
            className="inline-flex items-center space-x-2 px-10 py-4 text-lg font-bold 
                       text-purple-900 bg-white rounded-xl transition duration-300 shadow-2xl 
                       hover:bg-gray-100 transform hover:scale-[1.05]"
          >
            <span>Start Free Trial</span>
            <ArrowRight size={20} className="ml-1" />
          </Link>
           <Link
            href="/"
            className="inline-flex items-center space-x-2 px-10 py-4 text-lg font-bold 
                       text-white border-white border  rounded-xl transition duration-300 shadow-2xl 
                       hover:bg-gray-100 transform hover:scale-[1.05]"
          >
            <span>View All Features</span>
          </Link>
          </div>
        </div>
      </section>

     
    </>
  );
};


// --------------------------------------------------------------------------------
// 3. Final Footer Component
// --------------------------------------------------------------------------------

const PageFooter = () => (
    <div>
        <FooterFeaturesSection />
        <MainFooter />
    </div>
);

export default PageFooter;