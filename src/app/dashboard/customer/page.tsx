'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import {
  CalendarCheck2,
  Clock3,
  CheckCircle2,
  XCircle,
  CreditCard,
  Sparkles,
  ArrowRight,
  User,
  Calendar,
} from 'lucide-react';

interface CustomerStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  paidAppointments: number;
}

export default function CustomerDashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CustomerStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    paidAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchApi('/stats/customer');
        if (res.success && res.stats) {
          setStats(res.stats);
          if (res.recentAppointments) setRecentAppointments(res.recentAppointments);
        }
      } catch (err) {
        console.error('Error loading customer stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white relative overflow-hidden shadow-lg border border-stone-800">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-500/20 text-salon-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-salon-400" />
            Guest Sanctuary
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Valued Guest'}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            Monitor your salon appointments, review confirmed schedules, and complete secure digital payments for your upcoming treatments.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-salon-600 hover:bg-salon-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Book New Service
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/customer/appointments"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              My Appointments
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid (Page 12 Requirement: Total, Pending, Confirmed, Cancelled) */}
      <div>
        <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">
          Appointment Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Appointments */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500">Total Bookings</span>
              <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-stone-900 mt-4">
              {loading ? '...' : stats.totalAppointments}
            </p>
            <span className="text-[11px] text-stone-400 mt-1 block">Lifetime salon requests</span>
          </div>

          {/* Pending Appointments */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700">Pending Review</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock3 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-amber-700 mt-4">
              {loading ? '...' : stats.pendingAppointments}
            </p>
            <span className="text-[11px] text-stone-400 mt-1 block">Awaiting salon confirmation</span>
          </div>

          {/* Confirmed Appointments */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-green-700">Confirmed Slots</span>
              <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-green-700 mt-4">
              {loading ? '...' : stats.confirmedAppointments}
            </p>
            <span className="text-[11px] text-stone-400 mt-1 block">Ready for payment / service</span>
          </div>

          {/* Cancelled Appointments */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-red-600">Cancelled</span>
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-red-600 mt-4">
              {loading ? '...' : stats.cancelledAppointments}
            </p>
            <span className="text-[11px] text-stone-400 mt-1 block">Declined or revoked</span>
          </div>
        </div>
      </div>

      {/* Recent Appointments Feed */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Recent Appointments</h3>
            <p className="text-xs text-stone-500">Your latest salon activity and schedule status</p>
          </div>
          <Link
            href="/dashboard/customer/appointments"
            className="text-xs font-semibold text-salon-600 hover:text-salon-700 flex items-center gap-1"
          >
            View All Bookings
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-xs text-stone-400">Loading activity...</div>
        ) : recentAppointments.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-700">No appointments scheduled yet</p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Ready to indulge? Explore our menu and schedule your personalized treatment with ease.
            </p>
            <Link
              href="/services"
              className="inline-block px-5 py-2 rounded-full bg-salon-600 text-white text-xs font-semibold shadow-xs"
            >
              Browse Salon Menu
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentAppointments.map((app) => (
              <div
                key={app.id || app._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    <img
                      src={app.serviceId?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80'}
                      alt={app.serviceId?.serviceName || 'Service'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      {app.serviceId?.serviceName || 'Salon Service'}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {app.appointmentDate} • {app.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-sm font-bold text-stone-900">
                    {formatPrice(app.servicePrice)}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      app.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : app.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {app.status}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      app.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {app.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
