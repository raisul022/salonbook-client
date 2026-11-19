'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, CalendarCheck2, ShieldCheck } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white min-h-[85vh] flex items-center">
      {/* Salon-Themed High-Res Background Image with Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury Salon Interior"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/40 to-stone-950"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-salon-500/10 border border-salon-500/30 text-salon-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-salon-400" />
            <span>Elevate Your Elegance</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Impeccable Styling &{' '}
            <span className="bg-gradient-to-r from-salon-400 via-amber-300 to-salon-300 bg-clip-text text-transparent">
              Luxury Salon Rituals
            </span>
          </h1>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Welcome to SalonBook, where master artisans of aesthetics, precision cuts, and rejuvenating
            spa therapies await. Explore curated salon treatments and book your personal session seamlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-salon-600 to-amber-600 hover:from-salon-500 hover:to-amber-500 text-white font-semibold text-base shadow-xl shadow-salon-600/30 hover:shadow-salon-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Explore Salon Services
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/20 backdrop-blur-md transition-all"
            >
              Join as Client
            </Link>
          </div>

          {/* Social Proof / Trust Highlights */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
            <div>
              <div className="flex items-center gap-1 text-amber-400 text-lg font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>4.9 / 5</span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">Over 2,400 Reviews</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-white text-lg font-bold">
                <CalendarCheck2 className="w-4 h-4 text-salon-400" />
                <span>Instant</span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">Real-time Booking</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-white text-lg font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100%</span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">Verified Stylists</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
