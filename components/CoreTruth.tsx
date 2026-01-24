
import React from 'react';
import { motion } from 'framer-motion';

const CoreTruth: React.FC = () => {
  return (
    <section className="py-56 px-6 md:px-20 bg-white relative border-y border-[#f2f0ea]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            className="flex justify-center mb-8"
          >
            <div className="w-14 h-14 border border-[#e5d5b7] rounded-full flex items-center justify-center text-[#c5a059] serif-en italic text-2xl">
              &
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-normal leading-[1.4] serif-kr tracking-tight text-[#2a2a2a]"
          >
            2,190일의 기록,<br />
            <span className="serif-en italic text-[#c5a059] font-light text-3xl md:text-5xl block mt-4">Where Two Worlds Become One</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="space-y-8 text-stone-500 font-normal serif-kr text-lg md:text-xl leading-[2.2] max-w-2xl mx-auto"
          >
            <p>서로 다른 두 세계가 만나 하나의 역사가 되기까지.</p>
            <p>우리가 함께 걸어온 6년의 시간은 단순한 숫자가 아닌,<br />서로를 향한 깊은 신뢰와 사랑의 증명이었습니다.</p>
            <p className="pt-12 serif-kr font-bold text-[#c5a059] text-2xl md:text-3xl leading-relaxed italic">
              이제 그 찬란한 시작의 순간에<br />소중한 당신을 초대합니다.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoreTruth;
