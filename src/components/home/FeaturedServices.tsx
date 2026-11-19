'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Clock, Star, ArrowRight, Sparkles } from 'lucide-react';

export interface ServiceItem {
  id: string;
  _id?: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: 'active' | 'inactive';
  rating?: number;
  reviewsCount?: number;
}

const fallbackFeatured: ServiceItem[] = [
  {
    id: 'f1',
    serviceName: 'Signature Royal Haircut & Beard Sculpt',
    category: 'Haircut & Styling',
    description: 'Precision scissor crafting, hot towel aromatic treatment, scalp stimulation, and beard balm shaping.',
    price: 45,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 4.9,
    reviewsCount: 38,
  },
  {
    id: 'f2',
    serviceName: 'Balayage & Dimensional Sun-Kissed Tone',
    category: 'Hair Coloring',
    description: 'Bespoke hand-painted balayage highlights delivering radiant, sun-kissed natural tones with Olaplex therapy.',
    price: 130,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 5.0,
    reviewsCount: 24,
  },
  {
    id: 'f3',
    serviceName: 'Brazilian Silk Keratin Smoothing Therapy',
    category: 'Hair Treatment',
    description: 'Intense anti-frizz smoothing treatment sealing dry cuticles, imparting mirror-like silkiness and lustrous shine.',
    price: 110,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 4.8,
    reviewsCount: 19,
  },
  {
    id: 'f4',
    serviceName: 'Hydra-Glow Deep Cleansing Clinical Facial',
    category: 'Facial & Skincare',
    description: 'Multi-step clinical facial featuring ultrasonic peel, vacuum pore extraction, hyaluronic acid and cryogenic mask.',
    price: 85,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 4.9,
    reviewsCount: 42,
  },
  {
    id: 'f5',
    serviceName: 'Bridal Glam & Couture Evening Artistry',
    category: 'Makeup',
    description: 'Full-glam couture makeup session using luxury water-resistant products, custom silk eyelash application, and setting spray.',
    price: 95,
    duration: 75,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 5.0,
    reviewsCount: 31,
  },
  {
    id: 'f6',
    serviceName: 'Luxury Gel Manicure & Botanical Pedicure',
    category: 'Manicure & Pedicure',
    description: 'Exfoliating rose-sea-salt scrub, cuticle therapy, relaxing hot stone foot massage, and chip-free organic gel polish.',
    price: 65,
    duration: 65,
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 4.7,
    reviewsCount: 29,
  },
];

export default function FeaturedServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetchApi('/services?limit=6');
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        } else {
          setServices(fallbackFeatured);
        }
      } catch {
        setServices(fallbackFeatured);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-50 text-salon-700 text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-salon-600" />
              Handcrafted Indulgence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Featured Salon Services
            </h2>
            <p className="mt-2 text-stone-500 max-w-xl text-sm sm:text-base">
              Explore our most requested bespoke services, designed and delivered by master aesthetic specialists.
            </p>
          </div>

          <Link
            href="/services"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-salon-600 hover:text-salon-700 group"
          >
            Browse all services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Services Grid (At least 6 services, active only) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-3xl border border-stone-100 overflow-hidden bg-stone-50 animate-pulse">
                <div className="h-56 bg-stone-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-1/3"></div>
                  <div className="h-6 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-12 bg-stone-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((item) => {
              const serviceId = item.id || item._id;
              return (
                <div
                  key={serviceId}
                  className="group rounded-3xl bg-white border border-stone-200/80 hover:border-salon-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Service Image */}
                  <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-800 text-xs font-semibold shadow-md">
                        {item.category}
                      </span>
                    </div>
                    {/* Price Tag */}
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3.5 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md text-white text-sm font-bold shadow-lg">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Meta duration & rating */}
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-salon-500" />
                          {item.duration} mins
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {item.rating || 4.9} ({item.reviewsCount || 25})
                        </span>
                      </div>

                      {/* Service Name */}
                      <h3 className="text-lg font-bold text-stone-900 group-hover:text-salon-600 transition-colors line-clamp-1">
                        {item.serviceName}
                      </h3>

                      {/* Short Description */}
                      <p className="mt-2 text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* View Details Button */}
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
    </section>
  );
}
