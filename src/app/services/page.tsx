'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Search, SlidersHorizontal, Clock, Star, ArrowRight, X, Sparkles, Filter } from 'lucide-react';
import { ServiceItem } from '@/components/home/FeaturedServices';

const CATEGORIES = [
  'All',
  'Haircut & Styling',
  'Hair Coloring',
  'Hair Treatment',
  'Facial & Skincare',
  'Makeup',
  'Manicure & Pedicure',
  'Spa & Massage',
];

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');

  // Load services based on filters
  useEffect(() => {
    async function fetchFilteredServices() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append('search', searchTerm.trim());
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
        if (sortBy) params.append('sort', sortBy);

        const res = await fetchApi(`/services?${params.toString()}`);
        if (res.success && Array.isArray(res.data)) {
          setServices(res.data);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchFilteredServices();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
    router.push('/services');
  };

  return (
    <div className="py-12 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-100 text-salon-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-salon-600" />
            Full Salon Menu
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Browse Salon Services
          </h1>
          <p className="mt-1 text-sm sm:text-base text-stone-500">
            Explore our curated selection of premium beauty, styling, skincare, and restorative treatments.
          </p>
        </div>

        {/* Search, Filter & Sort Bar */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input (Challenge Requirement 1: Search by service name) */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services by name (e.g. Haircut, Facial, Keratin)..."
                className="w-full pl-11 pr-10 py-2.5 rounded-2xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown (Challenge Requirement 3: Sort by service price) */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-stone-500 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-56 py-2.5 px-4 rounded-2xl border border-stone-200 bg-white text-stone-700 text-sm font-medium outline-none focus:border-salon-500 focus:ring-2 focus:ring-salon-200 cursor-pointer"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price-asc">Price: Low to High ($)</option>
                <option value="price-desc">Price: High to Low ($$)</option>
                <option value="duration-asc">Duration: Shortest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Category Chips (Category-Based Filtering) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-salon-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Clear Filter */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
          <p>
            Showing <span className="font-semibold text-stone-800">{services.length}</span> active services
            {selectedCategory !== 'All' && <span> in "{selectedCategory}"</span>}
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </p>

          {(searchTerm || selectedCategory !== 'All' || sortBy !== 'newest') && (
            <button
              onClick={handleClearFilters}
              className="text-salon-600 hover:text-salon-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Services Card Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4 animate-pulse">
                <div className="h-48 bg-stone-100 rounded-2xl"></div>
                <div className="h-4 bg-stone-100 rounded w-1/3"></div>
                <div className="h-6 bg-stone-100 rounded w-3/4"></div>
                <div className="h-10 bg-stone-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
            <div className="w-16 h-16 rounded-full bg-salon-50 text-salon-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">No services match your criteria</h3>
            <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
              Try adjusting your search terms or clearing the category filter to explore other treatments.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-6 py-2.5 rounded-full bg-salon-600 text-white text-sm font-semibold hover:bg-salon-700 transition-colors"
            >
              Show All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((item) => {
              const serviceId = item.id || item._id;
              return (
                <div
                  key={serviceId}
                  className="group rounded-3xl bg-white border border-stone-200 hover:border-salon-300 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-800 text-xs font-semibold shadow-md">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3.5 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md text-white text-sm font-bold shadow-lg">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-salon-500" />
                          {item.duration} mins
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {item.rating || 4.9} ({item.reviewsCount || 20})
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-stone-900 group-hover:text-salon-600 transition-colors line-clamp-1">
                        {item.serviceName}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <Link
                      href={`/services/${serviceId}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-salon-700 bg-salon-50 hover:bg-salon-600 hover:text-white transition-all shadow-xs"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">Loading services menu...</div>}>
      <BrowseServicesContent />
    </Suspense>
  );
}
