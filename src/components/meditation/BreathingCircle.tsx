// src/components/meditation/BreathingCircle.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface BreathingCircleProps {
  // We remove the explicit 'any' type for controls and let TypeScript infer it,
  // or use 'any' if needed. The key is what it's attached to.
  controls: ReturnType<typeof useAnimationControls>;
}
// For simplicity and to avoid import issues, 'any' is fine here.
// interface BreathingCircleProps { controls: any; }


export const BreathingCircle: React.FC<{ controls: any }> = ({ controls }) => {
  return (
    // This is now JUST the circle. No text, no relative container.
    <motion.div
      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-teal-500/20 backdrop-blur-sm border-2 border-teal-500"
      initial={{ scale: 1 }} // Start at the base scale
      animate={controls}
    />
  );
};

export default BreathingCircle;