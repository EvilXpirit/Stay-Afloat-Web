export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  steps: {
    phase: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
    duration: number;
  }[];
  totalDuration: number;
}

export interface CustomBreathingPattern extends BreathingPattern {
  isCustom: boolean;
  createdAt: Date;
}