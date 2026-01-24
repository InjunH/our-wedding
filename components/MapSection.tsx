
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
    <section id="map-section" className="py-32 px-6 md:px-20 bg-[#faf9f6]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium serif tracking-tight mb-4">
            오시는 길
          </h2>
          <div className="h-px w-24 bg-[#c5a059] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden border border-[#f0ede6]"
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
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#c5a059] shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2 text-stone-400">
                    주소
                  </h4>
                  <p className="text-xl serif font-medium mb-1">
                    {VENUE_LOCATION.name}
                  </p>
                  <p className="text-stone-500 font-light">
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

              <div className="flex items-start gap-4">
                <Phone className="text-[#c5a059] shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2 text-stone-400">
                    문의
                  </h4>
                  <p className="text-stone-500 font-light">02-1234-5678</p>
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
      </div>
    </section>
  );
};

export default MapSection;
