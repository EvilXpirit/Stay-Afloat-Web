// src/screens/MeditateScreen.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Plus, Play, Pause, RotateCcw, CheckCircle,  X } from "lucide-react";
import { BreathingCircle } from "../components/meditation/BreathingCircle";
import { Card } from "../components/common/Card";
import type { BreathingPattern } from "../types/meditation";

// --- MOCK DATA and TYPES ---
interface BreathingPatternUpdated extends BreathingPattern {
  defaultSets: number;
}

const defaultPatterns: BreathingPatternUpdated[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    description:
      "Equal duration for inhale, hold, exhale, and hold. Great for reducing stress.",
    steps: [
      { phase: "inhale", duration: 4 },
      { phase: "hold", duration: 4 },
      { phase: "exhale", duration: 4 },
      { phase: "hold-empty", duration: 4 },
    ],
    totalDuration: 16,
    defaultSets: 10,
  },
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    description:
      "Inhale for 4, hold for 7, exhale for 8. Helps with sleep and anxiety.",
    steps: [
      { phase: "inhale", duration: 4 },
      { phase: "hold", duration: 7 },
      { phase: "exhale", duration: 8 },
    ],
    totalDuration: 19,
    defaultSets: 8,
  },
  // --- NEW PATTERN ADDED HERE ---
  {
    id: "equal-breathing",
    name: "Equal Breathing",
    description:
      "Breathe in for 4 seconds, and out for 4 seconds. A simple way to find calm.",
    steps: [
      { phase: "inhale", duration: 4 },
      { phase: "exhale", duration: 4 },
    ],
    totalDuration: 8,
    defaultSets: 15,
  },
  // --- END OF NEW PATTERN ---
];

// --- HELPER FUNCTIONS ---
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// --- NEW: HAPTIC FEEDBACK HELPER ---
const hapticFeedback = (type: "light" | "success") => {
  // Check if the Vibration API is supported
  if (window.navigator && "vibrate" in window.navigator) {
    if (type === "light") {
      // A short, subtle tap for phase changes
      window.navigator.vibrate(50);
    } else if (type === "success") {
      // A more noticeable pattern for start/end
      window.navigator.vibrate([100, 50, 100]);
    }
  }
};

// --- THE MAIN COMPONENT ---
const MeditateScreen: React.FC = () => {
  // State for controlling which view is shown: 'selecting', 'ready', 'active'
  const [sessionState, setSessionState] = useState<'selecting' | 'ready' | 'active' | 'finished'>('selecting');

  // State for the meditation session itself
  const [selectedPattern, setSelectedPattern] =
    useState<BreathingPatternUpdated | null>(null);
  const [numSets, setNumSets] = useState(10);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // State for timers
  const [stepCountdown, setStepCountdown] = useState(0);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(0);

  // Framer Motion animation controls
  const animationControls = useAnimationControls();

  // Memoize the current step details to avoid re-calculating on every render
  const currentStep = useMemo(() => {
    if (!selectedPattern) return null;
    return selectedPattern.steps[currentStepIndex];
  }, [selectedPattern, currentStepIndex]);

  // --- ANIMATION LOGIC ---
  const runAnimation = useCallback(() => {
    if (!currentStep) return;

    const { phase, duration } = currentStep;

    let scaleTarget = 1;
    switch (phase) {
      case "inhale":
        scaleTarget = 1.5;
        break;
      case "hold":
        scaleTarget = 1.5;
        break;
      case "exhale":
        scaleTarget = 1;
        break;
      case "hold-empty":
        scaleTarget = 1;
        break;
    }

    // Using start() on controls gives us fine-grained control
    animationControls.start({
      scale: scaleTarget,
      transition: { duration, ease: "easeInOut" },
    });
  }, [animationControls, currentStep]);

  // --- CORE SESSION LOGIC in useEffect ---
  useEffect(() => {
    // This effect handles all the timing and state transitions for the session
    if (
      sessionState !== "active" ||
      !isPlaying ||
      !selectedPattern ||
      !currentStep
    ) {
      return;
    }

    // Start the animation for the current step when it changes or when resuming
    runAnimation();

    const interval = setInterval(() => {
      setStepCountdown((prev) => prev - 1);
      setTotalTimeRemaining((prev) => prev - 1);

      if (stepCountdown <= 1) {
        hapticFeedback("light");
        // Time for the next step
        const nextStepIndex =
          (currentStepIndex + 1) % selectedPattern.steps.length;

        if (nextStepIndex === 0) {
          // A full cycle is complete, move to the next set
          if (currentSet >= numSets) {
            // All sets are complete, end the session
            setIsPlaying(false);
            setSessionState("selecting"); // Or a 'finished' state
            setSelectedPattern(null);
            animationControls.stop();
            hapticFeedback("success"); // Success feedback on completion
            return;
          }
          setCurrentSet((prev) => prev + 1);
        }

        setCurrentStepIndex(nextStepIndex);
        setStepCountdown(selectedPattern.steps[nextStepIndex].duration);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    sessionState,
    isPlaying,
    selectedPattern,
    currentStepIndex,
    stepCountdown,
    currentSet,
    numSets,
    animationControls,
    runAnimation,
    currentStep,
  ]);

  // --- EVENT HANDLERS ---
  const handleSelectPattern = (pattern: BreathingPatternUpdated) => {
    setSelectedPattern(pattern);
    setNumSets(pattern.defaultSets);
    setSessionState("ready");
  };

  const handleStartSession = () => {
    if (!selectedPattern) return;
    setCurrentSet(1);
    setCurrentStepIndex(0);
    setStepCountdown(selectedPattern.steps[0].duration);
    setTotalTimeRemaining(numSets * selectedPattern.totalDuration);
    setSessionState("active");
    setIsPlaying(true); // This will trigger the useEffect to start the timers
    hapticFeedback("success");
  };

  const handleTogglePlayPause = () => {
    setIsPlaying((prev) => {
      if (prev) {
        animationControls.stop(); // Pause animation
      } else {
        runAnimation(); // Resume animation
      }
      return !prev;
    });
  };

  const handleRestart = () => {
    animationControls.stop();
    handleStartSession(); // Just re-run the start logic
  };

  const handleExit = () => {
    animationControls.stop();
    setIsPlaying(false);
    setSelectedPattern(null);
    setSessionState("selecting");
  };

  const handleSetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 300) value = 300;
    setNumSets(value);
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    // --- NEW: RENDER BLOCK FOR THE 'FINISHED' STATE ---
    if (sessionState === 'finished' && selectedPattern) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-md p-6 sm:p-8 text-center flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-teal-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Great Work!</h2>
            <p className="text-slate-600 mb-8">
              You've completed {numSets} sets of {selectedPattern.name}.
            </p>
            <button
              onClick={handleExit}
              className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-all duration-200"
            >
              Back to Exercises
            </button>
          </Card>
        </motion.div>
      );
    }

    if (sessionState === 'active' && selectedPattern && currentStep) {
      const instructionText = { inhale: 'Breathe In', hold: 'Hold', exhale: 'Breathe Out', 'hold-empty': 'Hold' };
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <Card className="w-full max-w-md relative p-6 sm:p-8 text-center">
             <div className="absolute top-4 right-4 text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium"> {formatTime(totalTimeRemaining)} </div>
             <button onClick={handleExit} className="absolute top-3 left-3 text-slate-400 hover:text-slate-600"> <X size={24} /> </button>
            <h2 className="text-xl sm:text-2xl font-semibold mt-4"> {selectedPattern.name} </h2>
            <p className="text-slate-500 mb-6">Set {currentSet} of {numSets}</p>
            <div className="flex flex-col items-center justify-center w-full min-h-[250px] gap-y-4">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep.phase} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.5 }} className="text-2xl sm:text-3xl font-light text-teal-700 h-10" >
                  {instructionText[currentStep.phase]}
                </motion.div>
              </AnimatePresence>
              <div className="relative flex items-center justify-center">
                 <BreathingCircle controls={animationControls} />
                 <div className="absolute pointer-events-none">
                    <span className="text-5xl sm:text-6xl font-light text-teal-600"> {stepCountdown} </span>
                 </div>
              </div>
            </div>
             <div className="flex justify-center gap-4 mt-6">
              <button onClick={handleTogglePlayPause} className="p-4 rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2" >
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <button onClick={handleRestart} className="p-4 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2" >
                <RotateCcw size={28} />
              </button>
            </div>
          </Card>
        </div>
      );
    }

    if (sessionState === "ready" && selectedPattern) {
      return (
        // PREPARATION VIEW
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <Card className="w-full max-w-md p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">{selectedPattern.name}</h2>
            <p className="text-slate-600 mb-8">{selectedPattern.description}</p>

            <div className="mb-8">
              <label
                htmlFor="sets-input"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Number of Sets (1-300)
              </label>
              <input
                id="sets-input"
                type="number"
                value={numSets}
                onChange={handleSetsChange}
                className="w-32 text-center p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                min="1"
                max="300"
              />
            </div>

            <button
              onClick={handleStartSession}
              className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
            >
              Ready to Start
            </button>
            <button
              onClick={handleExit}
              className="w-full mt-3 p-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Choose Different Exercise
            </button>
          </Card>
        </div>
      );
    }

    return (
      // SELECTION VIEW
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">Guided Breathing</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {defaultPatterns.map((pattern) => (
            <motion.div
              key={pattern.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPattern(pattern)}
            >
              <Card className="cursor-pointer h-full hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{pattern.name}</h3>
                <p className="text-sm text-slate-600 flex-grow">
                  {pattern.description}
                </p>
                <div className="mt-4 text-xs text-slate-400">
                  1 Set = {pattern.totalDuration} seconds
                </div>
              </Card>
            </motion.div>
          ))}
          <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
            <Card className="cursor-pointer border-2 border-dashed h-full border-slate-200 hover:border-teal-500 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <span>Create Custom Pattern</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">{renderContent()}</div>
    </div>
  );
};

export default MeditateScreen;
