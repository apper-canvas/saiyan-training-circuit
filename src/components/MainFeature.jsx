import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import ApperIcon from './ApperIcon'
import { userService } from '../services'
import { dailyWorkoutService } from '../services'
import { powerLevelService } from '../services'

function MainFeature() {
  const [user, setUser] = useState({})
  const [todayWorkout, setTodayWorkout] = useState({})
  const [weekWorkouts, setWeekWorkouts] = useState([])
  const [powerLevels, setPowerLevels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [userData, workoutData, powerData] = await Promise.all([
          userService.getById(1),
          dailyWorkoutService.getAll(),
          powerLevelService.getAll()
        ])
        
        setUser(userData || {})
        
        const workouts = workoutData || []
        setWeekWorkouts(workouts)
        
        const todaysWorkout = workouts.find(w => w.date === today)
        if (!todaysWorkout) {
          const newWorkout = await createTodayWorkout(userData?.weekNumber || 1)
          setTodayWorkout(newWorkout)
        } else {
          setTodayWorkout(todaysWorkout)
        }
        
        setPowerLevels(powerData || [])
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load training data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [today])

  const createTodayWorkout = async (weekNumber) => {
    const baseReps = 10 + ((weekNumber - 1) * 10)
    const newWorkout = {
      date: today,
      pushUps: { target: baseReps, completed: false },
      sitUps: { target: baseReps, completed: false },
      crunches: { target: baseReps, completed: false },
      run: { target: Math.max(1, weekNumber), completed: false },
      isComplete: false
    }
    
    const created = await dailyWorkoutService.create(newWorkout)
    return created
  }

  const toggleExercise = async (exerciseKey) => {
    if (!todayWorkout?.id) return

    const updatedWorkout = {
      ...todayWorkout,
      [exerciseKey]: {
        ...todayWorkout[exerciseKey],
        completed: !todayWorkout[exerciseKey]?.completed
      }
    }

    const allCompleted = ['pushUps', 'sitUps', 'crunches', 'run'].every(
      key => updatedWorkout[key]?.completed
    )
    updatedWorkout.isComplete = allCompleted

    try {
      const updated = await dailyWorkoutService.update(todayWorkout.id, updatedWorkout)
      setTodayWorkout(updated)
      
      if (allCompleted && !todayWorkout.isComplete) {
        toast.success("Training complete! You're one step closer to Super Saiyan!")
        await checkLevelUp()
      } else if (updatedWorkout[exerciseKey]?.completed) {
        toast.success(`${exerciseKey} completed! Keep pushing!`)
      }
    } catch (err) {
      toast.error("Failed to update exercise")
    }
  }

  const checkLevelUp = async () => {
    const currentWeekWorkouts = weekWorkouts.filter(w => {
      const workoutDate = new Date(w.date)
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      return workoutDate >= startOfWeek && w.isComplete
    })

    if (currentWeekWorkouts.length === 7) {
      const newWeekNumber = (user?.weekNumber || 1) + 1
      const currentPowerLevel = powerLevels.find(p => 
        newWeekNumber >= p.minWeek && (!p.nextRank || newWeekNumber < powerLevels.find(next => next.rank === p.nextRank)?.minWeek)
      )

      const updatedUser = {
        ...user,
        weekNumber: newWeekNumber,
        currentLevel: (user?.currentLevel || 1) + 1,
        currentRank: currentPowerLevel?.rank || user?.currentRank || "Human",
        totalRepsCompleted: (user?.totalRepsCompleted || 0) + getTotalRepsThisWeek(),
        currentStreak: (user?.currentStreak || 0) + 1
      }

      try {
        const updated = await userService.update(1, updatedUser)
        setUser(updated)
        toast.success(`🔥 LEVEL UP! You've reached ${currentPowerLevel?.rank || 'Next Level'}!`)
      } catch (err) {
        toast.error("Failed to level up")
      }
    }
  }

  const getTotalRepsThisWeek = () => {
    return weekWorkouts
      .filter(w => w.isComplete)
      .reduce((total, workout) => {
        return total + 
          (workout.pushUps?.target || 0) +
          (workout.sitUps?.target || 0) +
          (workout.crunches?.target || 0) +
          (workout.run?.target || 0)
      }, 0)
  }

  const getCurrentPowerLevel = () => {
    const currentWeek = user?.weekNumber || 1
    return powerLevels.find(p => 
      currentWeek >= p.minWeek && (!p.nextRank || currentWeek < powerLevels.find(next => next.rank === p.nextRank)?.minWeek)
    ) || powerLevels[0] || {}
  }

  const getProgressToNext = () => {
    const currentLevel = getCurrentPowerLevel()
    const nextLevel = powerLevels.find(p => p.rank === currentLevel?.nextRank)
    if (!nextLevel) return 100

    const current = user?.weekNumber || 1
    const start = currentLevel?.minWeek || 1
    const end = nextLevel?.minWeek || start + 1
    
    return Math.min(100, ((current - start) / (end - start)) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saiyan-gold"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <ApperIcon name="AlertCircle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-400 text-lg">Failed to load training data</p>
      </div>
    )
  }

  const currentPowerLevel = getCurrentPowerLevel()
  const progressToNext = getProgressToNext()
  const completedThisWeek = weekWorkouts.filter(w => w.isComplete).length

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Power Level Display */}
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
              <Progress 
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

      {/* Today's Training */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-800/90 border-2 border-primary/30 shadow-saiyan backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-3">
              <ApperIcon name="Target" className="h-6 w-6 sm:h-8 sm:w-8 text-saiyan-orange" />
              <span>Today's Training Regiment</span>
            </CardTitle>
            <p className="text-gray-400">
              Complete all exercises to advance your power level
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Push-ups */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 sm:p-6 border border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="ArrowUp" className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                    <span className="font-semibold text-white text-sm sm:text-base">Push-ups</span>
                  </div>
                  <Checkbox
                    checked={todayWorkout?.pushUps?.completed || false}
                    onCheckedChange={() => toggleExercise('pushUps')}
                    className="data-[state=checked]:bg-saiyan-orange data-[state=checked]:border-saiyan-orange w-5 h-5"
                  />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-saiyan-gold mb-2">
                  {todayWorkout?.pushUps?.target || 0}
                </div>
                <Progress 
                  value={todayWorkout?.pushUps?.completed ? 100 : 0} 
                  className="h-2 bg-slate-600"
                />
              </motion.div>

              {/* Sit-ups */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 sm:p-6 border border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="RotateCcw" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                    <span className="font-semibold text-white text-sm sm:text-base">Sit-ups</span>
                  </div>
                  <Checkbox
                    checked={todayWorkout?.sitUps?.completed || false}
                    onCheckedChange={() => toggleExercise('sitUps')}
                    className="data-[state=checked]:bg-saiyan-orange data-[state=checked]:border-saiyan-orange w-5 h-5"
                  />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-saiyan-gold mb-2">
                  {todayWorkout?.sitUps?.target || 0}
                </div>
                <Progress 
                  value={todayWorkout?.sitUps?.completed ? 100 : 0} 
                  className="h-2 bg-slate-600"
                />
              </motion.div>

              {/* Crunches */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 sm:p-6 border border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Activity" className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                    <span className="font-semibold text-white text-sm sm:text-base">Crunches</span>
                  </div>
                  <Checkbox
                    checked={todayWorkout?.crunches?.completed || false}
                    onCheckedChange={() => toggleExercise('crunches')}
                    className="data-[state=checked]:bg-saiyan-orange data-[state=checked]:border-saiyan-orange w-5 h-5"
                  />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-saiyan-gold mb-2">
                  {todayWorkout?.crunches?.target || 0}
                </div>
                <Progress 
                  value={todayWorkout?.crunches?.completed ? 100 : 0} 
                  className="h-2 bg-slate-600"
                />
              </motion.div>

              {/* Running */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 sm:p-6 border border-gray-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="MapPin" className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                    <span className="font-semibold text-white text-sm sm:text-base">Running</span>
                  </div>
                  <Checkbox
                    checked={todayWorkout?.run?.completed || false}
                    onCheckedChange={() => toggleExercise('run')}
                    className="data-[state=checked]:bg-saiyan-orange data-[state=checked]:border-saiyan-orange w-5 h-5"
                  />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-saiyan-gold mb-2">
                  {todayWorkout?.run?.target || 0} km
                </div>
                <Progress 
                  value={todayWorkout?.run?.completed ? 100 : 0} 
                  className="h-2 bg-slate-600"
                />
              </motion.div>
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Progress */}
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
                const dayWorkout = weekWorkouts.find(w => new Date(w.date).getDay() === index)
                const isCompleted = dayWorkout?.isComplete || false
                const isToday = new Date().getDay() === index

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
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default MainFeature