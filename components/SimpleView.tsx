import React, { useState } from 'react';
import { Phone, MessageSquare, Copy, Check, Heart, MapPin, Calendar, Map, Navigation } from 'lucide-react';
import Hero from './Hero';
import KakaoMap from './KakaoMap';
import { VENUE_LOCATION } from '../constants';

const contactData = {
  groom: {
    name: '황인준',
    phone: '010-2620-6424',
    bank: '신한은행',
    account: '110-276-854237',
    father: { name: '故 황해연', phone: '' },
    mother: { name: '한순영', phone: '010-4178-1411', bank: '농협', account: '966-02-024872' },
  },
  bride: {
    name: '윤누리',
    phone: '010-6406-7539',
    bank: '토스뱅크',
    account: '1000-1432-9188',
    father: { name: '윤충식', phone: '010-3559-7539', bank: 'KB국민은행', account: '667-21-0634-723' },
    mother: { name: '김미애', phone: '010-3793-7539', bank: '하나은행', account: '132910-322-29507' },
  },
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border-2 border-stone-200 text-base text-stone-500 active:bg-stone-100 transition-colors"
    >
      {copied ? <><Check size={16} /> 복사됨</> : <><Copy size={16} /> 복사</>}
    </button>
  );
};

const MapTabs: React.FC = () => {
  const [tab, setTab] = useState<'map' | 'naver'>('map');
  return (
    <div className="mb-6">
      <div className="flex rounded-xl overflow-hidden border border-stone-200 mb-4">
        <button
          onClick={() => setTab('map')}
          className={`flex-1 py-3 text-base font-medium flex items-center justify-center gap-2 transition-colors ${
            tab === 'map' ? 'bg-gold text-white' : 'bg-white text-stone-500'
          }`}
        >
          <Map size={18} /> 약도
        </button>
        <button
          onClick={() => setTab('naver')}
          className={`flex-1 py-3 text-base font-medium flex items-center justify-center gap-2 transition-colors ${
            tab === 'naver' ? 'bg-gold text-white' : 'bg-white text-stone-500'
          }`}
        >
          <Navigation size={18} /> 지도
        </button>
      </div>
      {tab === 'map' ? (
        <img
          src="/hoam-map.jpg"
          alt="호암교수회관 약도"
          className="w-full rounded-xl border border-stone-100"
        />
      ) : (
        <div className="rounded-xl overflow-hidden border border-stone-100">
          <KakaoMap
            lat={VENUE_LOCATION.lat}
            lng={VENUE_LOCATION.lng}
            markerTitle={VENUE_LOCATION.name}
          />
        </div>
      )}
    </div>
  );
};

const SimpleView: React.FC<{ onSwitchToFull: () => void }> = ({ onSwitchToFull }) => {
  return (
    <div className="min-h-screen bg-white text-[#2a2a2a]" style={{ fontSize: '20px' }}>
      {/* Hero — 일반 보기와 동일 */}
      {/* 일반 보기 플로팅 버튼 */}
      <button
        onClick={onSwitchToFull}
        className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-sm hover:bg-black/50 transition-colors"
      >
        일반 보기
      </button>

      <Hero />

      {/* 일시 & 장소 */}
      <section className="px-6 py-10 border-b border-stone-100">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="flex items-start gap-4">
            <Calendar className="text-gold shrink-0 mt-1" size={24} />
            <div>
              <p className="text-sm text-stone-400 mb-1">일시</p>
              <p className="text-xl font-medium">2026년 5월 24일 (일)</p>
              <p className="text-xl font-medium">오후 1시</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="text-gold shrink-0 mt-1" size={24} />
            <div>
              <p className="text-sm text-stone-400 mb-1">장소</p>
              <p className="text-xl font-medium">서울대학교 호암교수회관</p>
              <p className="text-lg text-stone-500">서울특별시 관악구 관악로 1</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="text-gold shrink-0 mt-1" size={24} />
            <div>
              <p className="text-sm text-stone-400 mb-1">회관 연락처</p>
              <p className="text-xl font-medium">
                <a href="tel:16887745" className="text-gold underline">1688-7745</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 교통 안내 */}
      <section className="px-6 py-10 bg-[#faf9f6] border-b border-stone-100">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-medium serif-kr text-center mb-6">오시는 길</h2>

          {/* 탭: 약도 / 네이버지도 */}
          <MapTabs />

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 border border-stone-100">
              <p className="text-lg font-medium mb-2">🚇 지하철</p>
              <p className="text-lg text-stone-600 leading-relaxed">
                2호선 <strong>낙성대역 4번 출구</strong><br />
                → GS주유소 → 장블랑제리 제과점 앞<br />
                → 마을버스 <strong>관악-02번</strong> 승차<br />
                → 호암교수회관 하차 (5분)
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-stone-100">
              <p className="text-lg font-medium mb-2">🚗 승용차</p>
              <p className="text-lg text-stone-600 leading-relaxed">
                내비게이션: <strong>서울시 관악구 관악로 1</strong><br />
                주차 무료 (200대)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 대표 사진 */}
      <section className="border-b border-stone-100">
        <img
          src="/studio/KSJ02613-1_divider.webp"
          alt="누리 & 인준"
          className="w-full"
        />
      </section>

      {/* 신랑 & 신부 연락처 */}
      <section className="px-6 py-10 border-b border-stone-100">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-medium serif-kr text-center mb-8">연락처</h2>
          <div className="space-y-6">
            {/* 신랑 */}
            <div className="bg-[#faf9f6] rounded-xl p-5">
              <p className="text-sm text-gold font-bold tracking-wider mb-3">신랑</p>
              <p className="text-xl font-medium mb-3">{contactData.groom.name}</p>
              <div className="flex gap-3">
                <a href={`tel:${contactData.groom.phone.replace(/-/g, '')}`}
                   className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-lg border border-stone-200 text-lg">
                  <Phone size={18} /> 전화
                </a>
                <a href={`sms:${contactData.groom.phone.replace(/-/g, '')}`}
                   className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-lg border border-stone-200 text-lg">
                  <MessageSquare size={18} /> 문자
                </a>
              </div>
            </div>
            {/* 신부 */}
            <div className="bg-[#faf9f6] rounded-xl p-5">
              <p className="text-sm text-gold font-bold tracking-wider mb-3">신부</p>
              <p className="text-xl font-medium mb-3">{contactData.bride.name}</p>
              <div className="flex gap-3">
                <a href={`tel:${contactData.bride.phone.replace(/-/g, '')}`}
                   className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-lg border border-stone-200 text-lg">
                  <Phone size={18} /> 전화
                </a>
                <a href={`sms:${contactData.bride.phone.replace(/-/g, '')}`}
                   className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-lg border border-stone-200 text-lg">
                  <MessageSquare size={18} /> 문자
                </a>
              </div>
            </div>
          </div>

          {/* 혼주 */}
          <div className="mt-8">
            <p className="text-lg font-medium text-center mb-4 text-stone-500">혼주 연락처</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-3">
                <p className="text-sm text-gold font-bold">신랑 측</p>
                <div>
                  <p className="text-stone-400 text-sm">아버지</p>
                  <p className="text-lg">{contactData.groom.father.name}</p>
                </div>
                <div>
                  <p className="text-stone-400 text-sm">어머니</p>
                  <p className="text-lg">{contactData.groom.mother.name}</p>
                  <a href={`tel:${contactData.groom.mother.phone.replace(/-/g, '')}`}
                     className="inline-flex items-center gap-1 text-gold text-base mt-1">
                    <Phone size={14} /> 전화
                  </a>
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-sm text-gold font-bold">신부 측</p>
                <div>
                  <p className="text-stone-400 text-sm">아버지</p>
                  <p className="text-lg">{contactData.bride.father.name}</p>
                  <a href={`tel:${contactData.bride.father.phone.replace(/-/g, '')}`}
                     className="inline-flex items-center gap-1 text-gold text-base mt-1">
                    <Phone size={14} /> 전화
                  </a>
                </div>
                <div>
                  <p className="text-stone-400 text-sm">어머니</p>
                  <p className="text-lg">{contactData.bride.mother.name}</p>
                  <a href={`tel:${contactData.bride.mother.phone.replace(/-/g, '')}`}
                     className="inline-flex items-center gap-1 text-gold text-base mt-1">
                    <Phone size={14} /> 전화
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 축의금 계좌번호 */}
      <section className="px-6 py-10 bg-[#faf9f6]">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-medium serif-kr text-center mb-2">
            <Heart className="inline text-gold mr-2" size={24} />
            마음 전하기
          </h2>
          <p className="text-center text-stone-400 text-base mb-8">계좌번호를 눌러 복사하세요</p>

          <div className="space-y-4">
            {/* 신랑 측 */}
            <p className="text-sm text-gold font-bold tracking-wider text-center">신랑 측</p>
            <div className="bg-white rounded-xl p-5 border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-base text-stone-400">신랑 {contactData.groom.name}</p>
                <p className="text-lg font-medium">{contactData.groom.bank} {contactData.groom.account}</p>
              </div>
              <CopyButton text={contactData.groom.account} />
            </div>
            <div className="bg-white rounded-xl p-5 border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-base text-stone-400">어머니 {contactData.groom.mother.name}</p>
                <p className="text-lg font-medium">{contactData.groom.mother.bank} {contactData.groom.mother.account}</p>
              </div>
              <CopyButton text={contactData.groom.mother.account!} />
            </div>

            {/* 신부 측 */}
            <p className="text-sm text-gold font-bold tracking-wider text-center mt-6">신부 측</p>
            <div className="bg-white rounded-xl p-5 border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-base text-stone-400">신부 {contactData.bride.name}</p>
                <p className="text-lg font-medium">{contactData.bride.bank} {contactData.bride.account}</p>
              </div>
              <CopyButton text={contactData.bride.account} />
            </div>
            <div className="bg-white rounded-xl p-5 border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-base text-stone-400">아버지 {contactData.bride.father.name}</p>
                <p className="text-lg font-medium">{contactData.bride.father.bank} {contactData.bride.father.account}</p>
              </div>
              <CopyButton text={contactData.bride.father.account!} />
            </div>
            <div className="bg-white rounded-xl p-5 border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-base text-stone-400">어머니 {contactData.bride.mother.name}</p>
                <p className="text-lg font-medium">{contactData.bride.mother.bank} {contactData.bride.mother.account}</p>
              </div>
              <CopyButton text={contactData.bride.mother.account!} />
            </div>
          </div>
        </div>
      </section>

      {/* 하단 */}
      <footer className="py-8 text-center text-stone-300 text-sm border-t border-stone-100">
        <p>© 2026 누리 & 인준</p>
      </footer>
    </div>
  );
};

export default SimpleView;
