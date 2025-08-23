import React from 'react';
import type { User, NavItem } from '../types/types';
import { Home, MessageSquare, BookOpen, Leaf, User as UserIcon, Settings, Info, LogOut, Menu, X, Smile, Meh, AlertCircle, Sparkles, Frown, LibraryBig } from 'lucide-react';
import { Mood, MessageSender } from '../types/types';


export const navItems: NavItem[] = [
  { path: '/', name: 'Home', icon: Home },
  { path: '/journal', name: 'Journal', icon: BookOpen },
  { path: '/meditate', name: 'Meditate', icon: Leaf },
  { path: '/library', name: 'Library', icon: LibraryBig },
  { path: '/chat', name: 'Chat', icon: MessageSquare },
];

export const drawerItems: NavItem[] = [
  { path: '/profile', name: 'Profile', icon: UserIcon },
  { path: '/settings', name: 'Settings', icon: Settings },
  { path: '/about', name: 'About Us', icon: Info },
];

export const MoodIconMap: { [key in Mood]: { mood: Mood; Icon: React.FC<{className?: string}> } } = {
  [Mood.Happy]: { mood: Mood.Happy, Icon: Smile },
  [Mood.Neutral]: { mood: Mood.Neutral, Icon: Meh },
  [Mood.Sad]: { mood: Mood.Sad, Icon: Frown },
  [Mood.Anxious]: { mood: Mood.Anxious, Icon: AlertCircle },
  [Mood.Excited]: { mood: Mood.Excited, Icon: Sparkles },
};

export const JournalTabs = {
    MOOD: 'Mood Tracker',
    GRATITUDE: 'Gratitude Journal'
};