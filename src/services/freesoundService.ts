// src/services/freesoundService.ts

const API_KEY = import.meta.env.VITE_FREESOUND_API_KEY;
const BASE_URL = 'https://freesound.org/apiv2';

/**
 * Fetches sound information from Freesound and returns the HQ MP3 preview URL.
 * @param soundId - The ID of the sound on Freesound.org.
 * @returns The URL of the sound file, or null if not found.
 */
export const getSoundUrl = async (soundId: string): Promise<string | null> => {
  if (!API_KEY) {
    console.error("Freesound API key is missing. Please set REACT_APP_FREESOUND_API_KEY in your .env.local file.");
    return null;
  }

  // Freesound requires specific fields to be requested
  const fields = 'id,name,previews';
  const url = `${BASE_URL}/sounds/${soundId}/?token=${API_KEY}&fields=${fields}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Freesound API error: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Return the high-quality MP3 preview URL
    return data.previews['preview-hq-mp3'] || null;
  } catch (error) {
    console.error("Failed to fetch sound from Freesound:", error);
    return null;
  }
};