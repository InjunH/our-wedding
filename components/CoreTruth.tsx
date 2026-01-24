
import React from 'react';
import { motion } from 'framer-motion';

const CoreTruth: React.FC = () => {
  return (
    <section className="py-48 px-6 md:px-20 bg-white relative border-y border-[#f0ede6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            className="flex justify-center mb-8"
          >
            <div className="w-12 h-12 border border-gold-light rounded-full flex items-center justify-center text-gold serif italic text-xl">
              &
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2 }}
            className="text-4xl md:text-6xl font-medium leading-tight serif tracking-tight"
          >
            2,190일의 기록,<br />
            <span className="italic text-gold font-light">우리의 계절이 꽃피는 날</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="space-y-6 text-stone-500 font-light text-lg md:text-xl leading-loose"
          >
            <p>서로 다른 두 세계가 만나 하나의 역사가 되기까지.</p>
            <p>우리가 함께 걸어온 6년의 시간은 단순한 숫자가 아닌,<br />서로를 향한 깊은 신뢰와 사랑의 증명이었습니다.</p>
            <p className="pt-10 serif italic text-gold text-2xl">
              이제 그 찬란한 시작의 순간에<br />소중한 당신을 초대합니다.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoreTruth;
