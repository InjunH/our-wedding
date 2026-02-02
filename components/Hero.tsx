
import React from 'react';
import { motion } from 'framer-motion';
import { HeroGallery } from '@/components/ui/hero-gallery';

const Hero: React.FC = () => {

  return (
    <section className="h-screen w-full flex flex-col justify-center items-center px-6 relative overflow-hidden bg-ivory">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 2.5 }}
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"
      />

      <div className="z-10 text-center space-y-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] font-semibold tracking-[0.6em] text-gold uppercase mb-6 block">우리의 이야기</span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight-serif mb-2 serif-en italic text-[#2a2a2a]">
            Nuri <span className="font-extralight text-stone-300 mx-2">&</span> Injun
          </h1>
          <div className="h-px w-20 bg-gold mx-auto mt-8 opacity-40"></div>
        </motion.div>

        <HeroGallery />
      </div>

      <motion.div
        className="absolute bottom-16 flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent"></div>
        <span className="text-[8px] font-bold tracking-[0.4em] text-stone-400 uppercase">아래로 스크롤</span>
      </motion.div>
    </section>
  );
};

export default Hero;
