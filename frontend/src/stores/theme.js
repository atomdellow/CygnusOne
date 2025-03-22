import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: localStorage.getItem('theme') === 'light' ? false : true // Default to dark mode
  }),
  
  getters: {
    isDarkMode: (state) => state.darkMode,
    currentTheme: (state) => state.darkMode ? 'dark' : 'light'
  },
  
  actions: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
    },
    
    initTheme() {
      // Check if user has previously selected a theme
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.darkMode = savedTheme === 'dark';
      } else {
        // Check if user's OS prefers dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.darkMode = prefersDark;
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      }
      
      // Set the theme on the document
      document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
    }
  }
})
