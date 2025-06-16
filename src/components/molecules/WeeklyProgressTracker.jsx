import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import ApperIcon from '@/components/ApperIcon';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';

function WeeklyProgressTracker({ weekWorkouts = [] }) {
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'monthly'

  // Process workout data for chart visualization
  const chartData = useMemo(() => {
    if (!weekWorkouts.length) return [];

    const sortedWorkouts = [...weekWorkouts].sort((a, b) => new Date(a.date) - new Date(b.date));
    const days = viewMode === 'weekly' ? 7 : 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    // Generate data points for each day in the range
    const dataPoints = [];
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const workout = sortedWorkouts.find(w => w.date === dateStr);
      const dayName = currentDate.toLocaleDateString('en-US', { 
        weekday: viewMode === 'weekly' ? 'short' : undefined,
        month: viewMode === 'monthly' ? 'short' : undefined,
        day: 'numeric'
      });

dataPoints.push({
        date: dateStr,
        day: dayName,
        pushUps: workout?.push_ups_completed ? parseInt(workout.push_ups) : 0,
        sitUps: workout?.sit_ups_completed ? parseInt(workout.sit_ups) : 0,
        crunches: workout?.crunches_completed ? parseInt(workout.crunches) : 0,
        running: workout?.run_completed ? parseInt(workout.run) : 0,
        totalReps: workout?.push_ups_completed && workout?.sit_ups_completed && workout?.crunches_completed
          ? (parseInt(workout.push_ups) + parseInt(workout.sit_ups) + parseInt(workout.crunches))
          : 0
      });
    }

    return dataPoints;
  }, [weekWorkouts, viewMode]);

  // Calculate progress stats
  const progressStats = useMemo(() => {
    const completedWorkouts = chartData.filter(d => d.totalReps > 0);
    const totalReps = completedWorkouts.reduce((sum, d) => sum + d.totalReps, 0);
    const avgRepsPerDay = completedWorkouts.length > 0 ? Math.round(totalReps / completedWorkouts.length) : 0;
    const completionRate = chartData.length > 0 ? Math.round((completedWorkouts.length / chartData.length) * 100) : 0;

    // Calculate improvement
    const firstWeekData = chartData.slice(0, Math.min(7, chartData.length));
    const lastWeekData = chartData.slice(-7);
    const firstWeekAvg = firstWeekData.reduce((sum, d) => sum + d.totalReps, 0) / firstWeekData.length || 0;
    const lastWeekAvg = lastWeekData.reduce((sum, d) => sum + d.totalReps, 0) / lastWeekData.length || 0;
    const improvement = firstWeekAvg > 0 ? Math.round(((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100) : 0;

    return {
      totalReps,
      avgRepsPerDay,
      completionRate,
      improvement,
      completedDays: completedWorkouts.length
    };
  }, [chartData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/95 border border-saiyan-gold/30 rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-saiyan-gold font-semibold text-sm mb-2">{data.day}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.dataKey === 'running' ? 'km' : 'reps'}
            </p>
          ))}
          <p className="text-white text-xs font-medium mt-1 pt-1 border-t border-slate-600">
            Total: {data.totalReps} reps
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-slate-800/90 border-2 border-primary/30 shadow-saiyan backdrop-blur-sm p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <ApperIcon name="TrendingUp" className="h-6 w-6 sm:h-8 sm:w-8 text-saiyan-orange" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Progress Tracking
              </h2>
              <p className="text-gray-400 text-sm">
                {viewMode === 'weekly' ? 'Last 7 days' : 'Last 30 days'} performance
              </p>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-slate-700/50 rounded-lg p-1">
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('weekly')}
              className={`${
                viewMode === 'weekly' 
                  ? 'bg-saiyan-orange text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-600'
              } transition-all duration-200`}
            >
              Weekly
            </Button>
            <Button
              variant={viewMode === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('monthly')}
              className={`${
                viewMode === 'monthly' 
                  ? 'bg-saiyan-orange text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-600'
              } transition-all duration-200`}
            >
              Monthly
            </Button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-saiyan-gold">{progressStats.completedDays}</p>
            <p className="text-xs text-gray-400">Days Completed</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-saiyan-orange">{progressStats.totalReps}</p>
            <p className="text-xs text-gray-400">Total Reps</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-secondary">{progressStats.avgRepsPerDay}</p>
            <p className="text-xs text-gray-400">Avg/Day</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className={`text-2xl font-bold ${progressStats.improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {progressStats.improvement > 0 ? '+' : ''}{progressStats.improvement}%
            </p>
            <p className="text-xs text-gray-400">Improvement</p>
          </div>
        </div>

        {/* Progress Chart */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-64 sm:h-80 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }}
                />
                
                <Line
                  type="monotone"
                  dataKey="pushUps"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  dot={{ fill: '#FF6B35', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#FF6B35', strokeWidth: 2, fill: '#FF6B35' }}
                  name="Push-ups"
                />
                <Line
                  type="monotone"
                  dataKey="sitUps"
                  stroke="#FFD700"
                  strokeWidth={2}
                  dot={{ fill: '#FFD700', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#FFD700', strokeWidth: 2, fill: '#FFD700' }}
                  name="Sit-ups"
                />
                <Line
                  type="monotone"
                  dataKey="crunches"
                  stroke="#4ECDC4"
                  strokeWidth={2}
                  dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#4ECDC4', strokeWidth: 2, fill: '#4ECDC4' }}
                  name="Crunches"
                />
                <Line
                  type="monotone"
                  dataKey="running"
                  stroke="#8A2BE2"
                  strokeWidth={2}
                  dot={{ fill: '#8A2BE2', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#8A2BE2', strokeWidth: 2, fill: '#8A2BE2' }}
                  name="Running (km)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>

        {/* Completion Progress */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Completion Rate</span>
            <span className="text-white font-semibold">{progressStats.completionRate}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-saiyan-orange to-saiyan-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progressStats.completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default WeeklyProgressTracker;