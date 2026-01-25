
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GuestBookEntry } from '../types';

interface GuestBookCardProps {
  entry: GuestBookEntry;
  index: number;
}

const GuestBookCard: React.FC<GuestBookCardProps> = ({ entry, index }) => {
  const [showFullImage, setShowFullImage] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'numeric',
      day: 'numeric',
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

  // 랜덤 회전 각도 (-3 ~ 3도)
  const rotation = ((index % 7) - 3) * 1.5;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
        className="bg-white p-3 border border-[#f2f0ea] hover:border-gold/30 transition-all duration-300 h-full"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* 사진이 있으면 상단에 표시 */}
        {entry.photoUrl && (
          <div
            className="relative mb-2 cursor-pointer"
            onClick={() => setShowFullImage(true)}
          >
            <img
              src={entry.photoUrl}
              alt={`${entry.name}님의 추억`}
              className="w-full h-24 object-cover rounded-sm"
              loading="lazy"
            />
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="serif-kr text-xs font-medium text-[#2a2a2a] truncate">{entry.name}</span>
            {entry.side && (
              <span className="text-[8px] px-1.5 py-0.5 bg-[#faf9f6] text-stone-400">
                {getSideLabel(entry.side)}
              </span>
            )}
          </div>
          <p className="text-stone-500 text-[11px] leading-relaxed line-clamp-3 serif-kr">
            {entry.message}
          </p>
          <p className="text-[9px] text-stone-300">
            {formatDate(entry.createdAt)}
          </p>
        </div>
      </motion.div>

      {/* 풀스크린 이미지 모달 */}
      {showFullImage && entry.photoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
          >
            <X size={32} />
          </button>
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={entry.photoUrl}
            alt={`${entry.name}님의 추억`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>
  );
};

export default GuestBookCard;
