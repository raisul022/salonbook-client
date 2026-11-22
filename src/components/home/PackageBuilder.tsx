'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Check, Plus, Minus, Tag, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface PackageService {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  icon: string;
  image: string;
}

const availableServices: PackageService[] = [
  {
    id: 'b1',
    name: 'Executive Royal Haircut & Beard Sculpt',
    category: 'Haircut & Styling',
    price: 45,
    duration: 50,
    icon: '✂️',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b2',
    name: "Gentlemen's Charcoal Deep Pore Facial",
    category: 'Facial & Skincare',
    price: 75,
    duration: 50,
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b3',
    name: 'Deep Tissue Swedish Back & Shoulder Massage',
    category: 'Spa & Massage',
    price: 85,
    duration: 60,
    icon: '💆‍♂️',
    image: 'https://images.unsplash.com/photo-1650044252595-cacd425982ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b4',
    name: 'Executive Hand & Foot Reflexology Grooming',
    category: 'Manicure & Pedicure',
    price: 60,
    duration: 55,
    icon: '👞',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b5',
    name: 'Royal Hot Towel Straight Razor Shave',
    category: 'Haircut & Styling',
    price: 40,
    duration: 35,
    icon: '🪒',
    image: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b6',
    name: "Men's Natural Hair Toning & Grey Blending",
    category: 'Hair Coloring',
    price: 65,
    duration: 45,
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
  },
];

export default function PackageBuilder() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['b1', 'b2']);

  const toggleService = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedServices = availableServices.filter((s) => selectedIds.includes(s.id));
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Discount rules: 2 services = 10%, 3+ services = 20%
  let discountRate = 0;
  if (selectedIds.length === 2) discountRate = 0.1;
  else if (selectedIds.length >= 3) discountRate = 0.2;

  const discountAmount = subtotal * discountRate;
  const finalPrice = subtotal - discountAmount;

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-50 text-salon-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-salon-600" />
            Bundle & Save
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Build Your Bespoke Grooming Package
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-500">
            Combine multiple signature treatments for an all-inclusive session. Enjoy automatically
            scaled bundle discounts up to <span className="font-bold text-salon-600">20% off</span>.
          </p>
        </div>

        {/* Builder Layout: Left Grid of Selectable Services, Right Sticky Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Services Selection List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableServices.map((service) => {
              const isSelected = selectedIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between select-none ${
                    isSelected
                      ? 'border-salon-600 bg-salon-50/50 shadow-md scale-[1.01]'
                      : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-xl shrink-0">
                      {service.icon}
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'bg-salon-600 text-white' : 'border border-stone-300 bg-white text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-600 tracking-wider">
                      {service.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 leading-snug mt-0.5 line-clamp-2">
                      {service.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration} mins
                    </span>
                    <span className="font-bold text-stone-900 text-sm">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Live Package Summary & Savings Panel */}
          <div className="lg:col-span-5 sticky top-28 bg-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800">
            <div className="flex items-center justify-between pb-6 border-b border-stone-800">
              <div>
                <h3 className="text-xl font-bold text-white">Your Custom Package</h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {selectedServices.length} {selectedServices.length === 1 ? 'treatment' : 'treatments'} selected
                </p>
              </div>

              {discountRate > 0 && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 animate-pulse">
                  {discountRate * 100}% Bundle Applied
                </span>
              )}
            </div>

            {/* Selected Items Breakdown */}
            <div className="py-6 space-y-3 max-h-56 overflow-y-auto pr-1">
              {selectedServices.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium truncate max-w-[200px]">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-stone-400">{item.duration} mins</span>
                    <span className="font-semibold text-white">{formatPrice(item.price)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleService(item.id);
                      }}
                      className="text-stone-500 hover:text-red-400 ml-1 p-0.5"
                      title="Remove service"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-6 border-t border-stone-800 space-y-2.5 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Total Ritual Time:</span>
                <span className="text-white font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-salon-400" />
                  {totalDuration} mins (approx. {(totalDuration / 60).toFixed(1)} hrs)
                </span>
              </div>

              <div className="flex justify-between">
                <span>Standard Individual Total:</span>
                <span className="text-stone-300 line-through">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold text-sm">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Bundle Savings:
                  </span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              {/* Total Row */}
              <div className="pt-4 border-t border-stone-800 flex items-baseline justify-between">
                <span className="text-base font-bold text-white">Final Package Total:</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-amber-300 tracking-tight">
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tier Hint / Upsell */}
            {selectedIds.length === 2 && (
              <div className="mt-4 p-3 rounded-xl bg-salon-500/10 border border-salon-500/20 text-[11px] text-salon-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Tip: Add 1 more treatment to upgrade to the <strong className="text-white">20% VIP Tier discount!</strong>
                </span>
              </div>
            )}

            {/* Checkout Action */}
            <div className="mt-6 pt-2">
              <Link
                href="/services"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-salon-600 to-amber-600 hover:from-salon-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-salon-600/30 hover:scale-[1.02] transition-all"
              >
                Proceed to Book This Custom Bundle
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lock in discounted bundle pricing at time of appointment.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
