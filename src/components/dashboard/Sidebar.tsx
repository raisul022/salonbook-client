'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck2,
  User,
  Scissors,
  Users,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const customerLinks = [
    { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { label: 'My Appointments', href: '/dashboard/customer/appointments', icon: CalendarCheck2 },
    { label: 'My Profile', href: '/dashboard/customer/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Services', href: '/dashboard/admin/services', icon: Scissors },
    { label: 'Manage Appointments', href: '/dashboard/admin/appointments', icon: CalendarCheck2 },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Transactions', href: '/dashboard/admin/transactions', icon: CreditCard },
    { label: 'My Profile', href: '/dashboard/admin/profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <aside className="w-64 bg-white border-r border-stone-200/80 min-h-screen flex flex-col justify-between p-4 shrink-0 shadow-xs">
      <div>
        {/* User Card at top */}
        <div className="p-4 mb-6 rounded-2xl bg-salon-50/70 border border-salon-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-salon-200 flex items-center justify-center font-bold text-salon-800 text-sm shrink-0">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-stone-900 truncate leading-tight">
              {user?.name || 'Guest User'}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-salon-700">
                {user?.role} Portal
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2">
            Navigation Menu
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-salon-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:bg-salon-50 hover:text-salon-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-stone-100 space-y-2">
        <Link
          href="/services"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-500 hover:text-salon-600 hover:bg-stone-50 rounded-xl transition-colors"
        >
          <Sparkles className="w-4 h-4 text-salon-500" />
          Public Salon Menu
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
