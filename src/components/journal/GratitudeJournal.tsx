import React, { useState } from 'react';
import { Card } from '../common/Card';
import type { GratitudeEntry } from '../../types/types';

interface GratitudeJournalProps {
  entries: GratitudeEntry[];
  onAddEntry: (text: string) => void;
}

export const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ entries, onAddEntry }) => {
  const [newGratitude, setNewGratitude] = useState('');

  const handleAddGratitude = () => {
    if (newGratitude.trim()) {
      onAddEntry(newGratitude);
      setNewGratitude('');
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newGratitude}
          onChange={(e) => setNewGratitude(e.target.value)}
          placeholder="What are you grateful for today?"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none transition"
        />
        <button 
          onClick={handleAddGratitude} 
          className="bg-[#4DB6AC] text-white font-semibold px-5 rounded-lg shadow-md hover:bg-teal-600 transition"
        >
          Add
        </button>
      </div>
      <ul className="space-y-4">
        {entries.map(entry => (
          <li key={entry.id}>
            <Card>
              <p className="text-slate-700">{entry.text}</p>
              <p className="text-xs text-slate-400 text-right mt-2">
                {new Date(entry.timestamp).toLocaleDateString()}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GratitudeJournal;