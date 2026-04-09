
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Copy, Check } from 'lucide-react';
import KakaoMap from './KakaoMap';
import DirectionButtons from './DirectionButtons';
import { VENUE_LOCATION } from '../constants';

const MapSection: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(VENUE_LOCATION.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('주소 복사 실패:', err);
    }
  };

  return (
    <section id="map-section" className="py-16 md:py-32 lg:py-48 px-6 md:px-20 bg-[#faf9f6]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="text-gold text-xs font-bold tracking-[0.7em] uppercase mb-6 block">오시는 길</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl serif-kr font-normal mb-6 text-[#2a2a2a]">
            찾아오시는 방법
          </h2>
          <div className="h-px w-20 bg-gold mx-auto opacity-50"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden border border-[#f2f0ea]"
          >
            <KakaoMap
              lat={VENUE_LOCATION.lat}
              lng={VENUE_LOCATION.lng}
              markerTitle={VENUE_LOCATION.name}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between space-y-8"
          >
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <MapPin className="text-gold shrink-0 mt-1 opacity-60" size={20} strokeWidth={1} />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.5em] mb-3 text-stone-300">
                    주소
                  </h4>
                  <p className="text-2xl serif-kr font-normal mb-2 text-[#2a2a2a]">
                    {VENUE_LOCATION.name}
                  </p>
                  <p className="text-stone-400 serif-kr text-lg">
                    {VENUE_LOCATION.address}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyAddress}
                    className="mt-3 flex items-center gap-2 text-xs text-[#c5a059] hover:text-[#a88a47] transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        주소 복사
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <Phone className="text-gold shrink-0 mt-1 opacity-60" size={20} strokeWidth={1} />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.5em] mb-3 text-stone-300">
                    연락처
                  </h4>
                  <p className="text-stone-400 serif-kr text-lg">1688-7745</p>
                </div>
              </div>
            </div>

            <DirectionButtons
              lat={VENUE_LOCATION.lat}
              lng={VENUE_LOCATION.lng}
              name={VENUE_LOCATION.name}
            />
          </motion.div>
        </div>

        {/* 교통 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 border border-[#f2f0ea] bg-white p-6 md:p-10"
        >
          <h4 className="text-sm font-bold text-gold tracking-[0.3em] uppercase mb-6 text-center">교통 안내</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-left">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-[#2a2a2a] mb-2">지하철</p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  2호선 낙성대역 4번 출구 →<br />
                  GS주유소 → [장블랑제리]제과점 앞<br />
                  마을버스 <span className="text-[#2a2a2a] font-medium">관악-02번</span> 승차 →<br />
                  호암교수회관 하차 (5분거리)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#2a2a2a] mb-2">버스</p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  461, 641, 643, 5413, 5424,<br />
                  5520, 5524, 5528 이용 낙성대 하차 →<br />
                  마을버스 <span className="text-[#2a2a2a] font-medium">관악-02번</span> 환승 (5분거리)
                </p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-[#2a2a2a] mb-2">승용차</p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  남부순환도로에서 낙성대<br />
                  (이정표: 서울대후문) 방면 좌·우회전<br />
                  1.5km 직진 후 좌측 위치<br />
                  <span className="text-[#2a2a2a] font-medium">주차 무료 (200대)</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#2a2a2a] mb-2">내비게이션</p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  서울시 관악구 관악로 1
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;
