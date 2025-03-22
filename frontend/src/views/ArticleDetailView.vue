<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArticleStore } from '@/stores/articles';
import { useAuthStore } from '@/stores/auth';
import '../assets/styles/views/articles.css';

const route = useRoute();
const router = useRouter();
const articleStore = useArticleStore();
const authStore = useAuthStore();
const showDeleteConfirm = ref(false);

const article = computed(() => articleStore.currentArticle);
const isAuthor = computed(() => {
  if (!article.value || !authStore.user) return false;
  return article.value.author._id === authStore.user._id;
});

onMounted(async () => {
  await articleStore.fetchArticle(route.params.id);
});

const handleEdit = () => {
  router.push({ name: 'article-edit', params: { id: article.value._id } });
};

const confirmDelete = () => {
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

const handleDelete = async () => {
  if (await articleStore.deleteArticle(article.value._id)) {
    router.push({ name: 'articles' });
  }
};

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="article-wrapper">
    <div class="article-detail">
      <button @click="goBack" class="btn btn-back">← Back to Articles</button>
      
      <div v-if="articleStore.loading" class="loading">
        Loading article...
      </div>
      
      <div v-else-if="articleStore.error" class="alert alert-danger">
        {{ articleStore.error }}
      </div>
      
      <div v-else-if="article" class="article-content">
        <div class="article-header">
          <h1>{{ article.title }}</h1>
          
          <div class="article-meta">
            <div class="article-info">
              <span class="article-author">By {{ article.author.name }}</span>
              <span class="article-date">
                {{ new Date(article.createdAt).toLocaleDateString() }}
              </span>
            </div>
            
            <div class="article-actions" v-if="isAuthor">
              <button @click="handleEdit" class="btn btn-edit">Edit</button>
              <button @click="confirmDelete" class="btn btn-danger">Delete</button>
            </div>
          </div>
          
          <div class="article-tags" v-if="article.tags && article.tags.length">
            <span v-for="(tag, index) in article.tags" :key="index" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="article-body">
          <p>{{ article.content }}</p>
        </div>
      </div>
      
      <div v-else class="not-found">
        <p>Article not found.</p>
        <router-link to="/articles" class="btn">Back to Articles</router-link>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="modal">
        <div class="modal-content">
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this article? This action cannot be undone.</p>
          
          <div class="modal-actions">
            <button @click="cancelDelete" class="btn btn-secondary">Cancel</button>
            <button @click="handleDelete" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
