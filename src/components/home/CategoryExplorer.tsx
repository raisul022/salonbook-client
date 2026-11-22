'use client';

import React from 'react';
import Link from 'next/link';
import { Scissors, Palette, Sparkles, Smile, Flower2, HeartHandshake, Eye, ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: 'Haircut & Styling',
    description: 'Precision scissor fades, taper cuts, and beard sculpt styling.',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    count: '12+ Services',
  },
  {
    name: 'Hair Coloring',
    description: 'Natural grey blending, demi-permanent tone, and beard tint.',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
    count: '8+ Services',
  },
  {
    name: 'Hair Treatment',
    description: 'Scalp detox, tea tree therapy, and keratin follicle repair.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
    count: '6+ Services',
  },
  {
    name: 'Facial & Skincare',
    description: 'Charcoal pore extraction, beard hydration, and anti-aging care.',
    icon: Smile,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    count: '10+ Services',
  },
  {
    name: 'Makeup',
    description: 'Groom wedding prep, camera-ready matte complexion, and finish.',
    icon: Eye,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
    count: '5+ Services',
  },
  {
    name: 'Manicure & Pedicure',
    description: 'Executive hand therapy, foot reflexology, and paraffin care.',
    icon: Flower2,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80',
    count: '9+ Services',
  },
  {
    name: 'Spa & Massage',
    description: 'Swedish deep tissue massage, neck relief, and hot stone therapy.',
    icon: HeartHandshake,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    count: '7+ Services',
  },
];

export default function CategoryExplorer() {
  return (
    <section className="py-20 bg-stone-50 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-salon-600 uppercase tracking-widest">
            Curated Specialties
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-2">
            Salon Service Categories
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-500">
            Explore dedicated service collections tailored to your desired self-care and aesthetic transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-3xl overflow-hidden bg-white border border-stone-200 hover:border-salon-400 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-salon-50 text-salon-600 flex items-center justify-center group-hover:bg-salon-600 group-hover:text-white transition-colors duration-300 mb-4 shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-salon-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-600 group-hover:text-salon-600">
                  <span>{cat.count}</span>
                  <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-salon-50 flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
