
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, AlertCircle, User, Phone, Users, Utensils, Heart, MessageSquare } from 'lucide-react';
import { useRSVP } from '../hooks/useRSVP';
import { RSVPFormData } from '../types';

const RSVP: React.FC = () => {
  const { status, error, submitRSVP, reset } = useRSVP();
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    phone: '',
    attendance: 'attending',
    guestCount: 1,
    mealPreference: 'regular',
    side: 'groom',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guestCount' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRSVP(formData);
  };

  if (status === 'success') {
    return (
      <section id="rsvp" className="py-32 px-6 md:px-20 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16"
          >
            <div className="w-20 h-20 bg-[#c5a059] rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="text-white" size={40} />
            </div>
            <h3 className="text-3xl serif font-medium mb-4">감사합니다!</h3>
            <p className="text-stone-500 mb-8">
              참석 여부가 성공적으로 제출되었습니다.
              <br />
              소중한 날에 함께해 주셔서 감사합니다.
            </p>
            <button
              onClick={reset}
              className="text-[#c5a059] text-sm underline underline-offset-4 hover:text-[#a88a47] transition-colors"
            >
              다시 제출하기
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-32 px-6 md:px-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium serif tracking-tight mb-4">
            참석 여부
          </h2>
          <p className="text-stone-400 font-light">
            소중한 분들의 참석 여부를 알려주세요
          </p>
          <div className="h-px w-24 bg-[#c5a059] mx-auto mt-8"></div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-[#faf9f6] p-8 md:p-12 border border-[#f0ede6]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                <User size={14} /> 성함
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="홍길동"
                className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                <Phone size={14} /> 연락처
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="010-1234-5678"
                className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                <Heart size={14} /> 참석 여부
              </label>
              <select
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm"
              >
                <option value="attending">참석</option>
                <option value="not-attending">불참</option>
                <option value="undecided">미정</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                <Users size={14} /> 동반 인원
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                <Utensils size={14} /> 식사 선택
              </label>
              <select
                name="mealPreference"
                value={formData.mealPreference}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm"
              >
                <option value="regular">일반식</option>
                <option value="vegetarian">채식</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                <Heart size={14} /> 신랑/신부측
              </label>
              <select
                name="side"
                value={formData.side}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm"
              >
                <option value="groom">신랑측</option>
                <option value="bride">신부측</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
              <MessageSquare size={14} /> 축하 메시지 (선택)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="축하의 말씀을 남겨주세요"
              className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm resize-none"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={status === 'submitting'}
            whileHover={{ scale: status === 'submitting' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'submitting' ? 1 : 0.98 }}
            className="mt-8 w-full py-5 bg-[#333] text-white font-bold text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-[#c5a059] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? (
              <>
                <span className="animate-spin">
                  <Send size={14} />
                </span>
                제출 중...
              </>
            ) : (
              <>
                <Send size={14} />
                참석 여부 제출
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default RSVP;
