
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-32 px-6 bg-[#faf9f6] text-center">
      <div className="max-w-2xl mx-auto space-y-16">
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-[#c5a059] tracking-[0.6em] uppercase">Closing</span>
          <h3 className="text-4xl font-medium serif italic tracking-tight text-[#333]">
            With All Our <span className="text-[#c5a059]">Love</span>.
          </h3>
        </div>
        
        <p className="text-stone-400 font-light text-lg serif italic leading-loose">
          누구보다 치열하게 사랑했고,<br />
          이제는 평온한 쉼표가 되려 합니다.
        </p>

        <div className="pt-16 border-t border-[#f0ede6] flex flex-col md:flex-row justify-center gap-16 md:gap-32">
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.4em] block">Groom</span>
            <p className="text-lg font-medium serif italic text-[#333]">Injun Park</p>
            <p className="text-stone-400 text-xs">010-XXXX-XXXX</p>
          </div>
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.4em] block">Bride</span>
            <p className="text-lg font-medium serif italic text-[#333]">Nuri Kim</p>
            <p className="text-stone-400 text-xs">010-XXXX-XXXX</p>
          </div>
        </div>

        <div className="mt-24">
          <p className="text-[9px] text-stone-300 font-bold tracking-[0.5em] uppercase italic serif">
            © 2026 NURI & INJUN
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
