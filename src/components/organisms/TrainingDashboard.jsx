import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import ApperIcon from '@/components/ApperIcon';
import PowerLevelDisplay from '@/components/molecules/PowerLevelDisplay';
import TrainingExerciseCard from '@/components/molecules/TrainingExerciseCard';
import WeeklyProgressTracker from '@/components/molecules/WeeklyProgressTracker';

import { userService, dailyWorkoutService, powerLevelService, achievementService } from '@/services';

function TrainingDashboard() {
  const [user, setUser] = useState({});
  const [todayWorkout, setTodayWorkout] = useState({});
  const [weekWorkouts, setWeekWorkouts] = useState([]);
const [powerLevels, setPowerLevels] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
const [userData, workoutData, powerData, achievementData] = await Promise.all([
          userService.getById(1),
          dailyWorkoutService.getAll(),
          powerLevelService.getAll(),
          achievementService.getAll()
        ]);
        
        setUser(userData || {});
        
        const workouts = workoutData || [];
        setWeekWorkouts(workouts);
        
        const todaysWorkout = workouts.find(w => w.date === today);
        if (!todaysWorkout) {
          const newWorkout = await createTodayWorkout(userData?.weekNumber || 1);
          setTodayWorkout(newWorkout);
        } else {
          setTodayWorkout(todaysWorkout);
        }
setPowerLevels(powerData || []);
        setAchievements(achievementData || []);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load training data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [today]);

  const createTodayWorkout = async (weekNumber) => {
    const baseReps = 10 + ((weekNumber - 1) * 10);
    const newWorkout = {
      date: today,
      pushUps: { target: baseReps, completed: false },
      sitUps: { target: baseReps, completed: false },
      crunches: { target: baseReps, completed: false },
      run: { target: Math.max(1, weekNumber), completed: false },
      isComplete: false
    };
    
    const created = await dailyWorkoutService.create(newWorkout);
    return created;
  };

  const toggleExercise = async (exerciseKey) => {
    if (!todayWorkout?.id) return;

    const updatedWorkout = {
      ...todayWorkout,
      [exerciseKey]: {
        ...todayWorkout[exerciseKey],
        completed: !todayWorkout[exerciseKey]?.completed
      }
    };

    const allCompleted = ['pushUps', 'sitUps', 'crunches', 'run'].every(
      key => updatedWorkout[key]?.completed
    );
updatedWorkout.isComplete = allCompleted;

    try {
      const updated = await dailyWorkoutService.update(todayWorkout.id, updatedWorkout);
      setTodayWorkout(updated);
      if (allCompleted && !todayWorkout.isComplete) {
        // Show completion celebration
        showCompletionCelebration();
        await checkAchievements();
        await checkLevelUp();
      } else if (updatedWorkout[exerciseKey]?.completed) {
        toast.success(`${exerciseKey} completed! Keep pushing!`);
      }
    } catch (err) {
      toast.error("Failed to update exercise");
    }
  };
  const checkLevelUp = async () => {
    const currentWeekWorkouts = weekWorkouts.filter(w => {
      const workoutDate = new Date(w.date);
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      return workoutDate >= startOfWeek && w.isComplete;
    });

    if (currentWeekWorkouts.length === 7) {
      const newWeekNumber = (user?.weekNumber || 1) + 1;
      const currentPowerLevel = powerLevels.find(p => 
        newWeekNumber >= p.minWeek && (!p.nextRank || newWeekNumber < powerLevels.find(next => next.rank === p.nextRank)?.minWeek)
      );

      const updatedUser = {
        ...user,
        weekNumber: newWeekNumber,
        currentLevel: (user?.currentLevel || 1) + 1,
        currentRank: currentPowerLevel?.rank || user?.currentRank || "Human",
        totalRepsCompleted: (user?.totalRepsCompleted || 0) + getTotalRepsThisWeek(),
        currentStreak: (user?.currentStreak || 0) + 1
      };

      try {
        const updated = await userService.update(1, updatedUser);
        setUser(updated);
        toast.success(`🔥 LEVEL UP! You've reached ${currentPowerLevel?.rank || 'Next Level'}!`);
      } catch (err) {
        toast.error("Failed to level up");
      }
    }
  };

  const getTotalRepsThisWeek = () => {
    return weekWorkouts
      .filter(w => w.isComplete)
      .reduce((total, workout) => {
        return total + 
          (workout.pushUps?.target || 0) +
          (workout.sitUps?.target || 0) +
          (workout.crunches?.target || 0) +
          (workout.run?.target || 0);
      }, 0);
};

  const showCompletionCelebration = () => {
    // Create confetti effect
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
    
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    // Show celebration toast
    toast.success("🔥 Training Complete! Your power level is rising! 🔥", {
      className: "achievement-toast power-surge-effect"
    });
    
    // Clean up confetti after animation
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 4000);
  };

  const checkAchievements = async () => {
    try {
      const completedWorkouts = weekWorkouts.filter(w => w.isComplete).length + 1;
      const currentStreak = user?.currentStreak || 0;
      
      // Check for newly unlocked achievements
      const [streakAchievements, completionAchievements] = await Promise.all([
        achievementService.checkStreakMilestones(currentStreak + 1, completedWorkouts),
        achievementService.checkCompletionMilestones(completedWorkouts)
      ]);
      
      const newAchievements = [...streakAchievements, ...completionAchievements];
      
      // Show achievement notifications
      newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          showAchievementNotification(achievement);
        }, index * 1000);
      });
      
      if (newAchievements.length > 0) {
        // Update achievements state
        const updatedAchievements = await achievementService.getAll();
        setAchievements(updatedAchievements);
      }
    } catch (err) {
      console.error('Failed to check achievements:', err);
    }
  };

  const showAchievementNotification = (achievement) => {
    // Create achievement celebration effect
    const celebrationContainer = document.createElement('div');
    celebrationContainer.className = 'fixed inset-0 pointer-events-none z-50';
    
    // Add achievement-specific confetti
    for (let i = 0; i < 15; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece achievement-badge';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = achievement.color;
      confetti.style.animationDelay = `${Math.random() * 1.5}s`;
      celebrationContainer.appendChild(confetti);
    }
    
    document.body.appendChild(celebrationContainer);
    
    // Show achievement toast with custom styling
    toast.success(
      `${achievement.badge} ${achievement.name} Unlocked! ${achievement.description}`,
      {
        className: "achievement-toast",
        style: {
          background: `linear-gradient(135deg, ${achievement.color}40 0%, ${achievement.color}80 100%)`,
          borderColor: achievement.color,
          boxShadow: `0 0 30px ${achievement.color}80`
        },
        autoClose: 5000
      }
    );
    
    // Clean up celebration after animation
setTimeout(() => {
      document.body.removeChild(celebrationContainer);
    }, 3000);
  };

  const getCurrentPowerLevel = () => {
    const currentWeek = user?.weekNumber || 1;
    return powerLevels.find(p => 
      currentWeek >= p.minWeek && (!p.nextRank || currentWeek < powerLevels.find(next => next.rank === p.nextRank)?.minWeek)
    ) || powerLevels[0] || {};
  };

  const getProgressToNext = () => {
    const currentLevel = getCurrentPowerLevel();
    const nextLevel = powerLevels.find(p => p.rank === currentLevel?.nextRank);
    if (!nextLevel) return 100;

    const current = user?.weekNumber || 1;
    const start = currentLevel?.minWeek || 1;
    const end = nextLevel?.minWeek || start + 1;
    
    return Math.min(100, ((current - start) / (end - start)) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saiyan-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <ApperIcon name="AlertCircle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-400 text-lg">Failed to load training data</p>
      </div>
    );
  }

const currentPowerLevel = getCurrentPowerLevel();
  const progressToNext = getProgressToNext();
  const completedThisWeek = weekWorkouts.filter(w => w.isComplete).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Power Level Display */}
      <PowerLevelDisplay
        user={user}
        currentPowerLevel={currentPowerLevel}
        progressToNext={progressToNext}
        completedThisWeek={completedThisWeek}
        unlockedAchievements={unlockedAchievements}
      />
      {/* Today's Training */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-slate-800/90 border-2 border-primary/30 shadow-saiyan backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-3 mb-4">
            <ApperIcon name="Target" className="h-6 w-6 sm:h-8 sm:w-8 text-saiyan-orange" />
            <span>Today's Training Regiment</span>
          </h2>
          <p className="text-gray-400 mb-6">
            Complete all exercises to advance your power level
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <TrainingExerciseCard
              exerciseKey="pushUps"
              name="Push-ups"
              target={todayWorkout?.pushUps?.target || 0}
              completed={todayWorkout?.pushUps?.completed || false}
              onToggle={toggleExercise}
            />
            <TrainingExerciseCard
              exerciseKey="sitUps"
              name="Sit-ups"
              target={todayWorkout?.sitUps?.target || 0}
              completed={todayWorkout?.sitUps?.completed || false}
              onToggle={toggleExercise}
            />
            <TrainingExerciseCard
              exerciseKey="crunches"
              name="Crunches"
              target={todayWorkout?.crunches?.target || 0}
              completed={todayWorkout?.crunches?.completed || false}
              onToggle={toggleExercise}
            />
            <TrainingExerciseCard
              exerciseKey="run"
              name="Running"
              target={todayWorkout?.run?.target || 0}
              completed={todayWorkout?.run?.completed || false}
              onToggle={toggleExercise}
            />
          </div>

          {/* Completion Status */}
          <AnimatePresence>
            {todayWorkout?.isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-6 p-4 bg-gradient-to-r from-saiyan-orange/20 to-saiyan-gold/20 border border-saiyan-gold/50 rounded-xl text-center"
              >
                <ApperIcon name="Trophy" className="h-8 w-8 text-saiyan-gold mx-auto mb-2" />
                <p className="text-saiyan-gold font-semibold text-sm sm:text-base">
                  🔥 Training Complete! Your power level is rising! 🔥
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Weekly Progress */}
      <WeeklyProgressTracker weekWorkouts={weekWorkouts} />
    </div>
  );
}

export default TrainingDashboard;