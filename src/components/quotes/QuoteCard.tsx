import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, Share } from 'react-feather';
import quoteImage from '../../assets/quotes-images/1756417338006.jpg';

interface QuoteCardProps {
  quote: string;
  onLike?: () => void;
  onShare?: () => void;
  onSwipe: (direction: 'left' | 'right') => void;
}

const cardVariants = {
  enter: {
    y: 50,
    opacity: 0,
    scale: 0.9,
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
  },
  exit: (direction: 'left' | 'right') => ({
    zIndex: 0,
    x: direction === 'left' ? -300 : 300,
    opacity: 0,
    scale: 0.8,
    // --- THIS IS THE FIX ---
    // Replaced the invalid cubic-bezier array with a valid named easing.
    // 'easeIn' makes the card accelerate as it exits, which feels snappy.
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  onLike,
  onShare,
  onSwipe,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };
  
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`"${quote}"`);
      onShare?.();
    } catch (error) {
      console.error('Failed to copy quote:', error);
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab touch-none"
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
    >
      <div
        className="relative w-full h-full bg-cover bg-center rounded-2xl shadow-xl"
        // style={{ backgroundImage: 'url(".../assets/quotes-images/1756417338006.jpg")' }}
        style={{ backgroundImage: `url(${quoteImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl">
          <div className="relative h-full w-full p-6 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white text-xl md:text-2xl text-center font-serif leading-relaxed">
                "{quote}"
              </p>
            </div>
            <div className="flex justify-center gap-6 mt-auto">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsLiked(!isLiked);
                  onLike?.();
                }}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked ? 'fill-red-500 stroke-red-500' : 'stroke-white'
                  }`}
                />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
              >
                <Share className="w-6 h-6 stroke-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};