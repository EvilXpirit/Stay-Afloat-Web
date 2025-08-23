import { Groq } from 'groq-sdk';
import type { GratitudeEntry, MeditationCategory, Mood, MoodEntry, User } from '../types/types';
import { Mood as MoodEnum } from '../types/types';

// --- Groq AI Service ---
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Add conversation history management
type ConversationContext = {
  messages: Array<{
    role: 'system' | 'user' | 'assistant',
    content: string
  }>;
};

const CONTEXT_WINDOW = 10; // Number of messages to keep in context
const conversationContext: ConversationContext = {
  messages: [{
    role: 'system',
    content: 'You are a friendly and supportive mental health assistant for an app called StayAfloat. You are not a therapist, but a kind companion. Keep your responses concise, empathetic, and encouraging. Use a warm and gentle tone. Remember details from our conversation to provide personalized support.'
  }]
};

export const aiService = {
  sendMessage: async (prompt: string): Promise<string> => {
    try {
      // Add user's message to context
      conversationContext.messages.push({
        role: 'user',
        content: prompt
      });

      // Keep only recent messages within context window
      if (conversationContext.messages.length > CONTEXT_WINDOW + 1) { // +1 for system message
        conversationContext.messages = [
          conversationContext.messages[0], // Keep system message
          ...conversationContext.messages.slice(-CONTEXT_WINDOW)
        ];
      }

      const completion = await groq.chat.completions.create({
        messages: conversationContext.messages,
        model: 'llama-3.3-70b-versatile', // Using Mixtral for better conversation handling
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9,
        frequency_penalty: 0.5, // Add variety to responses
        presence_penalty: 0.5, // Encourage addressing new topics
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I am unable to respond at the moment.';

      // Add AI's response to context
      conversationContext.messages.push({
        role: 'assistant',
        content: response
      });

      return response;
    } catch (error) {
      console.error("Error calling Groq API:", error);
      return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
    }
  },

  // Add method to clear conversation context
  clearContext: () => {
    conversationContext.messages = [conversationContext.messages[0]];
  },

  // Add method to get conversation history
  getConversationHistory: () => {
    return conversationContext.messages.slice(1); // Exclude system message
  }
};

// --- Mock Data Service ---

const mockGratitudeEntries: GratitudeEntry[] = [
  { id: 1, text: 'A warm cup of coffee this morning.', timestamp: Date.now() - 86400000 },
  { id: 2, text: 'A nice walk in the park during lunch.', timestamp: Date.now() - 172800000 },
  { id: 3, text: 'A friend called just to say hi.', timestamp: Date.now() - 259200000 },
];

const mockMoodEntries: MoodEntry[] = [
    {id: 1, mood: MoodEnum.Happy, note: "Felt great after my morning run.", timestamp: Date.now() - 90000000},
    {id: 2, mood: MoodEnum.Neutral, note: "A standard workday.", timestamp: Date.now() - 180000000},
    {id: 3, mood: MoodEnum.Anxious, note: "Big presentation tomorrow.", timestamp: Date.now() - 260000000},
];

const mockMeditationCategories: MeditationCategory[] = [
    {id: 'anxiety', title: 'Anxiety & Stress Relief', description: 'Find calm in moments of overwhelm.', imageUrl: 'https://picsum.photos/seed/anxiety/400/300'},
    {id: 'motivation', title: 'Motivation Boost', description: 'Energize your mind and body.', imageUrl: 'https://picsum.photos/seed/motivation/400/300'},
    {id: 'sleep', title: 'Sleep Stories', description: 'Drift off into a peaceful slumber.', imageUrl: 'https://picsum.photos/seed/sleep/400/300'},
    {id: 'mindful', title: 'Mindful Walking', description: 'Connect with your surroundings.', imageUrl: 'https://picsum.photos/seed/mindful/400/300'},
];

const dailyQuotes = [
    "The best way to get started is to quit talking and begin doing.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It is during our darkest moments that we must focus to see the light.",
    "You will face many defeats in life, but never let yourself be defeated.",
    "The only impossible journey is the one you never begin."
];

const simulateDelay = <T,>(data: T): Promise<T> => 
    new Promise(resolve => setTimeout(() => resolve(data), 500));


export const mockDataService = {
  getDailyQuote: (): Promise<string> => {
    const quote = dailyQuotes[new Date().getDate() % dailyQuotes.length];
    return simulateDelay(quote);
  },
  getGratitudeEntries: (): Promise<GratitudeEntry[]> => simulateDelay(mockGratitudeEntries),
  addGratitudeEntry: (text: string): Promise<GratitudeEntry> => {
    const newEntry = {id: Date.now(), text, timestamp: Date.now()};
    mockGratitudeEntries.unshift(newEntry);
    return simulateDelay(newEntry);
  },
  getMoodEntries: (): Promise<MoodEntry[]> => simulateDelay(mockMoodEntries),
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>): Promise<MoodEntry> => {
    const newEntry = {...entry, id: Date.now(), timestamp: Date.now()};
    mockMoodEntries.unshift(newEntry);
    return simulateDelay(newEntry);
  },
  getMeditationCategories: (): Promise<MeditationCategory[]> => simulateDelay(mockMeditationCategories),
};
