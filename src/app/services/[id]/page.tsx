'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Clock,
  Star,
  Sparkles,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  Send,
  Lock,
} from 'lucide-react';
import { ServiceItem } from '@/components/home/FeaturedServices';

const AVAILABLE_TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:30 PM - 04:30 PM',
  '05:00 PM - 06:00 PM',
  '06:30 PM - 07:30 PM',
];

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Booking Form State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protected route check (Page 6 & Page 9 Requirement: redirect to Sign In if unauthenticated)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast('Please sign in to view service details and book an appointment.', { icon: '🔒' });
      router.push(`/auth/signin?redirect=/services/${id}`);
    }
  }, [authLoading, isAuthenticated, router, id]);

  // Fetch Service Details
  useEffect(() => {
    async function loadService() {
      if (!id) return;
      try {
        setLoading(true);
        setErrorMsg(null);
        const res = await fetchApi(`/services/${id}`);
        if (res.success && res.data) {
          setService(res.data);
        } else {
          setErrorMsg(res.message || 'Service not found. The service ID may be invalid or removed.');
        }
      } catch (err: any) {
        setErrorMsg('Failed to load service details. Please check connection.');
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadService();
    }
  }, [id, isAuthenticated]);

  // Handle Booking Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('You must be signed in as a customer to book.');
      router.push('/auth/signin');
      return;
    }

    if (isAdmin) {
      toast.error('Administrators cannot submit customer bookings.');
      return;
    }

    if (!appointmentDate || !selectedSlot) {
      toast.error('Please select both an appointment date and a time slot.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetchApi('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: id,
          appointmentDate,
          timeSlot: selectedSlot,
          message,
        }),
      });

      if (res.success) {
        toast.success('Appointment request submitted! Awaiting salon confirmation.');
        setIsBookingModalOpen(false);
        router.push('/dashboard/customer/appointments');
      } else {
        toast.error(res.message || 'Booking conflict or submission error.');
      }
    } catch (err: any) {
      toast.error('Error submitting appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date formatted as minimum selectable date
  const todayString = new Date().toISOString().split('T')[0];

  if (authLoading || (loading && !errorMsg)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-salon-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-stone-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Invalid Service ID error state (Page 9 Requirement)
  if (errorMsg || !service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">Invalid Service</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            {errorMsg || 'We could not find the salon service you were looking for.'}
          </p>
          <div className="pt-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-salon-600 text-white text-sm font-semibold hover:bg-salon-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to All Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isInactive = service.status === 'inactive';

  return (
    <div className="py-12 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-salon-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse Services
          </Link>
        </div>

        {/* Inactive service notification */}
        {isInactive && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <span>
              This service is currently marked as <strong>Inactive</strong>. It is not currently available for online appointment booking.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 relative min-h-[420px] lg:min-h-full bg-stone-100">
            <img
              src={service.image}
              alt={service.serviceName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-5 left-5">
              <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-stone-900 text-xs font-bold shadow-md">
                {service.category}
              </span>
            </div>
            <div className="absolute bottom-5 left-5">
              <span className="px-4 py-2 rounded-2xl bg-stone-950/90 text-white text-lg font-bold shadow-xl backdrop-blur-md">
                {formatPrice(service.price)}
              </span>
            </div>
          </div>

          {/* Right Column: Service Info & Action Panel */}
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Rating & Duration */}
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-50 text-salon-800 font-medium">
                  <Clock className="w-3.5 h-3.5 text-salon-600" />
                  Estimated: {service.duration} minutes
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {service.rating || 4.9} ({service.reviewsCount || 28} verified reviews)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
                {service.serviceName}
              </h1>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Treatment Overview
                </h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Luxury Guarantee Checklist */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-salon-600 shrink-0" />
                  <span>Dedicated one-on-one session with a verified specialist</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-salon-600 shrink-0" />
                  <span>Medical-grade sterilisation & organic botanical care</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Protected Stripe digital payment after salon confirmation</span>
                </div>
              </div>
            </div>

            {/* Action / Booking Trigger */}
            <div className="pt-6 border-t border-stone-100 space-y-3">
              {isAdmin ? (
                <div className="p-3.5 rounded-xl bg-stone-100 text-stone-600 text-xs text-center font-medium">
                  <Lock className="w-4 h-4 inline mr-1 text-stone-400" />
                  You are logged in as Administrator. Customer appointment requests can only be placed with a customer account.
                </div>
              ) : isInactive ? (
                <button
                  disabled
                  className="w-full py-4 rounded-2xl bg-stone-200 text-stone-400 font-semibold text-sm cursor-not-allowed"
                >
                  Service Temporarily Inactive
                </button>
              ) : (
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-salon-600 to-amber-600 hover:from-salon-500 hover:to-amber-500 text-white font-semibold text-base shadow-xl shadow-salon-600/25 hover:shadow-salon-600/40 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Request Appointment
                </button>
              )}

              <p className="text-center text-[11px] text-stone-400">
                ⚡ No immediate payment required. You will receive a confirmation before payment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Booking Modal (Page 16 Requirement) */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-xl font-bold text-stone-900">Book Appointment</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {service.serviceName} • {formatPrice(service.price)}
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Appointment Date */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Select Date *
                </label>
                <input
                  type="date"
                  required
                  min={todayString}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
                />
              </div>

              {/* Available Time Slot (Simple predefined list of time slots) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Available Time Slot *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                          isSelected
                            ? 'bg-salon-600 text-white border-salon-600 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Message (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Additional Note / Preferences (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell your stylist about hair length, skin sensitivity, or styling preferences..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all resize-none"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !appointmentDate || !selectedSlot}
                  className="px-6 py-2.5 rounded-xl bg-salon-600 hover:bg-salon-700 text-white text-sm font-semibold shadow-md shadow-salon-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSubmitting ? 'Confirming...' : 'Submit Request'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
