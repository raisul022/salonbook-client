'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;

      setScrollProgress(Number(scroll));
      setIsVisible(totalScroll > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  const strokeDashoffset = 100 - scrollProgress * 100;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={scrollToTop}
        className="relative group w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xl shadow-stone-900/30 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Scroll to top"
      >
        {/* SVG Circular Progress Ring */}
        <svg className="absolute w-12 h-12 -rotate-90 pointer-events-none" viewBox="0 0 36 36">
          <path
            className="text-stone-700"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-salon-500 transition-all duration-150"
            strokeDasharray="100, 100"
            style={{ strokeDashoffset: `${strokeDashoffset}` }}
            strokeWidth="2.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        <ArrowUp className="w-5 h-5 text-salon-300 group-hover:text-white group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}
