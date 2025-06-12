import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { ProgressBar } from '@/components/atoms/ProgressBar';

function PowerLevelDisplay({ user, currentPowerLevel, progressToNext, completedThisWeek }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card className="bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800 border-2 border-saiyan-gold/30 shadow-power overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saiyan-gold/5 to-saiyan-orange/5"></div>
        <CardHeader className="relative">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-saiyan-gold mb-2">
                {currentPowerLevel?.rank || "Training Warrior"}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm sm:text-base text-gray-300">
                <span>Level {user?.currentLevel || 1}</span>
                <span>•</span>
                <span>Week {user?.weekNumber || 1}</span>
                <span>•</span>
                <span>Power: {currentPowerLevel?.powerValue || 100}</span>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className="bg-saiyan-orange/20 text-saiyan-gold border-saiyan-gold/30 text-sm sm:text-base px-3 py-1"
            >
              {completedThisWeek}/7 Days Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Progress to {currentPowerLevel?.nextRank || "Next Level"}</span>
              <span>{Math.round(progressToNext)}%</span>
            </div>
            <ProgressBar 
              value={progressToNext} 
              className="h-3 bg-slate-700"
              style={{
                background: 'linear-gradient(90deg, #1e293b 0%, #374151 100%)'
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PowerLevelDisplay;