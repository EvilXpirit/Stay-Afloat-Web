// src/components/meditation/CustomPatternForm.tsx

import React, { useState, useEffect } from 'react';
import type { BreathingPattern } from '../../types/meditation'; // Adjust path if needed

interface BreathingPatternUpdated extends BreathingPattern {
  defaultSets: number;
  isCustom?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pattern: Omit<BreathingPatternUpdated, 'id' | 'isCustom'>) => void;
  patternToEdit?: BreathingPatternUpdated | null;
}

export const CustomPatternForm: React.FC<Props> = ({ isOpen, onClose, onSave, patternToEdit }) => {
  const [name, setName] = useState('');
  const [inhale, setInhale] = useState(4);
  const [hold1, setHold1] = useState(4);
  const [exhale, setExhale] = useState(4);
  const [hold2, setHold2] = useState(4);
  const [defaultSets, setDefaultSets] = useState(10);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patternToEdit) {
      setName(patternToEdit.name);
      setDefaultSets(patternToEdit.defaultSets);
      setInhale(patternToEdit.steps.find(s => s.phase === 'inhale')?.duration ?? 0);
      setHold1(patternToEdit.steps.find(s => s.phase === 'hold')?.duration ?? 0);
      setExhale(patternToEdit.steps.find(s => s.phase === 'exhale')?.duration ?? 0);
      setHold2(patternToEdit.steps.find(s => s.phase === 'hold-empty')?.duration ?? 0);
    } else {
      // Reset to default for new pattern
      setName('');
      setInhale(4);
      setHold1(4);
      setExhale(4);
      setHold2(4);
      setDefaultSets(10);
    }
    setError('');
  }, [patternToEdit, isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Pattern name is required.');
      return;
    }

    const steps = [
      { phase: 'inhale', duration: inhale },
      { phase: 'hold', duration: hold1 },
      { phase: 'exhale', duration: exhale },
      { phase: 'hold-empty', duration: hold2 },
    ].filter(step => step.duration > 0); // Only include steps with a duration

    if (steps.length === 0) {
      setError('At least one breathing phase must have a duration greater than 0.');
      return;
    }

    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

    onSave({
      name: name.trim(),
      description: 'A custom breathing pattern.', // Or add a field for this
      steps,
      totalDuration,
      defaultSets,
    });
    onClose();
  };

  if (!isOpen) return null;

  const renderInput = (label: string, value: number, setter: (val: number) => void) => (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => setter(Math.max(0, Math.min(60, parseInt(e.target.value, 10) || 0)))}
        className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm"
        min="0"
        max="60"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">{patternToEdit ? 'Edit Pattern' : 'Create Custom Pattern'}</h2>
        
        <div>
          <label className="block text-sm font-medium text-slate-700">Pattern Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm"
            placeholder="e.g., Calming Breath"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {renderInput('Inhale (sec)', inhale, setInhale)}
          {renderInput('Hold (sec)', hold1, setHold1)}
          {renderInput('Exhale (sec)', exhale, setExhale)}
          {renderInput('Hold Empty (sec)', hold2, setHold2)}
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700">Default Sets</label>
            <input
                type="number"
                value={defaultSets}
                onChange={e => setDefaultSets(Math.max(1, Math.min(300, parseInt(e.target.value, 10) || 1)))}
                className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm"
                min="1"
                max="300"
            />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600">
            Save Pattern
          </button>
        </div>
      </div>
    </div>
  );
};