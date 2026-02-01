import React, { useState, useCallback, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useS3Photos } from '../hooks/useS3Photos';
import { GuestBookEntry } from '../types';
import { S3Object, getThumbnailOriginalUrl } from '../lib/s3';
import { getImageDateTaken } from '../lib/exif-utils';

// 지연 로딩 이미지 컴포넌트
const LazyImage = memo(({ src, alt, className, onError }: {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={onError}
        />
      ) : (
        <div className="w-full h-full bg-white/20 animate-pulse" />
      )}
    </div>
  );
});

interface TimelineItem {
  id: string;
  type: 'history' | 'guestbook';
  url: string;  // 썸네일 URL (S3에서 가져온 것)
  date: Date;
  exifDate?: Date | null;
  name?: string;
  message?: string;
}

interface ClusteredItem {
  items: { item: TimelineItem; index: number }[];
  position: number;
  dateKey: string;
}

interface MemoryTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  guestbookEntries: GuestBookEntry[];
}

// 타임라인 시작일: 2024년 4월
const TIMELINE_START = new Date(2024, 3, 1);

// 스와이프 감지를 위한 최소 거리
const SWIPE_THRESHOLD = 50;

const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ isOpen, onClose, guestbookEntries }) => {
  const {
    photos: historyPhotos,
    loading: photosLoading,
    loadingMore,
    hasMore,
    loadMore
  } = useS3Photos('history/', true);  // 썸네일만 로드
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [originalUrls, setOriginalUrls] = useState<Map<string, string>>(new Map());
  const timelineBarRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 100 });
  const rafRef = useRef<number | null>(null);

  // 스와이프 관련 상태
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // 썸네일 URL에서 원본 URL 도출 (캐시 사용)
  const getOriginalUrl = useCallback((thumbnailUrl: string): string => {
    if (originalUrls.has(thumbnailUrl)) {
      return originalUrls.get(thumbnailUrl)!;
    }

    const originalUrl = getThumbnailOriginalUrl(thumbnailUrl);
    setOriginalUrls(prev => new Map(prev).set(thumbnailUrl, originalUrl));

    return originalUrl;
  }, [originalUrls]);

  const handleImageError = (id: string) => {
    setFailedImages(prev => new Set(prev).add(id));
  };

  // 현재 날짜
  const now = useMemo(() => new Date(), []);

  // 날짜를 타임라인 위치(%)로 변환
  const getPositionPercent = useCallback((date: Date) => {
    const startTime = TIMELINE_START.getTime();
    const endTime = now.getTime();
    const dateTime = date.getTime();

    if (dateTime < startTime) return 0;
    if (dateTime > endTime) return 100;

    return ((dateTime - startTime) / (endTime - startTime)) * 100;
  }, [now]);

  // history 사진과 guestbook 사진을 합쳐서 타임라인 생성
  const allItems: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [];

    historyPhotos.forEach((photo: S3Object) => {
      const extractedDate = getImageDateTaken(photo.url);
      items.push({
        id: `history-${photo.key}`,
        type: 'history',
        url: photo.url,  // 썸네일 URL
        date: extractedDate || new Date(photo.lastModified),
        exifDate: extractedDate,
      });
    });

    guestbookEntries.filter(entry => entry.photoUrl).forEach((entry) => {
      const extractedDate = getImageDateTaken(entry.photoUrl!);
      items.push({
        id: `guestbook-${entry.id}`,
        type: 'guestbook',
        url: entry.photoUrl!,
        date: extractedDate || entry.createdAt,
        exifDate: extractedDate,
        name: entry.name,
        message: entry.message,
      });
    });

    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [historyPhotos, guestbookEntries]);

  const timelineItems = allItems.filter(item => !failedImages.has(item.id));
  const currentItem = timelineItems[selectedIndex];

  // 클러스터링: 같은 날짜의 사진들을 그룹화
  const clusteredItems = useMemo(() => {
    const clusters: ClusteredItem[] = [];
    const clusterMap = new Map<string, ClusteredItem>();

    timelineItems.forEach((item, index) => {
      const dateKey = `${item.date.getFullYear()}-${item.date.getMonth()}-${item.date.getDate()}`;
      const position = getPositionPercent(item.date);

      if (clusterMap.has(dateKey)) {
        clusterMap.get(dateKey)!.items.push({ item, index });
      } else {
        const cluster: ClusteredItem = {
          items: [{ item, index }],
          position,
          dateKey,
        };
        clusterMap.set(dateKey, cluster);
        clusters.push(cluster);
      }
    });

    return clusters;
  }, [timelineItems, getPositionPercent]);

  // 보이는 범위의 클러스터만 필터링
  const visibleClusters = useMemo(() => {
    return clusteredItems.filter(cluster => {
      const isVisible = cluster.position >= visibleRange.start && cluster.position <= visibleRange.end;
      const hasSelectedItem = cluster.items.some(({ index }) => index === selectedIndex);
      return isVisible || hasSelectedItem;
    });
  }, [clusteredItems, visibleRange, selectedIndex]);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? timelineItems.length - 1 : prev - 1));
  }, [timelineItems.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === timelineItems.length - 1 ? 0 : prev + 1));
  }, [timelineItems.length]);

  // 스와이프 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;

    // 수평 스와이프가 수직보다 클 때만 처리
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    touchStartRef.current = null;
  }, [goToPrevious, goToNext]);

  // 월별 빠른 이동
  const jumpToMonth = useCallback((monthDate: Date) => {
    const targetTime = monthDate.getTime();
    let closestIndex = 0;
    let closestDiff = Infinity;

    timelineItems.forEach((item, index) => {
      const diff = Math.abs(item.date.getTime() - targetTime);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = index;
      }
    });

    setSelectedIndex(closestIndex);
  }, [timelineItems]);

  // 인덱스 범위 조정
  useEffect(() => {
    if (selectedIndex >= timelineItems.length && timelineItems.length > 0) {
      setSelectedIndex(0);
    }
  }, [selectedIndex, timelineItems.length]);

  // 키보드 이벤트
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

  // 타임라인 총 개월 수
  const totalMonths = (now.getFullYear() - TIMELINE_START.getFullYear()) * 12 +
    (now.getMonth() - TIMELINE_START.getMonth()) + 1;

  const months = useMemo(() => Array.from({ length: totalMonths }, (_, i) => {
    return new Date(TIMELINE_START.getFullYear(), TIMELINE_START.getMonth() + i, 1);
  }), [totalMonths]);

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', { month: 'short' }).format(date);
  };

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
  }, [selectedIndex, currentItem, getPositionPercent]);

  // 스크롤 최적화 (requestAnimationFrame)
  useEffect(() => {
    const container = timelineBarRef.current;
    if (!container) return;

    let ticking = false;

    const updateVisibleRange = () => {
      const scrollLeft = container.scrollLeft;
      const clientWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;

      const buffer = 20;
      const startPercent = Math.max(0, (scrollLeft / scrollWidth) * 100 - buffer);
      const endPercent = Math.min(100, ((scrollLeft + clientWidth) / scrollWidth) * 100 + buffer);

      setVisibleRange({ start: startPercent, end: endPercent });
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(updateVisibleRange);
        ticking = true;
      }
    };

    updateVisibleRange();
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isOpen]);

  // 인접 이미지 프리로드 (원본 URL)
  useEffect(() => {
    if (!currentItem) return;

    const preloadImages = [
      timelineItems[selectedIndex - 1]?.url,
      timelineItems[selectedIndex + 1]?.url,
    ].filter(Boolean);

    preloadImages.forEach(url => {
      const img = new Image();
      img.src = getOriginalUrl(url!);
    });
  }, [selectedIndex, timelineItems, currentItem, getOriginalUrl]);

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
            <h3 className="text-lg serif-kr">우리의 순간들</h3>
            <p className="text-sm text-white/50">{selectedIndex + 1} / {timelineItems.length}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2"
          >
            <X size={28} />
          </button>
        </div>

        {/* 메인 컨텐츠 (스와이프 지원) */}
        <div
          ref={mainContentRef}
          className="flex-1 flex items-center justify-center relative px-4"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl w-full"
            >
              <div className="relative">
                <img
                  src={getOriginalUrl(currentItem.url)}
                  alt="추억"
                  className="max-h-[60vh] w-auto mx-auto object-contain rounded-sm"
                  loading="eager"
                  decoding="async"
                  onError={() => handleImageError(currentItem.id)}
                />

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
                {/* 월 구분선 (클릭으로 빠른 이동) */}
                <div className="absolute inset-0 flex">
                  {months.map((month, idx) => (
                    <button
                      key={idx}
                      onClick={() => jumpToMonth(month)}
                      className={`flex-1 border-r border-white/10 last:border-r-0 relative hover:bg-white/5 transition-colors ${
                        isYearStart(month, idx) ? 'border-l border-l-white/30' : ''
                      }`}
                    >
                      <span
                        className={`absolute bottom-1 left-1 text-[9px] ${
                          isYearStart(month, idx) ? 'text-white/50' : 'text-white/20'
                        }`}
                      >
                        {formatMonth(month)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* 클러스터된 사진 도트들 */}
                <div className="absolute inset-0 pointer-events-none">
                  {visibleClusters.map((cluster) => {
                    const isSelected = cluster.items.some(({ index }) => index === selectedIndex);
                    const itemCount = cluster.items.length;
                    const firstItem = cluster.items[0];

                    return (
                      <button
                        key={cluster.dateKey}
                        className="absolute transition-all duration-200 pointer-events-auto"
                        style={{
                          left: `${cluster.position}%`,
                          top: '50%',
                          transform: `translate(-50%, -50%) scale(${isSelected ? 1.3 : 1})`,
                          zIndex: isSelected ? 20 : 10,
                        }}
                        onClick={() => setSelectedIndex(firstItem.index)}
                      >
                        <div
                          className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all relative ${
                            isSelected
                              ? 'border-gold ring-2 ring-gold/50'
                              : 'border-white/50 hover:border-gold/70'
                          }`}
                          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                        >
                          <LazyImage
                            src={firstItem.item.url}
                            alt=""
                            className="w-full h-full"
                            onError={() => handleImageError(firstItem.item.id)}
                          />
                          {/* 클러스터 카운트 배지 */}
                          {itemCount > 1 && (
                            <div className="absolute -top-1 -right-1 bg-gold text-black text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                              {itemCount > 9 ? '9+' : itemCount}
                            </div>
                          )}
                        </div>
                        {firstItem.item.type === 'guestbook' && (
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

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2 bg-gold/90 text-white rounded-lg hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all serif-kr text-sm"
              >
                {loadingMore ? '불러오는 중...' : `더 보기`}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemoryTimeline;
