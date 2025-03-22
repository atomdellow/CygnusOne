import { defineStore } from 'pinia'
import { articleService } from '@/services/api'

export const useArticleStore = defineStore('articles', {
  state: () => ({
    articles: [],
    currentArticle: null,
    loading: false,
    error: null,
    connectionError: false,
    pagination: {
      page: 1,
      pages: 1,
      total: 0
    }
  }),

  actions: {
    async fetchArticles(page = 1) {
      this.loading = true;
      this.error = null;
      this.connectionError = false;

      try {
        const response = await articleService.getArticles(page);
        this.articles = response.data.data;
        this.pagination = response.data.pagination;
        return this.articles;
      } catch (error) {
        // Check if it's a network error (backend down)
        if (!error.response) {
          this.connectionError = true;
          this.error = "Unable to connect to the server. Please check your connection or try again later.";
          // Clear any cached data when connection fails
          this.articles = [];
        } else {
          this.error = error.response?.data?.message || 'Failed to fetch articles';
        }
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchArticle(id) {
      this.loading = true;
      this.error = null;
      this.connectionError = false;

      try {
        const response = await articleService.getArticle(id);
        this.currentArticle = response.data.data;
        return this.currentArticle;
      } catch (error) {
        // Check if it's a network error (backend down)
        if (!error.response) {
          this.connectionError = true;
          this.error = "Unable to connect to the server. Please check your connection or try again later.";
          this.currentArticle = null;
        } else {
          this.error = error.response?.data?.message || 'Failed to fetch article';
        }
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createArticle(articleData) {
      this.loading = true;
      this.error = null;
      this.connectionError = false;

      try {
        const response = await articleService.createArticle(articleData);
        // Add to list if we're on the first page
        if (this.pagination.page === 1) {
          this.articles = [response.data.data, ...this.articles];
        }
        return response.data.data;
      } catch (error) {
        if (!error.response) {
          this.connectionError = true;
          this.error = "Unable to connect to the server. Please check your connection or try again later.";
        } else {
          this.error = error.response?.data?.message || 'Failed to create article';
        }
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateArticle(id, articleData) {
      this.loading = true;
      this.error = null;
      this.connectionError = false;

      try {
        const response = await articleService.updateArticle(id, articleData);
        // Update in list if it exists
        const index = this.articles.findIndex(a => a._id === id);
        if (index !== -1) {
          this.articles[index] = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        if (!error.response) {
          this.connectionError = true;
          this.error = "Unable to connect to the server. Please check your connection or try again later.";
        } else {
          this.error = error.response?.data?.message || 'Failed to update article';
        }
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteArticle(id) {
      this.loading = true;
      this.error = null;
      this.connectionError = false;

      try {
        await articleService.deleteArticle(id);
        // Remove from list
        this.articles = this.articles.filter(a => a._id !== id);
        return true;
      } catch (error) {
        if (!error.response) {
          this.connectionError = true;
          this.error = "Unable to connect to the server. Please check your connection or try again later.";
        } else {
          this.error = error.response?.data?.message || 'Failed to delete article';
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Reset store state - to clear cached data when needed
    resetState() {
      this.articles = [];
      this.currentArticle = null;
      this.error = null;
      this.connectionError = false;
      this.pagination = {
        page: 1,
        pages: 1,
        total: 0
      };
    }
  }
})
