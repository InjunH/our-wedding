
import React, { Suspense, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import Hero from './components/Hero';
import CoreTruth from './components/CoreTruth';
import PhotoDivider from './components/PhotoDivider';
import StudioGallery from './components/StudioGallery';
import PhotoGallery from './components/PhotoGallery';
import BigEvent from './components/BigEvent';
import MapSection from './components/MapSection';
import Footer from './components/Footer';

// Lazy load Firebase-dependent components
const RSVP = React.lazy(() => import('./components/RSVP'));
const GuestBook = React.lazy(() => import('./components/GuestBook'));

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Show/hide CTA based on scroll position
  const [showCTA, setShowCTA] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Show after scrolling past hero (>10%), hide near RSVP section (>85%)
    setShowCTA(latest > 0.1 && latest < 0.85);
  });

  return (
    <div className="relative bg-[#faf9f6] text-[#333] selection:bg-[#e5d5b7] selection:text-[#333]">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#c5a059] z-50 origin-left"
        style={{ scaleX }}
      />

      <main className="w-full">
        <Hero />
        <CoreTruth />
        <PhotoDivider src="/studio/KSJ02613-1_divider.webp" alt="Studio portrait" />
        <StudioGallery />
        <PhotoDivider src="/studio/KSJ02546_divider.webp" alt="Studio portrait" />
        <PhotoGallery />
        <BigEvent />
        <MapSection />
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <RSVP />
          <GuestBook />
        </Suspense>
        <Footer />
      </main>

      {/* RSVP CTA - mobile: bottom center, PC: bottom-right with pulse */}
      <motion.div
        className="fixed z-40 bottom-8 inset-x-0 flex justify-center md:justify-end md:right-8 md:bottom-10 md:inset-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showCTA ? 1 : 0,
          y: showCTA ? 0 : 20,
          pointerEvents: showCTA ? 'auto' : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* PC: pulse ring behind button */}
        <div className="hidden md:block absolute inset-0 -m-1 rounded-2xl animate-pulse bg-gold/20" />
        <div className="hidden md:block absolute inset-0 -m-2 rounded-2xl animate-ping bg-gold/10" style={{ animationDuration: '2s' }} />

        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <ShimmerButton
            shimmerColor="#c5a059"
            shimmerDuration="1.5s"
            background="rgba(255, 255, 255, 1)"
            borderRadius="14px"
            className="px-8 py-3 md:px-10 md:py-4 text-[13px] md:text-[14px] font-bold tracking-[0.25em] md:tracking-[0.3em] shadow-2xl text-[#333] md:shadow-[0_8px_40px_rgba(197,160,89,0.35)]"
            onClick={() => {
              const el = document.getElementById('rsvp');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            참석 의사 전달하기
          </ShimmerButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;
