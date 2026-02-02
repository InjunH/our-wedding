
import React from 'react';
import { motion } from 'framer-motion';

const CoreTruth: React.FC = () => {
  return (
    <section className="py-20 md:py-40 lg:py-56 px-6 md:px-20 bg-white relative border-y border-[#f2f0ea]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-10 md:space-y-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            className="flex justify-center mb-8"
          >
            <div className="w-14 h-14 border border-gold-light rounded-full flex items-center justify-center text-gold serif-en italic text-2xl">
              &
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-normal leading-[1.4] serif-kr tracking-tight text-[#2a2a2a]"
          >
            동료에서 연인으로,<br />
            <span className="serif-kr italic text-gold font-light text-xl sm:text-2xl md:text-3xl lg:text-5xl block mt-4">연인에서 가족으로</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="space-y-8 text-stone-500 font-normal serif-kr text-lg md:text-xl leading-[2.2] max-w-2xl mx-auto"
          >
            <p>같은 꿈을 꾸는 사람들이 만났습니다.</p>
            <p>함께 공부하고, 함께 일하고, 때론 함께 넘어지기도 했지만 —<br />결국 우리는 늘 나란히 일어섰습니다.</p>
            <p className="pt-8 md:pt-12 serif-kr font-bold text-gold text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed italic">
              앞으로도 이렇게 살고 싶어서,<br />결혼합니다.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoreTruth;
