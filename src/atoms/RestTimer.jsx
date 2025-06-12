import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const RestTimer = ({ 
  duration = 60, 
  isActive = false, 
  onComplete, 
  onTick,
  className,
  size = 'md' 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-base',
    lg: 'w-32 h-32 text-lg',
    xl: 'w-40 h-40 text-xl'
  }

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration)
    if (isRunning) {
      setIsRunning(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [duration])

  // Handle active state changes
  useEffect(() => {
    if (isActive && !isRunning) {
      startTimer()
    } else if (!isActive && isRunning) {
      pauseTimer()
    }
  }, [isActive])

  const startTimer = () => {
    if (timeLeft <= 0) return
    
    setIsRunning(true)
    startTimeRef.current = Date.now() - (duration - timeLeft) * 1000
    
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const remaining = Math.max(0, duration - elapsed)
      
      setTimeLeft(remaining)
      
      if (onTick) {
        onTick(remaining)
      }
      
      if (remaining === 0) {
        setIsRunning(false)
        clearInterval(intervalRef.current)
        if (onComplete) {
          onComplete()
        }
      }
    }, 100)
  }

  const pauseTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(duration)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0
  const circumference = 2 * Math.PI * 45 // radius of 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeLeft <= 5) return 'text-red-400 stroke-red-400'
    if (timeLeft <= 10) return 'text-yellow-400 stroke-yellow-400'
    return 'text-saiyan-gold stroke-saiyan-gold'
  }

  const getGlowIntensity = () => {
    if (timeLeft <= 5) return 'drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]'
    if (timeLeft <= 10) return 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
    return 'drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]'
  }

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <motion.div
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'bg-gradient-to-br from-slate-800 to-slate-900',
          'border-2 border-slate-600',
          sizeClasses[size],
          getGlowIntensity()
        )}
        animate={timeLeft <= 5 && isRunning ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: timeLeft <= 5 && isRunning ? Infinity : 0,
          ease: 'easeInOut'
        }}
      >
        {/* Background Circle */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgb(71, 85, 105)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className={getTimerColor()}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset
            }}
            animate={{
              strokeDashoffset: [strokeDashoffset, strokeDashoffset]
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut'
            }}
          />
        </svg>

        {/* Timer Display */}
        <div className={cn(
          'relative z-10 font-bold font-mono text-center',
          getTimerColor()
        )}>
          <div>{formatTime(timeLeft)}</div>
          {isRunning && (
            <motion.div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-1 h-1 bg-current rounded-full" />
            </motion.div>
          )}
        </div>

        {/* Power Aura Effect */}
        {isRunning && timeLeft <= 10 && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-saiyan-orange/20 to-saiyan-gold/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </motion.div>

      {/* Status Indicator */}
      {isRunning && (
        <motion.div
          className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  )
}

export default RestTimer