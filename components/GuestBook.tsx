
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import GuestBookForm from './GuestBookForm';
import GuestBookList from './GuestBookList';
import MemorySlider from './MemorySlider';
import MemoryTimeline from './MemoryTimeline';
import { useGuestBook } from '../hooks/useGuestBook';

const GuestBook: React.FC = () => {
  const { entries, loading, error, submitting, addEntry } = useGuestBook();
  const [showTimeline, setShowTimeline] = useState(false);

  return (
    <section className="py-16 md:py-32 lg:py-48 px-6 md:px-12 bg-[#faf9f6]">
      <div className="max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="text-gold text-xs font-bold tracking-[0.7em] uppercase mb-6 block">축하의 한마디</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl serif-kr font-normal mb-6 text-[#2a2a2a]">
            결혼식 사진을 함께 나눠요
          </h2>
          <p className="text-stone-400 serif-kr text-lg leading-relaxed max-w-xl mx-auto">
            결혼식 당일 찍은 사진이 있다면 공유해 주세요.<br />
            여러분의 시선으로 담긴 순간들이 우리에게 가장 소중한 선물입니다.
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

        {/* PC: 좌우 배치, 모바일: 세로 배치 */}
        <div className="flex flex-col-reverse lg:flex-row lg:gap-12 lg:items-start">
          {/* 폼 (PC: 좌측) - 1 비율 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 lg:mb-0 lg:flex-[1] lg:sticky lg:top-24"
          >
            <GuestBookForm onSubmit={addEntry} submitting={submitting} />
          </motion.div>

          {/* 메시지 목록 (PC: 우측) - 1.5 비율 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:flex-[1.5]"
          >
            <GuestBookList entries={entries} loading={loading} />
          </motion.div>
        </div>

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
