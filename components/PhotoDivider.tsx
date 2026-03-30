
import React from 'react';
import { motion } from 'framer-motion';

interface PhotoDividerProps {
  src: string;
  alt?: string;
}

const PhotoDivider: React.FC<PhotoDividerProps> = ({ src, alt = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.2 }}
      className="relative w-full overflow-hidden"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto block"
        loading="lazy"
      />
    </motion.div>
  );
};

export default PhotoDivider;
