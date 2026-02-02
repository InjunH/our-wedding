import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useS3Photos } from '../hooks/useS3Photos';
import { S3Object } from '../lib/s3';

// 사진 순서 하드코딩 (key만 지정, 나머지는 최신순)
const PHOTO_ORDER: { [position: number]: string } = {
  1: '2CC3E1B3-88CA-47F3-97BC-9A4D2B96D888.webp',
  2: 'C5839766-B0B8-4420-98E5-EB584F8AF2B8.webp',
  3: 'BDD7CF28-3773-4C2E-A507-0FFD005C6BE3.webp',
  4: '5713F127-3843-4499-8928-06BDF6774B2A.webp',
  5: 'F1375FD0-93AC-47AB-8F66-4A076219B4EF.webp',
  6: '52D9B7EB-E1DF-4D44-99A2-670332E7FBA5.webp',
  17: '8DA8EF17-0163-436B-B2B1-F280C62A7B07.webp',
  18: '9A8AE157-B5FF-4D21-BE45-FF755E0C6E15.webp',
};

const PhotoGallery: React.FC = () => {
  const { photos: allPhotos, loading, error } = useS3Photos();

  // 루트 레벨 사진만 필터링 + 커스텀 순서 정렬
  const photos = React.useMemo(() => {
    const filtered = allPhotos.filter((p: S3Object) => !p.key.includes('/'));
    const orderedKeys = Object.values(PHOTO_ORDER);
    const unordered = filtered
      .filter((p) => !orderedKeys.includes(p.key))
      .sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
      );

    // 결과 배열 구성
    const result: S3Object[] = [];
    let unorderedIdx = 0;

    for (let i = 1; i <= filtered.length; i++) {
      if (PHOTO_ORDER[i]) {
        const photo = filtered.find((p) => p.key === PHOTO_ORDER[i]);
        if (photo) result.push(photo);
      } else if (unorderedIdx < unordered.length) {
        result.push(unordered[unorderedIdx++]);
      }
    }
    return result;
  }, [allPhotos]);
  const [selectedPhoto, setSelectedPhoto] = useState<S3Object | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const openModal = (photo: S3Object, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = useCallback(() => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'unset';
  }, []);

  const goToPrevious = useCallback(() => {
    const newIndex = selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  }, [selectedIndex, photos]);

  const goToNext = useCallback(() => {
    const newIndex = selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  }, [selectedIndex, photos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, closeModal, goToPrevious, goToNext]);

  return (
    <section className="py-16 md:py-24 lg:py-32 px-6 md:px-20 bg-ivory">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-[10px] font-bold tracking-[0.7em] mb-6 uppercase block">
            Gallery
          </span>
          <h2 className="text-[#2a2a2a] text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-light serif-en tracking-tight-serif italic">
            Our Moments
          </h2>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-stone-400 serif-kr">사진을 불러오는 중...</div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="text-red-400 serif-kr">{error}</div>
          </div>
        )}

        {!loading && !error && photos.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-stone-400 serif-kr">사진이 없습니다.</div>
          </div>
        )}

        {!loading && !error && photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative aspect-square overflow-hidden rounded-sm bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.04)] group cursor-pointer"
                onClick={() => openModal(photo, index)}
              >
                <img
                  src={photo.url}
                  alt={photo.key}
                  className="w-full h-full object-cover rounded-sm transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <span className="text-stone-400 text-sm serif-kr">
              총 {photos.length}장의 사진
            </span>
          </motion.div>
        )}
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            >
              <X size={32} />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronLeft size={40} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronRight size={40} />
            </button>

            {/* Image */}
            <motion.img
              key={selectedPhoto.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={selectedPhoto.url}
              alt={selectedPhoto.key}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Photo Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotoGallery;
