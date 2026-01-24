
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
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
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#c5a059' }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#333] text-white px-12 py-4 rounded-none text-[10px] font-bold tracking-[0.5em] uppercase shadow-2xl transition-all duration-500 flex items-center gap-2"
          onClick={() => {
            const el = document.getElementById('rsvp');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          RSVP <span className="opacity-50">|</span> 05.24
        </motion.button>
      </div>
    </div>
  );
};

export default App;
