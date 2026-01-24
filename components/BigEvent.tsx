
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { WEDDING_DATA } from '../constants';

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
    <section id="big-event" className="py-48 px-6 md:px-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="text-5xl md:text-7xl font-medium serif tracking-tight mb-4"
          >
            Invitation <br />
            <span className="italic text-gold font-light">to our Big Day</span>
          </motion.h2>
          <div className="h-px w-24 bg-gold mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center space-y-12"
          >
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.mins },
                { label: 'Secs', value: timeLeft.secs },
              ].map(unit => (
                <div key={unit.label} className="text-center py-4 border-b border-[#f0ede6]">
                  <span className="text-3xl font-light block mb-1 serif text-gold">{unit.value}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold">{unit.label}</span>
                </div>
              ))}
            </div>
            
            <p className="text-xl text-stone-400 font-light leading-relaxed serif italic text-center md:text-left">
              "우리의 역사가 하나로 합쳐지는 날, <br />그 가장 빛나는 순간에 함께 해주세요."
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-ivory p-10 md:p-16 border border-[#f0ede6] relative"
          >
            <div className="space-y-12">
              <div className="flex items-start gap-6">
                <Calendar className="text-gold shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3 text-stone-400">Date</h4>
                  <p className="text-2xl serif italic font-medium">Sunday, May 24, 2026</p>
                  <p className="text-stone-500 mt-1 flex items-center gap-2">
                    <Clock size={16} className="text-gold" /> 12:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <MapPin className="text-gold shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3 text-stone-400">Venue</h4>
                  <p className="text-2xl serif italic font-medium">{WEDDING_DATA.venue}</p>
                  <p className="text-stone-500 mt-1 font-light leading-relaxed">{WEDDING_DATA.venueAddress}</p>
                </div>
              </div>

              <div className="pt-8">
                <button
                  className="w-full py-5 bg-[#333] text-white font-bold text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 group hover:bg-gold transition-colors duration-500"
                  onClick={() => {
                    const el = document.getElementById('map-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Map & Directions <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
