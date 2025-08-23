export interface NavItem {
  path: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface User {
  name: string | null;
  email: string | null;
}

export enum Mood {
  Happy = 'Happy',
  Neutral = 'Neutral',
  Sad = 'Sad',
  Anxious = 'Anxious',
  Excited = 'Excited',
}

export interface MoodEntry {
  id: number;
  mood: Mood;
  note?: string;
  timestamp: number;
}

export interface GratitudeEntry {
  id: number;
  text: string;
  timestamp: number;
}

export interface MeditationCategory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export enum MessageSender {
  User = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: MessageSender;
}