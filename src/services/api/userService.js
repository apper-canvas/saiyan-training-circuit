import userData from '../mockData/user.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let users = [...userData]

const userService = {
  async getAll() {
    await delay(300)
    return [...users]
  },

  async getById(id) {
    await delay(200)
    const user = users.find(u => u.id === id)
    return user ? {...user} : null
  },

  async create(user) {
    await delay(400)
    const newUser = {
      ...user,
      id: Date.now()
    }
    users.push(newUser)
    return {...newUser}
  },

  async update(id, userData) {
    await delay(300)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    
    users[index] = { ...users[index], ...userData }
    return {...users[index]}
  },

  async delete(id) {
    await delay(250)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    
    users.splice(index, 1)
    return true
  }
}

export default userService