
import React, { Suspense, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import Hero from './components/Hero';
import CoreTruth from './components/CoreTruth';
import PhotoDivider from './components/PhotoDivider';
import StudioGallery from './components/StudioGallery';
import PhotoGallery from './components/PhotoGallery';
import BigEvent from './components/BigEvent';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import SimpleView from './components/SimpleView';

// Lazy load Firebase-dependent components
const RSVP = React.lazy(() => import('./components/RSVP'));
const GuestBook = React.lazy(() => import('./components/GuestBook'));

const VIEW_MODE_KEY = 'wedding_view_mode';

const ViewModeModal: React.FC<{ onSelect: (mode: 'full' | 'simple') => void }> = ({ onSelect }) => (
  <motion.div
    className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <div className="p-8 text-center">
        <p className="text-gold text-xs font-bold tracking-[0.5em] mb-4">누리 & 인준</p>
        <h2 className="text-2xl serif-kr font-light text-[#2a2a2a] mb-2">청첩장 보기</h2>
        <p className="text-sm text-stone-400 mb-8">보기 방식을 선택해주세요</p>

        <div className="space-y-3">
          <button
            onClick={() => onSelect('full')}
            className="w-full py-4 px-6 rounded-xl border-2 border-stone-200 hover:border-gold/50 transition-colors text-left"
          >
            <p className="text-lg font-medium text-[#2a2a2a]">일반 보기</p>
            <p className="text-sm text-stone-400 mt-1">사진과 함께 보는 청첩장</p>
          </button>
          <button
            onClick={() => onSelect('simple')}
            className="w-full py-4 px-6 rounded-xl border-2 border-gold bg-gold/5 hover:bg-gold/10 transition-colors text-left"
          >
            <p className="text-lg font-medium text-gold">크게 보기</p>
            <p className="text-sm text-stone-500 mt-1">큰 글씨로 핵심 정보만 보기</p>
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'full' | 'simple' | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    if (saved === 'full' || saved === 'simple') {
      setViewMode(saved);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleSelectMode = (mode: 'full' | 'simple') => {
    localStorage.setItem(VIEW_MODE_KEY, mode);
    setViewMode(mode);
    setShowModal(false);
  };

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

  if (viewMode === 'simple') {
    return <SimpleView onSwitchToFull={() => handleSelectMode('full')} />;
  }

  return (
    <>
    <AnimatePresence>
      {showModal && <ViewModeModal onSelect={handleSelectMode} />}
    </AnimatePresence>
    <div className="relative bg-[#faf9f6] text-[#333] selection:bg-[#e5d5b7] selection:text-[#333]">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#c5a059] z-50 origin-left"
        style={{ scaleX }}
      />

      <main className="w-full">
        <Hero onSwitchToSimple={() => handleSelectMode('simple')} />
        <CoreTruth />
        <PhotoDivider src="/studio/KSJ02613-1_divider.webp" alt="Studio portrait" />
        <StudioGallery />
        <PhotoDivider src="/studio/KSJ02546_divider.webp" alt="Studio portrait" />
        <BigEvent />
        <MapSection />
        <Footer />
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <RSVP />
        </Suspense>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <GuestBook />
        </Suspense>
        <PhotoGallery />
      </main>

      {/* RSVP CTA - mobile: bottom center, PC: bottom-right with pulse */}
      <motion.div
        className="fixed z-40 bottom-8 inset-x-0 flex justify-center md:bottom-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showCTA ? 1 : 0,
          y: showCTA ? 0 : 20,
          pointerEvents: showCTA ? 'auto' : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          {/* PC: pulse ring behind button */}
          <div className="hidden md:block absolute inset-0 -m-1 rounded-2xl animate-pulse bg-gold/20" />
          <div className="hidden md:block absolute inset-0 -m-2 rounded-2xl animate-ping bg-gold/10" style={{ animationDuration: '2s' }} />
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
    </>
  );
};

export default App;
