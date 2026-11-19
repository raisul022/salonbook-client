'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ui/ImageUploader';
import { User, Mail, Phone, ShieldCheck, Check } from 'lucide-react';

export default function AdminProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetchApi('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          image,
          phone: phone.trim(),
        }),
      });

      if (res.success && res.user) {
        updateUser(res.user);
        toast.success('Administrator profile updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      toast.error('Network error during profile update.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Admin Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Manage administrative identity and contact information
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-2xs space-y-8">
        <div className="flex items-center gap-5 pb-6 border-b border-stone-100">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-salon-100 border-2 border-salon-200 flex items-center justify-center font-bold text-salon-800 text-2xl shrink-0 shadow-xs">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase() || 'A'
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">{name || 'Administrator'}</h2>
            <p className="text-xs text-stone-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-salon-600 text-white text-[10px] uppercase font-bold tracking-wider">
                Full Administrator
              </span>
              <span className="text-[10px] text-green-600 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                Root Role
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Admin Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Admin Email (Fixed)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-sm cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
              />
            </div>
          </div>

          <ImageUploader
            label="Admin Avatar (Image Upload / Image URL)"
            value={image}
            onChange={(url) => setImage(url)}
          />

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-salon-600 hover:bg-salon-700 text-white font-semibold text-xs shadow-md shadow-salon-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Update Admin Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
