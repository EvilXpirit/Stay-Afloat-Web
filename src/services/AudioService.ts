// src/services/AudioService.ts

interface PlayOptions {
  loop?: boolean;
  volume?: number;
}

/**
 * A singleton service to manage all audio playback in the application.
 */
class AudioService {
  private audioContext: Map<string, HTMLAudioElement> = new Map();

  /**
   * Plays a sound. If a sound with the same ID is already playing,
   * it will be stopped and replaced. If it's paused, it will resume.
   * @param soundId - A unique identifier for the sound instance (e.g., 'meditation-ambience').
   * @param url - The URL of the audio file to play.
   * @param options - Playback options like loop and volume.
   */
  public play(soundId: string, url: string, options: PlayOptions = {}) {
    // If this sound is already playing from the same URL, do nothing.
    const existingAudio = this.audioContext.get(soundId);
    if (existingAudio && !existingAudio.paused && existingAudio.src === url) {
      return;
    }

    // If it exists but is paused, just play it.
    if (existingAudio && existingAudio.paused && existingAudio.src === url) {
        existingAudio.play().catch(e => console.error("Error resuming audio:", e));
        return;
    }

    // If it exists but with a different URL, or doesn't exist, create a new one.
    if (existingAudio) {
      existingAudio.pause();
    }
    
    const audio = new Audio(url);
    audio.loop = options.loop ?? false;
    audio.volume = options.volume ?? 1.0;
    
    audio.play().catch(e => console.error("Error playing audio:", e));
    this.audioContext.set(soundId, audio);
  }

  /**
   * Pauses a currently playing sound.
   * @param soundId - The unique identifier of the sound to pause.
   */
  public pause(soundId: string) {
    const audio = this.audioContext.get(soundId);
    if (audio && !audio.paused) {
      audio.pause();
    }
  }

  /**
   * Stops a sound, removes it from memory, and resets its time.
   * @param soundId - The unique identifier of the sound to stop.
   */
  public stop(soundId: string) {
    const audio = this.audioContext.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.audioContext.delete(soundId);
    }
  }

  /**
   * Gradually fades out a sound and then stops it.
   * @param soundId - The identifier of the sound to fade out.
   * @param duration - The fade-out duration in milliseconds.
   */
  public fadeOutAndStop(soundId: string, duration: number = 1000) {
    const audio = this.audioContext.get(soundId);
    if (!audio || audio.volume === 0) {
      this.stop(soundId);
      return;
    }

    const initialVolume = audio.volume;
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = initialVolume / steps;

    const fadeInterval = setInterval(() => {
      const newVolume = audio.volume - volumeStep;
      if (newVolume <= 0) {
        clearInterval(fadeInterval);
        this.stop(soundId);
      } else {
        audio.volume = newVolume;
      }
    }, stepDuration);
  }
}

// Export a single instance to act as a singleton
export const audioService = new AudioService();