
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-16 md:py-28 lg:py-40 px-6 bg-ivory text-center">
      <div className="max-w-3xl mx-auto space-y-12 md:space-y-24">
        <div className="space-y-6">
          <span className="text-xs font-bold text-gold tracking-[0.7em] uppercase">감사합니다</span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light serif-kr tracking-tight-serif text-[#2a2a2a]">
            늘, <span className="text-gold font-extralight">함께.</span>
          </h3>
          <div className="h-px w-12 bg-gold mx-auto opacity-30"></div>
        </div>

        <p className="text-stone-400 font-normal text-xl serif-kr italic leading-[2.2]">
          좋은 팀이었던 우리,<br />
          이제 좋은 가족이 되려 합니다.
        </p>

        <div className="pt-12 md:pt-20 border-t border-[#f2f0ea] flex flex-col md:flex-row justify-center gap-10 md:gap-20 lg:gap-40">
          <div className="space-y-4">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-[0.5em] block">신랑</span>
            <p className="text-2xl font-normal serif-kr text-[#2a2a2a]">황인준</p>
            <p className="text-stone-300 serif-en text-sm tracking-widest italic">010.2620.6424</p>
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-[0.5em] block">신부</span>
            <p className="text-2xl font-normal serif-kr text-[#2a2a2a]">윤누리</p>
            <p className="text-stone-300 serif-en text-sm tracking-widest italic">010.6406.7539</p>
          </div>
        </div>

        <div className="mt-16 md:mt-32">
          <p className="text-xs text-stone-200 font-bold tracking-[0.8em] uppercase serif-kr">
            © 2026 누리 & 인준
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
