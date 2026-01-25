
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useS3Photos } from '../hooks/useS3Photos';
import { GuestBookEntry } from '../types';
import { S3Object } from '../lib/s3';
import { getImageDateTaken } from '../lib/exif-utils';

interface TimelineItem {
  id: string;
  type: 'history' | 'guestbook';
  url: string;
  date: Date;
  exifDate?: Date | null;
  name?: string;
  message?: string;
}

interface MemoryTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  guestbookEntries: GuestBookEntry[];
}

// 타임라인 시작일: 2023년 4월
const TIMELINE_START = new Date(2023, 3, 1);

const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ isOpen, onClose, guestbookEntries }) => {
  const { photos: historyPhotos } = useS3Photos('history/');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [exifDates, setExifDates] = useState<Map<string, Date | null>>(new Map());
  const timelineBarRef = useRef<HTMLDivElement>(null);

  const handleImageError = (id: string) => {
    setFailedImages(prev => new Set(prev).add(id));
  };

  // EXIF 날짜 로드
  useEffect(() => {
    if (!isOpen) return;

    const loadExifDates = async () => {
      const urls: string[] = [
        ...historyPhotos.map(p => p.url),
        ...guestbookEntries.filter(e => e.photoUrl).map(e => e.photoUrl!),
      ];

      for (const url of urls) {
        if (!exifDates.has(url)) {
          const date = await getImageDateTaken(url);
          if (date) {
            setExifDates(prev => new Map(prev).set(url, date));
          }
        }
      }
    };

    loadExifDates();
  }, [isOpen, historyPhotos, guestbookEntries]);

  // history 사진과 guestbook 사진을 합쳐서 타임라인 생성
  const allItems: TimelineItem[] = React.useMemo(() => {
    const items: TimelineItem[] = [];

    // history 폴더 사진 추가
    historyPhotos.forEach((photo: S3Object) => {
      const exifDate = exifDates.get(photo.url);
      items.push({
        id: `history-${photo.key}`,
        type: 'history',
        url: photo.url,
        date: exifDate || new Date(photo.lastModified),
        exifDate,
      });
    });

    // 방명록 사진 추가 (사진이 있는 것만)
    guestbookEntries.filter(entry => entry.photoUrl).forEach((entry) => {
      const exifDate = exifDates.get(entry.photoUrl!);
      items.push({
        id: `guestbook-${entry.id}`,
        type: 'guestbook',
        url: entry.photoUrl!,
        date: exifDate || entry.createdAt,
        exifDate,
        name: entry.name,
        message: entry.message,
      });
    });

    // 날짜순 정렬 (오래된 순 -> 최신순)
    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [historyPhotos, guestbookEntries, exifDates]);

  // 로드 실패한 이미지 제외
  const timelineItems = allItems.filter(item => !failedImages.has(item.id));

  const currentItem = timelineItems[selectedIndex];

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? timelineItems.length - 1 : prev - 1));
  }, [timelineItems.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === timelineItems.length - 1 ? 0 : prev + 1));
  }, [timelineItems.length]);

  // 인덱스 범위 조정
  useEffect(() => {
    if (selectedIndex >= timelineItems.length && timelineItems.length > 0) {
      setSelectedIndex(0);
    }
  }, [selectedIndex, timelineItems.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, goToPrevious, goToNext, onClose]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // 현재 날짜
  const now = new Date();

  // 타임라인의 총 개월 수 계산
  const totalMonths = (now.getFullYear() - TIMELINE_START.getFullYear()) * 12 +
    (now.getMonth() - TIMELINE_START.getMonth()) + 1;

  // 월 목록 생성
  const months = Array.from({ length: totalMonths }, (_, i) => {
    const date = new Date(TIMELINE_START.getFullYear(), TIMELINE_START.getMonth() + i, 1);
    return date;
  });

  // 날짜를 타임라인 위치(%)로 변환
  const getPositionPercent = (date: Date) => {
    const startTime = TIMELINE_START.getTime();
    const endTime = now.getTime();
    const dateTime = date.getTime();

    if (dateTime < startTime) return 0;
    if (dateTime > endTime) return 100;

    return ((dateTime - startTime) / (endTime - startTime)) * 100;
  };

  // 월 포맷
  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', { month: 'short' }).format(date);
  };

  // 연도가 바뀌는 월인지 확인
  const isYearStart = (date: Date, index: number) => {
    return index === 0 || date.getMonth() === 0;
  };

  // 선택된 아이템이 변경되면 타임라인 바 스크롤
  useEffect(() => {
    if (timelineBarRef.current && currentItem) {
      const position = getPositionPercent(currentItem.date);
      const scrollWidth = timelineBarRef.current.scrollWidth;
      const clientWidth = timelineBarRef.current.clientWidth;
      const targetScroll = (position / 100) * scrollWidth - clientWidth / 2;
      timelineBarRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [selectedIndex, currentItem]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex flex-col"
        onClick={onClose}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
          <div className="text-white/80">
            <h3 className="text-lg serif-kr">누리 & 인준의 추억</h3>
            <p className="text-sm text-white/50">{selectedIndex + 1} / {timelineItems.length}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2"
          >
            <X size={28} />
          </button>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex items-center justify-center relative px-4" onClick={(e) => e.stopPropagation()}>
          {/* 이전 버튼 */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-8 text-white/50 hover:text-white transition-colors z-10 p-2"
          >
            <ChevronLeft size={40} />
          </button>

          {/* 이미지 & 정보 */}
          {currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full"
            >
              <div className="relative">
                <img
                  src={currentItem.url}
                  alt="추억"
                  className="max-h-[60vh] w-auto mx-auto object-contain rounded-sm"
                  onError={() => handleImageError(currentItem.id)}
                />

                {/* 방명록 사진인 경우 정보 표시 */}
                {currentItem.type === 'guestbook' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Heart size={14} className="text-gold" />
                      <span className="text-white serif-kr">{currentItem.name}</span>
                    </div>
                    {currentItem.message && (
                      <p className="text-white/80 text-sm serif-kr line-clamp-2">
                        {currentItem.message}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* 날짜 */}
              <p className="text-center text-white/40 text-sm mt-4 serif-kr">
                {formatDate(currentItem.date)}
              </p>
            </motion.div>
          )}

          {/* 다음 버튼 */}
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-8 text-white/50 hover:text-white transition-colors z-10 p-2"
          >
            <ChevronRight size={40} />
          </button>
        </div>

        {/* 하단 타임라인 바 */}
        <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
          {/* 스크롤 가능한 타임라인 */}
          <div
            ref={timelineBarRef}
            className="overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#b8860b #333' }}
          >
            <div
              className="relative"
              style={{ minWidth: `${Math.max(800, totalMonths * 40)}px` }}
            >
              {/* 연도 라벨 */}
              <div className="relative h-5 mb-1">
                {months.map((month, idx) => (
                  isYearStart(month, idx) && (
                    <div
                      key={month.getFullYear()}
                      className="absolute text-xs text-white/60 font-medium"
                      style={{ left: `${(idx / totalMonths) * 100}%` }}
                    >
                      {month.getFullYear()}
                    </div>
                  )
                ))}
              </div>

              {/* 타임라인 컨테이너 */}
              <div className="relative h-16 bg-white/10 rounded-lg overflow-visible">
                {/* 월 구분선 */}
                <div className="absolute inset-0 flex">
                  {months.map((month, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 border-r border-white/10 last:border-r-0 relative ${
                        isYearStart(month, idx) ? 'border-l border-l-white/30' : ''
                      }`}
                    >
                      {/* 월 라벨 */}
                      <span
                        className={`absolute bottom-1 left-1 text-[9px] ${
                          isYearStart(month, idx) ? 'text-white/50' : 'text-white/20'
                        }`}
                      >
                        {formatMonth(month)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 사진 도트들 */}
                <div className="absolute inset-0">
                  {timelineItems.map((item, index) => {
                    const position = getPositionPercent(item.date);
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        key={item.id}
                        className="absolute transition-all duration-200"
                        style={{
                          left: `${position}%`,
                          top: '50%',
                          transform: `translate(-50%, -50%) scale(${isSelected ? 1.3 : 1})`,
                          zIndex: isSelected ? 20 : 10,
                        }}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <div
                          className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                            isSelected
                              ? 'border-gold ring-2 ring-gold/50'
                              : 'border-white/50 hover:border-gold/70'
                          }`}
                          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                        >
                          <img
                            src={item.url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(item.id)}
                          />
                        </div>
                        {item.type === 'guestbook' && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                            <Heart size={8} className="text-gold fill-gold" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 현재 위치 표시선 */}
                {currentItem && (
                  <motion.div
                    className="absolute top-0 bottom-0 w-0.5 bg-gold"
                    style={{ left: `${getPositionPercent(currentItem.date)}%` }}
                    layoutId="timeline-indicator"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemoryTimeline;
