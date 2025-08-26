// src/hooks/useBreathingPatterns.ts

import { useState, useEffect } from 'react';
import type { BreathingPattern } from '../types/meditation';

// Your existing type definition
interface BreathingPatternUpdated extends BreathingPattern {
  defaultSets: number;
  isCustom?: boolean; // Add this to easily identify custom patterns
}

// The default patterns that ship with the app
const defaultPatterns: BreathingPatternUpdated[] = [
  // ... (copy your defaultPatterns array here)
  {
    id: "box-breathing",
    name: "Box Breathing",
    description: "Equal duration for inhale, hold, exhale, and hold. Great for reducing stress.",
    steps: [ { phase: "inhale", duration: 4 }, { phase: "hold", duration: 4 }, { phase: "exhale", duration: 4 }, { phase: "hold-empty", duration: 4 }, ],
    totalDuration: 16,
    defaultSets: 10,
  },
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8. Helps with sleep and anxiety.",
    steps: [ { phase: "inhale", duration: 4 }, { phase: "hold", duration: 7 }, { phase: "exhale", duration: 8 }, ],
    totalDuration: 19,
    defaultSets: 8,
  },
  {
    id: "equal-breathing",
    name: "Equal Breathing",
    description: "Breathe in for 4 seconds, and out for 4 seconds. A simple way to find calm.",
    steps: [ { phase: "inhale", duration: 4 }, { phase: "exhale", duration: 4 }, ],
    totalDuration: 8,
    defaultSets: 15,
  },
];

const LOCAL_STORAGE_KEY = 'customBreathingPatterns';

export const useBreathingPatterns = () => {
  const [patterns, setPatterns] = useState<BreathingPatternUpdated[]>([]);

  // Load patterns from localStorage on initial render
  useEffect(() => {
    try {
      const storedPatterns = localStorage.getItem(LOCAL_STORAGE_KEY);
      const customPatterns = storedPatterns ? JSON.parse(storedPatterns) : [];
      setPatterns([...defaultPatterns, ...customPatterns]);
    } catch (error) {
      console.error("Failed to load custom patterns:", error);
      setPatterns(defaultPatterns);
    }
  }, []);

  const saveCustomPatterns = (customPatterns: BreathingPatternUpdated[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customPatterns));
      setPatterns([...defaultPatterns, ...customPatterns]);
    } catch (error) {
      console.error("Failed to save custom patterns:", error);
    }
  };

  const addPattern = (pattern: Omit<BreathingPatternUpdated, 'id' | 'isCustom'>) => {
    const customPatterns = patterns.filter(p => p.isCustom);
    const newPattern: BreathingPatternUpdated = {
      ...pattern,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    saveCustomPatterns([...customPatterns, newPattern]);
  };

  const updatePattern = (updatedPattern: BreathingPatternUpdated) => {
    const customPatterns = patterns.filter(p => p.isCustom);
    const newCustomPatterns = customPatterns.map(p =>
      p.id === updatedPattern.id ? updatedPattern : p
    );
    saveCustomPatterns(newCustomPatterns);
  };

  const deletePattern = (patternId: string) => {
    if (window.confirm('Are you sure you want to delete this pattern?')) {
        const customPatterns = patterns.filter(p => p.isCustom);
        const newCustomPatterns = customPatterns.filter(p => p.id !== patternId);
        saveCustomPatterns(newCustomPatterns);
    }
  };

  return { patterns, addPattern, updatePattern, deletePattern };
};