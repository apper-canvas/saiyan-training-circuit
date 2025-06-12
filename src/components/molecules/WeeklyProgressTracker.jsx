import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';

function WeeklyProgressTracker({ weekWorkouts }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-slate-800/80 border border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center space-x-3">
            <ApperIcon name="Calendar" className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
            <span>This Week's Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
              const dayWorkout = weekWorkouts.find(w => new Date(w.date).getDay() === index);
              const isCompleted = dayWorkout?.isComplete || false;
              const isToday = new Date().getDay() === index;

              return (
                <div
                  key={day}
                  className={`text-center p-2 sm:p-3 rounded-lg border transition-all duration-300 ${
                    isCompleted
                      ? 'bg-saiyan-orange/20 border-saiyan-orange text-saiyan-gold'
                      : isToday
                      ? 'bg-secondary/20 border-secondary text-white'
                      : 'bg-slate-700 border-gray-600 text-gray-400'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-medium">{day}</div>
                  <div className="mt-1">
                    {isCompleted ? (
                      <ApperIcon name="CheckCircle" className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-saiyan-gold" />
                    ) : isToday ? (
                      <ApperIcon name="Target" className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-secondary" />
                    ) : (
                      <div className="h-4 w-4 sm:h-5 sm:w-5 mx-auto rounded-full border border-gray-600"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WeeklyProgressTracker;