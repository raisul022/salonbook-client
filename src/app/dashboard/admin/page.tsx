'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import {
  Users,
  Scissors,
  CalendarCheck2,
  Clock3,
  CheckCircle2,
  CreditCard,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface AdminStats {
  totalCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  successfulPaymentsCount: number;
  totalRevenue: number;
}

export default function AdminDashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalCustomers: 0,
    totalActiveServices: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    successfulPaymentsCount: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetchApi('/stats/admin');
        if (res.success && res.stats) {
          setStats(res.stats);
          if (res.recentAppointments) setRecentAppointments(res.recentAppointments);
          if (res.categoryStats) setCategoryStats(res.categoryStats);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome & System Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-100 text-salon-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-salon-600" />
            Salon Management Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time analytics, appointment requests, service inventory, and Stripe revenue metrics
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/dashboard/admin/services"
            className="px-4 py-2 rounded-xl bg-salon-600 hover:bg-salon-700 text-white font-semibold text-xs shadow-xs"
          >
            + Add New Service
          </Link>
          <Link
            href="/dashboard/admin/appointments"
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-xs"
          >
            Manage Bookings
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards (Page 13 Requirements: Customers, Services, Requests, Pending, Confirmed, Payments) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Customers */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Customers</span>
            <Users className="w-4 h-4 text-salon-500" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900">
            {loading ? '...' : stats.totalCustomers}
          </p>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Registered accounts</span>
        </div>

        {/* Active Services */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Active Services</span>
            <Scissors className="w-4 h-4 text-salon-500" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900">
            {loading ? '...' : stats.totalActiveServices}
          </p>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Visible in catalog</span>
        </div>

        {/* Total Appointments */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Total Requests</span>
            <CalendarCheck2 className="w-4 h-4 text-salon-500" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900">
            {loading ? '...' : stats.totalAppointments}
          </p>
          <span className="text-[10px] text-stone-400 mt-0.5 block">All-time bookings</span>
        </div>

        {/* Pending Appointments */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold">Pending Review</span>
            <Clock3 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700">
            {loading ? '...' : stats.pendingAppointments}
          </p>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Needs confirmation</span>
        </div>

        {/* Confirmed Appointments */}
        <div className="p-5 rounded-2xl bg-white border border-green-200 bg-green-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-green-700 mb-2">
            <span className="text-xs font-semibold">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-extrabold text-green-700">
            {loading ? '...' : stats.confirmedAppointments}
          </p>
          <span className="text-[10px] text-stone-400 mt-0.5 block">Ready for service</span>
        </div>

        {/* Total Successful Payments & Revenue */}
        <div className="p-5 rounded-2xl bg-stone-900 text-white shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold">Stripe Revenue</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {loading ? '...' : formatPrice(stats.totalRevenue)}
          </p>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">
            {stats.successfulPaymentsCount} paid transactions
          </span>
        </div>
      </div>

      {/* Recent Appointments & Category Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Appointment Requests Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Recent Booking Requests</h3>
              <p className="text-xs text-stone-500">Live requests submitted by customers</p>
            </div>
            <Link
              href="/dashboard/admin/appointments"
              className="text-xs font-semibold text-salon-600 hover:text-salon-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-stone-400">Loading requests...</div>
          ) : recentAppointments.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400">No booking requests found.</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {recentAppointments.map((app) => (
                <div
                  key={app.id || app._id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={app.serviceId?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80'}
                        alt={app.serviceId?.serviceName || 'Service'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                        {app.serviceId?.serviceName || 'Service'}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Customer: <strong className="text-stone-700">{app.customerId?.name}</strong> •{' '}
                        {app.appointmentDate} ({app.timeSlot})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        app.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                    <span className="text-xs font-bold text-stone-800">
                      {formatPrice(app.servicePrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Performance Breakdown (Extra CV Analytics Feature) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">Revenue by Category</h3>
            <p className="text-xs text-stone-500">Paid appointments distribution</p>
          </div>

          {categoryStats.length === 0 ? (
            <div className="py-10 text-center text-xs text-stone-400">
              No paid category analytics yet.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">{cat._id}</span>
                    <span className="font-bold text-stone-900">{formatPrice(cat.totalRevenue)}</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-salon-600 h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (cat.totalRevenue / (stats.totalRevenue || 1)) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-stone-400">{cat.count} paid sessions</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
