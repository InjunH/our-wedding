
import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { GuestBookEntry } from '../types';

interface GuestBookCardProps {
  entry: GuestBookEntry;
  index: number;
}

const GuestBookCard: React.FC<GuestBookCardProps> = ({ entry, index }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getSideLabel = (side?: 'groom' | 'bride' | 'both') => {
    switch (side) {
      case 'groom':
        return '신랑측';
      case 'bride':
        return '신부측';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white p-6 border border-[#f2f0ea] hover:border-gold/30 transition-all duration-300"
    >
      <div className="flex items-start gap-5">
        <div className="w-10 h-10 bg-[#faf9f6] rounded-full flex items-center justify-center shrink-0">
          <User size={16} className="text-gold opacity-60" strokeWidth={1} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="serif-kr font-normal text-[#2a2a2a]">{entry.name}</span>
            {entry.side && (
              <span className="text-[9px] px-2 py-0.5 bg-[#faf9f6] text-stone-400 uppercase tracking-wider">
                {getSideLabel(entry.side)}
              </span>
            )}
          </div>
          <p className="text-stone-500 text-sm leading-[1.8] whitespace-pre-wrap break-words serif-kr">
            {entry.message}
          </p>
          <p className="text-[10px] text-stone-300 mt-4 tracking-wider">
            {formatDate(entry.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GuestBookCard;
