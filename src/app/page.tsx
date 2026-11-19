import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedServices from '@/components/home/FeaturedServices';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import WhyChooseUs from '@/components/home/WhyChooseUs';

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <FeaturedServices />
      <CategoryExplorer />
      <WhyChooseUs />
    </div>
  );
}
