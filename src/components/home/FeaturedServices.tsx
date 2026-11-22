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
    serviceName: 'Executive Royal Haircut & Beard Sculpt',
    category: 'Haircut & Styling',
    description: 'Precision shear & clipper haircut tailored to your head shape, hot towel ritual, soothing scalp massage, and beard sculpt with premium organic oils.',
    price: 45,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 4.9,
    reviewsCount: 48,
  },
  {
    id: 'f2',
    serviceName: 'Men\'s Natural Hair Toning & Grey Blending',
    category: 'Hair Coloring',
    description: 'Subtle, natural demi-permanent grey blending and modern matte toning designed specifically for men to restore a youthful, refined finish.',
    price: 65,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 5.0,
    reviewsCount: 34,
  },
  {
    id: 'f3',
    serviceName: 'Keratin Scalp Therapy & Fade Finish',
    category: 'Hair Treatment',
    description: 'Deep follicle detox with invigorating tea tree scalp scrub, keratin cuticle nourishment, and a clean razor skin-fade taper finish.',
    price: 55,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 4.8,
    reviewsCount: 29,
  },
  {
    id: 'f4',
    serviceName: 'Gentlemen\'s Charcoal Deep Pore Facial',
    category: 'Facial & Skincare',
    description: 'Targeted clinical facial for men with ultrasonic pore extraction, activated bamboo charcoal mask, beard conditioning, and cold jade roller finish.',
    price: 75,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 4.9,
    reviewsCount: 52,
  },
  {
    id: 'f5',
    serviceName: 'Groom\'s Wedding Day Grooming & Styling Package',
    category: 'Makeup',
    description: 'Complete high-profile photoshoot prep: precision cut, beard alignment, anti-shine HD camera complexion prep, and luxury cologne spray.',
    price: 95,
    duration: 75,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 5.0,
    reviewsCount: 41,
  },
  {
    id: 'f6',
    serviceName: 'Executive Hand & Foot Reflexology Grooming',
    category: 'Manicure & Pedicure',
    description: 'Therapeutic nail shaping, cuticle conditioning, exfoliating sea-salt foot scrub, and relaxing hot stone calf and hand massage in private lounge.',
    price: 60,
    duration: 55,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 4.7,
    reviewsCount: 26,
  },
  {
    id: 'f7',
    serviceName: 'Deep Tissue Swedish Back & Shoulder Massage',
    category: 'Spa & Massage',
    description: 'Intense therapeutic massage focused on releasing upper back tension, stiff neck, and shoulder knots using warm organic eucalyptus oils.',
    price: 85,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1650044252595-cacd425982ff?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 5.0,
    reviewsCount: 63,
  },
  {
    id: 'f8',
    serviceName: 'Royal Hot Towel Straight Razor Shave',
    category: 'Haircut & Styling',
    description: 'Traditional multi-step hot towel treatment with pre-shave badger brush lather, vintage straight razor shave, cold towel pore close, and aftershave balm.',
    price: 40,
    duration: 35,
    image: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 4.9,
    reviewsCount: 57,
  },
  {
    id: 'f9',
    serviceName: 'Artisan Scissor Cut & Signature Blowout',
    category: 'Haircut & Styling',
    description: 'Master styling with sectional shear sculpting, texturizing taper, invigorating scalp wash, and matte clay finish.',
    price: 50,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1593702295094-aea22597af65?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    rating: 5.0,
    reviewsCount: 42,
  },
];

export default function FeaturedServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetchApi('/services?limit=9');
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

        {/* Services Grid (At least 6 services, active only - 9 items for balanced 3x3 layout) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
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
