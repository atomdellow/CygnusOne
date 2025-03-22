import { defineStore } from 'pinia'
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

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.get('/admin/users');
        this.users = response.data.data;
        return this.users;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchUser(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.get(`/admin/users/${id}`);
        this.currentUser = response.data.data;
        return this.currentUser;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch user';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateUserRole(userId, role) {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
        
        // Update in list if exists
        const index = this.users.findIndex(u => u._id === userId);
        if (index !== -1) {
          this.users[index] = response.data.data;
        }
        
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update user role';
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
})
