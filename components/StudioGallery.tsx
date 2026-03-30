
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Studio photos: 수정-2 (22) + 원본 (7) = 29
const STUDIO_PHOTOS = [
  // 상단 고정
  'KSJ01165-1', 'KSJ01278', 'KSJ01230-1', 'KSJ01429',
  // 나머지
  'KSJ02241', 'KSJ00407', 'KSJ00475', 'KSJ00696', 'KSJ00807',
  'KSJ00985', 'KSJ01667', 'KSJ02101',
  'KSJ02367', 'KSJ02393', 'KSJ02436', 'KSJ02479',
  'KSJ02527', 'KSJ02679', 'KSJ02755',
  '20260103_173115',
  'KSJ01515-1', 'KSJ01897-1', 'KSJ02337-1', 'KSJ02477-1',
];

const StudioGallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const goToPrevious = useCallback(() => {
    setSelectedIndex(prev =>
      prev === null ? null : prev === 0 ? STUDIO_PHOTOS.length - 1 : prev - 1
    );
  }, []);

  const goToNext = useCallback(() => {
    setSelectedIndex(prev =>
      prev === null ? null : prev === STUDIO_PHOTOS.length - 1 ? 0 : prev + 1
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeModal, goToPrevious, goToNext]);

  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-gold text-xs font-bold tracking-[0.7em] uppercase mb-6 block">
            Studio
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-light serif-en italic tracking-tight-serif text-[#2a2a2a]">
            Our Portrait
          </h2>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
          {STUDIO_PHOTOS.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
              className="mb-3 md:mb-4 break-inside-avoid cursor-pointer group"
              onClick={() => openModal(index)}
            >
              <div className="relative overflow-hidden bg-stone-100">
                <img
                  src={`/studio/${name}_thumb.webp`}
                  alt={`Studio photo ${index + 1}`}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            >
              <X size={32} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronRight size={40} />
            </button>

            <motion.img
              key={STUDIO_PHOTOS[selectedIndex]}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={`/studio/${STUDIO_PHOTOS[selectedIndex]}.webp`}
              alt={`Studio photo ${selectedIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedIndex + 1} / {STUDIO_PHOTOS.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StudioGallery;
