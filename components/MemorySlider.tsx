
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Play } from 'lucide-react';
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

interface MemorySliderProps {
  guestbookEntries: GuestBookEntry[];
  onOpenTimeline: () => void;
}

const MemorySlider: React.FC<MemorySliderProps> = ({ guestbookEntries, onOpenTimeline }) => {
  const { photos: historyPhotos } = useS3Photos('history/');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [exifDates, setExifDates] = useState<Map<string, Date | null>>(new Map());

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

  // EXIF 날짜 로드
  useEffect(() => {
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
  }, [historyPhotos, guestbookEntries]);

  // 로드 실패한 이미지 제외
  const timelineItems = allItems.filter(item => !failedImages.has(item.id));

  const handleImageError = (id: string) => {
    setFailedImages(prev => new Set(prev).add(id));
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? timelineItems.length - 1 : prev - 1));
  }, [timelineItems.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === timelineItems.length - 1 ? 0 : prev + 1));
  }, [timelineItems.length]);

  // 자동 슬라이드
  useEffect(() => {
    if (timelineItems.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [goToNext, timelineItems.length]);

  // 인덱스 범위 조정
  useEffect(() => {
    if (currentIndex >= timelineItems.length && timelineItems.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, timelineItems.length]);

  if (timelineItems.length === 0) {
    return null;
  }

  const currentItem = timelineItems[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-16">
      {/* 메인 슬라이더 */}
    

      {/* 전체보기 버튼 */}
      <div className="text-center mt-6">
        <button
          onClick={onOpenTimeline}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/50 text-gold rounded-full transition-all serif-kr text-sm"
        >
          <Play size={14} />
          <span>{timelineItems.length}장의 추억 타임라인 보기</span>
        </button>
      </div>
    </div>
  );
};

export default MemorySlider;
