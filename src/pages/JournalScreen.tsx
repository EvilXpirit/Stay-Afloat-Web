
import React, { useState, useEffect, useCallback } from 'react';
import { mockDataService } from '../services/mockData';
import type { GratitudeEntry, MoodEntry } from '../types/types';
import {Card} from '../components/common/CommonComp';
import MoodModal from '../components/journal/MoodModal';
import { MoodIconMap, JournalTabs } from '../config/navigation';
import { Plus } from 'lucide-react';

const JournalScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState(JournalTabs.MOOD);
    const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
    const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
    const [newGratitude, setNewGratitude] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(() => {
        mockDataService.getMoodEntries().then(setMoodEntries);
        mockDataService.getGratitudeEntries().then(setGratitudeEntries);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddGratitude = () => {
        if (newGratitude.trim()) {
            mockDataService.addGratitudeEntry(newGratitude).then(() => {
                setNewGratitude('');
                fetchData();
            });
        }
    };
    
    const handleAddMoodEntry = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
        mockDataService.addMoodEntry(entry).then(() => {
            fetchData();
        });
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2F4F4F] mb-6">Journal</h1>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab(JournalTabs.MOOD)} className={`py-3 px-1 border-b-2 font-medium text-lg ${activeTab === JournalTabs.MOOD ? 'border-[#4DB6AC] text-[#4DB6AC]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'}`}>
                        {JournalTabs.MOOD}
                    </button>
                    <button onClick={() => setActiveTab(JournalTabs.GRATITUDE)} className={`py-3 px-1 border-b-2 font-medium text-lg ${activeTab === JournalTabs.GRATITUDE ? 'border-[#4DB6AC] text-[#4DB6AC]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'}`}>
                        {JournalTabs.GRATITUDE}
                    </button>
                </nav>
            </div>
            
            <div className="relative pb-20">
                {activeTab === JournalTabs.MOOD ? (
                    <div>
                        <ul className="space-y-4">
                            {moodEntries.map(entry => {
                                const { Icon } = MoodIconMap[entry.mood];
                                return (
                                <li key={entry.id}>
                                    <Card className="flex items-center gap-4">
                                        <Icon className="w-10 h-10 text-[#4DB6AC]"/>
                                        <div>
                                            <p className="font-bold text-slate-800">{entry.mood}</p>
                                            {entry.note && <p className="text-slate-600">{entry.note}</p>}
                                            <p className="text-xs text-slate-400 mt-1">{new Date(entry.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </Card>
                                </li>
                                );
                            })}
                        </ul>
                         <button onClick={() => setIsModalOpen(true)} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-[#4DB6AC] text-white p-4 rounded-full shadow-lg hover:bg-teal-600 transition" aria-label="Add new mood entry">
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newGratitude}
                                onChange={(e) => setNewGratitude(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddGratitude()}
                                placeholder="What are you grateful for today?"
                                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none transition"
                            />
                            <button onClick={handleAddGratitude} className="bg-[#4DB6AC] text-white font-semibold px-5 rounded-lg shadow-md hover:bg-teal-600 transition">Add</button>
                        </div>
                        <ul className="space-y-4">
                            {gratitudeEntries.map(entry => (
                                <li key={entry.id}>
                                    <Card>
                                        <p className="text-slate-700">{entry.text}</p>
                                        <p className="text-xs text-slate-400 text-right mt-2">{new Date(entry.timestamp).toLocaleDateString()}</p>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <MoodModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddEntry={handleAddMoodEntry} />
        </div>
    );
};

export default JournalScreen;
