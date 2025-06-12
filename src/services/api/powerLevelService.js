import powerData from '../mockData/powerLevel.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let powerLevels = [...powerData]

const powerLevelService = {
  async getAll() {
    await delay(200)
    return [...powerLevels]
  },

  async getById(id) {
    await delay(150)
    const level = powerLevels.find(l => l.id === id)
    return level ? {...level} : null
  },

  async create(level) {
    await delay(400)
    const newLevel = {
      ...level,
      id: Date.now()
    }
    powerLevels.push(newLevel)
    return {...newLevel}
  },

  async update(id, levelData) {
    await delay(300)
    const index = powerLevels.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Power level not found')
    
    powerLevels[index] = { ...powerLevels[index], ...levelData }
    return {...powerLevels[index]}
  },

  async delete(id) {
    await delay(250)
    const index = powerLevels.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Power level not found')
    
    powerLevels.splice(index, 1)
    return true
  }
}

export default powerLevelService