
import React, { useState, useEffect } from 'react';
import { mockDataService } from '../services/mockData';
import type { GratitudeEntry } from '../types/types';
import {Card} from '../components/common/CommonComp';

interface HomeScreenProps {
  userName: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ userName }) => {
  const [quote, setQuote] = useState('');
  const [latestGratitude, setLatestGratitude] = useState<GratitudeEntry | null>(null);

  useEffect(() => {
    mockDataService.getDailyQuote().then(setQuote);
    mockDataService.getGratitudeEntries().then(entries => {
      if (entries.length > 0) {
        setLatestGratitude(entries[0]);
      }
    });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-[#2F4F4F]">{`${getGreeting()}, ${userName}`}</h1>
        <p className="text-slate-600 mt-1">Ready to start your day with intention?</p>
      </header>

      <Card className="bg-[#4DB6AC]/20 border border-[#4DB6AC]/30">
        <h2 className="text-lg font-semibold text-[#2F4F4F] mb-2">Daily Quote</h2>
        <p className="text-xl italic text-slate-700">"{quote}"</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-[#2F4F4F] mb-3">How are you feeling today?</h2>
        <p className="text-slate-600 mb-4">Tracking your mood can help you understand your emotional patterns.</p>
        <a href="#/journal" className="inline-block bg-[#4DB6AC] text-white font-semibold py-2 px-5 rounded-lg hover:bg-teal-600 transition">
          Track Mood
        </a>
      </Card>

      {latestGratitude && (
        <Card>
          <h2 className="text-lg font-semibold text-[#2F4F4F] mb-2">Latest Gratitude Entry</h2>
          <p className="text-slate-600 line-clamp-2">"{latestGratitude.text}"</p>
           <a href="#/journal" className="text-sm text-[#4DB6AC] hover:underline mt-3 inline-block">View journal</a>
        </Card>
      )}
    </div>
  );
};

export default HomeScreen;
