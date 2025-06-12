import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/atoms/Button'
import { Select } from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import userPreferencesService from '@/services/api/userPreferencesService'
import audioServiceAPI from '@/services/api/audioService'
import { toast } from 'sonner'

const TimerControls = ({ 
  exerciseType, 
  onStart, 
  onPause, 
  onStop, 
  onDurationChange,
  isActive = false,
  className 
}) => {
  const [timerSettings, setTimerSettings] = useState(null)
  const [audioSettings, setAudioSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  const presetDurations = [
    { label: '30 seconds', value: 30 },
    { label: '45 seconds', value: 45 },
    { label: '1 minute', value: 60 },
    { label: '1.5 minutes', value: 90 },
    { label: '2 minutes', value: 120 },
    { label: '3 minutes', value: 180 }
  ]

  useEffect(() => {
    loadSettings()
  }, [exerciseType])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const [timerData, audioData] = await Promise.all([
        userPreferencesService.getTimerSettings(),
        userPreferencesService.getAudioSettings()
      ])
      setTimerSettings(timerData)
      setAudioSettings(audioData)
    } catch (error) {
      console.error('Failed to load timer settings:', error)
      toast.error('Failed to load timer settings')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentDuration = () => {
    if (!timerSettings) return 60
    return timerSettings[exerciseType]?.restDuration || timerSettings.default?.restDuration || 60
  }

  const handleDurationChange = async (newDuration) => {
    try {
      await userPreferencesService.updateTimerSettings(exerciseType, {
        restDuration: newDuration
      })
      
      // Update local state
      setTimerSettings(prev => ({
        ...prev,
        [exerciseType]: {
          ...prev[exerciseType],
          restDuration: newDuration
        }
      }))

      if (onDurationChange) {
        onDurationChange(newDuration)
      }
      
      toast.success(`Rest timer set to ${Math.floor(newDuration / 60)}:${(newDuration % 60).toString().padStart(2, '0')}`)
    } catch (error) {
      console.error('Failed to update timer duration:', error)
      toast.error('Failed to update timer settings')
    }
  }

  const handleSoundToggle = async () => {
    try {
      const newSoundEnabled = !getCurrentSoundEnabled()
      
      await userPreferencesService.updateTimerSettings(exerciseType, {
        soundEnabled: newSoundEnabled
      })
      
      // Update local state
      setTimerSettings(prev => ({
        ...prev,
        [exerciseType]: {
          ...prev[exerciseType],
          soundEnabled: newSoundEnabled
        }
      }))

      if (newSoundEnabled) {
        await audioServiceAPI.testSound()
        toast.success('Timer sounds enabled')
      } else {
        toast.success('Timer sounds disabled')
      }
    } catch (error) {
      console.error('Failed to toggle sound settings:', error)
      toast.error('Failed to update sound settings')
    }
  }

  const getCurrentSoundEnabled = () => {
    if (!timerSettings) return true
    return timerSettings[exerciseType]?.soundEnabled ?? timerSettings.default?.soundEnabled ?? true
  }

  const handleStart = () => {
    if (onStart) {
      onStart()
    }
  }

  const handlePause = () => {
    if (onPause) {
      onPause()
    }
  }

  const handleStop = () => {
    if (onStop) {
      onStop()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-saiyan-gold border-t-transparent" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-3 ${className}`}
    >
      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          onClick={handleStart}
          disabled={isActive}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ApperIcon name="Play" className="h-4 w-4 mr-1" />
          Start
        </Button>

        <Button
          onClick={handlePause}
          disabled={!isActive}
          size="sm"
          variant="outline"
          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ApperIcon name="Pause" className="h-4 w-4 mr-1" />
          Pause
        </Button>

        <Button
          onClick={handleStop}
          size="sm"
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <ApperIcon name="Square" className="h-4 w-4 mr-1" />
          Stop
        </Button>

        <Button
          onClick={() => setShowSettings(!showSettings)}
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          <ApperIcon name="Settings" className="h-4 w-4" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-slate-800 rounded-lg p-3 border border-slate-600"
        >
          <div className="space-y-3">
            {/* Duration Setting */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Rest Duration</label>
              <Select
                value={getCurrentDuration().toString()}
                onValueChange={(value) => handleDurationChange(parseInt(value))}
              >
                {presetDurations.map(preset => (
                  <option key={preset.value} value={preset.value.toString()}>
                    {preset.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Audio Cues</span>
              <Button
                onClick={handleSoundToggle}
                size="sm"
                variant="ghost"
                className={`p-1 ${getCurrentSoundEnabled() ? 'text-green-400' : 'text-gray-500'}`}
              >
                <ApperIcon 
                  name={getCurrentSoundEnabled() ? "Volume2" : "VolumeX"} 
                  className="h-4 w-4" 
                />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Duration Buttons */}
      {!showSettings && (
        <div className="flex justify-center space-x-1">
          {[30, 60, 90].map(duration => (
            <Button
              key={duration}
              onClick={() => handleDurationChange(duration)}
              size="sm"
              variant="ghost"
              className={`text-xs px-2 py-1 ${
                getCurrentDuration() === duration 
                  ? 'bg-saiyan-gold/20 text-saiyan-gold border border-saiyan-gold/50' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {duration}s
            </Button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default TimerControls