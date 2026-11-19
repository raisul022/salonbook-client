'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import toast from 'react-hot-toast';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error('Authentication required. Redirecting to Sign In.');
        router.push(`/auth/signin?redirect=${pathname}`);
        return;
      }

      // Role authorization enforcement (Page 11 Requirement)
      if (pathname.startsWith('/dashboard/admin') && !isAdmin) {
        toast.error('Access restricted to administrators only.');
        router.push('/dashboard/customer');
        return;
      }

      if (pathname.startsWith('/dashboard/customer') && isAdmin) {
        toast.error('Admins use the administrative portal.');
        router.push('/dashboard/admin');
        return;
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-salon-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Loading Dashboard Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Blocked user enforcement (Page 11 & 15 Requirement)
  if (user.isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-stone-100">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-red-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">Account Access Suspended</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Your SalonBook account has been blocked by system administrators. You cannot access dashboard features or book appointments.
          </p>
          <div className="pt-2">
            <a
              href="mailto:support@salonbook.com"
              className="inline-block px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
            >
              Contact Salon Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50/60">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
