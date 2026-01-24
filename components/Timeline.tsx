
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TIMELINE } from '../constants';

const Timeline: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress specifically when the container is in view from top to bottom
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Calculate horizontal shift based on the number of panels
  // Introduction + TIMELINE cards + Outro = total panels
  const totalPanels = TIMELINE.length + 2;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(1 - 1/totalPanels) * 100}%`]);

  return (
    <section ref={targetRef} className="relative h-[600vh] bg-ivory">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div 
          style={{ x }} 
          className="flex flex-nowrap h-full items-center"
        >
          {/* Section Introduction */}
          <div className="w-screen h-full flex flex-col justify-center px-12 md:px-32 shrink-0 bg-white border-r border-[#f0ede6]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="text-gold text-[10px] font-bold tracking-[0.6em] mb-6 uppercase block">Archive 01</span>
              <h2 className="text-[#333] text-6xl md:text-8xl font-medium serif tracking-tight leading-none mb-10">
                The Records<br /><span className="italic text-gold font-light">of N & I</span>
              </h2>
              <div className="h-px w-20 bg-gold mb-10"></div>
              <p className="text-stone-400 text-lg max-w-sm font-light leading-relaxed italic serif">
                우리가 함께한 모든 순간들이 모여 하나의 작품이 되었습니다. 
                그 소중한 조각들을 공유합니다.
              </p>
            </motion.div>
          </div>

          {/* Timeline Cards */}
          {TIMELINE.map((item, index) => (
            <div 
              key={index} 
              className="w-screen h-full flex items-center justify-center px-6 md:px-24 shrink-0 relative bg-ivory border-r border-[#f0ede6]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-6xl items-center">
                <div className="relative p-4 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-sm group overflow-hidden">
                   <motion.img 
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={item.image} 
                    alt={item.title} 
                    className="w-full aspect-[4/5] object-cover rounded-sm transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-10 left-10">
                     <span className="serif italic text-6xl text-gold opacity-20 italic">0{index + 1}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6">{item.date}</span>
                  <h3 className="text-4xl md:text-6xl font-medium serif italic tracking-tight mb-8 text-[#333]">{item.title}</h3>
                  <p className="text-stone-500 text-xl font-light leading-relaxed serif italic border-l-2 border-gold-light pl-8 py-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Outro of the Horizontal Scroll */}
          <div className="w-screen h-full flex flex-col justify-center items-center px-20 shrink-0 bg-white">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="text-center"
             >
               <div className="text-gold mb-8 flex justify-center">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
               </div>
               <h2 className="text-[#333] text-5xl md:text-7xl font-medium serif tracking-tight leading-tight">
                A New Chapter<br />
                <span className="italic text-gold font-light">Begins Now</span>
              </h2>
              <div className="mt-16 text-stone-300">
                <span className="text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse">Continue to Invitation</span>
              </div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;
