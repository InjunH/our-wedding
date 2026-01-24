
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, MessageSquare, Heart } from 'lucide-react';

interface GuestBookFormProps {
  onSubmit: (data: { name: string; message: string; side?: 'groom' | 'bride' | 'both' }) => Promise<void>;
  submitting: boolean;
}

const GuestBookForm: React.FC<GuestBookFormProps> = ({ onSubmit, submitting }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [side, setSide] = useState<'groom' | 'bride' | 'both'>('groom');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      await onSubmit({ name: name.trim(), message: message.trim(), side });
      setName('');
      setMessage('');
    } catch (err) {
      // 에러는 useGuestBook에서 처리
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="bg-[#faf9f6] p-6 md:p-8 border border-[#f0ede6] space-y-4"
    >
      <h3 className="text-lg serif font-medium mb-4">축하 메시지 남기기</h3>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
          <User size={12} /> 이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="이름을 입력해주세요"
          className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
          <Heart size={12} /> 신랑/신부측
        </label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as 'groom' | 'bride' | 'both')}
          className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm"
        >
          <option value="groom">신랑측</option>
          <option value="bride">신부측</option>
          <option value="both">함께</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
          <MessageSquare size={12} /> 메시지
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="축하의 말씀을 남겨주세요"
          className="w-full px-4 py-3 bg-white border border-[#f0ede6] focus:border-[#c5a059] outline-none transition-colors text-sm resize-none"
        />
      </div>

      <motion.button
        type="submit"
        disabled={submitting || !name.trim() || !message.trim()}
        whileHover={{ scale: submitting ? 1 : 1.02 }}
        whileTap={{ scale: submitting ? 1 : 0.98 }}
        className="w-full py-4 bg-[#333] text-white font-bold text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-[#c5a059] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <span className="animate-spin">
              <Send size={14} />
            </span>
            등록 중...
          </>
        ) : (
          <>
            <Send size={14} />
            메시지 남기기
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default GuestBookForm;
