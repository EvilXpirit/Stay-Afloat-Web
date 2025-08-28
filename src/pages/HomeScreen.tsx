
import React, { useState, useEffect } from 'react';
import { mockDataService } from '../services/mockData';
import { quoteService } from '../services/quoteService';
import type { GratitudeEntry } from '../types/types';
import {Card} from '../components/common/CommonComp';
import { QuoteCardStack } from '../components/quotes/QuoteCardStack';
import { Loader } from 'react-feather'; // Using a simple loader icon

interface HomeScreenProps {
  userName: string;
}

interface Quote {
  id: string;
  text: string;
}


const HomeScreen: React.FC<HomeScreenProps> = ({ userName }) => {
  // const [quote, setQuote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [latestGratitude, setLatestGratitude] = useState<GratitudeEntry | null>(null);
  // Updated quotes without authors
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
      const loadQuotes = async () => {
      setIsLoading(true);
      const fetchedQuotes = await quoteService.getQuotes();
      setQuotes(fetchedQuotes);
      setIsLoading(false);
    };
    loadQuotes();

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

    const renderQuoteStack = () => {
    if (isLoading) {
      return (
        <div className="relative w-full max-w-sm mx-auto aspect-[3/4] flex flex-col items-center justify-center bg-slate-100 rounded-2xl">
          <Loader className="animate-spin text-teal-500 mb-4" size={40} />
          <p className="text-slate-600">Preparing quotes...</p>
        </div>
      );
    }

    if (quotes.length > 0) {
      return (
        <QuoteCardStack
          quotes={quotes}
          onQuoteLike={(id) => console.log('Liked quote:', id)}
          onQuoteShare={(id) => console.log('Shared quote:', id)}
        />
      );
    }
    
    // Fallback if API fails on first load with no cache
    return (
       <div className="relative w-full max-w-sm mx-auto aspect-[3/4] flex items-center justify-center text-center bg-red-100 border border-red-300 text-red-700 p-4 rounded-2xl">
          <p>Could not load quotes. Please check your internet connection and try again later.</p>
        </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-[#2F4F4F]">{`${getGreeting()}, ${userName}`}</h1>
        <p className="text-slate-600 mt-1">Ready to start your day with intention?</p>
      </header>

      {/* <Card className="bg-[#4DB6AC]/20 border border-[#4DB6AC]/30">
        <h2 className="text-lg font-semibold text-[#2F4F4F] mb-2">Daily Quote</h2>
        <p className="text-xl italic text-slate-700">"{quote}"</p>
      </Card> */}

      {renderQuoteStack()}

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
