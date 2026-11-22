'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, MoveHorizontal, CheckCircle2, Award, Scissors, ArrowRight } from 'lucide-react';

export default function TransformationGallery() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-salon-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-salon-500/20 border border-salon-500/30 text-salon-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-salon-400" />
            <span>Master Artistry in Action</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Interactive Transformation Gallery
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-400">
            Slide horizontally to experience the caliber of precision, scissor artistry, and bespoke
            refinement executed at SalonBook.
          </p>
        </div>

        {/* The Interactive Slider Component */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="relative h-[380px] sm:h-[500px] md:h-[560px] rounded-3xl overflow-hidden border-2 border-stone-800 shadow-2xl cursor-ew-resize select-none touch-none group"
          >
            {/* "After" Image (Full Width Base) */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=85"
                alt="After Master Cut & Sculpt"
                className="w-full h-full object-cover object-center pointer-events-none"
              />
              <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-stone-950/80 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AFTER: Royal Sculpt & Taper Fade</span>
              </div>
            </div>

            {/* "Before" Image (Clipped with polygon) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=85"
                alt="Before Styling Treatment"
                className="w-full h-full object-cover object-center pointer-events-none filter brightness-90"
              />
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-stone-950/80 backdrop-blur-md border border-white/20 text-stone-300 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg">
                <Scissors className="w-4 h-4 text-salon-400" />
                <span>BEFORE: Untamed Initial Growth</span>
              </div>
            </div>

            {/* Divider Handle Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-salon-400 via-amber-300 to-salon-500 shadow-[0_0_15px_rgba(212,115,85,0.8)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Circular Knob */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-stone-900 border-2 border-amber-300 shadow-xl flex items-center justify-center text-amber-300 pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                <MoveHorizontal className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Instruction Floating Hint */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-stone-950/70 backdrop-blur-md border border-white/10 text-stone-300 text-xs font-semibold flex items-center gap-2 pointer-events-none group-hover:opacity-0 transition-opacity">
              <MoveHorizontal className="w-3.5 h-3.5 text-salon-400" />
              <span>Drag handle left or right to compare</span>
            </div>
          </div>

          {/* Highlights & Metrics under Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-5 rounded-2xl bg-stone-800/60 border border-stone-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-salon-500/20 text-salon-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">100%</p>
                <p className="text-xs text-stone-400">Master Certified Barbers</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-800/60 border border-stone-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">1,400+</p>
                <p className="text-xs text-stone-400">Monthly Transformations</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-800/60 border border-stone-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-salon-400 font-semibold uppercase tracking-wider">
                  Ready to evolve?
                </p>
                <p className="text-base font-bold text-white mt-0.5">Book Your Session</p>
              </div>
              <Link
                href="/services"
                className="w-10 h-10 rounded-xl bg-salon-600 hover:bg-salon-500 text-white flex items-center justify-center shadow-md transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
