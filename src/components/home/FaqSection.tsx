'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'What is SalonBook’s appointment cancellation and rescheduling policy?',
    answer:
      'We understand schedules change. You may cancel or reschedule your reservation free of charge up to 4 hours prior to your scheduled time directly through your Customer Dashboard. For late cancellations within 4 hours, a courtesy notice to our reception is appreciated.',
  },
  {
    question: 'Do you accommodate walk-in appointments, or is reservation required?',
    answer:
      'While we do accept walk-in guests subject to chair availability, we strongly recommend reserving your preferred slot online to guarantee zero waiting time and dedicated attention from your preferred master barber or aesthetician.',
  },
  {
    question: 'What clinical hygiene and sanitation standards are practiced?',
    answer:
      'Every shear, razor, clipper blade, and comb undergoes hospital-grade UV-C sterilization and Barbicide immersion between every single guest. Fresh, single-use organic cotton towels and sanitized styling capes are standard for all services.',
  },
  {
    question: 'Can I request a specific master stylist or aesthetic specialist?',
    answer:
      'Yes! When booking any signature treatment, you can select from our verified master barbers and certified skin aestheticians based on their specialization and guest ratings.',
  },
  {
    question: 'Which payment methods and currencies are supported?',
    answer:
      'We support seamless online card payments powered by Stripe (Visa, Mastercard, American Express), digital wallets (Apple Pay, Google Pay), and cash settlement at reception upon appointment completion.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-stone-50 border-t border-stone-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-50 text-salon-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-salon-600" />
            Transparent Care
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-500">
            Everything you need to know about preparing for your luxury salon experience.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:border-salon-300 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base font-bold text-stone-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-salon-600 text-white rotate-180' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
