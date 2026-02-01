import { useState, useEffect } from 'react';
import { listS3Objects, S3Object } from '../lib/s3';

export const useS3Photos = (prefix?: string, thumbnailsOnly: boolean = false) => {
  const [photos, setPhotos] = useState<S3Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const objects = await listS3Objects(prefix, thumbnailsOnly);
        setPhotos(objects);
        setLoading(false);
      } catch (err) {
        console.error('S3 사진 로드 오류:', err);
        setError('사진을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [prefix, thumbnailsOnly]);

  return { photos, loading, error };
};
