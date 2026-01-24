
import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Map } from 'lucide-react';

interface DirectionButtonsProps {
  lat: number;
  lng: number;
  name: string;
}

const DirectionButtons: React.FC<DirectionButtonsProps> = ({ lat, lng, name }) => {
  const encodedName = encodeURIComponent(name);

  const openKakaoMap = () => {
    window.open(`https://map.kakao.com/link/to/${encodedName},${lat},${lng}`, '_blank');
  };

  const openNaverMap = () => {
    window.open(
      `https://map.naver.com/v5/directions/-/-/-/car?c=${lng},${lat},15,0,0,0,dh&destination=${encodedName},${lng},${lat}`,
      '_blank'
    );
  };

  const openTMap = () => {
    window.open(
      `https://apis.openapi.sk.com/tmap/app/routes?appKey=&goalname=${encodedName}&goalx=${lng}&goaly=${lat}`,
      '_blank'
    );
  };

  const buttons = [
    { label: '카카오맵', onClick: openKakaoMap, color: 'bg-[#FEE500]', textColor: 'text-[#3C1E1E]' },
    { label: '네이버지도', onClick: openNaverMap, color: 'bg-[#03C75A]', textColor: 'text-white' },
    { label: '티맵', onClick: openTMap, color: 'bg-[#1C6DD0]', textColor: 'text-white' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Navigation size={18} className="text-[#c5a059]" />
        <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
          길안내
        </h4>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {buttons.map((btn) => (
          <motion.button
            key={btn.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={btn.onClick}
            className={`${btn.color} ${btn.textColor} py-3 px-4 text-xs font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-2`}
          >
            <Map size={14} />
            {btn.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DirectionButtons;
