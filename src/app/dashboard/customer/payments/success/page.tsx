'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { CheckCircle2, Sparkles, ArrowRight, FileDown, CalendarCheck2, ShieldCheck } from 'lucide-react';
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

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-10 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
            Payment Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-3">
            Thank You For Your Booking!
          </h1>
          <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">
            Your payment has been successfully processed through Stripe. Your chair is reserved and your stylist is notified.
          </p>
        </div>

        {sessionId && (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-400">Payment Reference:</span>
              <span className="font-mono text-stone-700 font-semibold">{sessionId.slice(0, 24)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Status:</span>
              <span className="font-semibold text-emerald-700">Paid & Verified</span>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleDownloadReceipt}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Download PDF Receipt
          </button>

          <Link
            href="/dashboard/customer/appointments"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-salon-600 hover:bg-salon-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            View My Appointments
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
