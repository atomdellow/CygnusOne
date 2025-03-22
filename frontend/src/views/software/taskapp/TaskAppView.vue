<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '../../../assets/styles/software/taskapp/taskapp.css';

const router = useRouter();
const tasks = ref([]);
const newTask = ref({ title: '', description: '', dueDate: '' });
const loading = ref(true);

onMounted(() => {
  // Simulate loading tasks
  setTimeout(() => {
    tasks.value = [
      { id: 1, title: 'Complete project setup', description: 'Initialize Git repository and set up CI/CD', dueDate: '2023-08-15', completed: true },
      { id: 2, title: 'Design database schema', description: 'Create ERD and define relationships', dueDate: '2023-08-20', completed: false },
      { id: 3, title: 'Implement authentication', description: 'Set up JWT authentication flow', dueDate: '2023-08-25', completed: false },
    ];
    loading.value = false;
  }, 800);
});

const addTask = () => {
  if (!newTask.value.title) return;
  
  tasks.value.push({
    id: Date.now(),
    title: newTask.value.title,
    description: newTask.value.description,
    dueDate: newTask.value.dueDate,
    completed: false
  });
  
  newTask.value = { title: '', description: '', dueDate: '' };
};

const toggleTaskStatus = (task) => {
  task.completed = !task.completed;
};

const deleteTask = (taskId) => {
  tasks.value = tasks.value.filter(task => task.id !== taskId);
};

const goBack = () => {
  router.push({ name: 'software' });
};
</script>

<template>
  <div class="app-wrapper">
    <div class="app-container">
      <div class="app-header">
        <button @click="goBack" class="btn btn-back">← Back to Software</button>
        <h1>TaskApp</h1>
        <p class="app-description">Manage your tasks efficiently</p>
      </div>
      
      <div class="app-content">
        <div class="task-form">
          <h2>Add New Task</h2>
          <form @submit.prevent="addTask">
            <div class="form-group">
              <label for="title">Task Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="newTask.title"
                class="form-control" 
                placeholder="Enter task title" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                v-model="newTask.description"
                class="form-control" 
                placeholder="Enter task description"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="dueDate">Due Date</label>
              <input 
                type="date" 
                id="dueDate" 
                v-model="newTask.dueDate"
                class="form-control"
              />
            </div>
            
            <button type="submit" class="btn btn-primary">Add Task</button>
          </form>
        </div>
        
        <div class="task-list">
          <h2>Your Tasks</h2>
          
          <div v-if="loading" class="loading">
            Loading tasks...
          </div>
          
          <div v-else-if="tasks.length === 0" class="no-tasks">
            <p>No tasks found. Add your first task to get started!</p>
          </div>
          
          <div v-else>
            <div 
              v-for="task in tasks" 
              :key="task.id" 
              class="task-item"
              :class="{ completed: task.completed }"
            >
              <div class="task-content">
                <div class="task-header">
                  <h3>{{ task.title }}</h3>
                  <div class="task-actions">
                    <button 
                      @click="toggleTaskStatus(task)" 
                      class="btn btn-sm"
                      :class="task.completed ? 'btn-completed' : 'btn-secondary'"
                    >
                      {{ task.completed ? 'Completed' : 'Mark Complete' }}
                    </button>
                    <button @click="deleteTask(task.id)" class="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
                
                <p v-if="task.description" class="task-description">
                  {{ task.description }}
                </p>
                
                <div v-if="task.dueDate" class="task-due-date">
                  Due: {{ new Date(task.dueDate).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
