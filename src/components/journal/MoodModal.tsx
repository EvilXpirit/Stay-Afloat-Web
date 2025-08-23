import React, { useState } from 'react';
import type { Mood, MoodEntry } from '../../types/types';
import { MoodIconMap } from '../../config/navigation';

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
}

export const MoodModal: React.FC<MoodModalProps> = ({ isOpen, onClose, onAddEntry }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedMood) {
      onAddEntry({ mood: selectedMood, note });
      setSelectedMood(null);
      setNote('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#FAF9F6] rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">How are you feeling?</h2>
        <div className="flex justify-around mb-6">
          {Object.values(MoodIconMap).map(({ mood, Icon }) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`p-3 rounded-full transition-all duration-200 ${
                selectedMood === mood 
                  ? 'bg-[#4DB6AC] text-white scale-110' 
                  : 'bg-[#F5EFE6] hover:bg-teal-100'
              }`}
            >
              <Icon className="w-8 h-8" />
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)..."
          className="w-full p-3 border border-gray-300 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none transition"
          rows={3}
        />
        <div className="flex justify-end gap-4 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-slate-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!selectedMood} 
            className="px-6 py-2 bg-[#4DB6AC] text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodModal;