'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle2, ShieldCheck, Lock, ArrowUpRight } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        const res = await fetchApi('/payments/admin/transactions');
        if (res.success && Array.isArray(res.data)) {
          setTransactions(res.data);
        }
      } catch (err) {
        toast.error('Failed to load transaction ledger.');
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Financial Transactions
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Immutable transaction history verified directly through Stripe webhook webhooks
          </p>
        </div>

        {/* Security Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold self-start sm:self-auto border border-stone-200">
          <Lock className="w-3.5 h-3.5 text-stone-400" />
          <span>Manual ledger edits disabled by security policy</span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">Loading payment ledger...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <CreditCard className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No Transactions Recorded</h3>
          <p className="text-xs text-stone-400">
            Completed Stripe payments verified via webhook will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold border-b border-stone-200/70">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Related Service</th>
                  <th className="py-4 px-6">Appt Date</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Stripe Session Ref</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Date Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transactions.map((tx) => {
                  const txId = tx.id || tx._id;
                  const service = tx.appointmentId?.serviceId;
                  const shortenedRef = (tx.stripeSessionId || '').slice(0, 18) + '...';

                  return (
                    <tr key={txId} className="hover:bg-salon-50/20 transition-colors">
                      {/* Customer Info */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-stone-900 block">{tx.customerId?.name || 'Customer'}</span>
                        <span className="text-[11px] text-stone-400">{tx.customerId?.email}</span>
                      </td>

                      {/* Related Service */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-stone-800 block line-clamp-1">
                          {service?.serviceName || 'Salon Service'}
                        </span>
                        <span className="text-[11px] text-stone-400">{service?.category || 'Treatment'}</span>
                      </td>

                      {/* Appointment Date */}
                      <td className="py-4 px-6 text-stone-600">
                        {tx.appointmentId?.appointmentDate || 'N/A'}
                      </td>

                      {/* Payment Amount & Currency */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-stone-900 text-sm">
                          {formatPrice(tx.amount)}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold ml-1">
                          {tx.currency}
                        </span>
                      </td>

                      {/* Stripe Session ID */}
                      <td className="py-4 px-6">
                        <code className="px-2 py-1 rounded bg-stone-100 text-stone-600 text-[11px] font-mono">
                          {shortenedRef}
                        </code>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 capitalize">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {tx.status}
                        </span>
                      </td>

                      {/* Transaction Date */}
                      <td className="py-4 px-6 text-right text-stone-500 text-xs">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
