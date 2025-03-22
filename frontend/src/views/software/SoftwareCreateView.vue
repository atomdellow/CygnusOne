<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSoftwareStore } from '@/stores/software';
import { useAuthStore } from '@/stores/auth';

const softwareStore = useSoftwareStore();
const authStore = useAuthStore();
const router = useRouter();

// Form fields with better defaults
const software = ref({
  title: '',
  description: '',
  version: '1.0.0',
  appUrl: '',
  iconUrl: '',
  isPublic: false,
  tags: '',
  languages: '',
  frameworks: '',
  status: 'planning'
});

const error = ref('');
const loading = ref(false);

// Verify user is editor or admin
if (!authStore.isEditor) {
  router.push({ name: 'software' });
}

const handleSubmit = async () => {
  // Form validation
  if (!software.value.title || !software.value.title.trim()) {
    error.value = 'Title is required';
    return;
  }
  
  if (!software.value.description || !software.value.description.trim()) {
    error.value = 'Description is required';
    return;
  }
  
  if (!software.value.appUrl || !software.value.appUrl.trim()) {
    error.value = 'Application URL is required';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    // Convert comma-separated strings to arrays
    const tagsArray = software.value.tags 
      ? software.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : [];
    
    const languagesArray = software.value.languages 
      ? software.value.languages.split(',').map(lang => lang.trim()).filter(lang => lang !== '')
      : [];
      
    const frameworksArray = software.value.frameworks 
      ? software.value.frameworks.split(',').map(fw => fw.trim()).filter(fw => fw !== '')
      : [];
    
    // Prepare the software data
    const softwareData = {
      title: software.value.title.trim(),
      description: software.value.description.trim(),
      version: software.value.version,
      appUrl: software.value.appUrl.trim(),
      iconUrl: software.value.iconUrl.trim() || undefined,
      isPublic: software.value.isPublic,
      tags: tagsArray,
      meta: {
        languages: languagesArray,
        frameworks: frameworksArray,
        status: software.value.status
      }
    };
    
    const result = await softwareStore.createSoftware(softwareData);
    if (result && result._id) {
      router.push({ name: 'software-detail', params: { id: result._id } });
    } else {
      error.value = 'Failed to create software: Unknown error';
    }
  } catch (err) {
    console.error('Error creating software:', err);
    error.value = err.message || 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'software' });
};
</script>

<template>
  <div class="software-create-wrapper">
    <div class="software-create-container">
      <button @click="goBack" class="btn btn-back">← Back to Software</button>
      
      <div class="software-create">
        <h1>Add New Software Application</h1>
        
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleSubmit" class="software-form">
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              type="text"
              id="title"
              v-model.trim="software.title"
              class="form-control"
              placeholder="Enter software title"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              v-model.trim="software.description"
              class="form-control"
              rows="4"
              placeholder="Describe the software application"
              required
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="version">Version</label>
              <input
                type="text"
                id="version"
                v-model.trim="software.version"
                class="form-control"
                placeholder="e.g. 1.0.0"
              />
            </div>
            
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="software.status" class="form-control">
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="appUrl">Application URL *</label>
            <input
              type="url"
              id="appUrl"
              v-model.trim="software.appUrl"
              class="form-control"
              placeholder="https://example.com"
              required
            />
            <small class="form-text">The URL where your application is hosted</small>
          </div>
          
          <div class="form-group">
            <label for="iconUrl">Icon URL</label>
            <input
              type="url"
              id="iconUrl"
              v-model.trim="software.iconUrl"
              class="form-control"
              placeholder="https://example.com/icon.png"
            />
            <small class="form-text">URL to an icon image for the application</small>
          </div>
          
          <div class="form-group">
            <label for="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              v-model.trim="software.tags"
              class="form-control"
              placeholder="e.g. productivity, web app, tools"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="languages">Programming Languages (comma-separated)</label>
              <input
                type="text"
                id="languages"
                v-model.trim="software.languages"
                class="form-control"
                placeholder="e.g. javascript, python, typescript"
              />
            </div>
            
            <div class="form-group">
              <label for="frameworks">Frameworks (comma-separated)</label>
              <input
                type="text"
                id="frameworks"
                v-model.trim="software.frameworks"
                class="form-control"
                placeholder="e.g. vue, express, django"
              />
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <input
              type="checkbox"
              id="isPublic"
              v-model="software.isPublic"
            />
            <label for="isPublic">Make this software public</label>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="goBack" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create Software' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.software-create-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.software-create-container {
  width: 100%;
  max-width: 1160px;
  padding: 2rem 1rem;
}

.software-create {
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow);
}

.software-create h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: white;
}

.btn-back {
  background-color: transparent;
  color: var(--primary-color);
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  display: inline-flex;
  align-items: center;
}

.btn-back:hover {
  background-color: transparent;
  color: #3c6bcf;
}

.alert-danger {
  background-color: rgba(255, 107, 107, 0.1);
  color: var(--accent-color);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
}

.software-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: white;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.form-text {
  font-size: 0.85rem;
  color: var(--text-color-muted);
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>
