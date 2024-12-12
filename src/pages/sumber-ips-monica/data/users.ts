import axios from 'axios'

export const Users = async () => {
  try {
    const response = await axios.get('http://localhost:5000/users')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}