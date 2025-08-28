import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { QuoteCard } from './QuoteCard';

interface Quote {
  id: string;
  text: string;
}

interface QuoteCardStackProps {
  quotes: Quote[];
  onQuoteLike?: (quoteId: string) => void;
  onQuoteShare?: (quoteId: string) => void;
}

export const QuoteCardStack: React.FC<QuoteCardStackProps> = ({
  quotes,
  onQuoteLike,
  onQuoteShare,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    // --- THIS IS THE INFINITE LOOP LOGIC ---
    // Use the modulo operator to loop back to the start.
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  // No need to check if activeQuote exists, as the parent handles the empty state
  const activeQuote = quotes[currentIndex];

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4]">
      <AnimatePresence custom={swipeDirection}>
        {/* The key is now more important than ever for AnimatePresence */}
        <QuoteCard
          key={activeQuote.id}
          quote={activeQuote.text}
          onLike={() => onQuoteLike?.(activeQuote.id)}
          onShare={() => onQuoteShare?.(activeQuote.id)}
          onSwipe={handleSwipe}
        />
      </AnimatePresence>
    </div>
  );
};