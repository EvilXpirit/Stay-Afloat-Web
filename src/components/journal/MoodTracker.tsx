import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../common/Card';
import type { MoodEntry } from '../../types/types';
import { MoodIconMap } from '../../config/navigation';

interface MoodTrackerProps {
  entries: MoodEntry[];
  onOpenModal: () => void;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ entries, onOpenModal }) => {
  return (
    <div>
      <ul className="space-y-4">
        {entries.map(entry => {
          const { Icon } = MoodIconMap[entry.mood];
          return (
            <li key={entry.id}>
              <Card className="flex items-center gap-4">
                <Icon className="w-10 h-10 text-[#4DB6AC]"/>
                <div>
                  <p className="font-bold text-slate-800">{entry.mood}</p>
                  {entry.note && <p className="text-slate-600">{entry.note}</p>}
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
      <button 
        onClick={onOpenModal} 
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-[#4DB6AC] text-white p-4 rounded-full shadow-lg hover:bg-teal-600 transition" 
        aria-label="Add mood entry"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MoodTracker;