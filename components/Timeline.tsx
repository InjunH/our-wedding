
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TIMELINE } from '../constants';

const Timeline: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const totalPanels = TIMELINE.length + 2;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(1 - 1/totalPanels) * 100}%`]);

  return (
    <section ref={targetRef} className="relative h-[650vh] bg-ivory">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex flex-nowrap h-full items-center"
        >
          {/* Section Introduction */}
          <div className="w-screen h-full flex flex-col justify-center px-6 md:px-12 lg:px-32 shrink-0 bg-white border-r border-[#f2f0ea]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
            >
              <span className="text-gold text-xs font-bold tracking-[0.7em] mb-8 uppercase block">우리가 걸어온 길</span>
              <h2 className="text-[#2a2a2a] text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-light serif-kr tracking-tight-serif leading-none mb-12">
                1,100일의 기록
              </h2>
              <div className="h-px w-24 bg-gold mb-12"></div>
              <p className="text-stone-400 text-lg max-w-sm font-normal leading-relaxed serif-kr italic">
                동료로 만나 연인이 되고, 이제 가족이 됩니다.
              </p>
            </motion.div>
          </div>

          {/* Timeline Cards */}
          {TIMELINE.map((item, index) => (
            <div
              key={index}
              className="w-screen h-full flex items-center justify-center px-6 md:px-24 shrink-0 relative bg-ivory border-r border-[#f2f0ea]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full max-w-6xl items-center">
                <div className="relative p-5 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.04)] rounded-sm group overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-[4/5] object-cover rounded-sm transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-12 left-12">
                    <span className="serif-en italic text-7xl text-gold opacity-15">0{index + 1}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gold text-xs font-bold tracking-[0.5em] uppercase mb-8 serif-en italic">{item.date}</span>
                  <h3 className="text-4xl md:text-6xl font-normal serif-kr tracking-tight mb-10 text-[#2a2a2a]">{item.title}</h3>
                  <div className="pl-10 border-l border-gold-light">
                    <p className="text-stone-500 text-xl font-normal leading-[1.8] serif-kr italic">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Outro of the Horizontal Scroll */}
          <div className="w-screen h-full flex flex-col justify-center items-center px-20 shrink-0 bg-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-gold mb-12 flex justify-center opacity-60">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <h2 className="text-[#2a2a2a] text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-light serif-kr tracking-tight-serif leading-tight">
                이제,<br />
                <span className="text-gold font-light serif-kr">같은 이름으로</span>
              </h2>
              <div className="mt-20">
                <span className="text-[9px] font-bold tracking-[0.6em] text-stone-300 uppercase animate-pulse">결혼식에 초대합니다</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;
