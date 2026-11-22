'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Check, ArrowRight, RotateCcw, Clock, Star, Gift, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface QuestionOption {
  id: string;
  label: string;
  description: string;
  iconText: string;
}

interface Step {
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

const steps: Step[] = [
  {
    title: '1. What is your occasion or primary goal?',
    subtitle: 'Select the vibe you are preparing to embody.',
    options: [
      {
        id: 'executive',
        label: 'Corporate Executive',
        description: 'Impeccable scissor lines, pristine taper, and commanding boardroom presence.',
        iconText: '💼',
      },
      {
        id: 'wedding',
        label: 'Wedding & Gala Ready',
        description: 'Complete high-profile photoshoot prep, camera-ready complexion, and fragrance.',
        iconText: '🤵',
      },
      {
        id: 'weekend',
        label: 'Low-Maintenance Refresh',
        description: 'Clean razor skin-fade, tea tree follicle scrub, and invigorating beard tone.',
        iconText: '⚡',
      },
      {
        id: 'recovery',
        label: 'Stress Relief & Recovery',
        description: 'Deep tissue knot release, eucalyptus oils, and athletic shoulder decompression.',
        iconText: '🌿',
      },
    ],
  },
  {
    title: '2. Which treatment area matters most today?',
    subtitle: 'Where should our master specialists focus their artistry?',
    options: [
      {
        id: 'hair-beard',
        label: 'Haircut & Precision Beard Sculpt',
        description: 'Head shape analysis, hot lather razor edging, and organic oil nourishment.',
        iconText: '✂️',
      },
      {
        id: 'skin-facial',
        label: 'Facial Detox & Grey Blending',
        description: 'Bamboo charcoal pore extraction, ice jade rolling, and natural matte tone.',
        iconText: '✨',
      },
      {
        id: 'massage-spa',
        label: 'Upper Back & Shoulder Massage',
        description: 'Intense therapeutic tension release focused on stiff neck knots and spine relief.',
        iconText: '💆‍♂️',
      },
      {
        id: 'grooming-hands',
        label: 'Executive Nails & Foot Care',
        description: 'Therapeutic nail detailing, sea salt exfoliation, and calf reflexology.',
        iconText: '👞',
      },
    ],
  },
  {
    title: '3. What is your preferred appointment duration?',
    subtitle: 'Tailor your session to fit your calendar seamlessly.',
    options: [
      {
        id: 'fast',
        label: 'Express Precision (35 - 45 mins)',
        description: 'High-efficiency sharp touchup without compromising royal craftsmanship.',
        iconText: '⏱️',
      },
      {
        id: 'classic',
        label: 'Classic Indulgence (50 - 60 mins)',
        description: 'The golden standard: consultation, multi-step ritual, and scalp massage.',
        iconText: '⭐',
      },
      {
        id: 'vip',
        label: 'Full VIP Ritual (70+ mins)',
        description: 'Unrushed luxury package with private lounge beverage and full consultation.',
        iconText: '👑',
      },
    ],
  },
];

interface MatchedService {
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  matchScore: number;
  image: string;
  promoCode: string;
}

const matchPresets: Record<string, MatchedService> = {
  executive: {
    name: 'Executive Royal Haircut & Beard Sculpt',
    category: 'Haircut & Styling',
    description:
      'Precision shear & clipper haircut tailored to head shape, hot towel ritual, soothing scalp massage, and beard sculpt with premium organic oils.',
    price: 45,
    duration: 50,
    matchScore: 98,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    promoCode: 'EXECUTIVE20',
  },
  wedding: {
    name: "Groom's Wedding Day Grooming & Styling Package",
    category: 'Makeup',
    description:
      'Complete high-profile photoshoot prep: precision cut, beard alignment, anti-shine HD camera complexion prep, and luxury cologne spray.',
    price: 95,
    duration: 75,
    matchScore: 99,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    promoCode: 'ROYALGUEST',
  },
  weekend: {
    name: 'Keratin Scalp Therapy & Fade Finish',
    category: 'Hair Treatment',
    description:
      'Deep follicle detox with invigorating tea tree scalp scrub, keratin cuticle nourishment, and a clean razor skin-fade taper finish.',
    price: 55,
    duration: 60,
    matchScore: 96,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    promoCode: 'REFRESH15',
  },
  recovery: {
    name: 'Deep Tissue Swedish Back & Shoulder Massage',
    category: 'Spa & Massage',
    description:
      'Intense therapeutic massage focused on releasing upper back tension, stiff neck, and shoulder knots using warm organic eucalyptus oils.',
    price: 85,
    duration: 60,
    matchScore: 97,
    image: 'https://images.unsplash.com/photo-1650044252595-cacd425982ff?auto=format&fit=crop&w=800&q=80',
    promoCode: 'UNWIND20',
  },
};

export default function StyleMatcher() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<MatchedService | null>(null);

  const handleSelectOption = (optionId: string) => {
    const updated = [...answers];
    updated[currentStep] = optionId;
    setAnswers(updated);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate Match Result
      const primaryGoal = updated[0] || 'executive';
      const matched = matchPresets[primaryGoal] || matchPresets.executive;
      setResult(matched);
    }
  };

  const resetMatcher = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <section className="py-20 bg-stone-50 border-b border-stone-200/70 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            Interactive Consultation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Virtual Stylist & Treatment Matcher
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-500">
            Answer 3 quick preferences and let our recommendation engine pair you with your optimal
            grooming ritual.
          </p>
        </div>

        {/* Quiz or Result Card */}
        {!result ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-2">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'w-10 bg-salon-600'
                        : idx < currentStep
                        ? 'w-6 bg-emerald-500'
                        : 'w-6 bg-stone-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-600">
                Question {currentStep + 1} of {steps.length}
              </span>
            </div>

            {/* Step Heading */}
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                {steps[currentStep].title}
              </h3>
              <p className="text-sm text-stone-500 mt-1">{steps[currentStep].subtitle}</p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps[currentStep].options.map((opt) => {
                const isSelected = answers[currentStep] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group hover:border-salon-500 hover:shadow-md ${
                      isSelected
                        ? 'border-salon-600 bg-salon-50/70 shadow-sm'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{opt.iconText}</span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-salon-600 text-white'
                              : 'bg-stone-100 text-transparent group-hover:text-stone-300'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <h4 className="font-bold text-stone-900 group-hover:text-salon-600 transition-colors">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Back Button */}
            {currentStep > 0 && (
              <div className="mt-8 pt-4 border-t border-stone-100 flex justify-start">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  ← Previous Question
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Match Result Card */
          <div className="bg-white rounded-3xl border-2 border-salon-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-salon-600 via-salon-700 to-amber-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider uppercase mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Your Tailored Recommendation
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {result.matchScore}% Perfect Ritual Match
                </h3>
                <p className="text-salon-100 text-xs sm:text-sm mt-1">
                  Based on your aesthetic goals, schedule, and treatment preference.
                </p>
              </div>

              <button
                onClick={resetMatcher}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Quiz
              </button>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Match Image */}
              <div className="md:col-span-5 h-64 rounded-2xl overflow-hidden bg-stone-100 relative shadow-md">
                <img
                  src={result.image}
                  alt={result.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-xs font-bold">
                  {result.category}
                </span>
              </div>

              {/* Match Details */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                  <span className="inline-flex items-center gap-1 text-salon-700 font-semibold bg-salon-50 px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5" />
                    {result.duration} mins session
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    5.0 / 5 Rating
                  </span>
                </div>

                <h4 className="text-2xl font-bold text-stone-900 leading-snug">
                  {result.name}
                </h4>

                <p className="text-sm text-stone-600 leading-relaxed">
                  {result.description}
                </p>

                {/* Promo Coupon Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">
                        Exclusive Consultation Perk
                      </p>
                      <p className="text-[11px] text-amber-700">
                        Use promo code <span className="font-mono font-bold">{result.promoCode}</span> for 20% off at checkout.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-200/80 text-amber-900 text-xs font-mono font-bold shrink-0">
                    {result.promoCode}
                  </span>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-600 block">Service Fee</span>
                    <span className="text-2xl font-black text-stone-900">
                      {formatPrice(result.price)}
                    </span>
                  </div>

                  <Link
                    href={`/services?category=${encodeURIComponent(result.category)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-salon-600 hover:bg-salon-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    Book This Recommended Ritual
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
