import React, { useState, useEffect } from 'react';
import { useDelayedSkeleton } from '../hooks/useDelayedSkeleton';
import { SkeletonSection } from '../components/landing/ClassicSkeleton';

import ClassicNavbar from '../components/landing/ClassicNavbar';
import HeroSection from '../components/landing/HeroSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesGridSection from '../components/landing/FeaturesGridSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import ClassicFooter from '../components/landing/ClassicFooter';

export default function LandingPage({ setActivePage, openDiagnostic }) {
  const shouldShowSkeleton = useDelayedSkeleton(500);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Simulate initial data fetching for the landing page (e.g. dynamic testimonials)
    // In a real app, this would be a fetch call.
    const timer = setTimeout(() => {
      setDataLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (shouldShowSkeleton && !dataLoaded) {
    return (
      <div className="min-h-screen bg-classic-bg flex flex-col w-full">
        <ClassicNavbar setActivePage={setActivePage} openDiagnostic={openDiagnostic} />
        <SkeletonSection />
        <SkeletonSection />
      </div>
    );
  }

  return (
    <div className="bg-classic-bg text-classic-textPrimary font-sans w-full selection:bg-classic-accent selection:text-white">
      <ClassicNavbar setActivePage={setActivePage} openDiagnostic={openDiagnostic} />
      <main>
        <HeroSection openDiagnostic={openDiagnostic} />
        <HowItWorksSection />
        <FeaturesGridSection />
        <TestimonialsSection />
        <PricingSection openDiagnostic={openDiagnostic} />
        <FinalCtaSection openDiagnostic={openDiagnostic} />
      </main>
      <ClassicFooter setActivePage={setActivePage} />
    </div>
  );
}
