import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5035',
})

export default instance
