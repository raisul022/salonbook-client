'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock3,
  CreditCard,
  Ban,
  Check,
  Eye,
  X,
  Filter,
} from 'lucide-react';

export default function AdminManageAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/appointments/admin/all');
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

  // Admin confirm appointment (Only pending can be confirmed)
  const handleConfirm = async (id: string) => {
    try {
      setActionLoadingId(id);
      const res = await fetchApi(`/appointments/admin/${id}/confirm`, {
        method: 'PATCH',
      });
      if (res.success) {
        toast.success('Appointment confirmed! Customer can now proceed with payment.');
        loadAppointments();
        if (selectedApp?._id === id || selectedApp?.id === id) setSelectedApp(null);
      } else {
        toast.error(res.message || 'Could not confirm appointment.');
      }
    } catch (err) {
      toast.error('Error confirming appointment.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Admin cancel appointment (Pending or Confirmed)
  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      setActionLoadingId(id);
      const res = await fetchApi(`/appointments/admin/${id}/cancel`, {
        method: 'PATCH',
      });
      if (res.success) {
        toast.success('Appointment has been cancelled.');
        loadAppointments();
        if (selectedApp?._id === id || selectedApp?.id === id) setSelectedApp(null);
      } else {
        toast.error(res.message || 'Could not cancel appointment.');
      }
    } catch (err) {
      toast.error('Error cancelling appointment.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Manage Appointments
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review customer bookings, confirm upcoming slots, and manage salon schedule
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl self-start sm:self-auto text-xs">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">Loading appointment requests...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <CalendarCheck2 className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No Appointments in this tab</h3>
          <p className="text-xs text-stone-400">There are currently no bookings with status "{statusFilter}".</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold border-b border-stone-200/70">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Date & Slot</th>
                  <th className="py-4 px-6">Fee</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredAppointments.map((app) => {
                  const appId = app.id || app._id || '';
                  const isPending = app.status === 'pending';
                  const isConfirmed = app.status === 'confirmed';
                  const isCancelled = app.status === 'cancelled';
                  const isPaid = app.paymentStatus === 'paid';

                  return (
                    <tr key={appId} className="hover:bg-salon-50/20 transition-colors">
                      {/* Customer Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-salon-100 flex items-center justify-center font-bold text-salon-800 text-xs shrink-0">
                            {app.customerId?.image ? (
                              <img src={app.customerId.image} alt={app.customerId.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              app.customerId?.name?.charAt(0) || 'C'
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">{app.customerId?.name || 'Customer'}</span>
                            <span className="text-[11px] text-stone-400 block">{app.customerId?.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Service Info */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-stone-800 block line-clamp-1">{app.serviceId?.serviceName || 'Service'}</span>
                        <span className="text-[11px] text-stone-400">{app.serviceId?.category}</span>
                      </td>

                      {/* Date & Time Slot */}
                      <td className="py-4 px-6 text-stone-700">
                        <span className="font-semibold block">{app.appointmentDate}</span>
                        <span className="text-stone-400 text-xs">{app.timeSlot}</span>
                      </td>

                      {/* Fee */}
                      <td className="py-4 px-6 font-bold text-stone-900">
                        {formatPrice(app.servicePrice)}
                      </td>

                      {/* Appointment Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            isConfirmed
                              ? 'bg-green-100 text-green-800'
                              : isCancelled
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <CreditCard className="w-3 h-3" />
                          {app.paymentStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Modal */}
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Confirm (Only for pending) */}
                          {isPending && (
                            <button
                              onClick={() => handleConfirm(appId)}
                              disabled={actionLoadingId === appId}
                              className="px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                              title="Confirm Appointment"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Confirm
                            </button>
                          )}

                          {/* Cancel (For pending or confirmed) */}
                          {(isPending || isConfirmed) && (
                            <button
                              onClick={() => handleCancel(appId)}
                              disabled={actionLoadingId === appId}
                              className="px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition-colors flex items-center gap-1"
                              title="Cancel Appointment"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Cancel
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

      {/* Appointment Inspection Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Appointment Record</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Customer Information</span>
                <p className="font-bold text-stone-900 text-sm">{selectedApp.customerId?.name}</p>
                <p className="text-stone-500">Email: {selectedApp.customerId?.email}</p>
                <p className="text-stone-500">Phone: {selectedApp.customerId?.phone || 'Not provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 font-medium block">Service Name</span>
                  <span className="font-bold text-stone-800">{selectedApp.serviceId?.serviceName}</span>
                </div>
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
                  <span className="font-bold text-stone-900">{formatPrice(selectedApp.servicePrice)}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Booking Status</span>
                  <span className="font-bold capitalize text-salon-700">{selectedApp.status}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-medium block">Payment Status</span>
                  <span className="font-bold capitalize text-emerald-700">{selectedApp.paymentStatus}</span>
                </div>
              </div>

              {selectedApp.message && (
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                  <span className="font-semibold text-amber-800 block mb-0.5">Customer Message:</span>
                  <p className="text-stone-700 italic">"{selectedApp.message}"</p>
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
