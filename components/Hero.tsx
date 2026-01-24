
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { WEDDING_DATA } from '../constants';

const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 3, ease: [0.16, 1, 0.3, 1] });
    return animation.stop;
  }, [value]);

  return <motion.span className="serif-en italic font-light text-[18vw] leading-none tracking-tight-serif text-[#c5a059]">{rounded}</motion.span>;
};

const Hero: React.FC = () => {
  const [daysSince, setDaysSince] = useState(0);

  useEffect(() => {
    const diff = Math.floor((new Date().getTime() - WEDDING_DATA.firstMetDate.getTime()) / (1000 * 60 * 60 * 24));
    setDaysSince(diff);
  }, []);

  return (
    <section className="h-screen w-full flex flex-col justify-center items-center px-6 relative overflow-hidden bg-[#faf9f6]">
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
          <span className="text-[10px] font-semibold tracking-[0.6em] text-[#c5a059] uppercase mb-6 block">Our History</span>
          <h1 className="text-5xl md:text-8xl font-light tracking-tight-serif mb-2 serif-en italic text-[#2a2a2a]">
            Nuri <span className="font-extralight text-stone-300 mx-2">&</span> Injun
          </h1>
          <div className="h-px w-20 bg-[#c5a059] mx-auto mt-8 opacity-40"></div>
        </motion.div>
        
        <div className="flex flex-col items-center">
          <CountUp value={daysSince} />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-[10px] font-bold tracking-[0.5em] text-stone-400 uppercase mt-4"
          >
            Days Journeying Together
          </motion.p>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-16 flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-[#c5a059] to-transparent"></div>
        <span className="text-[8px] font-bold tracking-[0.4em] text-stone-400 uppercase">Discover more</span>
      </motion.div>
    </section>
  );
};

export default Hero;
