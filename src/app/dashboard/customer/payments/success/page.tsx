'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { exportAppointmentToIcs } from '@/lib/calendarExport';
import toast from 'react-hot-toast';
import { CheckCircle2, Sparkles, ArrowRight, FileDown, Calendar, CalendarCheck2, ShieldCheck, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    async function verifySession() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetchApi(`/payments/verify-session?sessionId=${sessionId}`);
        if (res.success) {
          setPaymentData(res);
          toast.success('Stripe payment verified!');
        }
      } catch (err) {
        console.error('Session verify error:', err);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [sessionId]);

  const handleDownloadReceipt = () => {
    try {
      const doc = new jsPDF();
      const app = paymentData?.appointment;
      const tx = paymentData?.transaction;
      const ref = (sessionId || 'TXN').slice(-8).toUpperCase();

      doc.setFillColor(212, 115, 85);
      doc.rect(0, 0, 210, 36, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('SalonBook Luxury Aesthetics', 14, 20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Payment & Reservation Receipt', 14, 28);

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.text(`Receipt Reference: #REC-${ref}`, 14, 48);
      doc.text(`Transaction Date: ${new Date().toLocaleDateString()}`, 14, 55);
      doc.text(`Payment Gateway: Stripe Checkout Verified`, 14, 62);
      doc.text(`Stripe Session ID: ${sessionId || 'N/A'}`, 14, 69);

      (doc as any).autoTable({
        startY: 78,
        head: [['Service Name', 'Schedule Date', 'Time Slot', 'Amount Paid']],
        body: [
          [
            app?.serviceId?.serviceName || 'Salon Service',
            app?.appointmentDate || 'Confirmed',
            app?.timeSlot || 'Scheduled',
            `$${(tx?.amount || app?.servicePrice || 0).toFixed(2)} USD`,
          ],
        ],
        theme: 'striped',
        headStyles: { fillColor: [52, 21, 13] },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(9);
      doc.setTextColor(130, 130, 130);
      doc.text('We look forward to welcoming you for your appointment.', 14, finalY);

      doc.save(`SalonBook_Receipt_${ref}.pdf`);
      toast.success('PDF Receipt downloaded!');
    } catch {
      toast.error('Could not generate receipt PDF.');
    }
  };

  const handleAddToCalendar = () => {
    const app = paymentData?.appointment;
    exportAppointmentToIcs({
      title: `${app?.serviceId?.serviceName || 'Luxury Salon Appointment'} - SalonBook`,
      description: `Appointment confirmed with SalonBook Luxury Studio. Total paid: $${app?.servicePrice || 0}.`,
      dateStr: app?.appointmentDate || new Date().toISOString().split('T')[0],
      timeStr: app?.timeSlot || '10:00 AM',
      durationMinutes: app?.serviceId?.duration || 60,
    });
    toast.success('Calendar event (.ics) generated!');
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 relative">
      {/* CSS Confetti Celebration Animation Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(24)].map((_, i) => (
          <span
            key={i}
            className="absolute block w-2.5 h-2.5 rounded-full animate-bounce"
            style={{
              top: `${(i * 17) % 90}%`,
              left: `${(i * 23) % 96}%`,
              backgroundColor: ['#D47355', '#CA8A04', '#10B981', '#6366F1', '#EC4899'][i % 5],
              animationDuration: `${1.5 + (i % 3) * 0.5}s`,
              animationDelay: `${(i % 5) * 0.2}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md border-2 border-emerald-200">
          <CheckCircle2 className="w-10 h-10 animate-pulse" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
            Payment & Slot Confirmed 🎉
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-4">
            Reservation Successfully Placed!
          </h1>
          <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
            Your appointment has been secured in our schedule. A receipt and calendar reminder are
            ready for you below.
          </p>
        </div>

        {/* Appointment Details Box */}
        {paymentData?.appointment && (
          <div className="p-5 rounded-2xl bg-salon-50/60 border border-salon-200/70 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-salon-800 uppercase tracking-wider">
                Confirmed Treatment
              </span>
              <span className="text-sm font-bold text-stone-900">
                {formatPrice(paymentData.appointment.servicePrice)}
              </span>
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {paymentData.appointment.serviceId?.serviceName || 'Bespoke Salon Service'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pt-2 border-t border-salon-200/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-salon-600" />
                <span>{paymentData.appointment.appointmentDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-salon-600" />
                <span>{paymentData.appointment.timeSlot}</span>
              </div>
            </div>
          </div>
        )}

        {sessionId && (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-400">Payment Reference:</span>
              <span className="font-mono text-stone-700 font-semibold">{sessionId.slice(0, 24)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Gateway Status:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Stripe Verified
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleAddToCalendar}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-sm transition-colors"
          >
            <CalendarCheck2 className="w-4 h-4" />
            Add to Calendar (.ics)
          </button>

          <button
            onClick={handleDownloadReceipt}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Download PDF
          </button>

          <Link
            href="/dashboard/customer/appointments"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-salon-600 hover:bg-salon-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            My Appointments
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-stone-400">Verifying payment...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
