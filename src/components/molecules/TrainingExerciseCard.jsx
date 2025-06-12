import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { Checkbox } from '@/components/atoms/Checkbox';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Button } from '@/components/atoms/Button';
import ExerciseTechniqueModal from '@/components/organisms/ExerciseTechniqueModal';
import RestTimer from '@/atoms/RestTimer';
import TimerControls from '@/molecules/TimerControls';
import audioServiceAPI from '@/services/api/audioService';
import userPreferencesService from '@/services/api/userPreferencesService';
import { toast } from 'sonner';
const iconMap = {
  pushUps: 'ArrowUp',
  sitUps: 'RotateCcw',
  crunches: 'Activity',
  run: 'MapPin',
};

const iconColorMap = {
  pushUps: 'text-red-400',
  sitUps: 'text-blue-400',
  crunches: 'text-green-400',
  run: 'text-yellow-400',
};

function TrainingExerciseCard({ exerciseKey, name, target, completed, onToggle }) {
  const [isTechniqueModalOpen, setIsTechniqueModalOpen] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastBeepTime, setLastBeepTime] = useState(0);
  
  const iconName = iconMap[exerciseKey];
  const iconColorClass = iconColorMap[exerciseKey];

  // Load timer preferences
  useEffect(() => {
    loadTimerPreferences();
  }, [exerciseKey]);

  const loadTimerPreferences = async () => {
    try {
      const timerSettings = await userPreferencesService.getTimerSettings();
      const exerciseSettings = timerSettings[exerciseKey] || timerSettings.default;
      setTimerDuration(exerciseSettings?.restDuration || 60);
      setAudioEnabled(exerciseSettings?.soundEnabled ?? true);
    } catch (error) {
      console.error('Failed to load timer preferences:', error);
    }
  };

  const handleToggle = (key) => {
    onToggle(key);
    
    // Show rest timer after completing exercise
    if (!completed) {
      setTimeout(() => {
        setShowRestTimer(true);
        toast.success(`Great job! Take a ${Math.floor(timerDuration / 60)}:${(timerDuration % 60).toString().padStart(2, '0')} rest`, {
          description: 'Rest timer is ready when you are'
        });
      }, 500);
    } else {
      setShowRestTimer(false);
      setTimerActive(false);
    }
  };

  const handleTimerStart = () => {
    setTimerActive(true);
    if (audioEnabled) {
      audioServiceAPI.playBeep();
    }
    toast.success('Rest timer started', {
      description: 'Focus on recovery and breathing'
    });
  };

  const handleTimerPause = () => {
    setTimerActive(false);
    toast.info('Rest timer paused');
  };

  const handleTimerStop = () => {
    setTimerActive(false);
    setShowRestTimer(false);
    toast.info('Rest timer stopped');
  };

  const handleTimerComplete = async () => {
    setTimerActive(false);
    setShowRestTimer(false);
    
    if (audioEnabled) {
      await audioServiceAPI.playComplete();
    }
    
    toast.success('Rest period complete!', {
      description: 'Ready for your next set?',
      className: 'achievement-toast',
      duration: 4000
    });
  };

  const handleTimerTick = async (timeLeft) => {
    if (!audioEnabled) return;
    
    // Play countdown beeps at 5, 4, 3, 2, 1 seconds
    if (timeLeft <= 5 && timeLeft > 0 && timeLeft !== lastBeepTime) {
      setLastBeepTime(timeLeft);
      await audioServiceAPI.playBeep();
    }
    
    // Play warning at 10 seconds
    if (timeLeft === 10) {
      await audioServiceAPI.playWarning();
    }
  };

  const handleDurationChange = (newDuration) => {
    setTimerDuration(newDuration);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 sm:p-6 border border-gray-600"
      >
<div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <ApperIcon name={iconName} className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColorClass}`} />
            <span className="font-semibold text-white text-sm sm:text-base">{name}</span>
          </div>
          <Checkbox
            checked={completed || false}
            onCheckedChange={() => handleToggle(exerciseKey)}
            className="data-[state=checked]:bg-saiyan-orange data-[state=checked]:border-saiyan-orange w-5 h-5"
          />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-saiyan-gold mb-2">
          {target} {exerciseKey === 'run' ? 'km' : ''}
        </div>
        <ProgressBar 
          value={completed ? 100 : 0} 
          className="h-2 bg-slate-600 mb-4"
        />
        {/* Rest Timer Section */}
        {showRestTimer && completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-saiyan-gold/30"
          >
            <div className="text-center mb-3">
              <h4 className="text-sm font-semibold text-saiyan-gold mb-1">Rest Period</h4>
              <p className="text-xs text-gray-400">Recovery time between sets</p>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <RestTimer
                duration={timerDuration}
                isActive={timerActive}
                onComplete={handleTimerComplete}
                onTick={handleTimerTick}
                size="md"
              />
              
              <TimerControls
                exerciseType={exerciseKey}
                onStart={handleTimerStart}
                onPause={handleTimerPause}
                onStop={handleTimerStop}
                onDurationChange={handleDurationChange}
                isActive={timerActive}
              />
            </div>
          </motion.div>
        )}

        {/* Technique Guide Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTechniqueModalOpen(true)}
            className="text-xs sm:text-sm bg-slate-800/50 border-slate-600 hover:border-primary/50 hover:bg-slate-700/50 text-gray-300 hover:text-white transition-all duration-200"
          >
            <ApperIcon name="HelpCircle" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Technique Guide
          </Button>
        </div>
      </motion.div>

      {/* Technique Modal */}
      <ExerciseTechniqueModal
        exerciseKey={exerciseKey}
        isOpen={isTechniqueModalOpen}
        onClose={() => setIsTechniqueModalOpen(false)}
      />
    </>
  );
}

export default TrainingExerciseCard;