
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import GuestBookCard from './GuestBookCard';
import { GuestBookEntry } from '../types';

interface GuestBookListProps {
  entries: GuestBookEntry[];
  loading: boolean;
}

const GuestBookList: React.FC<GuestBookListProps> = ({ entries, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-stone-400 text-sm serif-kr">메시지를 불러오는 중...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <MessageSquare size={40} className="text-stone-300 mb-4" strokeWidth={1} />
        <p className="text-stone-400 text-sm serif-kr leading-relaxed">
          아직 작성된 메시지가 없습니다.
          <br />
          첫 번째 축하 메시지를 남겨주세요!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {entries.map((entry, index) => (
        <GuestBookCard key={entry.id} entry={entry} index={index} />
      ))}
    </div>
  );
};

export default GuestBookList;
