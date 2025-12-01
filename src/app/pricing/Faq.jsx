'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';



// Data structure for the FAQs
const faqData = [
  {
    question: 'Can I switch plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and your billing will be prorated accordingly.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, mobile money (M-Pesa, MTN, Airtel), and bank transfers. We strive to offer flexible payment solutions for all our users.',
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No setup fees ever. You only pay for your subscription and any add-ons you choose. We believe in transparent pricing from the start.',
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer: "We'll notify you and help you upgrade. Your service continues uninterrupted. We make sure you are never suddenly cut off from your essential business tools.",
  },
];

const FaqItem = ({ question, answer }) => {
  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-[1.01] hover:shadow-xl"
      style={{ marginBottom: '1rem' }} 
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{question}</h3>
      <p className="text-sm text-gray-600">{answer}</p>
    </div>
  );
};

// --- Ready to Get Started Banner Component ---
const ReadyToGetStartedBanner = () => (
  <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#6a0dad] via-[#a332d7] to-[#ec1673] w-full shadow-2xl mt-16">
    <div className="text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-extrabold text-white mb-4">
        Ready to Get Started?
      </h2>
      <p className="text-lg text-white/90 mb-8">
        Start your free trial today. No credit card required.
      </p>
      <Link
        href="/signin"
        className="inline-flex items-center space-x-2 px-8 py-3 text-lg font-bold text-white 
                   rounded-xl transition duration-300 shadow-xl 
                   bg-white/20 backdrop-blur-sm hover:bg-white/30 
                   transform hover:scale-[1.05] border border-white/50"
      >
        <span>Start Free Trial</span>
        <ArrowRight size={20} />
      </Link>
    </div>
  </div>
);

// --- Main Component ---
const Faq = () => {
  return (
    <section className=" bg-slate-100 w-full py-3">
      <div className="max-w-4xl mx-auto">
        
        {/* FAQ Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Everything you need to know about our service.
          </p>
        </div>

        {/* FAQ Static Cards List */}
        <div className="space-y-8">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>

        

      </div>
      {/* Call to Action Banner */}
        <ReadyToGetStartedBanner />
    </section>
  );
};

export default Faq;