const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AudioService {
  constructor() {
    this.audioContext = null
    this.isSupported = false
    this.volume = 0.7
    this.sounds = {
      beep: null,
      complete: null,
      warning: null
    }
    this.init()
  }

  async init() {
    try {
      // Check for audio context support
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.audioContext = new AudioContext()
        this.isSupported = true
        await this.createSounds()
      }
    } catch (error) {
      console.warn('Audio not supported:', error)
      this.isSupported = false
    }
  }

  async createSounds() {
    if (!this.audioContext) return

    // Create beep sound (800Hz, 0.1s)
    this.sounds.beep = this.createTone(800, 0.1)
    
    // Create completion sound (sequence of ascending tones)
    this.sounds.complete = this.createCompletionSound()
    
    // Create warning sound (600Hz, 0.2s)
    this.sounds.warning = this.createTone(600, 0.2)
  }

  createTone(frequency, duration) {
    return () => {
      if (!this.audioContext || this.audioContext.state === 'suspended') {
        return Promise.resolve()
      }

      return new Promise(resolve => {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
        
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + duration)
        
        oscillator.onended = resolve
      })
    }
  }

  createCompletionSound() {
    return async () => {
      const frequencies = [523, 659, 784, 1047] // C, E, G, C (major chord)
      for (const freq of frequencies) {
        await this.createTone(freq, 0.15)()
        await delay(50)
      }
    }
  }

  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume()
      } catch (error) {
        console.warn('Could not resume audio context:', error)
      }
    }
  }

  async playBeep() {
    if (!this.isSupported || !this.sounds.beep) return
    await this.resumeContext()
    return this.sounds.beep()
  }

  async playComplete() {
    if (!this.isSupported || !this.sounds.complete) return
    await this.resumeContext()
    return this.sounds.complete()
  }

  async playWarning() {
    if (!this.isSupported || !this.sounds.warning) return
    await this.resumeContext()
    return this.sounds.warning()
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  getVolume() {
    return this.volume
  }

  isAudioSupported() {
    return this.isSupported
  }
}

// Create singleton instance
const audioService = new AudioService()

// Export service methods
const audioServiceAPI = {
  async playBeep() {
    return audioService.playBeep()
  },

  async playComplete() {
    return audioService.playComplete()
  },

  async playWarning() {
    return audioService.playWarning()
  },

  async setVolume(volume) {
    await delay(50)
    audioService.setVolume(volume)
    return audioService.getVolume()
  },

  async getVolume() {
    await delay(50)
    return audioService.getVolume()
  },

  async isSupported() {
    await delay(50)
    return audioService.isAudioSupported()
  },

  async testSound() {
    await delay(100)
    return audioService.playBeep()
  }
}

export default audioServiceAPI