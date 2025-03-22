<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useArticleStore } from '@/stores/articles';
import '../assets/styles/views/articles.css';

const articleStore = useArticleStore();
const router = useRouter();
const route = useRoute();

const title = ref('');
const content = ref('');
const tags = ref('');
const error = ref('');
const loading = ref(false);
const loadingArticle = ref(true);

onMounted(async () => {
  try {
    const article = await articleStore.fetchArticle(route.params.id);
    
    if (article) {
      title.value = article.title;
      content.value = article.content;
      tags.value = article.tags ? article.tags.join(', ') : '';
    } else {
      error.value = 'Article not found';
    }
  } catch (err) {
    error.value = 'Failed to load article';
  } finally {
    loadingArticle.value = false;
  }
});

const handleSubmit = async () => {
  if (!title.value || !content.value) {
    error.value = 'Please enter both title and content';
    return;
  }

  loading.value = true;
  error.value = '';

  // Convert tags from comma-separated string to array
  const tagsArray = tags.value 
    ? tags.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    : [];
  
  const articleData = {
    title: title.value,
    content: content.value,
    tags: tagsArray
  };

  const updatedArticle = await articleStore.updateArticle(route.params.id, articleData);
  
  loading.value = false;
  
  if (updatedArticle) {
    router.push({ name: 'article-detail', params: { id: route.params.id } });
  } else {
    error.value = articleStore.error || 'Failed to update article';
  }
};

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="article-wrapper">
    <div class="article-detail">
      <button @click="goBack" class="btn btn-back">← Back</button>
      
      <div v-if="loadingArticle" class="loading">
        Loading article...
      </div>
      
      <div v-else-if="error && !articleStore.currentArticle" class="alert alert-danger">
        {{ error }}
      </div>
      
      <div v-else class="article-card create-article">
        <h1>Edit Article</h1>
        
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              type="text"
              id="title"
              v-model="title"
              class="form-control"
              placeholder="Enter article title"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="content">Content</label>
            <textarea
              id="content"
              v-model="content"
              class="form-control"
              rows="10"
              placeholder="Write your article content here..."
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              v-model="tags"
              class="form-control"
              placeholder="e.g. technology, programming, vue"
            />
          </div>
          
          <div class="form-actions">
            <button type="button" @click="goBack" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
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

.create-article {
  background-color: var(--bg-color-light);
  padding: 2rem;
  width: 100%;
}

.create-article h1 {
  margin-bottom: 1.5rem;
}

textarea.form-control {
  resize: vertical;
  min-height: 200px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
