import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { Checkbox } from '@/components/atoms/Checkbox';
import { ProgressBar } from '@/components/atoms/ProgressBar';

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
  const iconName = iconMap[exerciseKey];
  const iconColorClass = iconColorMap[exerciseKey];

  return (
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
          onCheckedChange={() => onToggle(exerciseKey)}
          className="data-[state=checked]:bg-saiyan-orange data-[state=checked]:border-saiyan-orange w-5 h-5"
        />
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-saiyan-gold mb-2">
        {target} {exerciseKey === 'run' ? 'km' : ''}
      </div>
      <ProgressBar 
        value={completed ? 100 : 0} 
        className="h-2 bg-slate-600"
      />
    </motion.div>
  );
}

export default TrainingExerciseCard;