import { defineStore } from 'pinia'
import { authService } from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user
  },

  actions: {
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.register(userData)
        this.token = response.data.token
        this.user = response.data.user
        
        localStorage.setItem('token', this.token)
        router.push({ name: 'articles' })
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.login(credentials)
        this.token = response.data.token
        this.user = response.data.user
        
        localStorage.setItem('token', this.token)
        router.push({ name: 'articles' })
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return
      
      this.loading = true
      
      try {
        const response = await authService.getCurrentUser()
        this.user = response.data.user
        return true
      } catch (error) {
        this.logout()
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    }
  }
})
