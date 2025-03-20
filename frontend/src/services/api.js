import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth services
export const authService = {
  register(userData) {
    return apiClient.post('/auth/register', userData)
  },
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },
  getCurrentUser() {
    return apiClient.get('/auth/me')
  }
}

// Articles services
export const articleService = {
  getArticles(page = 1, limit = 10) {
    return apiClient.get(`/articles?page=${page}&limit=${limit}`)
  },
  getArticle(id) {
    return apiClient.get(`/articles/${id}`)
  },
  createArticle(articleData) {
    return apiClient.post('/articles', articleData)
  },
  updateArticle(id, articleData) {
    return apiClient.put(`/articles/${id}`, articleData)
  },
  deleteArticle(id) {
    return apiClient.delete(`/articles/${id}`)
  }
}
