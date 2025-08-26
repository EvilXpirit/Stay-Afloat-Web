import { useState, useEffect, useCallback } from 'react';
import { audioService } from '../services/AudioService';
import type { Sound } from '../types/audio';

export const useAudio = (soundId: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSound = async () => {
      const loadedSound = await audioService.loadSound(soundId);
      if (mounted) {
        setSound(loadedSound);
      }
    };

    loadSound();

    return () => {
      mounted = false;
      audioService.stop(soundId);
    };
  }, [soundId]);

  const play = useCallback((loop = false) => {
    audioService.play(soundId, loop);
    setIsPlaying(true);
  }, [soundId]);

  const stop = useCallback(() => {
    audioService.stop(soundId);
    setIsPlaying(false);
  }, [soundId]);

  const setVolume = useCallback((volume: number) => {
    audioService.setVolume(soundId, volume);
  }, [soundId]);

  return {
    isPlaying,
    sound,
    play,
    stop,
    setVolume
  };
};