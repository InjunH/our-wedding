
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, PenLine, X } from 'lucide-react';
import GuestBookForm from './GuestBookForm';
import GuestBookList from './GuestBookList';
import MemorySlider from './MemorySlider';
import MemoryTimeline from './MemoryTimeline';
import { useGuestBook } from '../hooks/useGuestBook';
import { useIsMobile } from '../hooks/useMediaQuery';

const GuestBook: React.FC = () => {
  const { entries, loading, error, submitting, addEntry } = useGuestBook();
  const [showTimeline, setShowTimeline] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (data: Parameters<typeof addEntry>[0]) => {
    await addEntry(data);
    setShowMobileForm(false);
  };

  return (
    <section className="py-16 md:py-32 lg:py-48 px-6 md:px-12 bg-[#faf9f6]">
      <div className="max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="text-gold text-xs font-bold tracking-[0.7em] uppercase mb-6 block">방명록</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl serif-kr font-normal mb-6 text-[#2a2a2a]">
            마음을 남겨주세요
          </h2>
          <p className="text-stone-400 serif-kr text-lg leading-relaxed max-w-xl mx-auto">
            축하의 한마디와 함께 찍은 사진이 있다면 같이 남겨주세요.<br />
            여러분의 따뜻한 마음이 우리에게 가장 소중한 선물입니다.
          </p>
          <div className="h-px w-20 bg-gold mx-auto mt-10 opacity-50"></div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm max-w-4xl mx-auto"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PC: 좌우 배치 */}
        <div className="flex flex-col lg:flex-row lg:gap-12 lg:items-start">
          {/* 폼 (PC only) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block lg:flex-[1] lg:sticky lg:top-24"
          >
            <GuestBookForm onSubmit={addEntry} submitting={submitting} />
          </motion.div>

          {/* 메시지 목록 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:flex-[1.5]"
          >
            {/* 모바일: 메시지 작성 버튼 (목록 위) */}
            {isMobile && (
              <button
                onClick={() => setShowMobileForm(true)}
                className="w-full mb-6 py-3.5 flex items-center justify-center gap-2 border border-gold/30 rounded-lg text-sm text-gold hover:bg-gold/5 transition-colors"
              >
                <PenLine size={16} />
                <span className="tracking-wider">메시지 남기기</span>
              </button>
            )}
            <GuestBookList entries={entries} loading={loading} />
          </motion.div>
        </div>

        {/* 모바일: 바텀시트 폼 */}
        <AnimatePresence>
          {isMobile && showMobileForm && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileForm(false)}
              />
              <motion.div
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-stone-300" />
                </div>
                <div className="px-5 pb-8 pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg serif-kr font-light text-[#2a2a2a]">메시지 작성</h3>
                    <button onClick={() => setShowMobileForm(false)} className="p-1 text-stone-400 hover:text-stone-600">
                      <X size={20} />
                    </button>
                  </div>
                  <GuestBookForm onSubmit={handleSubmit} submitting={submitting} hideHeader />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 추억 슬라이더 */}
        <MemorySlider
          guestbookEntries={entries}
          onOpenTimeline={() => setShowTimeline(true)}
        />
      </div>

      {/* 타임라인 모달 */}
      <MemoryTimeline
        isOpen={showTimeline}
        onClose={() => setShowTimeline(false)}
        guestbookEntries={entries}
      />
    </section>
  );
};

export default GuestBook;
