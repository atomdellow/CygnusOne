<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useArticleStore } from '@/stores/articles';
import '../assets/styles/views/articles.css';

const articleStore = useArticleStore();
const router = useRouter();

const title = ref('');
const content = ref('');
const tags = ref('');
const error = ref('');
const loading = ref(false);

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

  const article = await articleStore.createArticle(articleData);
  
  loading.value = false;
  
  if (article) {
    router.push({ name: 'articles' });
  } else {
    error.value = articleStore.error || 'Failed to create article';
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
      
      <div class="article-card create-article">
        <h1>Create New Article</h1>
        
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
          
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Creating...' : 'Create Article' }}
          </button>
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
</style>
