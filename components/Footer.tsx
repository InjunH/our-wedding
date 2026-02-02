import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, ChevronDown } from 'lucide-react';

// 더미 데이터 - 나중에 실제 정보로 교체
const contactData = {
  groom: {
    name: '황인준',
    phone: '010-2620-6424',
    father: { name: '故 황해연', phone: '', deceased: true },
    mother: { name: '한순영', phone: '010-4178-1411' },
  },
  bride: {
    name: '윤누리',
    phone: '010-6406-7539',
    father: { name: '윤충식', phone: '010-3559-7539' },
    mother: { name: '김미애', phone: '010-3793-7539' },
  },
};

const ContactButton: React.FC<{ href: string; icon: React.ReactNode }> = ({ href, icon }) => (
  <a
    href={href}
    className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:border-gold hover:text-gold transition-colors"
  >
    {icon}
  </a>
);

const Footer: React.FC = () => {
  const [isParentsOpen, setIsParentsOpen] = useState(false);

  return (
    <footer className="py-16 md:py-28 lg:py-40 px-6 bg-ivory text-center">
      <div className="max-w-3xl mx-auto space-y-12 md:space-y-20">
        {/* 감사 메시지 */}
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

        {/* 신랑 & 신부 연락처 */}
        <div className="pt-12 md:pt-16 border-t border-[#f2f0ea] flex flex-col md:flex-row justify-center gap-10 md:gap-20 lg:gap-40">
          <div className="space-y-4">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-[0.5em] block">신랑</span>
            <p className="text-2xl font-normal serif-kr text-[#2a2a2a]">{contactData.groom.name}</p>
            
            <div className="flex justify-center gap-2">
              <ContactButton
                href={`tel:${contactData.groom.phone.replace(/-/g, '')}`}
                icon={<Phone size={14} />}
              />
              <ContactButton
                href={`sms:${contactData.groom.phone.replace(/-/g, '')}`}
                icon={<MessageSquare size={14} />}
              />
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-[0.5em] block">신부</span>
            <p className="text-2xl font-normal serif-kr text-[#2a2a2a]">{contactData.bride.name}</p>
            
            <div className="flex justify-center gap-2">
              <ContactButton
                href={`tel:${contactData.bride.phone.replace(/-/g, '')}`}
                icon={<Phone size={14} />}
              />
              <ContactButton
                href={`sms:${contactData.bride.phone.replace(/-/g, '')}`}
                icon={<MessageSquare size={14} />}
              />
            </div>
          </div>
        </div>

        {/* 혼주 연락처 아코디언 */}
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setIsParentsOpen(!isParentsOpen)}
            className="w-full py-3 flex items-center justify-center gap-2 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <span className="text-xs tracking-widest">혼주에게 연락하기</span>
            <motion.div animate={{ rotate: isParentsOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isParentsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-6 pt-4 pb-6 text-left">
                  {/* 신랑 측 */}
                  <div className="space-y-3">
                    <span className="text-xs text-gold tracking-wider block text-center">신랑 측</span>
                    {/* 故 아버지 - 연락처 없음 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-300 mr-2">아버지</span>
                        <span className="text-sm serif-kr text-stone-400">{contactData.groom.father.name}</span>
                      </div>
                    </div>
                    {/* 어머니 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-300 mr-2">어머니</span>
                        <span className="text-sm serif-kr text-[#2a2a2a]">{contactData.groom.mother.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <ContactButton href={`tel:${contactData.groom.mother.phone.replace(/-/g, '')}`} icon={<Phone size={12} />} />
                        <ContactButton href={`sms:${contactData.groom.mother.phone.replace(/-/g, '')}`} icon={<MessageSquare size={12} />} />
                      </div>
                    </div>
                  </div>
                  {/* 신부 측 */}
                  <div className="space-y-3">
                    <span className="text-xs text-gold tracking-wider block text-center">신부 측</span>
                    {/* 아버지 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-300 mr-2">아버지</span>
                        <span className="text-sm serif-kr text-[#2a2a2a]">{contactData.bride.father.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <ContactButton href={`tel:${contactData.bride.father.phone.replace(/-/g, '')}`} icon={<Phone size={12} />} />
                        <ContactButton href={`sms:${contactData.bride.father.phone.replace(/-/g, '')}`} icon={<MessageSquare size={12} />} />
                      </div>
                    </div>
                    {/* 어머니 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-300 mr-2">어머니</span>
                        <span className="text-sm serif-kr text-[#2a2a2a]">{contactData.bride.mother.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <ContactButton href={`tel:${contactData.bride.mother.phone.replace(/-/g, '')}`} icon={<Phone size={12} />} />
                        <ContactButton href={`sms:${contactData.bride.mother.phone.replace(/-/g, '')}`} icon={<MessageSquare size={12} />} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 저작권 */}
        <div className="mt-16 md:mt-24">
          <p className="text-xs text-stone-200 font-bold tracking-[0.8em] uppercase serif-kr">
            © 2026 누리 & 인준
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
