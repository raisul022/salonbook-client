'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Menu, X, User as UserIcon, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dashboardHref = isAdmin ? '/dashboard/admin' : '/dashboard/customer';

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-salon-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-salon-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-salon-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-stone-900 group-hover:text-salon-600 transition-colors">
                  Salon<span className="text-salon-600">Book</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-semibold text-stone-600 -mt-1">
                  Luxury & Aesthetics
                </span>
              </div>
            </Link>

            {/* Live Studio Status Pill */}
            <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Open Today: 09:00 AM - 09:00 PM</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-salon-600 ${
                pathname === '/' ? 'text-salon-600 font-semibold' : 'text-stone-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-salon-600 ${
                pathname.startsWith('/services') ? 'text-salon-600 font-semibold' : 'text-stone-600'
              }`}
            >
              Browse Services
            </Link>

            {isAuthenticated && (
              <Link
                href={dashboardHref}
                className={`text-sm font-medium transition-colors hover:text-salon-600 ${
                  pathname.startsWith('/dashboard') ? 'text-salon-600 font-semibold' : 'text-stone-600'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pl-3 pr-2 rounded-full border border-stone-200 hover:border-salon-300 bg-stone-50 hover:bg-salon-50/50 transition-all focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-salon-200 flex items-center justify-center text-salon-800 font-semibold text-sm">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-stone-800 max-w-[100px] truncate leading-tight">
                      {user.name}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-salon-600 tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-600" />
                </button>

                {/* Profile Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-600 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-salon-50 hover:text-salon-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-salon-500" />
                      Dashboard
                    </Link>

                    <Link
                      href={`${dashboardHref}/profile`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-salon-50 hover:text-salon-700 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-salon-500" />
                      My Profile
                    </Link>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-salon-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-salon-600 hover:bg-salon-700 rounded-full shadow-md shadow-salon-600/20 hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-100 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-700 hover:bg-salon-50 rounded-xl"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-700 hover:bg-salon-50 rounded-xl"
          >
            Browse Services
          </Link>

          {isAuthenticated && (
            <Link
              href={dashboardHref}
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-salon-600 hover:bg-salon-50 rounded-xl"
            >
              Dashboard ({user?.role})
            </Link>
          )}

          <div className="pt-4 border-t border-stone-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl"
              >
                Logout ({user?.name})
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-stone-700 border border-stone-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-salon-600 rounded-xl shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
