import { useState, useEffect, useCallback } from 'react';
import { listS3Objects, S3Object } from '../lib/s3';

export const useS3Photos = (prefix?: string, thumbnailsOnly: boolean = false) => {
  const [photos, setPhotos] = useState<S3Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextMarker, setNextMarker] = useState<string | undefined>(undefined);

  // 초기 로드
  useEffect(() => {
    const fetchInitialPhotos = async () => {
      try {
        setLoading(true);
        const result = await listS3Objects({
          prefix,
          thumbnailsOnly,
          maxKeys: 50  // 첫 50장만
        });

        setPhotos(result.objects);
        setHasMore(result.isTruncated);
        setNextMarker(result.nextMarker);
        setLoading(false);
      } catch (err) {
        console.error('S3 사진 로드 오류:', err);
        setError('사진을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchInitialPhotos();
  }, [prefix, thumbnailsOnly]);

  // 추가 로드
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const result = await listS3Objects({
        prefix,
        thumbnailsOnly,
        maxKeys: 50,
        marker: nextMarker
      });

      setPhotos(prev => [...prev, ...result.objects]);
      setHasMore(result.isTruncated);
      setNextMarker(result.nextMarker);
      setLoadingMore(false);
    } catch (err) {
      console.error('추가 사진 로드 오류:', err);
      setError('추가 사진을 불러오는 중 오류가 발생했습니다.');
      setLoadingMore(false);
    }
  }, [prefix, thumbnailsOnly, nextMarker, hasMore, loadingMore]);

  return {
    photos,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore
  };
};
