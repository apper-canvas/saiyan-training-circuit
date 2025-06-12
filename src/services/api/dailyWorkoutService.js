import workoutData from '../mockData/dailyWorkout.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let workouts = [...workoutData]

const dailyWorkoutService = {
  async getAll() {
    await delay(250)
    return [...workouts]
  },

  async getById(id) {
    await delay(200)
    const workout = workouts.find(w => w.id === id)
    return workout ? {...workout} : null
  },

  async create(workout) {
    await delay(350)
    const newWorkout = {
      ...workout,
      id: Date.now()
    }
    workouts.push(newWorkout)
    return {...newWorkout}
  },

  async update(id, workoutData) {
    await delay(300)
    const index = workouts.findIndex(w => w.id === id)
    if (index === -1) throw new Error('Workout not found')
    
    workouts[index] = { ...workouts[index], ...workoutData }
    return {...workouts[index]}
  },

  async delete(id) {
    await delay(250)
    const index = workouts.findIndex(w => w.id === id)
    if (index === -1) throw new Error('Workout not found')
    
    workouts.splice(index, 1)
    return true
  }
}

export default dailyWorkoutService