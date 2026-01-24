
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-40 px-6 bg-ivory text-center">
      <div className="max-w-3xl mx-auto space-y-24">
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-gold tracking-[0.7em] uppercase">Gratitude</span>
          <h3 className="text-4xl md:text-5xl font-light serif-en italic tracking-tight-serif text-[#2a2a2a]">
            Always & <span className="text-gold not-italic serif-en font-extralight">Forever</span>.
          </h3>
          <div className="h-px w-12 bg-gold mx-auto opacity-30"></div>
        </div>

        <p className="text-stone-400 font-normal text-xl serif-kr italic leading-[2.2]">
          누구보다 치열하게 사랑했고,<br />
          이제는 평온한 쉼표가 되려 합니다.
        </p>

        <div className="pt-20 border-t border-[#f2f0ea] flex flex-col md:flex-row justify-center gap-20 md:gap-40">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.5em] block">Groom</span>
            <p className="text-2xl font-normal serif-kr text-[#2a2a2a]">황인준</p>
            <p className="text-stone-300 serif-en text-sm tracking-widest italic">010.2620.6424</p>
          </div>
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.5em] block">Bride</span>
            <p className="text-2xl font-normal serif-kr text-[#2a2a2a]">윤누리</p>
            <p className="text-stone-300 serif-en text-sm tracking-widest italic">010.6406.7539</p>
          </div>
        </div>

        <div className="mt-32">
          <p className="text-[10px] text-stone-200 font-bold tracking-[0.8em] uppercase serif-en italic">
            © 2026 NURI & INJUN · HISTORY OF US
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
