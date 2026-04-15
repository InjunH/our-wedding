import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, X, Copy, Check, Heart } from 'lucide-react';
import { useIsMobile } from '../hooks/useMediaQuery';

// 더미 데이터 - 나중에 실제 정보로 교체
const contactData = {
  groom: {
    name: '황인준',
    phone: '010-2620-6424',
    bank: '신한은행',
    account: '110-276-854237',
    father: { name: '故 황해연', phone: '', deceased: true },
    mother: { name: '한순영', phone: '010-4178-1411', bank: '농협', account: '966-02-024872' },
  },
  bride: {
    name: '윤누리',
    phone: '010-6406-7539',
    bank: '토스뱅크',
    account: '1000-1432-9188',
    father: { name: '윤충식', phone: '010-3559-7539', bank: 'KB국민은행', account: '667-21-0634-723' },
    mother: { name: '김미애', phone: '010-3793-7539', bank: '하나은행', account: '132910-322-29507' },
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

const AccountCopyRow: React.FC<{ label: string; name: string; bank: string; account: string }> = ({ label, name, bank, account }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-b-0">
      <div className="text-left">
        <div>
          <span className="text-xs text-stone-400 mr-1.5">{label}</span>
          <span className="text-sm serif-kr text-[#2a2a2a]">{name}</span>
        </div>
        <p className="text-xs text-stone-400 mt-1">{bank} {account}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-stone-200 text-xs text-stone-400 hover:border-gold hover:text-gold transition-colors shrink-0 ml-3"
      >
        {copied ? <><Check size={12} /> 복사됨</> : <><Copy size={12} /> 복사</>}
      </button>
    </div>
  );
};

const AccountSheet: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const isMobile = useIsMobile();

  const content = (
    <div className="space-y-4">
      {/* 신랑 측 */}
      <div>
        <span className="text-xs text-gold tracking-wider block text-center mb-1">신랑 측</span>
        <AccountCopyRow label="신랑" name={contactData.groom.name} bank={contactData.groom.bank} account={contactData.groom.account} />
        <AccountCopyRow label="어머니" name={contactData.groom.mother.name} bank={contactData.groom.mother.bank!} account={contactData.groom.mother.account!} />
      </div>
      {/* 신부 측 */}
      <div>
        <span className="text-xs text-gold tracking-wider block text-center mb-1">신부 측</span>
        <AccountCopyRow label="신부" name={contactData.bride.name} bank={contactData.bride.bank} account={contactData.bride.account} />
        <AccountCopyRow label="아버지" name={contactData.bride.father.name} bank={contactData.bride.father.bank!} account={contactData.bride.father.account!} />
        <AccountCopyRow label="어머니" name={contactData.bride.mother.name} bank={contactData.bride.mother.bank!} account={contactData.bride.mother.account!} />
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {isMobile ? (
            /* 모바일: 바텀시트 */
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-2xl flex flex-col"
              style={{ height: '60vh' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-stone-300" />
              </div>
              <div className="flex items-center justify-between px-6 pt-1 pb-3 shrink-0">
                <h3 className="text-lg serif-kr font-light text-[#2a2a2a]">마음 전하기</h3>
                <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 pb-6 overflow-y-auto flex-1 min-h-0">
                {content}
              </div>
            </motion.div>
          ) : (
            /* PC: 센터 모달 */
            <motion.div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-8 py-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg serif-kr font-light text-[#2a2a2a]">마음 전하기</h3>
                    <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
                      <X size={20} />
                    </button>
                  </div>
                  {content}
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

const Footer: React.FC = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <>
    <footer className="py-16 md:py-28 lg:py-40 px-6 bg-ivory text-center">
      <div className="max-w-3xl mx-auto space-y-12 md:space-y-20">
        {/* 인사 메시지 */}
        <div className="space-y-6">
          <span className="text-xs font-bold text-gold tracking-[0.7em] uppercase">연락처</span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light serif-kr tracking-tight-serif text-[#2a2a2a]">
            늘, <span className="text-gold font-extralight">함께.</span>
          </h3>
          <div className="h-px w-12 bg-gold mx-auto opacity-30"></div>
        </div>

        <p className="text-stone-400 font-normal text-xl serif-kr italic leading-[2.2]">
          축하의 마음을 전해주시면<br />
          감사히 간직하겠습니다.
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

        {/* 혼주 연락처 */}
        <div className="max-w-md mx-auto">
          <span className="text-xs tracking-widest text-stone-400 block text-center py-3">혼주에게 연락하기</span>
          <div>
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
          </div>
        </div>

        {/* 마음 전하기 버튼 */}
        <div className="space-y-3">
          <button
            onClick={() => setIsAccountOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gold text-white text-base hover:bg-[#a88a47] transition-colors shadow-md"
          >
            <Heart size={18} />
            <span className="tracking-widest font-medium">마음 전하기</span>
          </button>
          <p className="text-xs text-stone-400">축의금 계좌번호 확인</p>
        </div>

        {/* 저작권 */}
        <div className="mt-16 md:mt-24">
          <p className="text-xs text-stone-200 font-bold tracking-[0.8em] uppercase serif-kr">
            © 2026 누리 & 인준
          </p>
        </div>
      </div>
    </footer>
    <AccountSheet isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </>
  );
};

export default Footer;
