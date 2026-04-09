
import React from 'react';
import { motion } from 'framer-motion';
import { WEDDING_DATA } from '../constants';

const Hero: React.FC<{ onSwitchToSimple?: () => void; switchLabel?: string }> = ({ onSwitchToSimple, switchLabel = '크게 보기' }) => {
  const dateStr = WEDDING_DATA.weddingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background photo */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src="/studio/hero.webp"
          alt="누리 & 인준"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end items-center pb-28 px-6 z-10">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light serif-en italic text-white tracking-tight-serif mb-4 drop-shadow-lg">
            Nuri <span className="font-extralight text-white/60 mx-2">&</span> Injun
          </h1>
          <div className="h-px w-16 bg-white/40 mx-auto my-6" />
          <p className="text-sm sm:text-base tracking-[0.3em] text-white/80 font-light uppercase">
            {dateStr}
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
