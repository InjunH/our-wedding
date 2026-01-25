
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';

interface DirectionButtonsProps {
  lat: number;
  lng: number;
}

const KakaoLogo = () => (
  <img src="/kakaomap_basic.png" alt="카카오맵" className="w-full h-full object-cover rounded-full" />
);

const NaverLogo = () => (
  <img src="/naver.png" alt="네이버지도" className="w-full h-full object-cover rounded-lg" />
);

const TMapLogo = () => (
  <img src="/tmap.jpeg" alt="티맵" className="w-full h-full object-cover rounded-lg" />
);

const DirectionButtons: React.FC<DirectionButtonsProps> = ({ lat, lng }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile());
  }, []);

  const openKakaoMap = () => {
    window.open('https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=%2C%2C491185%2C1102283&rt1=&rt2=%EC%84%9C%EC%9A%B8%EB%8C%80%ED%95%99%EA%B5%90+%ED%98%B8%EC%95%94%EA%B5%90%EC%88%98%ED%9A%8C%EA%B4%80&rtIds=%2C&rtTypes=%2C', '_blank');
  };

  const openNaverMap = () => {
    window.open(
      'https://map.naver.com/p/directions/-/37.46764,126.96014,%EC%84%9C%EC%9A%B8%EB%8C%80%ED%95%99%EA%B5%90%20%ED%98%B8%EC%95%94%EA%B5%90%EC%88%98%ED%9A%8C%EA%B4%80/-/car?c=14.00,0,0,0,dh',
      '_blank'
    );
  };

  const openTMap = () => {
    window.open(
      `https://tmap.life/${lat},${lng}`,
      '_blank'
    );
  };

  const buttons = [
    { label: '카카오맵', onClick: openKakaoMap, color: 'bg-[#FEE500]', textColor: 'text-[#3C1E1E]', logo: <KakaoLogo /> },
    { label: '네이버지도', onClick: openNaverMap, color: 'bg-[#03C75A]', textColor: 'text-white', logo: <NaverLogo /> },
    ...(isMobile ? [{ label: '티맵', onClick: openTMap, color: 'bg-[#1C6DD0]', textColor: 'text-white', logo: <TMapLogo /> }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Navigation size={18} className="text-gold opacity-60" strokeWidth={1} />
        <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-300">
          Navigation
        </h4>
      </div>
      <div className="flex gap-6">
        {buttons.map((btn) => (
          <div key={btn.label} className="flex flex-col items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={btn.onClick}
              aria-label={btn.label}
              className={`${btn.color} ${btn.textColor} w-12 h-12 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center`}
            >
              {btn.logo}
            </motion.button>
            <span className="text-[10px] text-stone-400 font-medium tracking-wide">{btn.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectionButtons;
