'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Users, ShieldAlert, ShieldCheck, UserX, UserCheck, Eye, X } from 'lucide-react';

export default function AdminManageUsersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/users/customers');
      if (res.success && Array.isArray(res.data)) {
        setCustomers(res.data);
      }
    } catch (err) {
      toast.error('Failed to load registered customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Admin Block or Unblock Customer (Page 15 Requirement)
  const handleToggleBlock = async (id: string, currentStatus: boolean, name: string) => {
    const actionName = currentStatus ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${actionName} access for ${name}?`)) return;

    try {
      setActionLoadingId(id);
      const res = await fetchApi(`/users/customers/${id}/toggle-block`, {
        method: 'PATCH',
      });

      if (res.success) {
        toast.success(res.message || `Customer access updated.`);
        loadCustomers();
      } else {
        toast.error(res.message || 'Operation failed.');
      }
    } catch (err) {
      toast.error('Error toggling customer block status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Inspect User Details
  const handleViewUser = async (id: string) => {
    try {
      const res = await fetchApi(`/users/customers/${id}`);
      if (res.success && res.data) {
        setSelectedUser(res.data);
      }
    } catch (err) {
      toast.error('Error fetching customer record.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Manage Registered Customers
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Review customer accounts, monitor booking activity, and manage platform access permissions
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">Loading customers...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <Users className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No Customers Found</h3>
          <p className="text-xs text-stone-400">
            Registered customer accounts will appear here once guests create accounts.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold border-b border-stone-200/70">
                <tr>
                  <th className="py-4 px-6">Customer Profile</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6">Access Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => {
                  const cId = c.id || c._id;
                  const isBlocked = c.isBlocked;

                  return (
                    <tr key={cId} className="hover:bg-salon-50/20 transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-salon-100 flex items-center justify-center font-bold text-salon-800 text-sm shrink-0">
                            {c.image ? (
                              <img src={c.image} alt={c.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              c.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">{c.name}</span>
                            <span className="text-stone-400 text-xs block">{c.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-6 text-stone-600">
                        {c.phone || <span className="text-stone-300 italic">Not set</span>}
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-stone-600">
                        {formatDate(c.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            isBlocked
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {isBlocked ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                          )}
                          {isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewUser(cId)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                            title="View Customer Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Block / Unblock Button (Page 15 Requirement) */}
                          <button
                            onClick={() => handleToggleBlock(cId, isBlocked, c.name)}
                            disabled={actionLoadingId === cId}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs ${
                              isBlocked
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'border border-red-200 text-red-600 hover:bg-red-50'
                            }`}
                          >
                            {isBlocked ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                Block
                              </>
                            )}
                          </button>
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Customer Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-salon-100 flex items-center justify-center font-bold text-salon-800 text-xl overflow-hidden shrink-0">
                  {selectedUser.user?.image ? (
                    <img src={selectedUser.user.image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    selectedUser.user?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">{selectedUser.user?.name}</h4>
                  <p className="text-stone-500">{selectedUser.user?.email}</p>
                  <p className="text-stone-500">Phone: {selectedUser.user?.phone || 'Not set'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Lifetime Activity
                </span>
                <p className="font-semibold text-stone-800">
                  Total Appointment Bookings: {selectedUser.appointmentCount || 0}
                </p>
                <p className="text-stone-500">
                  Account Status:{' '}
                  <strong className={selectedUser.user?.isBlocked ? 'text-red-600' : 'text-green-600'}>
                    {selectedUser.user?.isBlocked ? 'Blocked' : 'Active'}
                  </strong>
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
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
