import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import StyleMatcher from '@/components/home/StyleMatcher';
import FeaturedServices from '@/components/home/FeaturedServices';
import TransformationGallery from '@/components/home/TransformationGallery';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import PackageBuilder from '@/components/home/PackageBuilder';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FaqSection from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroBanner />
      <StyleMatcher />
      <FeaturedServices />
      <TransformationGallery />
      <CategoryExplorer />
      <PackageBuilder />
      <WhyChooseUs />
      <FaqSection />
    </div>
  );
}
