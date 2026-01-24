
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import GuestBookForm from './GuestBookForm';
import GuestBookList from './GuestBookList';
import { useGuestBook } from '../hooks/useGuestBook';

const GuestBook: React.FC = () => {
  const { entries, loading, error, submitting, addEntry } = useGuestBook();

  return (
    <section className="py-48 px-6 md:px-20 bg-[#faf9f6]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-gold text-[10px] font-bold tracking-[0.7em] uppercase mb-6 block">Guestbook</span>
          <h2 className="text-5xl md:text-6xl serif-kr font-normal mb-6 text-[#2a2a2a]">
            방명록
          </h2>
          <p className="text-stone-400 serif-kr text-lg">
            소중한 축하의 말씀을 남겨주세요
          </p>
          <div className="h-px w-20 bg-gold mx-auto mt-10 opacity-50"></div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm max-w-4xl mx-auto"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GuestBookForm onSubmit={addEntry} submitting={submitting} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GuestBookList entries={entries} loading={loading} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GuestBook;
