
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
      <section id="rsvp" className="py-48 px-6 md:px-20 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20"
          >
            <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-10">
              <Check className="text-white" size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-4xl serif-kr font-normal mb-6 text-[#2a2a2a]">감사합니다!</h3>
            <p className="text-stone-400 mb-10 serif-kr text-lg leading-relaxed">
              참석 여부가 성공적으로 제출되었습니다.
              <br />
              소중한 날에 함께해 주셔서 감사합니다.
            </p>
            <button
              onClick={reset}
              className="text-gold text-xs uppercase tracking-[0.3em] underline underline-offset-4 hover:text-[#a88a47] transition-colors"
            >
              다시 제출하기
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-48 px-6 md:px-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-gold text-[10px] font-bold tracking-[0.7em] uppercase mb-6 block">RSVP</span>
          <h2 className="text-5xl md:text-6xl serif-kr font-normal mb-6 text-[#2a2a2a]">
            참석 여부
          </h2>
          <p className="text-stone-400 serif-kr text-lg">
            소중한 분들의 참석 여부를 알려주세요
          </p>
          <div className="h-px w-20 bg-gold mx-auto mt-10 opacity-50"></div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-[#faf9f6] p-10 md:p-16 border border-[#f2f0ea]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="label-wedding">
                <User size={14} /> 성함
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="홍길동"
                className="input-wedding"
              />
            </div>

            <div className="space-y-2">
              <label className="label-wedding">
                <Phone size={14} /> 연락처
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="010-1234-5678"
                className="input-wedding"
              />
            </div>

            <div className="space-y-2">
              <label className="label-wedding">
                <Heart size={14} /> 참석 여부
              </label>
              <select
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                className="input-wedding"
              >
                <option value="attending">참석</option>
                <option value="not-attending">불참</option>
                <option value="undecided">미정</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="label-wedding">
                <Users size={14} /> 동반 인원
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                min="1"
                max="10"
                className="input-wedding"
              />
            </div>

            <div className="space-y-2">
              <label className="label-wedding">
                <Utensils size={14} /> 식사 선택
              </label>
              <select
                name="mealPreference"
                value={formData.mealPreference}
                onChange={handleChange}
                className="input-wedding"
              >
                <option value="regular">일반식</option>
                <option value="vegetarian">채식</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="label-wedding">
                <Heart size={14} /> 신랑/신부측
              </label>
              <select
                name="side"
                value={formData.side}
                onChange={handleChange}
                className="input-wedding"
              >
                <option value="groom">신랑측</option>
                <option value="bride">신부측</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="label-wedding">
              <MessageSquare size={14} /> 축하 메시지 (선택)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="축하의 말씀을 남겨주세요"
              className="input-wedding resize-none"
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
            className="mt-8 w-full btn-gold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
