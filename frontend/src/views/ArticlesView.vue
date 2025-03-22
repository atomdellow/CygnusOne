<script setup>
import { onMounted, ref } from 'vue';
import { useArticleStore } from '@/stores/articles';
import { useRouter } from 'vue-router';
import '../assets/styles/views/articles.css';

const articleStore = useArticleStore();
const router = useRouter();
const currentPage = ref(1);

const goToArticle = (id) => {
  router.push({ name: 'article-detail', params: { id } });
};

const loadArticles = async (page = 1) => {
  currentPage.value = page;
  await articleStore.fetchArticles(page);
};

const handlePageChange = (page) => {
  loadArticles(page);
};

onMounted(() => {
  loadArticles();
});
</script>

<template>
  <div class="articles-wrapper">
    <div class="articles-container">
      <div class="articles-header">
        <h1>Articles</h1>
        <router-link to="/articles/create" class="btn">New Article</router-link>
      </div>
      
      <div v-if="articleStore.loading" class="loading">Loading articles...</div>
      
      <div v-else-if="articleStore.error" class="alert alert-danger">
        {{ articleStore.error }}
      </div>
      
      <div v-else-if="articleStore.articles.length === 0" class="no-articles">
        <p>No articles found. Be the first to create one!</p>
        <router-link to="/articles/create" class="btn">Create Article</router-link>
      </div>
      
      <div v-else class="articles-list">
        <div 
          v-for="article in articleStore.articles" 
          :key="article._id" 
          class="article-card"
          @click="goToArticle(article._id)"
        >
          <h2 class="article-title">{{ article.title }}</h2>
          <p class="article-content">
            {{ article.content.substring(0, 150) + (article.content.length > 150 ? '...' : '') }}
          </p>
          <div class="article-meta">
            <span class="article-author">By {{ article.author.name }}</span>
            <span class="article-date">
              {{ new Date(article.createdAt).toLocaleDateString() }}
            </span>
          </div>
          <div class="article-tags">
            <span v-for="(tag, index) in article.tags" :key="index" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="pagination" v-if="articleStore.pagination.pages > 1">
          <button 
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            Previous
          </button>
          
          <span class="page-info">
            Page {{ currentPage }} of {{ articleStore.pagination.pages }}
          </span>
          
          <button 
            class="pagination-btn"
            :disabled="currentPage === articleStore.pagination.pages"
            @click="handlePageChange(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.articles-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
