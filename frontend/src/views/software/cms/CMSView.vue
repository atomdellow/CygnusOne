<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '../../../assets/styles/software/cms/cms.css';

const router = useRouter();
const activeContent = ref(null);
const isEditing = ref(false);
const contents = ref([]);
const categories = ref([
  { id: 1, name: 'Blog Posts' },
  { id: 2, name: 'Pages' },
  { id: 3, name: 'Products' },
  { id: 4, name: 'Events' }
]);
const activeCategory = ref(1);
const searchQuery = ref('');

// Form fields for editing
const editingTitle = ref('');
const editingSlug = ref('');
const editingStatus = ref('draft');
const editingContent = ref('');
const editingCategory = ref(1);

// Mock CMS data
const mockContents = [
  { 
    id: 1, 
    title: 'Getting Started with CMS', 
    slug: 'getting-started-cms',
    content: 'This is a comprehensive guide to getting started with our content management system. Learn how to create, edit, and manage your content effectively.',
    status: 'published',
    author: 'John Doe',
    category: 1,
    createdAt: '2023-05-10T10:30:00Z',
    updatedAt: '2023-05-15T14:20:00Z'
  },
  { 
    id: 2, 
    title: 'About Us', 
    slug: 'about-us',
    content: 'We are a dynamic company focused on delivering high-quality content management solutions to businesses of all sizes.',
    status: 'published',
    author: 'Jane Smith',
    category: 2,
    createdAt: '2023-04-12T08:15:00Z',
    updatedAt: '2023-04-12T08:15:00Z'
  },
  { 
    id: 3, 
    title: 'Premium CMS Features', 
    slug: 'premium-cms-features',
    content: 'Explore our premium CMS features that help you streamline your content workflow and improve your online presence.',
    status: 'draft',
    author: 'John Doe',
    category: 3,
    createdAt: '2023-05-20T11:45:00Z',
    updatedAt: '2023-05-20T11:45:00Z'
  },
  { 
    id: 4, 
    title: 'Annual Conference', 
    slug: 'annual-conference',
    content: 'Join us for our annual conference where we showcase the latest trends in content management and digital experience.',
    status: 'published',
    author: 'Jane Smith',
    category: 4,
    createdAt: '2023-06-01T09:00:00Z',
    updatedAt: '2023-06-01T09:00:00Z'
  },
  { 
    id: 5, 
    title: 'Content SEO Best Practices', 
    slug: 'content-seo-best-practices',
    content: 'Learn how to optimize your content for search engines while maintaining quality and relevance for your audience.',
    status: 'draft',
    author: 'John Doe',
    category: 1,
    createdAt: '2023-05-25T13:20:00Z',
    updatedAt: '2023-05-25T13:20:00Z'
  }
];

const filteredContents = computed(() => {
  return contents.value
    .filter(content => content.category === activeCategory.value)
    .filter(content => {
      if (!searchQuery.value) return true;
      const query = searchQuery.value.toLowerCase();
      return content.title.toLowerCase().includes(query) || 
             content.content.toLowerCase().includes(query);
    });
});

const activeCategoryName = computed(() => {
  const category = categories.value.find(c => c.id === activeCategory.value);
  return category ? category.name : '';
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId;
  activeContent.value = null;
  isEditing.value = false;
};

const viewContent = (content) => {
  activeContent.value = content;
  isEditing.value = false;
};

const editContent = (content) => {
  activeContent.value = content;
  editingTitle.value = content.title;
  editingSlug.value = content.slug;
  editingStatus.value = content.status;
  editingContent.value = content.content;
  editingCategory.value = content.category;
  isEditing.value = true;
};

const saveContent = () => {
  if (!editingTitle.value || !editingContent.value) return;
  
  const index = contents.value.findIndex(c => c.id === activeContent.value.id);
  
  if (index !== -1) {
    contents.value[index] = {
      ...contents.value[index],
      title: editingTitle.value,
      slug: editingSlug.value,
      status: editingStatus.value,
      content: editingContent.value,
      category: editingCategory.value,
      updatedAt: new Date().toISOString()
    };
  }
  
  activeContent.value = contents.value[index];
  isEditing.value = false;
};

const createNewContent = () => {
  const newContent = {
    id: Date.now(),
    title: 'New Content',
    slug: 'new-content',
    content: 'Start writing your content here...',
    status: 'draft',
    author: 'Current User',
    category: activeCategory.value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  contents.value.unshift(newContent);
  editContent(newContent);
};

const deleteContent = (contentId) => {
  contents.value = contents.value.filter(c => c.id !== contentId);
  if (activeContent.value && activeContent.value.id === contentId) {
    activeContent.value = null;
    isEditing.value = false;
  }
};

onMounted(() => {
  // Initialize CMS data
  contents.value = [...mockContents];
});

const goBack = () => {
  router.push({ name: 'software' });
};
</script>

<template>
  <div class="app-wrapper">
    <div class="app-container">
      <div class="app-header">
        <button @click="goBack" class="btn btn-back">← Back to Software</button>
        <h1>Content Management System</h1>
        <p class="app-description">Manage and organize your website content</p>
      </div>
      
      <div class="cms-app">
        <aside class="sidebar">
          <div class="categories">
            <h3>Content Types</h3>
            <ul class="category-list">
              <li 
                v-for="category in categories" 
                :key="category.id"
                :class="{ active: activeCategory === category.id }"
                @click="setActiveCategory(category.id)"
              >
                {{ category.name }}
              </li>
            </ul>
          </div>
        </aside>
        
        <main class="content-area">
          <div class="content-list" :class="{ 'hidden': activeContent && isEditing }">
            <div class="content-list-header">
              <h2>{{ activeCategoryName }}</h2>
              <div class="content-actions">
                <div class="search-input">
                  <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Search content..." 
                  />
                </div>
                <button @click="createNewContent" class="btn btn-primary">New Content</button>
              </div>
            </div>
            
            <div class="content-items">
              <div 
                v-for="content in filteredContents" 
                :key="content.id"
                class="content-item"
                :class="{ active: activeContent && activeContent.id === content.id }"
                @click="viewContent(content)"
              >
                <div class="content-item-header">
                  <h3>{{ content.title }}</h3>
                  <span class="status-badge" :class="content.status">
                    {{ content.status }}
                  </span>
                </div>
                <div class="content-item-meta">
                  <span>{{ formatDate(content.updatedAt) }}</span>
                  <span>{{ content.author }}</span>
                </div>
              </div>
              
              <div v-if="filteredContents.length === 0" class="no-content">
                <p>No content found in this category.</p>
                <button @click="createNewContent" class="btn">Create New</button>
              </div>
            </div>
          </div>
          
          <div v-if="activeContent" class="content-detail" :class="{ 'editing': isEditing }">
            <div class="content-detail-header">
              <button @click="activeContent = null" class="btn btn-secondary">← Back to List</button>
              <div v-if="!isEditing" class="detail-actions">
                <button @click="editContent(activeContent)" class="btn btn-primary">Edit</button>
                <button @click="deleteContent(activeContent.id)" class="btn btn-danger">Delete</button>
              </div>
            </div>
            
            <div v-if="!isEditing" class="content-view">
              <h2>{{ activeContent.title }}</h2>
              <div class="content-meta">
                <span class="status-badge" :class="activeContent.status">{{ activeContent.status }}</span>
                <span>Created: {{ formatDate(activeContent.createdAt) }}</span>
                <span>Updated: {{ formatDate(activeContent.updatedAt) }}</span>
                <span>Author: {{ activeContent.author }}</span>
              </div>
              <div class="content-body">
                {{ activeContent.content }}
              </div>
            </div>
            
            <div v-else class="content-edit">
              <div class="form-group">
                <label for="title">Title</label>
                <input type="text" id="title" v-model="editingTitle" class="form-control" />
              </div>
              
              <div class="form-group">
                <label for="slug">Slug</label>
                <input type="text" id="slug" v-model="editingSlug" class="form-control" />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="status">Status</label>
                  <select id="status" v-model="editingStatus" class="form-control">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="category">Category</label>
                  <select id="category" v-model="editingCategory" class="form-control">
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label for="content">Content</label>
                <textarea 
                  id="content" 
                  v-model="editingContent" 
                  class="form-control content-textarea"
                  rows="15"
                ></textarea>
              </div>
              
              <div class="form-actions">
                <button @click="isEditing = false" class="btn btn-secondary">Cancel</button>
                <button @click="saveContent" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
