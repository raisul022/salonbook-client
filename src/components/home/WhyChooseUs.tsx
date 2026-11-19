'use client';

import React from 'react';
import { Award, Clock3, Sparkles, ShieldCheck, HeartHandshake, Star } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Certified Master Stylists',
    description: 'Every aesthetician and stylist has over 8+ years of salon experience and rigorous certification.',
  },
  {
    icon: Clock3,
    title: 'Zero Waiting Time',
    description: 'Direct slot reservation system ensures your styling chair is prepped and ready the moment you arrive.',
  },
  {
    icon: Sparkles,
    title: 'Organic & Luxury Products',
    description: 'We exclusively utilize top-tier organic, cruelty-free balms, keratin serums, and clinical-grade formulations.',
  },
  {
    icon: ShieldCheck,
    title: 'Hospital-Grade Sanitization',
    description: 'All instruments undergo medical autoclave sterilization before every single guest appointment.',
  },
];

const testimonials = [
  {
    quote: 'SalonBook made reserving my bridal prep so effortless. The balayage and manicure were utterly sublime!',
    author: 'Camilla Dupont',
    role: 'Loyal Client',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
  {
    quote: 'The Swedish full-body massage melted away weeks of stress. Secure Stripe payment and instant booking is unmatched.',
    author: 'Marcus Sterling',
    role: 'Corporate Executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
  {
    quote: 'The precision haircut and beard sculpt was by far the cleanest grooming experience I have had in New York.',
    author: 'David Chen',
    role: 'Architect',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-salon-600 uppercase tracking-widest">
            The SalonBook Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-2">
            Why Discerning Clients Choose Us
          </h2>
          <p className="mt-3 text-stone-500 text-sm sm:text-base">
            We redefine the salon appointment experience through bespoke artistry, tranquil ambiances, and transparent booking.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {reasons.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-salon-200 hover:bg-salon-50/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-salon-600 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Client Testimonials */}
        <div className="rounded-3xl bg-salon-950 text-white p-8 sm:p-14 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase font-semibold tracking-widest text-salon-400">
                Client Accolades
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                Loved by Over 5,000+ Guests
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                      {[...Array(t.stars)].map((_, s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-stone-300 text-xs sm:text-sm italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-salon-500/30"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{t.author}</h4>
                      <p className="text-[11px] text-stone-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
