'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  CalendarCheck2,
  Clock3,
  CheckCircle2,
  XCircle,
  CreditCard,
  Ban,
  Eye,
  X,
  AlertTriangle,
  FileDown,
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface AppointmentData {
  id: string;
  _id?: string;
  serviceId: {
    _id?: string;
    id?: string;
    serviceName: string;
    category: string;
    image: string;
    duration: number;
    price: number;
  };
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  paymentStatus: 'unpaid' | 'paid';
  status: 'pending' | 'confirmed' | 'cancelled';
  stripeSessionId?: string;
  createdAt: string;
}

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<AppointmentData | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/appointments/my');
      if (res.success && Array.isArray(res.data)) {
        setAppointments(res.data);
      }
    } catch (err) {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Customer can cancel only pending appointment requests (Page 12 Requirement)
  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this pending appointment?')) return;

    try {
      setCancellingId(id);
      const res = await fetchApi(`/appointments/${id}/cancel`, {
        method: 'PATCH',
      });

      if (res.success) {
        toast.success('Appointment cancelled successfully.');
        loadAppointments();
        if (selectedApp?.id === id || selectedApp?._id === id) {
          setSelectedApp(null);
        }
      } else {
        toast.error(res.message || 'Could not cancel appointment.');
      }
    } catch (err) {
      toast.error('Network error while cancelling appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  // Pay for Confirmed Appointment via Stripe Checkout (Page 17 Requirement)
  const handlePayNow = async (appointmentId: string) => {
    try {
      setPayingId(appointmentId);
      toast.loading('Initializing secure Stripe checkout...', { id: 'stripe-toast' });

      const res = await fetchApi('/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ appointmentId }),
      });

      if (res.success && res.url) {
        toast.dismiss('stripe-toast');
        window.location.href = res.url;
      } else {
        toast.error(res.message || 'Failed to start Stripe checkout session.', { id: 'stripe-toast' });
      }
    } catch (err) {
      toast.error('Payment initialization error.', { id: 'stripe-toast' });
    } finally {
      setPayingId(null);
    }
  };

  // Extra CV Feature: Download Branded PDF Receipt for Paid Appointments
  const handleDownloadReceipt = (app: AppointmentData) => {
    try {
      const doc = new jsPDF();
      const appRef = (app.id || app._id || '').slice(-8).toUpperCase();

      // Header
      doc.setFillColor(212, 115, 85); // Salon rose-gold
      doc.rect(0, 0, 210, 36, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('SalonBook Luxury Aesthetics', 14, 20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Appointment & Payment Receipt', 14, 28);

      // Receipt Metadata
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.text(`Receipt Reference: #REC-${appRef}`, 14, 48);
      doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 14, 55);
      doc.text(`Client Name: ${user?.name || 'Valued Guest'}`, 14, 62);
      doc.text(`Client Email: ${user?.email || 'N/A'}`, 14, 69);

      // Status Badges
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Status: PAID (VERIFIED VIA STRIPE)', 14, 80);

      // Service Table
      (doc as any).autoTable({
        startY: 88,
        head: [['Service Description', 'Category', 'Appointment Schedule', 'Amount']],
        body: [
          [
            app.serviceId?.serviceName || 'Salon Service',
            app.serviceId?.category || 'Beauty Care',
            `${app.appointmentDate} at ${app.timeSlot}`,
            `$${app.servicePrice.toFixed(2)} USD`,
          ],
        ],
        theme: 'striped',
        headStyles: { fillColor: [52, 21, 13] },
      });

      // Footer
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(9);
      doc.setTextColor(130, 130, 130);
      doc.text('Thank you for choosing SalonBook. We look forward to pampering you.', 14, finalY);
      doc.text('Suite 400, Rosewood Luxury Avenue, Manhattan, NY • concierge@salonbook.com', 14, finalY + 6);

      doc.save(`SalonBook_Receipt_${appRef}.pdf`);
      toast.success('Official PDF receipt downloaded!');
    } catch (err) {
      toast.error('Could not generate PDF receipt.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review status, make payments for confirmed slots, and track booking history
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-salon-600 hover:bg-salon-700 text-white text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          Book Another Service
        </Link>
      </div>

      {/* Appointments List / Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">Loading your appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-salon-50 text-salon-600 flex items-center justify-center mx-auto">
            <CalendarCheck2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-stone-900">No Appointments Found</h3>
          <p className="text-stone-500 text-sm max-w-sm mx-auto">
            You have not booked any salon services yet. Browse our luxury treatments and reserve your chair.
          </p>
          <Link
            href="/services"
            className="inline-block px-6 py-2.5 rounded-full bg-salon-600 text-white text-xs font-semibold"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold border-b border-stone-200/70">
                <tr>
                  <th className="py-4 px-6">Service Details</th>
                  <th className="py-4 px-6">Date & Slot</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Booking Status</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {appointments.map((app) => {
                  const appId = app.id || app._id || '';
                  const isPending = app.status === 'pending';
                  const isConfirmed = app.status === 'confirmed';
                  const isCancelled = app.status === 'cancelled';
                  const isPaid = app.paymentStatus === 'paid';
                  const canPay = isConfirmed && !isPaid;

                  return (
                    <tr key={appId} className="hover:bg-salon-50/30 transition-colors">
                      {/* Service Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                            <img
                              src={app.serviceId?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80'}
                              alt={app.serviceId?.serviceName || 'Service'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block line-clamp-1">
                              {app.serviceId?.serviceName || 'Salon Service'}
                            </span>
                            <span className="text-[11px] text-stone-400 block">
                              {app.serviceId?.category || 'Aesthetics'} • Requested on {formatDate(app.createdAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-6 text-stone-700">
                        <span className="font-semibold block">{app.appointmentDate}</span>
                        <span className="text-stone-400 text-xs">{app.timeSlot}</span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-bold text-stone-900">
                        {formatPrice(app.servicePrice)}
                      </td>

                      {/* Appointment Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            isConfirmed
                              ? 'bg-green-100 text-green-800'
                              : isCancelled
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isConfirmed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isCancelled ? (
                            <XCircle className="w-3.5 h-3.5" />
                          ) : (
                            <Clock3 className="w-3.5 h-3.5" />
                          )}
                          {app.status}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {app.paymentStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                            title="View Booking Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Pay Now Button (Only for Confirmed + Unpaid) */}
                          {canPay && (
                            <button
                              onClick={() => handlePayNow(appId)}
                              disabled={payingId === appId}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              {payingId === appId ? 'Connecting...' : 'Pay Now'}
                            </button>
                          )}

                          {/* Cancel Pending Appointment Request */}
                          {isPending && (
                            <button
                              onClick={() => handleCancelAppointment(appId)}
                              disabled={cancellingId === appId}
                              className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition-colors flex items-center gap-1"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          )}

                          {/* Download PDF Receipt (Extra Feature for Paid) */}
                          {isPaid && (
                            <button
                              onClick={() => handleDownloadReceipt(app)}
                              className="p-1.5 rounded-lg text-salon-600 hover:bg-salon-50 transition-colors"
                              title="Download PDF Receipt"
                            >
                              <FileDown className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Appointment Overview</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center gap-4">
                <img
                  src={selectedApp.serviceId?.image}
                  alt={selectedApp.serviceId?.serviceName}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-bold text-stone-900 text-base">
                    {selectedApp.serviceId?.serviceName}
                  </h4>
                  <p className="text-stone-500">
                    Category: {selectedApp.serviceId?.category} • Duration:{' '}
                    {selectedApp.serviceId?.duration} mins
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 font-medium block">Appointment Date</span>
                  <span className="font-bold text-stone-800">{selectedApp.appointmentDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Time Slot</span>
                  <span className="font-bold text-stone-800">{selectedApp.timeSlot}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Service Fee</span>
                  <span className="font-bold text-stone-900">
                    {formatPrice(selectedApp.servicePrice)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Requested On</span>
                  <span className="font-bold text-stone-800">
                    {formatDate(selectedApp.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Status</span>
                  <span className="font-bold capitalize text-salon-700">{selectedApp.status}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Payment</span>
                  <span className="font-bold capitalize text-emerald-700">
                    {selectedApp.paymentStatus}
                  </span>
                </div>
              </div>

              {selectedApp.message && (
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                    Your Message
                  </span>
                  <p className="p-3 rounded-xl bg-stone-50 text-stone-700 italic text-xs">
                    "{selectedApp.message}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
