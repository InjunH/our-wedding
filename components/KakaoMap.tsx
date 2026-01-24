
import React, { useEffect, useRef, useState } from 'react';

interface KakaoMapProps {
  lat: number;
  lng: number;
  markerTitle?: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ lat, lng, markerTitle }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      setError('카카오맵 SDK가 로드되지 않았습니다. API 키를 확인해주세요.');
      return;
    }

    window.kakao.maps.load(() => {
      if (!mapRef.current) return;

      try {
        const mapOption = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapRef.current, mapOption);

        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        if (markerTitle) {
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:8px 12px;font-size:13px;font-weight:500;">${markerTitle}</div>`,
          });
          infowindow.open(map, marker);
        }

        setIsLoaded(true);
      } catch (e) {
        setError('지도를 불러오는 중 오류가 발생했습니다.');
      }
    });
  }, [lat, lng, markerTitle]);

  if (error) {
    return (
      <div className="w-full h-[400px] bg-[#faf9f6] border border-[#f0ede6] flex items-center justify-center">
        <p className="text-stone-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px]">
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#faf9f6] flex items-center justify-center z-10">
          <div className="text-stone-400 text-sm">지도를 불러오는 중...</div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default KakaoMap;
