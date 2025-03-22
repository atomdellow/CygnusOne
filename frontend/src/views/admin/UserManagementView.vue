<script setup>
import { onMounted, ref } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const adminStore = useAdminStore();
const authStore = useAuthStore();
const router = useRouter();
const selectedUser = ref(null);
const newRole = ref('');
const showRoleModal = ref(false);
const successMessage = ref('');
const displaySuccess = ref(false);
const currentTab = ref('users'); // Add tabs: 'users' or 'permissions'

// User permissions management
const editingUser = ref(null);
const showPermissionsModal = ref(false);
const userPermissions = ref({
  // Platform access
  platforms: {
    articles: false,
    software: false,
    autobots: false
  },
  // Content creation
  creation: {
    createArticles: false,
    createSoftware: false,
    commenting: false
  },
  // Application specific
  apps: {
    taskApp: {
      createTasks: false,
      editTasks: false,
      deleteTasks: false
    },
    budget: {
      addExpenses: false,
      addIncome: false,
      viewReports: false
    },
    ecommerce: {
      addToCart: false,
      checkout: false,
      viewOrders: false
    },
    cms: {
      createContent: false,
      editContent: false,
      deleteContent: false
    },
    weather: {
      viewForecasts: false,
      saveLocations: false
    }
  }
});

const openRoleModal = (user) => {
  selectedUser.value = user;
  newRole.value = user.role;
  showRoleModal.value = true;
};

const closeRoleModal = () => {
  showRoleModal.value = false;
  selectedUser.value = null;
};

const changeRole = async () => {
  if (!selectedUser.value || !newRole.value) return;
  
  const result = await adminStore.updateUserRole(selectedUser.value._id, newRole.value);
  
  if (result) {
    successMessage.value = `User role updated successfully to ${newRole.value}`;
    displaySuccess.value = true;
    setTimeout(() => {
      displaySuccess.value = false;
    }, 3000);
  }
  
  closeRoleModal();
};

const openPermissionsModal = (user) => {
  editingUser.value = user;
  // Load user permissions from the user object or use defaults
  // This is where you'd normally fetch from the backend
  // For now, we'll use defaults just to demonstrate the UI
  loadUserPermissions(user);
  showPermissionsModal.value = true;
};

const closePermissionsModal = () => {
  showPermissionsModal.value = false;
  editingUser.value = null;
};

const loadUserPermissions = (user) => {
  // In a real app, you would fetch the user's permissions from your backend
  // For this example, we'll just use the default empty permissions
  
  // If user already has permissions saved, load them
  if (user.permissions) {
    userPermissions.value = JSON.parse(JSON.stringify(user.permissions));
  } else {
    // Reset to defaults
    userPermissions.value = {
      platforms: {
        articles: false,
        software: false,
        autobots: false
      },
      creation: {
        createArticles: false,
        createSoftware: false,
        commenting: false
      },
      apps: {
        taskApp: {
          createTasks: false,
          editTasks: false,
          deleteTasks: false
        },
        budget: {
          addExpenses: false,
          addIncome: false,
          viewReports: false
        },
        ecommerce: {
          addToCart: false,
          checkout: false,
          viewOrders: false
        },
        cms: {
          createContent: false,
          editContent: false,
          deleteContent: false
        },
        weather: {
          viewForecasts: false,
          saveLocations: false
        }
      }
    };
  }
};

const savePermissions = async () => {
  if (!editingUser.value) return;
  
  // In a real app, you would save these permissions to your backend
  // For now, we'll just show a success message
  successMessage.value = `Permissions updated for ${editingUser.value.name}`;
  displaySuccess.value = true;
  
  setTimeout(() => {
    displaySuccess.value = false;
  }, 3000);
  
  closePermissionsModal();
};

const setTab = (tab) => {
  currentTab.value = tab;
};

onMounted(async () => {
  await adminStore.fetchUsers();
});
</script>

<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <div class="admin-header">
        <h1>User Management</h1>
      </div>
      
      <div v-if="displaySuccess" class="alert alert-success">
        {{ successMessage }}
      </div>
      
      <div class="admin-tabs">
        <button 
          @click="setTab('users')" 
          class="tab-btn" 
          :class="{ active: currentTab === 'users' }"
        >
          Users
        </button>
        <button 
          @click="setTab('permissions')" 
          class="tab-btn" 
          :class="{ active: currentTab === 'permissions' }"
        >
          Permissions
        </button>
      </div>
      
      <div v-if="adminStore.loading" class="loading">
        Loading users...
      </div>
      
      <div v-else-if="adminStore.error" class="alert alert-danger">
        {{ adminStore.error }}
      </div>
      
      <!-- Users Tab -->
      <div v-else-if="currentTab === 'users'" class="users-section">
        <div v-if="adminStore.users.length === 0" class="no-users">
          <p>No users found.</p>
        </div>
        
        <div v-else class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in adminStore.users" :key="user._id">
                <td class="table-cell">{{ user.name }}</td>
                <td class="table-cell">{{ user.email }}</td>
                <td class="table-cell">
                  <span class="role-badge" :class="user.role">
                    {{ user.role }}
                  </span>
                </td>
                <td class="table-cell">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
                <td class="table-cell">
                  <div class="action-buttons">
                    <button 
                      @click="openRoleModal(user)" 
                      class="btn btn-small"
                      :disabled="user._id === authStore.user?._id"
                    >
                      Change Role
                    </button>
                    <button 
                      @click="openPermissionsModal(user)" 
                      class="btn btn-small btn-secondary"
                    >
                      Permissions
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Permissions Tab -->
      <div v-else-if="currentTab === 'permissions'" class="permissions-section">
        <div class="permissions-explanation">
          <h2>User Permissions</h2>
          <p>Select a user from the Users tab to manage their specific permissions.</p>
          <p>You can control what features and platforms each user has access to.</p>
          
          <h3>Available Permission Types:</h3>
          <div class="permissions-types">
            <div class="permission-category">
              <h4>Platform Access</h4>
              <ul>
                <li>Articles - Access to article system</li>
                <li>Software - Access to software applications</li>
                <li>Autobots - Access to automation tools</li>
              </ul>
            </div>
            
            <div class="permission-category">
              <h4>Content Creation</h4>
              <ul>
                <li>Create Articles - Ability to post new articles</li>
                <li>Create Software - Ability to add new software</li>
                <li>Commenting - Ability to comment on content</li>
              </ul>
            </div>
            
            <div class="permission-category">
              <h4>Application-Specific Permissions</h4>
              <ul>
                <li>TaskApp - Create, edit, delete tasks</li>
                <li>Budget Tracker - Add expenses/income, view reports</li>
                <li>E-commerce - Cart operations, checkout, view orders</li>
                <li>CMS - Create, edit, delete content</li>
                <li>Weather Dashboard - View forecasts, save locations</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- List of users with quick permission overview -->
        <div class="users-permissions-table">
          <h3>User Permissions Overview</h3>
          <table class="permissions-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Articles</th>
                <th>Software</th>
                <th>Autobots</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in adminStore.users" :key="user._id">
                <td class="table-cell">{{ user.name }}</td>
                <td class="table-cell">
                  <span class="role-badge" :class="user.role">{{ user.role }}</span>
                </td>
                <td class="table-cell permission-status">
                  <span class="permission-indicator" :class="{ granted: user.permissions?.platforms?.articles }">
                    {{ user.permissions?.platforms?.articles ? '✓' : '✕' }}
                  </span>
                </td>
                <td class="table-cell permission-status">
                  <span class="permission-indicator" :class="{ granted: user.permissions?.platforms?.software }">
                    {{ user.permissions?.platforms?.software ? '✓' : '✕' }}
                  </span>
                </td>
                <td class="table-cell permission-status">
                  <span class="permission-indicator" :class="{ granted: user.permissions?.platforms?.autobots }">
                    {{ user.permissions?.platforms?.autobots ? '✓' : '✕' }}
                  </span>
                </td>
                <td class="table-cell">
                  <button 
                    @click="openPermissionsModal(user)" 
                    class="btn btn-small"
                  >
                    Edit Permissions
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Role Change Modal -->
      <div v-if="showRoleModal" class="modal">
        <div class="modal-content">
          <h2>Change User Role</h2>
          <p>
            Change role for <strong>{{ selectedUser?.name }}</strong>:
          </p>
          
          <div class="form-group">
            <label for="role">Select Role</label>
            <select id="role" v-model="newRole" class="form-control">
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button @click="closeRoleModal" class="btn btn-secondary">Cancel</button>
            <button @click="changeRole" class="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
      
      <!-- Permissions Modal -->
      <div v-if="showPermissionsModal" class="modal permissions-modal">
        <div class="modal-content wide-modal">
          <div class="modal-header">
            <h2>Manage User Permissions</h2>
            <p>Setting permissions for: <strong>{{ editingUser?.name }}</strong></p>
            <button @click="closePermissionsModal" class="btn-close">×</button>
          </div>
          
          <div class="permissions-grid">
            <!-- Platform Access Permissions -->
            <div class="permission-section">
              <h3>Platform Access</h3>
              <div class="permission-options">
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="articles-access" 
                    v-model="userPermissions.platforms.articles"
                  />
                  <label for="articles-access">Articles Access</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="software-access" 
                    v-model="userPermissions.platforms.software"
                  />
                  <label for="software-access">Software Access</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="autobots-access" 
                    v-model="userPermissions.platforms.autobots"
                  />
                  <label for="autobots-access">Autobots Access</label>
                </div>
              </div>
            </div>
            
            <!-- Content Creation Permissions -->
            <div class="permission-section">
              <h3>Content Creation</h3>
              <div class="permission-options">
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="create-articles" 
                    v-model="userPermissions.creation.createArticles"
                  />
                  <label for="create-articles">Create Articles</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="create-software" 
                    v-model="userPermissions.creation.createSoftware"
                  />
                  <label for="create-software">Create Software</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="commenting" 
                    v-model="userPermissions.creation.commenting"
                  />
                  <label for="commenting">Commenting</label>
                </div>
              </div>
            </div>
            
            <!-- TaskApp Permissions -->
            <div class="permission-section">
              <h3>TaskApp Permissions</h3>
              <div class="permission-options">
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="create-tasks" 
                    v-model="userPermissions.apps.taskApp.createTasks"
                  />
                  <label for="create-tasks">Create Tasks</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="edit-tasks" 
                    v-model="userPermissions.apps.taskApp.editTasks"
                  />
                  <label for="edit-tasks">Edit Tasks</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="delete-tasks" 
                    v-model="userPermissions.apps.taskApp.deleteTasks"
                  />
                  <label for="delete-tasks">Delete Tasks</label>
                </div>
              </div>
            </div>
            
            <!-- Budget Tracker Permissions -->
            <div class="permission-section">
              <h3>Budget Tracker Permissions</h3>
              <div class="permission-options">
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="add-expenses" 
                    v-model="userPermissions.apps.budget.addExpenses"
                  />
                  <label for="add-expenses">Add Expenses</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="add-income" 
                    v-model="userPermissions.apps.budget.addIncome"
                  />
                  <label for="add-income">Add Income</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="view-reports" 
                    v-model="userPermissions.apps.budget.viewReports"
                  />
                  <label for="view-reports">View Reports</label>
                </div>
              </div>
            </div>
            
            <!-- E-commerce Permissions -->
            <div class="permission-section">
              <h3>E-commerce Permissions</h3>
              <div class="permission-options">
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="add-to-cart" 
                    v-model="userPermissions.apps.ecommerce.addToCart"
                  />
                  <label for="add-to-cart">Add to Cart</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="checkout" 
                    v-model="userPermissions.apps.ecommerce.checkout"
                  />
                  <label for="checkout">Checkout</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="view-orders" 
                    v-model="userPermissions.apps.ecommerce.viewOrders"
                  />
                  <label for="view-orders">View Orders</label>
                </div>
              </div>
            </div>
            
            <!-- CMS Permissions -->
            <div class="permission-section">
              <h3>CMS Permissions</h3>
              <div class="permission-options">
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="create-content" 
                    v-model="userPermissions.apps.cms.createContent"
                  />
                  <label for="create-content">Create Content</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="edit-content" 
                    v-model="userPermissions.apps.cms.editContent"
                  />
                  <label for="edit-content">Edit Content</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="delete-content" 
                    v-model="userPermissions.apps.cms.deleteContent"
                  />
                  <label for="delete-content">Delete Content</label>
                </div>
              </div>
            </div>
            
            <!-- Weather Dashboard Permissions -->
            <div class="permission-section">
              <h3>Weather Dashboard Permissions</h3>
              <div class="permission-options">
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="view-forecasts" 
                    v-model="userPermissions.apps.weather.viewForecasts"
                  />
                  <label for="view-forecasts">View Forecasts</label>
                </div>
                
                <div class="permission-option">
                  <input 
                    type="checkbox" 
                    id="save-locations" 
                    v-model="userPermissions.apps.weather.saveLocations"
                  />
                  <label for="save-locations">Save Locations</label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button @click="closePermissionsModal" class="btn btn-secondary">Cancel</button>
            <button @click="savePermissions" class="btn btn-primary">Save Permissions</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.admin-container {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.admin-header {
  margin-bottom: 2rem;
}

/* Admin tabs styling */
.admin-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-color-muted);
  cursor: pointer;
  font-size: 1rem;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-speed);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-btn:hover:not(.active) {
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

/* Users table styling with fixed color issue */
.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Fix for white text on white background */
.users-table th {
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}

.table-cell {
  color: white !important; /* Force white text */
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.role-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  text-transform: uppercase;
}

.role-badge.user {
  background-color: rgba(77, 138, 255, 0.1);
  color: var(--primary-color);
}

.role-badge.editor {
  background-color: rgba(159, 113, 255, 0.1);
  color: var(--secondary-color);
}

.role-badge.admin {
  background-color: rgba(255, 107, 107, 0.1);
  color: var(--accent-color);
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.modal-content {
  background-color: var(--bg-color-light);
  padding: 2rem;
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

/* Wider modal for permissions */
.wide-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  position: relative;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color-muted);
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.loading,
.no-users {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted);
}

/* Permissions tab styling */
.permissions-explanation {
  margin-bottom: 2rem;
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.permissions-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.permission-category h4 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.permission-category ul {
  padding-left: 1.5rem;
  color: white;
}

.permission-category li {
  margin-bottom: 0.5rem;
}

/* Permissions table */
.users-permissions-table {
  margin-top: 2rem;
}

.permissions-table {
  width: 100%;
  border-collapse: collapse;
}

.permissions-table th,
.permissions-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.permissions-table th {
  background-color: rgba(0, 0, 0, 0.2);
}

.permission-status {
  text-align: center;
}

.permission-indicator {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  line-height: 24px;
  text-align: center;
  background-color: rgba(255, 107, 107, 0.2);
  color: var(--accent-color);
}

.permission-indicator.granted {
  background-color: rgba(67, 255, 175, 0.2);
  color: var(--highlight-color);
}

/* Permissions modal styling */
.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.permission-section {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.permission-section h3 {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--primary-color);
}

.permission-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.permission-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.permission-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
}

.permission-option label {
  color: white;
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .permissions-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}
</style>
