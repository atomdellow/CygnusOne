<script setup>
import { onMounted, ref } from 'vue';
import { useArticleStore } from '@/stores/articles';
import { useRouter } from 'vue-router';

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
</template>

<style scoped>
.articles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.article-title {
  color: var(--secondary-color);
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.article-content {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 10px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #555;
}

.loading,
.no-articles {
  text-align: center;
  padding: 40px;
  color: #777;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination-btn {
  padding: 8px 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}
</style>
