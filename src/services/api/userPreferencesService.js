const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Default timer preferences
const defaultPreferences = {
  id: 1,
  userId: 1,
  timerSettings: {
    pushUps: { restDuration: 60, soundEnabled: true },
    sitUps: { restDuration: 45, soundEnabled: true },
    crunches: { restDuration: 30, soundEnabled: true },
    run: { restDuration: 120, soundEnabled: true },
    default: { restDuration: 60, soundEnabled: true }
  },
  audioSettings: {
    countdownBeeps: true,
    completionSound: true,
    volume: 0.7
  },
  theme: 'saiyan',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

let preferences = { ...defaultPreferences }

const userPreferencesService = {
  async getAll() {
    await delay(200)
    return [{ ...preferences }]
  },

  async getById(id) {
    await delay(150)
    return { ...preferences }
  },

  async create(data) {
    await delay(250)
    const newPreferences = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    preferences = { ...newPreferences }
    return { ...preferences }
  },

  async update(id, data) {
    await delay(200)
    preferences = {
      ...preferences,
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { ...preferences }
  },

  async delete(id) {
    await delay(150)
    preferences = { ...defaultPreferences }
    return true
  },

  async getTimerSettings() {
    await delay(100)
    return { ...preferences.timerSettings }
  },

  async updateTimerSettings(exerciseType, settings) {
    await delay(150)
    preferences.timerSettings[exerciseType] = {
      ...preferences.timerSettings[exerciseType],
      ...settings
    }
    preferences.updatedAt = new Date().toISOString()
    return { ...preferences.timerSettings[exerciseType] }
  },

  async getAudioSettings() {
    await delay(100)
    return { ...preferences.audioSettings }
  },

  async updateAudioSettings(settings) {
    await delay(150)
    preferences.audioSettings = {
      ...preferences.audioSettings,
      ...settings
    }
    preferences.updatedAt = new Date().toISOString()
    return { ...preferences.audioSettings }
  }
}

export default userPreferencesService