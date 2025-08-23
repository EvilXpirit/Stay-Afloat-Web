export const vibrateDevice = (pattern: number | number[] | readonly number[]) => {
  if ('vibrate' in navigator) {
    // Convert readonly array to mutable array if needed
    navigator.vibrate([...pattern]);
  }
};

export const HapticPatterns = {
  inhale: [100] as const,
  hold: [50, 100, 50] as const,
  exhale: [200] as const,
  'hold-empty': [50, 100, 50] as const,
  buttonPress: [50] as const,
  sessionComplete: [100, 50, 100, 50, 100] as const,
} as const;