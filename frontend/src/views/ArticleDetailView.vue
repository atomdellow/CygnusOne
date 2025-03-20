<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArticleStore } from '@/stores/articles';
import { useAuthStore } from '@/stores/auth';

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
</template>

<style scoped>
.article-detail {
  position: relative;
}

.btn-back {
  background-color: transparent;
  color: var(--primary-color);
  padding: 8px 0;
  margin-bottom: 20px;
}

.article-header {
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5rem;
  color: var(--secondary-color);
  margin-bottom: 10px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.article-info {
  color: #777;
  font-size: 0.9rem;
}

.article-author {
  margin-right: 15px;
}

.article-actions {
  display: flex;
  gap: 10px;
}

.btn-edit {
  background-color: #f0ad4e;
}

.btn-edit:hover {
  background-color: #ec971f;
}

.article-tags {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #555;
}

.article-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.not-found, .loading {
  text-align: center;
  padding: 50px 0;
  color: #777;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal-content h2 {
  margin-bottom: 15px;
  color: var(--secondary-color);
}

.modal-content p {
  margin-bottom: 20px;
  color: #555;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
