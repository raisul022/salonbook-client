'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import ImageUploader from '@/components/ui/ImageUploader';
import toast from 'react-hot-toast';
import {
  Scissors,
  Plus,
  Pencil,
  Trash2,
  Power,
  Clock,
  Sparkles,
  X,
  Check,
  Search,
} from 'lucide-react';
import { ServiceItem } from '@/components/home/FeaturedServices';

const CATEGORIES = [
  'Haircut & Styling',
  'Hair Coloring',
  'Hair Treatment',
  'Facial & Skincare',
  'Makeup',
  'Manicure & Pedicure',
  'Spa & Massage',
];

export default function AdminManageServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State (Add or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isSaving, setIsSaving] = useState(false);

  const loadAllServices = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/services/admin/all');
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (err) {
      toast.error('Error fetching services catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllServices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setServiceName('');
    setCategory(CATEGORIES[0]);
    setDescription('');
    setPrice('');
    setDuration('');
    setImage('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingId(service.id || service._id || null);
    setServiceName(service.serviceName);
    setCategory(service.category);
    setDescription(service.description);
    setPrice(service.price);
    setDuration(service.duration);
    setImage(service.image);
    setStatus(service.status);
    setIsModalOpen(true);
  };

  // Submit Add or Update Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName.trim() || !category || !description.trim() || !image) {
      toast.error('Please fill in all service details and upload an image.');
      return;
    }

    const numPrice = Number(price);
    const numDuration = Number(duration);

    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error('Price must be a positive number.');
      return;
    }

    if (isNaN(numDuration) || numDuration <= 0) {
      toast.error('Duration must be a positive number of minutes.');
      return;
    }

    try {
      setIsSaving(true);
      let res;
      if (editingId) {
        // Update
        res = await fetchApi(`/services/admin/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({
            serviceName: serviceName.trim(),
            category,
            description: description.trim(),
            price: numPrice,
            duration: numDuration,
            image,
            status,
          }),
        });
      } else {
        // Create
        res = await fetchApi('/services/admin/create', {
          method: 'POST',
          body: JSON.stringify({
            serviceName: serviceName.trim(),
            category,
            description: description.trim(),
            price: numPrice,
            duration: numDuration,
            image,
            status,
          }),
        });
      }

      if (res.success) {
        toast.success(editingId ? 'Service updated successfully!' : 'New service created successfully!');
        setIsModalOpen(false);
        loadAllServices();
      } else {
        toast.error(res.message || 'Operation failed.');
      }
    } catch (err) {
      toast.error('Network error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Service Status (Active / Inactive)
  const handleToggleStatus = async (id: string) => {
    try {
      const res = await fetchApi(`/services/admin/${id}/toggle-status`, {
        method: 'PATCH',
      });
      if (res.success) {
        toast.success(res.message || 'Service status toggled.');
        loadAllServices();
      } else {
        toast.error(res.message || 'Could not change status.');
      }
    } catch (err) {
      toast.error('Network error while toggling status.');
    }
  };

  // Delete Service
  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await fetchApi(`/services/admin/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        toast.success('Service removed from catalog.');
        loadAllServices();
      } else {
        toast.error(res.message || 'Could not delete service.');
      }
    } catch (err) {
      toast.error('Network error during deletion.');
    }
  };

  const filteredServices = services.filter((s) =>
    s.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Manage Salon Services
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Create, update, toggle visibility, and configure service pricing & durations
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-salon-600 hover:bg-salon-700 text-white font-semibold text-xs shadow-md shadow-salon-600/20 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* Search Input Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter services by name or category..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-xs outline-none focus:border-salon-500 focus:ring-1 focus:ring-salon-200"
        />
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">Loading salon services...</div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <Scissors className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No Services Found</h3>
          <p className="text-xs text-stone-400">
            Click "Add New Service" above to add your first salon offering to the database.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold border-b border-stone-200/70">
                <tr>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredServices.map((service) => {
                  const sId = service.id || service._id || '';
                  const isActive = service.status === 'active';
                  return (
                    <tr key={sId} className="hover:bg-salon-50/20 transition-colors">
                      {/* Service Name & Thumbnail */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={service.image}
                            alt={service.serviceName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block line-clamp-1">
                              {service.serviceName}
                            </span>
                            <span className="text-[11px] text-stone-400 line-clamp-1">
                              {service.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-stone-600 font-medium">{service.category}</td>

                      {/* Price */}
                      <td className="py-4 px-6 font-bold text-stone-900">
                        {formatPrice(service.price)}
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-6 text-stone-600">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-salon-500" />
                          {service.duration} mins
                        </span>
                      </td>

                      {/* Status & Toggle (Page 13 Requirement: Activate or Deactivate) */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(sId)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                            isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                          title="Click to toggle active/inactive status"
                        >
                          <Power className="w-3 h-3" />
                          {service.status}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(service)}
                            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                            title="Edit Service"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(sId, service.serviceName)}
                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add / Update Service Modal (Page 14 Requirement) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-xl font-bold text-stone-900">
                {editingId ? 'Edit Salon Service' : 'Add New Salon Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              {/* Service Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Signature Royal Haircut"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
                />
              </div>

              {/* Service Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all bg-white cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="45"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="50"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the procedure, products used, and benefits..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all resize-none"
                ></textarea>
              </div>

              {/* Service Image (ImgBB Image Upload or URL) */}
              <ImageUploader
                label="Service Image (Image Upload; Not Image URL)"
                value={image}
                onChange={(url) => setImage(url)}
                required
              />

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'active'}
                      onChange={() => setStatus('active')}
                      className="text-salon-600 focus:ring-salon-500"
                    />
                    <span>Active (Visible on public menu)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'inactive'}
                      onChange={() => setStatus('inactive')}
                      className="text-salon-600 focus:ring-salon-500"
                    />
                    <span>Inactive (Hidden)</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-salon-600 hover:bg-salon-700 text-white font-semibold text-xs shadow-md shadow-salon-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {isSaving ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
