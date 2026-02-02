
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
    <section className="py-48 px-6 md:px-12 bg-[#faf9f6]">
      <div className="max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-gold text-[10px] font-bold tracking-[0.7em] uppercase mb-6 block">함께 만드는 추억</span>
          <h2 className="text-5xl md:text-6xl serif-kr font-normal mb-6 text-[#2a2a2a]">
            함께한 순간을 나눠주세요
          </h2>
          <p className="text-stone-400 serif-kr text-lg leading-relaxed max-w-xl mx-auto">
            핸드폰 문제로 예전 사진들을 많이 잃어버렸습니다.<br />
            가족, 친구, 회사 동료분들께서 누리, 인준과 함께 찍은 사진이 있다면<br />
            공유해 주세요. 여러분의 사진으로 우리의 타임라인을 채우고 싶습니다.
          </p>
          <div className="h-px w-20 bg-gold mx-auto mt-10 opacity-50"></div>
        </motion.div>

        {/* 추억 슬라이더 */}
        <MemorySlider
          guestbookEntries={entries}
          onOpenTimeline={() => setShowTimeline(true)}
        />

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
        <div className="flex flex-col lg:flex-row lg:gap-12 lg:items-start">
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
