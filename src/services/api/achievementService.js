import achievementData from '../mockData/achievements.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let achievements = [...achievementData]

const achievementService = {
  async getAll() {
    await delay(200)
    return [...achievements]
  },

  async getById(id) {
    await delay(150)
    const achievement = achievements.find(a => a.id === id)
    return achievement ? {...achievement} : null
  },

  async create(achievement) {
    await delay(300)
    const newAchievement = {
      ...achievement,
      id: Date.now(),
      unlockedAt: new Date().toISOString()
    }
    achievements.push(newAchievement)
    return {...newAchievement}
  },

  async update(id, achievementData) {
    await delay(250)
    const index = achievements.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Achievement not found')
    
    achievements[index] = { ...achievements[index], ...achievementData }
    return {...achievements[index]}
  },

  async delete(id) {
    await delay(200)
    const index = achievements.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Achievement not found')
    
    achievements.splice(index, 1)
    return true
  },

  async checkStreakMilestones(currentStreak, completedWorkouts) {
    await delay(100)
    const milestones = achievements.filter(a => 
      a.type === 'streak' && 
      a.requirement <= currentStreak && 
      !a.unlocked
    )

    const newlyUnlocked = []
    for (const milestone of milestones) {
      milestone.unlocked = true
      milestone.unlockedAt = new Date().toISOString()
      newlyUnlocked.push({...milestone})
    }

    return newlyUnlocked
  },

  async checkCompletionMilestones(totalCompletedWorkouts) {
    await delay(100)
    const milestones = achievements.filter(a => 
      a.type === 'completion' && 
      a.requirement <= totalCompletedWorkouts && 
      !a.unlocked
    )

    const newlyUnlocked = []
    for (const milestone of milestones) {
      milestone.unlocked = true
      milestone.unlockedAt = new Date().toISOString()
      newlyUnlocked.push({...milestone})
    }

    return newlyUnlocked
  },

  async getUnlockedAchievements() {
    await delay(150)
    return achievements.filter(a => a.unlocked).map(a => ({...a}))
  }
}

export default achievementService