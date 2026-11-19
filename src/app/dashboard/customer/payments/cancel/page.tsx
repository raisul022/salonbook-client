'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw, CalendarCheck2 } from 'lucide-react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment_id');

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-10 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
            Payment Incomplete
          </span>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-3">
            Checkout Was Not Completed
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            No funds were charged. Your confirmed appointment remains reserved in your account, and you can retry payment whenever you are ready.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/dashboard/customer/appointments"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-salon-600 hover:bg-salon-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Return to Appointments to Pay
          </Link>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-stone-400">Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
