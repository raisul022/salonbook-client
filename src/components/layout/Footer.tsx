'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Logo & Short Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-salon-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Salon<span className="text-salon-500">Book</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Experience the pinnacle of personal care. SalonBook seamlessly connects you with
              premier stylists, luxury aesthetic treatments, and tranquil spa rituals with instant
              booking and verified payments.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-salon-600 hover:text-white flex items-center justify-center transition-colors text-stone-400"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-salon-600 hover:text-white flex items-center justify-center transition-colors text-stone-400"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-salon-600 hover:text-white flex items-center justify-center transition-colors text-stone-400"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-salon-600 hover:text-white flex items-center justify-center transition-colors text-stone-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Important Navigation Links */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-wide mb-4">
              Explore & Book
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-salon-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-salon-400 transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=Haircut+%26+Styling" className="hover:text-salon-400 transition-colors">
                  Haircut & Styling
                </Link>
              </li>
              <li>
                <Link href="/services?category=Facial+%26+Skincare" className="hover:text-salon-400 transition-colors">
                  Facial & Skincare
                </Link>
              </li>
              <li>
                <Link href="/services?category=Spa+%26+Massage" className="hover:text-salon-400 transition-colors">
                  Spa & Massage Rituals
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:text-salon-400 transition-colors">
                  Client Portal / Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Salon Address and Opening Hours */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-wide mb-4">
              Hours & Location
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-salon-500 mt-0.5 shrink-0" />
                <p className="text-stone-400 leading-relaxed">
                  Suite 400, Rosewood Luxury Avenue, Manhattan, NY 10022
                </p>
              </div>
              <div className="flex items-start gap-3 pt-2">
                <Clock className="w-4 h-4 text-salon-500 mt-0.5 shrink-0" />
                <div className="text-stone-400 space-y-1">
                  <p className="font-medium text-stone-200">Opening Hours:</p>
                  <p>Mon – Fri: 9:00 AM – 8:00 PM</p>
                  <p>Saturday: 10:00 AM – 7:00 PM</p>
                  <p>Sunday: 11:00 AM – 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Salon Contact Information */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-wide mb-4">
              Contact & Inquiries
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-stone-400 text-xs">
                Have questions or need a custom bridal party booking? Get in touch with our concierge team.
              </p>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-salon-500 shrink-0" />
                <a href="tel:+15554321098" className="hover:text-white transition-colors">
                  +1 (555) 432-1098
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-salon-500 shrink-0" />
                <a href="mailto:concierge@salonbook.com" className="hover:text-white transition-colors">
                  concierge@salonbook.com
                </a>
              </div>
              <div className="pt-3">
                <div className="inline-block px-3 py-1.5 rounded-lg bg-stone-800 text-xs font-medium text-salon-400 border border-stone-700">
                  ✨ Instant Online Confirmation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Information */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} SalonBook Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 cursor-pointer">Security Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
