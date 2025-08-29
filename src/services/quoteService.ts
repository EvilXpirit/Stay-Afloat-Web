import { Capacitor } from '@capacitor/core';

// Define the structure of a quote in our app
interface Quote {
  id: string;
  text: string;
}

// Define the structure of the API response from ZenQuotes
interface ZenQuote {
  q: string; // The quote text
  a: string; // The author
}

// Define the structure of our cache in localStorage
interface QuoteCache {
  quotes: Quote[];
  timestamp: number;
}

const CACHE_KEY = 'zenQuotesCache';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

class QuoteService {
  private async fetchQuotesFromApi(): Promise<Quote[]> {
    console.log("Fetching new quotes...");

    // Determine the correct URL based on the platform
    let apiUrl: string;

    if (Capacitor.isNativePlatform()) {
      // We are on a real device (iOS/Android).
      // We MUST use the full, absolute URL to our deployed Vercel function.
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      apiUrl = `${baseUrl}/api/quotes`;
    } else {
      // We are in a web browser (local dev or deployed on Vercel).
      // Use the relative path to take advantage of the proxy/serverless function.
      apiUrl = import.meta.env.VITE_QUOTES_API_ENDPOINT; // This is "/api/quotes"
    }

    console.log(`Platform: ${Capacitor.isNativePlatform() ? 'Native' : 'Web'}. Making request to: ${apiUrl}`);

    try {
      const response = await fetch(apiUrl); 

      if (!response.ok) {
        // ... (rest of the function is exactly the same)
        const errorText = await response.text();
        console.error(`API request failed with status ${response.status}:`, errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data: ZenQuote[] = await response.json();

      const formattedQuotes = data.map((quote, index) => ({
        id: `${Date.now()}-${index}`,
        text: quote.q,
      }));
      
      return formattedQuotes;

    } catch (error) {
      console.error("Failed to fetch quotes from API:", error);
      return [];
    }
  }


  private getCachedQuotes(): QuoteCache | null {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;
    return JSON.parse(cachedData) as QuoteCache;
  }
  
  private setCachedQuotes(quotes: Quote[]): void {
     const cache: QuoteCache = {
        quotes,
        timestamp: Date.now(),
     };
     localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }

  public async getQuotes(): Promise<Quote[]> {
    const cache = this.getCachedQuotes();

    // Check if we have a valid, non-expired cache
    if (cache && (Date.now() - cache.timestamp < CACHE_DURATION_MS)) {
      console.log("Using cached quotes.");
      return cache.quotes;
    }

    // If cache is expired or doesn't exist, fetch new ones
    const newQuotes = await this.fetchQuotesFromApi();
    
    // If the API call was successful, update the cache
    if (newQuotes.length > 0) {
      this.setCachedQuotes(newQuotes);
      return newQuotes;
    }
    
    // **Edge Case Fallback**
    // If API fails but we have old (expired) quotes in cache, use them as a last resort
    if (cache) {
       console.warn("API fetch failed. Falling back to stale cache.");
       return cache.quotes;
    }

    // If API fails and there's no cache at all, return empty
    return [];
  }
}

// Export a singleton instance of the service
export const quoteService = new QuoteService();