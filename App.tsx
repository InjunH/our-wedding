
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import Hero from './components/Hero';
import CoreTruth from './components/CoreTruth';
import Timeline from './components/Timeline';
import BigEvent from './components/BigEvent';
import MapSection from './components/MapSection';
import RSVP from './components/RSVP';
import GuestBook from './components/GuestBook';
import Footer from './components/Footer';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative bg-[#faf9f6] text-[#333] selection:bg-[#e5d5b7] selection:text-[#333]">
      {/* Delicate Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#c5a059] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Note: overflow-x-hidden removed from main as it breaks sticky children */}
      <main className="w-full">
        <Hero />
        <CoreTruth />
        <Timeline />
        <BigEvent />
        <MapSection />
        <RSVP />
        <GuestBook />
        <Footer />
      </main>

      {/* Elegant RSVP Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShimmerButton
            shimmerColor="#c5a059"
            background="rgba(255, 255, 255, 1)"
            borderRadius="12px"
            className="px-12 py-4 text-[10px] font-bold tracking-[0.3em] shadow-2xl text-[#333]"
            onClick={() => {
              const el = document.getElementById('rsvp');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            참석 의사 전달하기
          </ShimmerButton>
        </motion.div>
      </div>
    </div>
  );
};

export default App;
