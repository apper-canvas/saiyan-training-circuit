// Service exports
export { default as dailyWorkoutService } from './api/dailyWorkoutService'
export { default as powerLevelService } from './api/powerLevelService'
export { default as exerciseTechniqueService } from './api/exerciseTechniqueService'
export { default as achievementService } from './api/achievementService'
export { default as userService } from './api/userService'
export { default as userPreferencesService } from './api/userPreferencesService'
export { default as audioService } from './api/audioService'

// Service types
export const ServiceTypes = {
  DAILY_WORKOUT: 'dailyWorkout',
  POWER_LEVEL: 'powerLevel',
  EXERCISE_TECHNIQUE: 'exerciseTechnique',
  ACHIEVEMENT: 'achievement',
  USER: 'user',
  USER_PREFERENCES: 'userPreferences',
  AUDIO: 'audio'
}