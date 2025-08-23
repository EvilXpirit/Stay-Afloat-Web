
import React, { useState, useEffect } from 'react';
import { mockDataService } from '../services/mockData';
import type { MeditationCategory } from '../types/types';

const MeditateScreen: React.FC = () => {
  const [categories, setCategories] = useState<MeditationCategory[]>([]);

  useEffect(() => {
    mockDataService.getMeditationCategories().then(setCategories);
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-[#2F4F4F] mb-6">Meditate</h1>
      <p className="text-slate-600 mb-8">Find a moment of peace and recenter yourself with our guided sessions.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(category => (
          <div key={category.id} className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
            <img src={category.imageUrl} alt={category.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"/>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white">{category.title}</h3>
              <p className="text-white/90">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeditateScreen;
