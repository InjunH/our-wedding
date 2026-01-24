
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
      className="bg-white p-6 border border-stone-100 rounded-lg shadow-sm hover:shadow-md hover:border-gold/40 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 bg-gradient-to-br from-gold/10 to-gold/5 rounded-full flex items-center justify-center shrink-0 ring-1 ring-gold/20">
          <User size={18} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-serif font-medium">{entry.name}</span>
            {entry.side && (
              <span className="text-[10px] px-2.5 py-1 bg-gold/10 text-gold rounded-full tracking-wide">
                {getSideLabel(entry.side)}
              </span>
            )}
          </div>
          <p className="text-stone-600 text-sm leading-7 whitespace-pre-wrap break-words">
            {entry.message}
          </p>
          <p className="text-[10px] text-stone-400 mt-3">
            {formatDate(entry.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GuestBookCard;
