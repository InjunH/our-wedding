
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

  return <motion.span className="font-light serif italic text-[14vw] leading-none tracking-tight text-[#c5a059]">{rounded}</motion.span>;
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
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"
      />
      
      <div className="z-10 text-center space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-[10px] font-bold tracking-[0.5em] text-[#c5a059] uppercase mb-4 block">Save the Date</span>
          <h1 className="text-5xl md:text-8xl font-medium tracking-tight mb-2 serif italic text-[#333]">
            Nuri <span className="font-light serif text-stone-300">&</span> Injun
          </h1>
          <div className="h-px w-24 bg-[#c5a059] mx-auto mt-6 opacity-50"></div>
        </motion.div>
        
        <div className="flex flex-col items-center">
          <CountUp value={daysSince} />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-[10px] font-bold tracking-[0.4em] text-stone-400 uppercase mt-2"
          >
            Days of our Story
          </motion.p>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-12 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <div className="w-px h-16 bg-gradient-to-b from-[#c5a059] to-transparent"></div>
        <span className="text-[9px] font-bold tracking-[0.3em] text-stone-400 uppercase">Scroll Down</span>
      </motion.div>
    </section>
  );
};

export default Hero;
