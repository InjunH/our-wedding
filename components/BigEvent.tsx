
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { WEDDING_DATA } from '../constants';
import AddToCalendar from './AddToCalendar';

const BigEvent: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = WEDDING_DATA.weddingDate.getTime() - now;

      setTimeLeft({
        days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        mins: Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
        secs: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="big-event" className="py-60 px-6 md:px-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-light serif-kr tracking-tight-serif mb-6"
          >
            결혼합니다
          </motion.h2>
          <div className="h-px w-20 bg-gold mx-auto mt-10"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center space-y-16"
          >
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: '일', value: timeLeft.days },
                { label: '시간', value: timeLeft.hours },
                { label: '분', value: timeLeft.mins },
                { label: '초', value: timeLeft.secs },
              ].map(unit => (
                <div key={unit.label} className="text-center py-6 border-b border-[#f2f0ea]">
                  <span className="text-4xl font-light block mb-2 serif-en italic text-gold">{unit.value}</span>
                  <span className="text-[8px] uppercase tracking-[0.3em] text-stone-300 font-bold">{unit.label}</span>
                </div>
              ))}
            </div>

            <p className="text-xl text-stone-400 font-normal leading-[1.8] serif-kr italic text-center md:text-left">
              저희 두 사람이 부부가 되는 날,<br />
              함께해 주세요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-ivory p-12 md:p-20 border border-[#f2f0ea] relative"
          >
            <div className="space-y-16">
              <div className="flex items-start gap-8">
                <Calendar className="text-gold shrink-0 mt-1 opacity-60" size={24} strokeWidth={1} />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-4 text-stone-300">일시</h4>
                  <p className="text-3xl serif-kr font-medium tracking-tight-serif text-[#2a2a2a]">2026년 5월 24일 일요일</p>
                  <p className="text-stone-500 mt-2 flex items-center gap-2 serif-kr text-lg">
                    <Clock size={16} className="text-gold opacity-60" strokeWidth={1} /> 오후 1시 정각
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-8">
                <MapPin className="text-gold shrink-0 mt-1 opacity-60" size={24} strokeWidth={1} />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-4 text-stone-300">장소</h4>
                  <p className="text-3xl serif-kr font-medium tracking-tight-serif text-[#2a2a2a]">{WEDDING_DATA.venue1}</p>
                  <p className="text-3xl serif-kr font-medium tracking-tight-serif text-[#2a2a2a]">{WEDDING_DATA.venue2}</p>
                  <p className="text-stone-400 mt-3 font-normal serif-kr text-lg leading-relaxed">{WEDDING_DATA.venueAddress}</p>
                </div>
              </div>

              <div className="pt-10 space-y-6">
                <AddToCalendar />
                <button
                  className="w-full py-6 bg-[#2a2a2a] text-white font-bold text-[10px] uppercase tracking-[0.6em] flex items-center justify-center gap-4 group hover:bg-gold transition-all duration-700"
                  onClick={() => {
                    const el = document.getElementById('map-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  지도 보기 <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BigEvent;
